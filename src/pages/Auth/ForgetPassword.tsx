"use client";
import { Button } from "@/Components/ui/button";
import Container from "@/Components/ui/CustomUi/Container";
import { FormInput } from "@/Components/ui/CustomUi/ReuseForm/Form";
import { FieldGroup } from "@/Components/ui/field";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { RiKey2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import Cookies from "js-cookie";
import { useEffect } from "react";
import useUserData from "@/hooks/useUserData";


const forgetPassSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
});

const ForgotPassword = () => {
    const form = useForm({
        resolver: zodResolver(forgetPassSchema),
        defaultValues: {
            email: "",
        },
    });

    const router = useNavigate();
    const userExist = useUserData();
    const [forgetPassword] = useForgetPasswordMutation();

    useEffect(() => {
        if (userExist?.role === "admin") {
            router("/", { replace: true });
        }
    }, [router, userExist]);

    const onFinish = async (data: z.infer<typeof forgetPassSchema>) => {
        const res = await tryCatchWrapper(
            forgetPassword,
            { body: data },
            "Sending OTP..."
        );
        if (res?.status === 200) {
            form.reset();
            Cookies.set("maggot_dashboard_forgetToken", res.data.forgetToken, {
                path: "/",
                expires: 1 / 144, // 10 minutes
                secure: window.location.protocol === "https:",
                sameSite: "strict",
            });
            Cookies.set("maggot_dashboard_forgetEmail", JSON.stringify(data.email), {
                path: "/",
                expires: 1 / 144,
                secure: window.location.protocol === "https:",
                sameSite: "strict",
            });
            router("/forgot-password/otp-verify");
        }
    };
    return (
        <div className="text-base-color">
            <Container>
                <div className="min-h-screen flex justify-center items-center ">
                    <div className="w-full max-w-150 mx-auto bg-highlight-color p-6 rounded-2xl">
                        <div className="mb-8">
                            <div className="bg-[#0C0C0C0D] w-fit mx-auto p-2 rounded-full  mb-4">
                                <RiKey2Line className="size-10 text-base-color mx-auto" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-base-color mb-5 text-center">
                                Forgot Password
                            </h1>
                            <p className=" sm:text-lg mb-2 text-base-color text-center">
                                No Worries, we’ll send you reset instruction
                            </p>
                        </div>

                        <form onSubmit={form.handleSubmit(onFinish)}>
                            <FieldGroup>
                                <FormInput prefix={<MdOutlineEmail size={20} />} control={form.control} name="email" label="Email" placeholder="Enter your email" />

                                <Button className="py-5 text-base cursor-pointer" type="submit">Sign in</Button>
                            </FieldGroup>
                        </form>

                        <div className="text-base-color w-fit mx-auto mt-10">
                            <Link
                                to="/sign-in"
                                className="flex justify-center items-center  gap-2 "
                            >
                                <FaArrowLeftLong className="size-4 " />
                                <span>Back to log in</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default ForgotPassword;
