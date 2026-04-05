"use server";

import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { IVendor } from "@/script/migrate";

export async function updateVendorDetails(formData: {
  shopName: string;
  shopAddress: string;
  gstNumber: string;
}) {
  try {
    const { shopName, shopAddress, gstNumber } = formData;

    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }

    if (session?.user?.role !== "vendor") {
      return {
        success: false,
        message: "Only vendors can update vendor details",
      };
    }

    const res = await sql`
     INSERT INTO Vendors (user_id, shop_name, shop_address, gst_number, requested_at)
      VALUES (${session.user.id}, ${shopName}, ${shopAddress}, ${gstNumber}, NOW())
      ON CONFLICT (user_id) DO UPDATE 
      SET shop_name = ${shopName}, shop_address = ${shopAddress}, gst_number = ${gstNumber}, requested_at = NOW()
      RETURNING id, shop_name, shop_address, status, gst_number, requested_at;
    `;

    if (!res[0]) {
      return {
        success: false,
        message: "Failed to update the vendor",
      };
    }

    const newVendor = res[0] as IVendor;

    return {
      success: true,
      message: "Vendor details updated successfully",
      vendor: newVendor,
    };
  } catch (error) {
    console.error("Error updating vendor details:", error);
    return {
      success: false,
      message: "Server error occurred",
    };
  }
}

