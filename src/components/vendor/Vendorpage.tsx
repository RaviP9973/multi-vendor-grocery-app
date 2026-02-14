import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { IUser, IVendor } from "@/script/migrate";
import { redirect } from "next/navigation";
import VendorDashboard from "./VendorDashboard";
import { TimerIcon } from "lucide-react";

export default async function Vendorpage({ user }: { user: IUser }) {
  const session = await auth();
  const res = await sql`
        SELECT * FROM vendors WHERE user_id = ${session?.user?.id}
        LIMIT 1;
    `;
  if (!res[0]) {
    return redirect("/edit-vendor-details");
  }

  const vendor = res[0] as IVendor;

  if (vendor?.status === "approved") {
    return (
      <div className="w-full min-h-screen pt-16">
        <VendorDashboard />
      </div>
    );
  }

  if (vendor?.status === "pending") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black  to-gray-900 text-white px-4">
        <div className="bg-white/10 backdrop:blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full text-center ">
          <h2 className="text-4xl font-bold mb-6 text-blue-400 flex justify-center items-center gap-2">
            Verification Pending
            <TimerIcon size={32} />
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed ">
            You can access vendor dashboard only after{" "}
            <span className="font-semibold ">admin verificaton</span>
          </p>

          <div className="mt-6 text-base text-gray-300 ">
            VerificationStatus:{" "}
            <span className="text-blue-400 font-semibold uppercase">
              {" "}
              {vendor?.status}{" "}
            </span>
          </div>

          <div className="mt-10 text-sm text-gray-400 ">
            It usually takes 2-3 hours.
          </div>
        </div>
      </div>
    );
  }

  if (vendor?.status === "rejected") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black  to-gray-900 text-white px-4">
        
      </div>
    );
  }
  return <div></div>;
}
