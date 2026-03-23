import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";
import Cookies from "js-cookie";
import { getBaseUrl } from "../../helpers/config/envConfig";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers) => {
    const resetToken = Cookies.get("maggot_dashboard_forgetOtpMatchToken");
    const forgetToken = Cookies.get("maggot_dashboard_forgetToken");
    const accessToken = Cookies.get("maggot_dashboard_accessToken");

    const token = resetToken || forgetToken || accessToken;
    if (token) {
      headers.set("token", token);
    }

    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Clear all auth cookies and redirect to sign-in
    Cookies.remove("maggot_dashboard_accessToken", { path: "/" });
    Cookies.remove("maggot_dashboard_loginTempToken", { path: "/" });
    Cookies.remove("maggot_dashboard_forgetToken", { path: "/" });
    Cookies.remove("maggot_dashboard_forgetOtpMatchToken", { path: "/" });
    window.location.href = "/sign-in";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
