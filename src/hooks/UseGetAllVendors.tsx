import { AppDispatch } from "@/redux/store";
import { setAllVendorData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

const UseGetAllVendors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchAllVendorsData = async () => {
      // Only fetch if user is authenticated
      if (status === "loading") return;
      if (status === "unauthenticated") {
        dispatch(setAllVendorData([]));
        return;
      }

      try {
        const limit = 10;
        const res = await axios.get("/api/vendor/allPendingVendor", {
          params: { limit: limit },
        });
        
        // Serialize dates to strings for Redux compatibility
        const serializedVendors = res.data.vendors.map((vendor: any) => ({
          ...vendor,
          requested_at: vendor.requested_at instanceof Date 
            ? vendor.requested_at.toISOString() 
            : vendor.requested_at,
          approved_at: vendor.approved_at instanceof Date 
            ? vendor.approved_at.toISOString() 
            : vendor.approved_at,
          rejected_at: vendor.rejected_at instanceof Date 
            ? vendor.rejected_at.toISOString() 
            : vendor.rejected_at,
        }));
        
        dispatch(setAllVendorData(serializedVendors));
      } catch (error) {
        console.error(error);
        dispatch(setAllVendorData([]));
      }
    };

    fetchAllVendorsData();
  }, [status, dispatch]);
};

export default UseGetAllVendors;
