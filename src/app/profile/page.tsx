"use client";

import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Loader, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { updateVendorDetails } from "../actions/vendor";
import { setUserData } from "@/redux/userSlice";

type VendorDetails = {
  shop_name?: string;
  shop_address?: string;
  gst_number?: string;
};

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.userData);
  const router = useRouter();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.image);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(
    null,
  );
  const [phone, setPhone] = useState(user?.phone || "");
  const [shopName, setShopName] = useState(vendorDetails?.shop_name || "");
  const [shopAddress, setShopAddress] = useState(
    vendorDetails?.shop_address || "",
  );
  const [gstNumber, setGstNumber] = useState(vendorDetails?.gst_number || "");

  const [loading, setLoading] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();



  const getVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/vendor/myDetails");

      if (res.status === 200) {
        const { vendorDetails: data } = res.data;
        if (data && data.length > 0) {
          setVendorDetails(data[0]);
        } else {
          setVendorDetails(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch vendor details:", error);
      setVendorDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "vendor") {
      getVendorDetails();
    } else {
      setVendorDetails(null);
    }
  }, [user?.role]);

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setPreviewImage(user?.image || "");
  }, [user?.name, user?.phone, user?.image]);

  useEffect(() => {
    setShopAddress(vendorDetails?.shop_address || "");
    setShopName(vendorDetails?.shop_name || "");
    setGstNumber(vendorDetails?.gst_number || "");
  }, [vendorDetails]);

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setProfileImage(file);

    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!shopName || !shopAddress || !gstNumber) {
      alert("Fill all fields");
      return;
    }
    setUpdateLoading(true);

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
      setUpdateLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!name || !phone) {
      return;
    }
    try {
      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (profileImage) {
        formData.append("image", profileImage);
      }

      const res = await axios.post("/api/user/update-profile",formData);

      if(res.status === 200) {
        dispatch(setUserData(res.data.user));
        alert("Profile updated successfully");
        setProfileImage(null);
      }

    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating profile");
      
    }finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-0 pt-24 pb-10">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 border-white/20 shadow-xl rounded-2xl"
      >
        <div className="flex flex-col items-center text-center ">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/30 hover:border-blue-400"
          >
            {user?.image ? (
              <Image src={user?.image} alt="profile" width={120} height={120} />
            ) : (
              <div className="w-full h-full flex items-center justify-center ">
                <User size={48} className="text-white" />
              </div>
            )}
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold mt-4">{user?.name}</h2>
          <p className="text-gray-300  text-sm sm:text-base">{user?.email}</p>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">
            Role: <span className="text-blue-400 uppercase">{user?.role}</span>
          </p>
        </div>

        <div className="mt-8 space-y-3 text-sm text-base ">
          <p>
            <b>Phone: </b>
            {user?.phone || "-"}
          </p>

          {user?.role === "vendor" && (
            <>
              <p>
                <b>Shop Name: </b>
                {loading ? "Loading..." : vendorDetails?.shop_name || "-"}
              </p>
              <p>
                <b>Shop Address: </b>
                {loading ? "Loading..." : vendorDetails?.shop_address || "-"}
              </p>
              <p>
                <b>GSTIN : </b>
                {loading ? "Loading..." : vendorDetails?.gst_number || "-"}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8 ">
          {user?.role === "user" && (
            <motion.button
              className="bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold "
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/orders")}
            >
              My Orders
            </motion.button>
          )}

          <motion.button
            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold "
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setShowEditProfile(!showEditProfile);

              setShowEditShop(false);
            }}
          >
            Edit Profile
          </motion.button>

          {user?.role === "vendor" && (
            <motion.button
              className="bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold "
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setShowEditShop(!showEditShop);

                setShowEditProfile(false);
              }}
            >
              Edit Shop Details
            </motion.button>
          )}
        </div>
        <AnimatePresence>
          {showEditProfile && (
            <motion.div
              className="mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <h3 className="text-xl font-bold mb-5">Edit Profile</h3>

              <div className="flex flex-col items-center mb-6 ">
                <motion.div
                  className="w-24 h-24 rounded-full overflow-hidden border-white/30 mb-3 hover:border-blue-400 border-2 "
                  whileHover={{ scale: 1.05 }}
                >
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="select image"
                      height={120}
                      width={120}
                      className="object-cover w-full h-full "
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center ">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </motion.div>
                <label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg text-sm">
                  Select Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePreviewImage}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />

                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded"
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold w-full "

                  onClick={handleProfileUpdate}
                >
                  {updateLoading ? <Loader className="animate-spin duration-75"/> : "Update Profile"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showEditShop && (
            <motion.div
              className="mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <h3 className="text-xl font-bold mb-5">Edit Shop Details</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded"
                  placeholder="Shop Name"
                  onChange={(e) => setShopName(e.target.value)}
                  value={shopName}
                />

                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded"
                  placeholder="Shop Address"
                  onChange={(e) => setShopAddress(e.target.value)}
                  value={shopAddress}
                />
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded"
                  placeholder="GSTIN"
                  onChange={(e) => setGstNumber(e.target.value)}
                  value={gstNumber}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold w-full "
                  disabled={updateLoading}
                  onClick={handleSubmit}
                >
                  {updateLoading ? "Updating..." : "Update Shop Details"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;
