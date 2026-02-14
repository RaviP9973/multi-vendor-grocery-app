import { auth } from "@/auth";
import sql from "./lib/db";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";
import Navbar from "@/components/Navbar";
import { IUser, IVendor } from "@/script/migrate";
import UserDashboard from "@/components/user/UserDashboard";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import Footer from "@/components/Footer";
import Vendorpage from "@/components/vendor/Vendorpage";

export default async function Home() {
  const session = await auth();
  const res = await sql`
    SELECT id, name, email, role, phone, image FROM users WHERE id = ${session?.user?.id} LIMIT 1
  `;
  const user = res[0] as IUser;
  if (!user || res.length === 0) {
    redirect("/login");
  }

  const incomplete =
    !user.role || !user.phone || (!user.phone && user.role === "user");


  if(user?.role === "vendor") {
    // check if vendor details are complete
    const vendorRes = await sql`
      SELECT shop_name, shop_address, gst_number FROM vendors WHERE user_id = ${user.id} LIMIT 1
    `;
    const vendor = vendorRes[0] as IVendor;
    if (!vendor || !vendor.shop_name || !vendor.shop_address || !vendor.gst_number) {
      redirect(`/edit-vendor-details`);
    }
  }
  if (incomplete) {
    return <EditRoleAndPhone />;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col ">
      <Navbar user={user} />
      {user.role === "user" ? (
        <UserDashboard />
      ) : user.role === "vendor" ? (
        <Vendorpage user={user} />
      ) : (
        <AdminDashboard />
      )}

      <Footer user={user}/>
    </div>
  );
}
