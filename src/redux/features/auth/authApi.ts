import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (req) => ({
        url: "/admin-login",
        method: "POST",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    changePassword: build.mutation({
      query: (req) => ({
        url: "/change-password",
        method: "PATCH",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    verifyLoginOtp: build.mutation({
      query: (req) => ({
        url: "/verify-otp",
        method: "POST",
        body: req.body,
      }),
    }),
    forgetPassword: build.mutation({
      query: (req) => ({
        url: "/forgot-password",
        method: "POST",
        body: req.body,
      }),
    }),
    forgetOtpVerify: build.mutation({
      query: (req) => ({
        url: "/verify-reset-otp",
        method: "PATCH",
        body: req.body,
      }),
    }),
    resendForgetOTP: build.mutation({
      query: (req) => ({
        url: "/resend-reset-otp",
        method: "PATCH",
        body: req.body,
      }),
    }),
    resetPassword: build.mutation({
      query: (req) => ({
        url: "/reset-password",
        method: "PATCH",
        body: req.body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useForgetOtpVerifyMutation,
  useResendForgetOTPMutation,
  useResetPasswordMutation,
} = authApi;
export default authApi;
