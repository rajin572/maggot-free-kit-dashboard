/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useUserData.ts
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { decodedToken } from "../utils/jwt";

const useUserData = () => {
  const [token, setToken] = useState(() => Cookies.get("maggot_dashboard_accessToken"));

  useEffect(() => {
    const handleTokenUpdate = () => {
      setToken(Cookies.get("maggot_dashboard_accessToken"));
    };
    window.addEventListener("tokenUpdated", handleTokenUpdate);
    return () => window.removeEventListener("tokenUpdated", handleTokenUpdate);
  }, []);

  const user: ITokenUser = useMemo(() => {
    if (!token) return null;
    return decodedToken(token) as any | null;
  }, [token]);

  return user;
};

export default useUserData;
