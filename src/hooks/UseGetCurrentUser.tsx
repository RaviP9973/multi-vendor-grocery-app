import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

function UseGetCurrentUser() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      // Only fetch if user is authenticated
      if (status === "loading") return;
      if (status === "unauthenticated") {
        dispatch(setUserData(null));
        return;
      }

      try {
        const result = await axios.get("api/user/currentUser");
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error(error);
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [status, dispatch]);
}

export default UseGetCurrentUser;
