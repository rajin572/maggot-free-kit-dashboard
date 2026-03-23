import { Button } from "@/Components/ui/button";
import Container from "@/Components/ui/CustomUi/Container";
import { FormInput, FormPassword } from "@/Components/ui/CustomUi/ReuseForm/Form";
import { FieldGroup } from "@/Components/ui/field";
import useUserData from "@/hooks/useUserData";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineEmail, MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";

const signInSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const SignIn = () => {
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useNavigate();

    const [login] = useLoginMutation();

    const userExist = useUserData();

    useEffect(() => {
        if (userExist?.role === "admin") {
            router("/", { replace: true });
        }
    }, [router, userExist]);

    const onFinish = async (data: z.infer<typeof signInSchema>) => {
        const res = await tryCatchWrapper(login, { body: data }, "Logging In...");
        if (res?.status === 200 && res?.data?.tempToken) {
            Cookies.set("maggot_dashboard_loginTempToken", res.data.tempToken, {
                path: "/",
                expires: 1 / 144, // 10 minutes
                secure: window.location.protocol === "https:",
                sameSite: "strict",
            });
            form.reset();
            router("/login/otp-verify", { replace: true });
        }
    };

    return (
        <div className="text-base-color">
            <Container>
                <div className="min-h-screen flex justify-center items-center">
                    <div className="w-full max-w-150 mx-auto bg-highlight-color p-6 rounded-2xl">
                        {/* -------- Sign In Page Header ------------ */}
                        <div className="flex flex-col justify-center items-center">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mt-5"
                                style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
                            >
                                <span className="text-white text-2xl font-bold">M</span>
                            </div>
                            <div className="text-center mb-8">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-secondary-color">
                                    ম্যাগট-ফ্রি কিট ড্যাশবোর্ড
                                </h1>
                                <h4 className="text-sm sm:text-base lg:text-lg text-secondary-color">
                                    অ্যাডমিন লগইন
                                </h4>
                            </div>
                        </div>
                        <form onSubmit={form.handleSubmit(onFinish)}>
                            <FieldGroup>
                                <FormInput prefix={<MdOutlineEmail size={20} />} control={form.control} name="email" label="Email" placeholder="Enter your email" />

                                <FormPassword
                                    prefix={<MdPassword size={20} />}
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                />

                                <Button className="py-5 text-base cursor-pointer" type="submit">Sign in</Button>
                            </FieldGroup>
                        </form>

                        <div className="flex items-center justify-between mt-4">
                            <div></div>
                            <Link to="/forgot-password" className="text-sm text-secondary-color hover:text-highlight-color">
                                Forgot Password?
                            </Link>
                        </div>

                    </div>

                </div>
            </Container>
        </div>
    );
};
export default SignIn;
