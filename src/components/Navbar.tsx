"use client";

import { IUser } from "@/script/migrate";
import Link from "next/link";
import LogoAndName from "./LogoAndName";
import { AnimatePresence, motion } from "framer-motion";
import {
  History,
  Home,
  LogIn,
  LogOut,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Navbar({ user }: { user: IUser }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed top-0 w-full bg-black text-white z-50 shadow-lg py-2 ">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center ">
        {/* logo */}
        <LogoAndName />

        {/* nav items */}

        {user.role === "user" && (
          <div className="hidden md:flex gap-8 ">
            <NavItem label={"Home"} path="/" />
            <NavItem label={"Categories"} path="/category" />
            <NavItem label={"Shop"} path="/shop" />
            <NavItem label={"Orders"} path="/orders" />
          </div>
        )}

        {/* desktop icons */}
        <div className="hidden md:flex items-center gap-6 ">
          {user.role === "user" && (
            <IconBtn Icon={Search} onClick={() => router.push("/category")} />
          )}

          <IconBtn Icon={Phone} onClick={() => router.push("/support")} />

          <div className="relative">
            {user?.image ? (
              <Image
                src={user.image}
                alt="User Image"
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover border border-gray-700 cursor-pointer "
                onClick={() => setOpenMenu(!openMenu)}
              />
            ) : (
              <IconBtn Icon={User} onClick={() => setOpenMenu(!openMenu)} />
            )}

            <AnimatePresence>
              {openMenu && (
                <motion.div
                  className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 bg-[#6a69693c]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <DropDownBtn
                    Icon={User}
                    label="profile"
                    onClick={() => {
                      router.push("/profile");
                      setOpenMenu(false);
                    }}
                  />
                  <DropDownBtn
                    Icon={LogIn}
                    label="Sign In"
                    onClick={() => {
                      router.push("/login");
                      setOpenMenu(false);
                    }}
                  />
                  <DropDownBtn
                    Icon={LogOut}
                    label="Sign Out"
                    onClick={() => {
                      signOut();
                      setOpenMenu(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user?.role === "user" && <CartBtn router={router} count={5} />}
        </div>

        {/* mobile icons  */}
        <div className="md:hidden flex items-center gap-4 ">
          {user?.role !== "user" ? (
            <>
              <IconBtn Icon={Phone} onClick={() => router.push("/support")} />
              <div className="relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="User Image"
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 object-cover border border-gray-700 cursor-pointer "
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                ) : (
                  <IconBtn Icon={User} onClick={() => setOpenMenu(!openMenu)} />
                )}

                <AnimatePresence>
                  {openMenu && (
                    <motion.div
                      className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 bg-[#6a69693c]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                    >
                      <DropDownBtn
                        Icon={User}
                        label="profile"
                        onClick={() => {
                          router.push("/profile");
                          setOpenMenu(false);
                        }}
                      />
                      <DropDownBtn
                        Icon={LogIn}
                        label="Sign In"
                        onClick={() => {
                          router.push("/login");
                          setOpenMenu(false);
                        }}
                      />
                      <DropDownBtn
                        Icon={LogOut}
                        label="Sign Out"
                        onClick={() => {
                          signOut();
                          setOpenMenu(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <IconBtn Icon={Search} onClick={() => router.push("/category")} />

              <IconBtn Icon={Phone} onClick={() => router.push("/support")} />

              <CartBtn router={router} count={5} />

              <Menu
                size={28}
                className="cursor-pointer "
                onClick={() => setSidebarOpen(true)}
              />

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    className="fixed top-0  right-0 h-screen w-[65%] bg-black/90 backdrop-blur-lg p-6 text-white "
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      stiffness: 200,
                      damping: 24,
                    }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-xl font-semibold ">Menu</h1>
                      <X
                        size={28}
                        className="cursor-pointer"
                        onClick={() => setSidebarOpen(false)}
                      />
                    </div>
                    <div className="flex flex-col gap-4 text-lg ">
                      <SidebarBtn
                        label="Home"
                        path="/"
                        Icon={Home}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Categories"
                        path="/category"
                        Icon={Home}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Shops"
                        path="/shop"
                        Icon={ShoppingBag}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Orders"
                        path="/orders"
                        Icon={History}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label="Profile"
                        path="/profile"
                        Icon={User}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      {!user && (
                        <SidebarBtn
                          label="Sign In"
                          path="/login"
                          Icon={LogIn}
                          router={router}
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                      {user && (
                        <SidebarBtnForSignOut
                          label="Sign Out"
                          Icon={LogOut}
                          setSidebarOpen={setSidebarOpen}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const NavItem = ({ label, path }: { label: string; path: string }) => {
  return (
    <Link href={path}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="hover:text-gray-300"
      >
        {label}
      </motion.button>
    </Link>
  );
};

const IconBtn = ({ Icon, onClick }: any) => (
  <motion.button whileHover={{ scale: 1.1 }} onClick={onClick}>
    <Icon size={24} />
  </motion.button>
);

const DropDownBtn = ({ Icon, label, onClick }: any) => {
  return (
    <button
      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 text-left"
      onClick={() => {
        onClick();
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );
};

const CartBtn = ({ router, count }: any) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    onClick={() => router.push("/cart")}
    className="relative"
  >
    <ShoppingCart size={24} />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-1 ">
        {count}
      </span>
    )}
  </motion.button>
);

const SidebarBtn = ({ label, path, router, Icon, setSidebarOpen }: any) => {
  return (
    <button
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left"
      onClick={() => {
        router.push(path);
        setSidebarOpen(false);
      }}
    >
      <Icon size={20} />
      {label}
    </button>
  );
};
const SidebarBtnForSignOut = ({ label, Icon, setSidebarOpen }: any) => {
  return (
    <button
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left"
      onClick={() => {
        signOut();
        setSidebarOpen(false);
      }}
    >
      <Icon size={20} />
      {label}
    </button>
  );
};
