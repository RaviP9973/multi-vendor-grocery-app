import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import sql from "./app/lib/db";
import bcrypt from "bcryptjs";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize( credentials, request ) {
            const email = credentials?.email as string;
            const password = credentials?.password as string;

            const user = await sql`
                SELECT id, name, email, password, role FROM users WHERE email = ${email} LIMIT 1
            `
            if (user.length === 0) {
                throw new Error("No user found with the given email.");
            }
            
            const isMatch = await bcrypt.compare(password, user[0].password);
            if (!isMatch) {
                throw new Error("Password is incorrect.");
            }

            return {
                id: user[0]?.id.toString(),
                name: user[0]?.name,
                email: user[0]?.email,
                role: user[0]?.role
            }
        }
    })
  ],
  callbacks: {
    jwt({token, user}) {
        if(user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.role = user.role;
        }
        return token;
    },
    session({session, token}) {
        if(token) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            session.user.role = token.role as string;
        }
        return session;
    } 
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  },
  secret: process.env.AUTH_SECRET,
})