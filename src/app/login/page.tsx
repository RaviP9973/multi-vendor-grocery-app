"use client";

import { Eye, EyeOff, Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const session = useSession();

  console.log(session.data?.user);
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      redirect("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (  
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence>
        <motion.div
          className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-100">
            Welcome Back to <span className="text-blue-400">Kiranakart</span>
          </h1>
          <form className="flex flex-col gap-4 " onSubmit={handleSignin}>
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
              className="absolute right-12 top-44 -translate-y-1/2 text-gray-400 hover:text-white  transition-all duration-300"
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

              {loading ? (
                <Loader className="animate-spin duration-300 " />
              ) : (
                "Sign In"
              )}
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
              onClick={() => signIn("google", {callbackUrl: "/"})}
            >
              <img
                src={`https://img.icons8.com/?size=100&id=17949&format=png&color=000000`}
                alt="google icon"
                className="w-5 h-5"
              />
              <span className="font-medium ">Continue with Google </span>
            </motion.button>
            <p className="text-center text-sm mt-4 text-gray-400 ">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-400 hover:underline hover:text-blue-300 transition"
              >
                SignUp
              </span>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
