import sql from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await sql`
            SELECT id FROM users WHERE role = 'admin' LIMIT 1
        `;

    return NextResponse.json({
      exists: admin.length > 0,
    });
  } catch (error) {
    console.error("Error checking admin existence:", error);
    return NextResponse.json(
      {
        error: `Failed to check admin existence ${error}`,
      },
      { status: 500 },
    );
  }
}
