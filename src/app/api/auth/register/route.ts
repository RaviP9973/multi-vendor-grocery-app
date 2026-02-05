import sql from "@/app/lib/db";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
    const {name, email, password} = await request.json();

    // Basic validation
    if (!name || !email || !password) {
        return new Response(JSON.stringify({error: "Name, email, and password are required."}), {status: 400});
    }

    if(password.length < 6) {
        return new Response(JSON.stringify({error: "Password must be at least 6 characters long."}), {status: 400});
    }

    const existingUser = await sql`
        SELECT email FROM users WHERE email = ${email} LIMIT 1
    `;

    if(existingUser.length > 0) {
        return new Response(JSON.stringify({error: "User with this email already exists."}), {status: 409});
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashPassword})
        RETURNING id, name, email, role, created_at
    `;

    return new Response(JSON.stringify({user: newUser[0]}), {status: 201});
}