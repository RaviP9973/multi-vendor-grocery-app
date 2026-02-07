"use client";
import { ROLES } from "@/lib/constants/roles";
import { userRole } from "@/script/migrate";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditRoleAndPhone() {
  const [role, setRole] = useState<userRole | "">("user");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [adminExists, setAdminExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/admin/check-admin");
        setAdminExists(res.data.exists);
      } catch (error) {
        console.error("Error checking admin existence:", error);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !phone) {
      alert("Please select a role and enter your phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/user/edit-role-phone", {
        role,
        phone,
      });
      console.log(res.data);

      router.push("/");
    } catch (error) {
      console.error("Error updating role and phone:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to bg-gray-900 text-white p-6 ">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 p-10"
        >
          <h1 className="text-4xl font-semibold text-center mb-4 ">
            Select Your Role
          </h1>
          <p className="text-center text-gray-300 mb-8 text-base ">
            Select your role and enter your mobile number to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
            <input
              type="text"
              className="bg-white/10 border border-white/30 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              placeholder="Enter your Mobile number"
              maxLength={10}
              required
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 ">
              {ROLES.map((role) => {
                const isAdminBlocked = role.value === "admin" && adminExists;
                const Icon = role.icon;
                return (
                  <motion.div
                    whileHover={
                      !isAdminBlocked ? { scale: 1.07 } : { scale: 1 }
                    }
                    key={role.value}
                    className={`cursor-pointer p-6 text-center rounded-2xl border transition text-lg font-medium ${isAdminBlocked && "opacity-40 cursor-not-allowed "}`}
                    onClick={() => {
                      if (isAdminBlocked) {
                        alert(
                          "Admin exists already",
                        );
                        return;
                      }

                      setRole(role.value);
                    }}
                  >
                    <div className="flex flex-col items-center mb-3">
                      <Icon className="w-8 h-8" />
                    </div>
                    <p>{role.label}</p>

                    {isAdminBlocked && (
                      <p className="text-red-500 text-sm mt-2">
                        Admin exists already, you can't select admin role
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 justify-center w-full transition-colors duration-300"
              type="submit"
            >
              {/* create a loader  */}

              {loading ? (
                <Loader className="animate-spin duration-300 " />
              ) : (
                "Submit Now"
              )}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
