import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import sql from "./app/lib/db";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await sql`
                SELECT id, name, email, password, role FROM users WHERE email = ${email} LIMIT 1
            `;
        if (user.length === 0) {
          throw new Error("No user found with the given email.");
        }

        if (!user[0].password) {
          throw new Error("Please log in with Google.");
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
          throw new Error("Password is incorrect.");
        }

        return {
          id: user[0]?.id.toString(),
          name: user[0]?.name,
          email: user[0]?.email,
          role: user[0]?.role,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const normalizedEmail = String(user.email || "").trim().toLowerCase();

        const dbUser = await sql`
          INSERT INTO users (name, email, role, image)
          VALUES (${user.name}, ${normalizedEmail}, 'user', ${user.image})
          ON CONFLICT (email)
          DO UPDATE SET
            name = COALESCE(EXCLUDED.name, users.name),
            image = COALESCE(EXCLUDED.image, users.image)
          RETURNING id, name, email, role, image
        `;

        if (dbUser.length === 0) {
          throw new Error("Unable to resolve user during Google sign-in.");
        }

        user.id = dbUser[0].id.toString();
        user.role = dbUser[0].role.toString();
      }
      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  },
  secret: process.env.AUTH_SECRET,
});
