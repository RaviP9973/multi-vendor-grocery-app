"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  UserIcon,
  Store,
  UserStar,
  ChevronRight,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [loading,setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(result.data);
      setEmail("");
      setName("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20"
          >
            <h1 className="text-4xl font-bold mb-4 text-blue-400 ">
              Welcome to kirana Cart
            </h1>
            <p className="text-gray-300 mb-6 ">
              Register with one of the following account types:
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "User",
                  icon: <UserIcon className="w-8 h-8 mb-2" />,
                  value: "user",
                },
                {
                  label: "Vendor",
                  icon: <Store className="w-8 h-8 mb-2" />,
                  value: "vendor",
                },
                {
                  label: "Admin",
                  icon: <UserStar className="w-8 h-8 mb-2" />,
                  value: "admin",
                },
              ].map((item) => (
                <motion.div
                  key={item.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-white/5 hover:bg-white/20 cursor-pointer rounded-xl  border border-white/30 shadow-lg flex flex-col items-center transition"
                >
                  {item.icon}
                  <span className="text-sm font-medium"> {item.label} </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 justify-center w-full transition-colors duration-300"
              onClick={() => setStep(2)}
            >
              Next <ChevronRight />
            </motion.button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-semibold text-center mb-6 text-blue-600">
              Create Your Account
            </h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4 ">
              <input
                type="text"
                required
                placeholder="Full Name"
                className="bg-white/10 border-white/30 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                required
                placeholder="Email"
                className="bg-white/10 border-white/30 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="relative bg-white/10 border-white/30 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-12 top-61 -translate-y-1/2 text-gray-400 hover:text-white  transition-all duration-300"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex items-center gap-2 justify-center w-full transition-colors duration-300"
                type="submit"
              >

                {/* create a loader  */}


                {loading ? <Loader className="animate-spin duration-300 "/> : "Register Now!"}
              </motion.button>

              {/* or  */}
              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-gray-600 "></div>
                <span className="px-3 text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-600 "></div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-colors duration-300"
              >
                <img src={`https://img.icons8.com/?size=100&id=17949&format=png&color=000000`} alt="google icon" className="w-5 h-5"/>
                <span className="font-medium ">Continue with Google  </span>
              </motion.button>
              <p className="text-center text-sm mt-4 text-gray-400 ">
                Already have an account?{" "} <span onClick={() => router.push('/login')} className="text-blue-400 hover:underline hover:text-blue-300 transition">SignIn</span>
              </p>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
