import { IUser } from "@/script/migrate";
import Link from "next/link";

const Footer = ({ user }: { user: IUser }) => {
  const isUser = user?.role === "user";

  return (
    <div className="bg-linear-to-br from-[#1f1f1f] to-[#0f0f0f] w-full text-gray-300 z-40 py-12 border-t border-gray-700 ">
      <div
        className={`max-w-7xl mx-auto px-6 grid gap-10 text-center md:text-left ${isUser ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 " : "grid-cols-1 md:grid-cols-3 "}`}
      >
        <div className="space-y-3 ">
          <Link
            href={"/"}
            className="text-white text-3xl font-bold cursor-pointer tracking-wide hover:text-blue-400 transition "
          >
            Kiranacart
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 ">
            Your trusted online marketplace for all your needs.
          </p>
          {!isUser && (
            <span
              className={`inline-block mt-2
                         text-[11px] px-3 py-1 rounded-full text-white cursor-pointer ${user.role === "admin" ? "bg-blue-600" : "bg-green-600"} `}
            >
              {user?.role === "admin" ? "Admin Panel" : "Vendor Panel"}
            </span>
          )}
        </div>

        {isUser && (
          <div>
            <h3 className="text-white text-lg font-semibold mb-0">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm">
              <Link href={"/"}>
                <li> Home </li>
              </Link>
              <Link href={"/category"}>
                <li> Categories </li>
              </Link>
              <Link href={"/shop"}>
                <li> Shop </li>
              </Link>
              <Link href={"/orders"}>
                <li> Orders </li>
              </Link>
            </ul>
          </div>
        )}

        {isUser && (
          <div className="">
            <h3 className="text-white text-lg font-semibold mb-4 ">
              Help and Support
            </h3>

            <ul>
              <Link href={"/support"}>
                <li>Support</li>
              </Link>
              <Link href={"/orders"}>
                <li>Track Orders</li>
              </Link>
            </ul>
          </div>
        )}

        {!isUser && (
          <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-lg border border-gray-700 ">
            <h2 className="text-white text-lg font-semibold mb-3    ">
              {user?.role === "admin" ? "System Access" : "Vendor Dashboard"}
            </h2>

            <ul className="space-y-2 text-sm text-gray-400 mb-4 ">
              {user?.role === "admin" ? (
                <>
                  <li> Platform Management</li>
                  <li> Vendor control</li>
                  <li> orders & revenue </li>
                  <li> System & Security</li>
                </>
              ) : (
                <>
                  <li>Product Upload & edit</li>
                  <li>Order & delivery Tracking</li>
                  <li>Sales & profit Analtics</li>
                  <li>wallet and Settlements</li>
                </>
              )}
            </ul>
          </div>
        )}

        <div className="space-y-2 ">
          <h3 className="text-white text-lg font-semibold mb-4 ">
            Contact Info
          </h3>
          <p className="text-sm "> admin@kiranacart.com</p>
          <p className="text-sm "> +1 234 567 890</p>
          <p className="text-sm "> 123 Kiranacart Street, City, Country</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Kiranacart. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
