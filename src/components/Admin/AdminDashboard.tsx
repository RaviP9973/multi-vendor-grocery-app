"use client";

import {
  Box,
  Circle,
  CircleCheck,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import VendorDetails from "./VendorDetails";
import UserOrders from "./UserOrders";
import VendorAproval from "./VendorAproval";
import ProductAproval from "./ProductAproval";
import Dashboard from "./Dashboard";
const AdminDashboard = () => {
  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "vendors",
      label: "Vendor Details",
      icon: Store,
    },
    {
      id: "orders",
      label: "User Orders",
      icon: ShoppingBag,
    },
    {
      id: "vendor-approvals",
      label: "Vendor Approvals",
      icon: CircleCheck,
    },
    {
      id: "product-approvals",
      label: "Product Approvals",
      icon: Box,
    },
  ];

  const [active, setActive] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState(false);

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "vendors":
        return <VendorDetails />;
      case "orders":
        return <UserOrders />;
      case "vendor-approvals":
        return <VendorAproval />;
      case "product-approvals":
        return <ProductAproval />;
    }
  };

  return (
    <div className="w-full flex min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* mobile */}
      <div className="lg:hidden fixed top-15 left-0 w-full bg-black p-6 py-3 flex justify-between items-center border-b border-gray-700 z-50 text-white">
        <h1 className="text-xl font-bold ">Admin Panel</h1>
        {!openMenu && (
          <button
            onClick={() => {
              setOpenMenu((prev) => !prev);
            }}
          >
            <Menu size={25} />
          </button>
        )}
      </div>

      {/* desktop */}
      <motion.div
        className="hidden lg:block w-72 bg-gray-800/40 border-r border-gray-700 mt-12 p-6 backdrop-blur-xl "
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-bold mb-6  text-white">Admin Panel</h1>

        <div className="flex flex-col gap-3">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-3 px-4  py-3 rounded-lg transition-all text-sm ${active === item.id ? "bg-blue-600 text-white " : "bg-gray-800 hover:bg-gray-700 text-white"}`}
              onClick={() => {
                setActive(item.id);
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* side bar for mobile */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            className="lg:hidden fixed top-0 left-0 w-72 h-full bg-gray-800 backdrop:blur-xl p-6 z-50 border-r border-gray-700 "
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6  text-white">
              <h1 className="text-white">Admin Panel</h1>
              <button onClick={() => setOpenMenu(false)}>
                {" "}
                <X size={24} />{" "}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {menu.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-3 px-4  py-3 rounded-lg transition-all text-sm ${active === item.id ? "bg-blue-600 text-white " : "bg-black/20 hover:bg-gray-700 text-white"}`}
                  onClick={() => {
                    setActive(item.id);
                    setOpenMenu(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main area */}

      <motion.div
        className="flex-1 p-10 mt-16 lg:mt-0"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderPage()}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
