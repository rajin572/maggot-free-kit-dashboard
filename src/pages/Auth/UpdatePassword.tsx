import { Button } from "@/Components/ui/button";
import Container from "@/Components/ui/CustomUi/Container";
import { FormPassword } from "@/Components/ui/CustomUi/ReuseForm/Form";
import PasswordStrengthIndicator from "@/Components/ui/CustomUi/PasswordStrengthIndicator";
import { FieldError, FieldGroup } from "@/Components/ui/field";
import useUserData from "@/hooks/useUserData";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { updatePasswordSchema } from "@/schemas/auth";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RiKey2Line } from "react-icons/ri";
import AuthLogo from "@/Components/Shared/AuthLogo";
import { useNavigate } from "react-router-dom";
import z from "zod";

const UpdatePassword = () => {
  const form = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const confirmPasswordError = confirmPassword && password !== confirmPassword;

  const router = useNavigate();
  const userExist = useUserData();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    if (userExist?.role === "admin") {
      router("/", { replace: true });
    }
  }, [router, userExist]);

  const onFinish = async (data: z.infer<typeof updatePasswordSchema>) => {
    const res = await tryCatchWrapper(
      resetPassword,
      { body: { newPassword: data.password, confirmPassword: data.confirmPassword } },
      "Changing Password..."
    );
    if (res?.status === 200) {
      form.reset();
      Cookies.remove("maggot_dashboard_forgetOtpMatchToken");
      router("/sign-in");
    }
  };

  return (
    <div className="text-base-color">
      <Container>
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-full max-w-150 mx-auto bg-highlight-color p-6 rounded-2xl">
            <div className="mb-8 text-center">
              <AuthLogo />
              <div className="flex items-center justify-center gap-2 -mt-4 mb-3">
                <RiKey2Line className="size-5 text-secondary-color" />
                <h1 className="text-xl sm:text-2xl font-semibold text-base-color">
                  নতুন পাসওয়ার্ড তৈরি করুন
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                নতুন পাসওয়ার্ড আগের পাসওয়ার্ড থেকে আলাদা হতে হবে।
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onFinish)}>
              <FieldGroup>
                <div>
                  <FormPassword
                    control={form.control}
                    name="password"
                    label="নতুন পাসওয়ার্ড"
                    placeholder="নতুন পাসওয়ার্ড দিন"
                  />
                  <PasswordStrengthIndicator password={password} />
                </div>

                <FormPassword
                  control={form.control}
                  name="confirmPassword"
                  label="পাসওয়ার্ড নিশ্চিত করুন"
                  placeholder="পাসওয়ার্ড আবার দিন"
                />

                {confirmPasswordError && (
                  <FieldError errors={[{ message: "পাসওয়ার্ড মিলছে না" }]} />
                )}

                <Button className="py-5 text-base w-full" type="submit">
                  সম্পন্ন করুন
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UpdatePassword;
