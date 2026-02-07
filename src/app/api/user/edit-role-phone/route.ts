import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { role, phone } = await req.json();

        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await sql`
            UPDATE users SET role = ${role}, phone= ${phone} where id = ${session.user.id} RETURNING id, name, email, role, phone
        `;

        if(!user) {
            return NextResponse.json( {
                message: "user is not found"
             }, 
             {status: 400
            })
        }

        return NextResponse.json({user}, {status: 200});
    } catch (error) {
        console.error("Error updating user role and phone:", error);
        return NextResponse.json(
            {
                error: `Failed to update user role and phone ${error}`,
            },
            { status: 500 },
        );
    }
}