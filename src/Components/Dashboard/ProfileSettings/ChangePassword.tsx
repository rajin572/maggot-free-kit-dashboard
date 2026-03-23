import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schemas/auth";
import { FieldError, FieldGroup } from "@/Components/ui/field";
import { FormPassword } from "@/Components/ui/CustomUi/ReuseForm/Form";
import z from "zod";
import { Button } from "@/Components/ui/button";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import Cookies from "js-cookie";
import PasswordStrengthIndicator from "@/Components/ui/CustomUi/PasswordStrengthIndicator";

const ChangePassword = () => {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const confirmPasswordError = confirmPassword && password !== confirmPassword;

  const [updatePassword] = useChangePasswordMutation();

  const onFinish = async (data: z.infer<typeof changePasswordSchema>) => {
    const values = {
      oldPassword: data.currentPassword,
      newPassword: data.confirmPassword,
    };

    const res = await tryCatchWrapper(
      updatePassword,
      { body: values },
      "Changing Password..."
    );
    if (res?.status === 200) {
      Cookies.remove("maggot_dashboard_accessToken");
      window.location.href = "/sign-in";
      window.location.reload();
    }
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={form.handleSubmit(onFinish)}>
        <FieldGroup>
          <FormPassword
            control={form.control}
            name="currentPassword"
            label="বর্তমান পাসওয়ার্ড"
            placeholder="বর্তমান পাসওয়ার্ড দিন"
          />
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

          <Button className="py-5 text-base" type="submit">পাসওয়ার্ড পরিবর্তন করুন</Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default ChangePassword;
