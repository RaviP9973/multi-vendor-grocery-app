"use client";
import { File, Home, Loader, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateVendorDetails } from "@/app/actions/vendor";

const EditVendorDetailsForm = () => {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !shopAddress || !gstNumber) {
      alert("Fill all fields");
      return;
    }
    setLoading(true);

    try {
      const result = await updateVendorDetails({
        shopName,
        shopAddress,
        gstNumber,
      });
      
      if (result.success) {
        console.log(result.message, result.vendor);
        router.push("/");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error in updating details", error);
      alert("An error occurred while updating details");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        className="w-full max-w-md bg-white/10 backdrop:blur-md rounded-3xl shadow-xl p-8 border border-white/10 "
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-3xl font-semibold text-center mb-4  ">
          Complete Your Shop Details
        </h3>

        <p className="text-center text-gray-300 mb-6 text-sm ">
          Enter Your business information to activate your vendor account.
        </p>

        <form className="flex flex-col gap-6 " onSubmit={handleSubmit}>
          <div className="relative ">
            <ShoppingBag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 "
              size={22}
            />
            <input
              type="text"
              required
              placeholder="Enter your shop name"
              className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setShopName(e.target.value)}
              value={shopName}
            />
          </div>
          <div className="relative ">
            <Home
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 "
              size={22}
            />
            <input
              type="text"
              required
              placeholder="Enter your shop address"
              className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setShopAddress(e.target.value)}
              value={shopAddress}
            />
          </div>
          <div className="relative ">
            <File
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 "
              size={22}
            />
            <input
              type="text"
              required
              placeholder="Enter your gst number"
              className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setGstNumber(e.target.value)}
              value={gstNumber}
            />
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
  );
};

export default EditVendorDetailsForm;
