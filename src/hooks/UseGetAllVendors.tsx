import { AppDispatch } from "@/redux/store";
import { setAllVendorData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const UseGetAllVendors = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAllVendorsData = async () => {
      try {
        const limit = 10;
        const res = await axios.get("/api/vendor/AllVendor", {
          params: { limit: limit },
        });
        dispatch(setAllVendorData(res.data));
      } catch (error) {
        console.error(error);
        dispatch(setAllVendorData([]));
      }
    };

    fetchAllVendorsData();
  }, []);
};

export default UseGetAllVendors;
