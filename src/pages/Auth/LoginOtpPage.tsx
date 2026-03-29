import { useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Container from "@/Components/ui/CustomUi/Container";
import AuthLogo from "@/Components/Shared/AuthLogo";
import { Button } from "@/Components/ui/button";
import { useVerifyLoginOtpMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import OTPInput from "react-otp-input";

const LoginOtpPage = () => {
  const router = useNavigate();
  const [otp, setOtp] = useState("");
  const [verifyOtp] = useVerifyLoginOtpMutation();

  const tempToken = Cookies.get("maggot_dashboard_loginTempToken");

  const handleSubmit = async () => {
    if (otp.length !== 6) return;

    const res = await tryCatchWrapper(
      verifyOtp,
      { body: { tempToken, otp } },
      "যাচাই করা হচ্ছে..."
    );

    if (res?.status === 200 && res?.token) {
      Cookies.remove("maggot_dashboard_loginTempToken");
      Cookies.set("maggot_dashboard_accessToken", res.token, {
        path: "/",
        expires: 7,
        secure: window.location.protocol === "https:",
        sameSite: "strict",
      });
      setOtp("");
      router("/", { replace: true });
    }
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
                আপনার ইমেইলে একটি ৬-সংখ্যার OTP পাঠানো হয়েছে।
                <br />লগইন সম্পন্ন করতে OTP প্রবেশ করুন।
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <OTPInput
                inputStyle="!w-[42px] h-[52px] md:!w-[56px] md:!h-[64px] text-xl sm:text-2xl !bg-primary-color border !border-base-color/30 rounded-lg mr-[8px] sm:mr-[12px] !text-base-color"
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => <input {...props} required />}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={otp.length !== 6}
              className="py-5 text-base cursor-pointer w-full"
            >
              লগইন নিশ্চিত করুন
            </Button>

            <p
              className="text-sm text-muted-foreground mt-4 cursor-pointer hover:underline"
              onClick={() => router("/sign-in")}
            >
              ← ফিরে যান
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginOtpPage;
