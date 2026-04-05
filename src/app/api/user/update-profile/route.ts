import uploadOnCloudinary from "@/app/lib/cloudinary";
import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !session ||
      !session?.user ||
      !session?.user?.email ||
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          message: "unauthorised user",
        },
        {
          status: 400,
        },
      );
    }


    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("image") as File;

    if(!name || !phone){
        return NextResponse.json(
            {
                message: "name and phone are required",
            },
            {
                status: 400,
            }
        )
    }
    let imageUrl ;
    if(file ) {
        imageUrl = await uploadOnCloudinary(file);
    }

    const updatedUser = await sql`
      UPDATE users
      SET name = ${name}, phone = ${phone}, image = COALESCE(${imageUrl}, image)
      WHERE id = ${session.user.id}
      RETURNING id, name, email, phone, image;
    `;

    
    return NextResponse.json({ user: updatedUser[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        message: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}
