import { IVendor } from "@/script/migrate";
import { createSlice } from "@reduxjs/toolkit";

interface IVendorData {
    allVendorData: IVendor[] | null
}

const initialState: IVendorData = {
    allVendorData: []
}


const vendorSlice = createSlice({
    name: "vendor",
    initialState: initialState,
    reducers: {
        setAllVendorData: (state,action) => {
            state.allVendorData = action.payload;
        }
    }

})


export const { setAllVendorData } = vendorSlice.actions;
export default vendorSlice.reducer;