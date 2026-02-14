import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { IUser } from "@/script/migrate";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Un-authorised",
        },
        {
          status: 401,
        },
      );
    }
    const res = await sql`
                SELECT id , name, email, image, role, phone FROM users WHERE email = ${session?.user?.email}
                LIMIT 1;
        `;

    if (!res || !res[0])
      return NextResponse.json(
        {
          message: "user not found",
        },
        {
          status: 404,
        },
      );
    const user = res[0] as IUser;

    return NextResponse.json(
      {
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "server error",
        error,
      },
      { status: 500 },
    );
  }
}
