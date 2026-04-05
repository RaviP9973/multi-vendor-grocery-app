"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IVendor } from "@/script/migrate";
import { setAllVendorData } from "@/redux/vendorSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { Loader } from "lucide-react";

// Local type for vendors with joined user data
type VendorWithUser = IVendor & {
  user_name: string;
  phone: string;
};

const VendorAproval = () => {
  const [selectedVendor, setSelectedVendor] = useState<VendorWithUser | null>(
    null,
  );
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const openRejectModal = () => {
    setRejectModal(true);
    setRejectionReason("");
  }

  const dispatch = useDispatch();

  const getPendingVendors = async () => {
    const res = await axios.get("/api/vendor/allPendingVendor", {
      params: { limit: 10 },
    });

    if (res.status === 200) {
      console.log(res);
      dispatch(setAllVendorData(res.data.vendors));
    } else {
      dispatch(setAllVendorData([]));
    }
  };

  useEffect(() => {
    getPendingVendors();
  }, []);

  const allVendorData = useSelector(
    (state: RootState) => state.vendor.allVendorData,
  ) as VendorWithUser[];

  const updateStatus = async (
    id: string,
    status: string,
    rejectionReason?: string | null,
  ) => {
    if (status === "approved") {
      setApproveLoading(true);
    } else {
      setRejectLoading(true);
    }
    try {
      const res = await axios.post("/api/admin/update-vendor-status", {
        vendorId: id,
        status,
        rejectionReason,
      });

      if (res.status === 200) {
        dispatch(
          setAllVendorData(allVendorData.filter((vendor) => vendor.id !== id)),
        );

        setSelectedVendor(null);
        alert("Vendor status updated successfully");
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
      alert("Failed to update vendor status. Please try again.");
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-10 py-6 text-white">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left ">
        Vendor Approval Requests
      </h1>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10 ">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Vendor Name</th>
              <th className="p-4">Shop Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {allVendorData.length === 0 ? (
              <tr>
                <td className="p-6  text-center text-gray-400 ">
                  No pending vendor approval requests.
                </td>
              </tr>
            ) : (
              allVendorData.map((vendor: VendorWithUser) => (
                <tr
                  key={vendor?.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{vendor?.user_name}</td>
                  <td className="p-4">{vendor?.shop_name || "-"}</td>
                  <td className="p-4">{vendor?.phone || "-"}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/30">
                      {vendor?.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      Check Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile view */}
      <div className="md:hidden flex flex-col gap-4 ">
        {allVendorData.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 ">
            No pending vendor approval requests.
          </div>
        ) : (
          allVendorData.map((vendor) => (
            <div
              className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2"
              key={vendor?.id}
            >
              <div className="flex justify-between items-center ">
                <h3 className="font-semibold text-lg">{vendor?.user_name}</h3>
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
                  {vendor?.status}
                </span>
              </div>
              <p className="text-sm text-gray-300 ">
                <b>Shop:</b>
                {vendor?.shop_name}
              </p>
              <p className="text-sm text-gray-300 ">
                <b>Phone:</b>
                {vendor?.phone}
              </p>

              <button
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded-lg "
                onClick={() => setSelectedVendor(vendor)}
              >
                Check Details
              </button>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6  rounded-2xl w-full max-w-lg border border-white/10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 ">
                Selected Vendor details
              </h3>

              <div className="space-y-2 text-sm ">
                <p>
                  <b>Name:</b> {selectedVendor?.user_name}
                </p>
                <p>
                  <b>Phone:</b> {selectedVendor?.phone || "-"}
                </p>
                <p>
                  <b>Shop Name:</b> {selectedVendor?.shop_name || "-"}
                </p>
                <p>
                  <b>Shop Address:</b> {selectedVendor?.shop_address || "-"}
                </p>
                <p>
                  <b>GSTIN:</b> {selectedVendor?.gst_number || "-"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  className="flex-1 bg-green-600 py-2 rounded-lg hover:bg-green-700 text-sm"
                  onClick={() => {
                    updateStatus(selectedVendor?.id as string, "approved");
                  }}
                  disabled={approveLoading || rejectLoading}
                >
                  {approveLoading ? (
                    // SHOW LOADER
                    <Loader className="animate-spin duration-300 " />
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-700 text-sm"
                  onClick={() => {
                    openRejectModal();
                  }}

                  disabled={rejectLoading || approveLoading}
                >
                  {rejectLoading ? (
                    // SHOW LOADER
                    <Loader className="animate-spin duration-300 " />
                  ) : (
                    "Reject"
                  )}
                </button>
                <button
                  className="flex-1 bg-gray-600 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  onClick={() => setSelectedVendor(null)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6  rounded-2xl w-full max-w-lg border border-white/10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 ">
                Enter rejection reason
              </h3>

              <textarea className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm " name="rejectionReason" id="rejectionReason" placeholder="Enter rejection reason" 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)} 
              rows={3}
              />

              

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-700 text-sm"
                  onClick={() => {
                    updateStatus(selectedVendor?.id as string, "rejected", rejectionReason);
                    setRejectModal(false);
                  }}

                  disabled={rejectLoading || approveLoading}
                >
                  {rejectLoading ? (
                    // SHOW LOADER
                    <Loader className="animate-spin duration-300 " />
                  ) : (
                    "Confirm Reject"
                  )}
                </button>
                <button
                  className="flex-1 bg-gray-600 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  onClick={() => setRejectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
};

export default VendorAproval;
