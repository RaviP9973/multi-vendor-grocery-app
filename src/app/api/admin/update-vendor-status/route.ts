import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { vendorId, status, rejectionReason } = await request.json();

    if (
      !vendorId ||
      !status ||
      (status !== "approved" && status !== "rejected")
    ) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let res;
    if (status === "approved") {
      res = await sql`
        UPDATE vendors
        SET status = ${status}, approved_at = NOW()
        WHERE id = ${vendorId}
        RETURNING id, status, approved_at
      `;
    } else {
      res = await sql`
        UPDATE vendors
        SET status = ${status}, rejected_at = NOW(), rejection_reason = ${rejectionReason.length > 0 ? rejectionReason : "rejected by admin"}
        WHERE id = ${vendorId}
        RETURNING id, status, rejected_at
      `;
    }

    if (res.length === 0) { 
      return NextResponse.json(
        { message: "Vendor not found or status unchanged" },
        { status: 404 }, 
      );
    }

    return NextResponse.json(
      { message: "Vendor status updated successfully", data: res[0] }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to update vendor status:", error); 
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 },
    );
  }
}