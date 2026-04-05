import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { role, phone } = await req.json();

        const allowedRoles = ["user", "vendor", "admin"] as const;
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        if (!phone || String(phone).trim().length === 0) {
            return NextResponse.json({ error: "Phone is required" }, { status: 400 });
        }

        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user.id) {
            return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
        }

        // Ensure the business rule is enforced at database level for concurrent requests.
        if (role === "admin") {
            await sql`
              CREATE UNIQUE INDEX IF NOT EXISTS users_single_admin_idx
              ON users (role)
              WHERE role = 'admin'
            `;
        }

        const user = await sql`
            UPDATE users SET role = ${role}, phone= ${phone} where id = ${session.user.id} RETURNING id, name, email, role, phone
        `;

        if(user.length === 0) {
            return NextResponse.json( {
                message: "user is not found"
             }, 
             {status: 404
            })
        }

        return NextResponse.json({user: user[0]}, {status: 200});
    } catch (error) {
        console.error("Error updating user role and phone:", error);

        // PostgreSQL unique violation (prevents multiple admin users).
        if ((error as { code?: string })?.code === "23505") {
            return NextResponse.json(
                {
                    error: "Admin already exists. Please choose another role.",
                },
                { status: 409 },
            );
        }

        return NextResponse.json(
            {
                error: `Failed to update user role and phone ${error}`,
            },
            { status: 500 },
        );
    }
}