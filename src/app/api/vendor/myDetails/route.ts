import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const session = await auth();

        if(!session || !session.user || session.user.role !== "vendor") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const vendorDetails = await sql`
            SELECT shop_name, shop_address, gst_number FROM vendors WHERE user_id = ${session.user.id}
        `;
       
        if (!vendorDetails || vendorDetails.length === 0) {
            return NextResponse.json({ message: "Vendor details not found" }, { status: 404 });
        }
        return NextResponse.json({ vendorDetails ,}, { status: 200 });

    } catch (error) {
        console.error("Error fetching vendor details:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}