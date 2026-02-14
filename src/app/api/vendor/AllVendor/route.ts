import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Not authorised",
        },
        {
          status: 401,
        },
      );
    }
    const limitString = req.nextUrl.searchParams.get("limit") || '50'
    const limit = parseInt(limitString, 10);
    const safeLimit = isNaN(limit) ? 50 : limit;

    const vendors = await sql`
        SELECT * FROM vendors
        ORDER BY requested_at DESC
        LIMIT ${safeLimit}
        `;

    if (!vendors)
      return NextResponse.json(
        {
          message: "Vendors not found",
        },
        {
          status: 400,
        },
      );

    return NextResponse.json(
      {
        vendors,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: " server error",
      },
      {
        status: 500,
      },
    );
  }
}
