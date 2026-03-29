"use client";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Container from "@/Components/ui/CustomUi/Container";
import AuthLogo from "@/Components/Shared/AuthLogo";
import { Button } from "@/Components/ui/button";
import { useForgetOtpVerifyMutation, useResendForgetOTPMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";

const OTPVerify = () => {
  const router = useNavigate();
  const [otp, setOtp] = useState("");

  const forgottenEmail = JSON.parse(
    Cookies.get("maggot_dashboard_forgetEmail") || "null"
  );

  const [otpMatch] = useForgetOtpVerifyMutation();
  const [resendOtp] = useResendForgetOTPMutation();

  const handleOTPSubmit = async () => {
    if (otp.length === 6) {
      const res = await tryCatchWrapper(
        otpMatch,
        { body: { otp: otp } },
        "Verifying..."
      );
      if (res?.status === 200) {
        Cookies.remove("maggot_dashboard_forgetToken");
        Cookies.remove("maggot_dashboard_forgetEmail");
        Cookies.set("maggot_dashboard_forgetOtpMatchToken", res.data.forgetOtpMatchToken, {
          path: "/",
          expires: 1 / 144, // 10 minutes
          secure: window.location.protocol === "https:",
          sameSite: "strict",
        });

        setOtp("");
        router("/update-password");
      }
    }
  };

  const handleResendOtp = async () => {
    await tryCatchWrapper(
      resendOtp,
      {
        body: {
          purpose: "forget-password",
        },
      },
      "Sending OTP..."
    );
  };

  return (
    <div className="text-base-color">
      <Container>
        <div className="min-h-screen flex justify-center items-center text-center">
          <div className="w-full max-w-150 mx-auto bg-highlight-color p-6 rounded-2xl">
            <div className="mb-8">
              <AuthLogo />
              <div className="flex items-center justify-center gap-2 -mt-4 mb-3">
                <MdVerifiedUser className="size-5 text-secondary-color" />
                <h1 className="text-xl sm:text-2xl font-semibold text-base-color">
                  ইমেইল যাচাই করুন
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                পাসওয়ার্ড রিসেটের OTP পাঠানো হয়েছে{" "}
                <span className="text-secondary-color font-bold">{forgottenEmail}</span>-এ
              </p>
            </div>

            <div className="bg-transparent w-full">
              <div className="flex justify-center items-center">
                <OTPInput
                  inputStyle="!w-[30px] h-[40px] md:!w-[60px] md:!h-[70px] text-[20px] sm:text-[30px] !bg-primary-color border !border-base-color/30
                      rounded-lg mr-[10px] sm:mr-[20px] !text-base-color "
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} required />}
                />
              </div>

              <Button
                onClick={handleOTPSubmit}
                className="py-5 text-base cursor-pointer w-full mt-10"
              >
                Verify OTP
              </Button>
            </div>
            <div className="flex justify-center gap-2 py-1 mt-5">
              <p>Didn’t receive code?</p>
              <p
                onClick={handleResendOtp}
                className="text-secondary-color! underline! font-semibold cursor-pointer"
              >
                Click to resend
              </p>
            </div>
          </div>
        </div>
      </Container >
    </div >
  );
};
export default OTPVerify;
