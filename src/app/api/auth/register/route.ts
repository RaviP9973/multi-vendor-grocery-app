import sql from "@/app/lib/db";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
    try {
        const {name, email, password} = await request.json();

        // Basic validation
        if (!name || !email || !password) {
            return new Response(JSON.stringify({error: "Name, email, and password are required."}), {status: 400});
        }

        if(password.length < 6) {
            return new Response(JSON.stringify({error: "Password must be at least 6 characters long."}), {status: 400});
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const hashPassword = await bcrypt.hash(password, 10);

        // Atomic insert avoids the check-then-insert race under concurrent requests.
        const newUser = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${normalizedEmail}, ${hashPassword})
            ON CONFLICT (email) DO NOTHING
            RETURNING id, name, email, role, created_at
        `;

        if (newUser.length === 0) {
            return new Response(JSON.stringify({error: "User with this email already exists."}), {status: 409});
        }

        return new Response(JSON.stringify({user: newUser[0]}), {status: 201});
    } catch (error) {
        console.error("Registration error:", error);
        return new Response(JSON.stringify({error: "Server error occurred."}), {status: 500});
    }
}