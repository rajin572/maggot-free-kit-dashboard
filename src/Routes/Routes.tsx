import {
  createBrowserRouter,
  RouteObject,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import { routeGenerator } from "@/utils/routesGenerator";
import { adminRoutes } from "./admin.route";
import { useEffect } from "react";
import Loading from "@/Components/ui/CustomUi/Loading";
import SignIn from "@/pages/Auth/SignIn";
import LoginOtpPage from "@/pages/Auth/LoginOtpPage";
import ForgotPassword from "@/pages/Auth/ForgetPassword";
import OTPVerify from "@/pages/Auth/OtpPage";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import NotFound from "@/Components/ui/CustomUi/NotFound/NotFound";
import useUserData from "@/hooks/useUserData";
import ProtectedRoute from "./ProtectedRoute";

// eslint-disable-next-line react-refresh/only-export-components
function AuthRedirect() {
  const user = useUserData(); // Replace with actual user retrieval logic
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      navigate(`/${user.role}/overview`, {
        replace: true,
      });
    } else {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate, user]);

  // Optionally display a loading indicator
  return <Loading />;
}

// Define routes with TypeScript types
const router: RouteObject[] = [
  {
    path: "/",
    index: true, // This applies to the exact path "/"
    element: <AuthRedirect />,
  },
  {
    path: "/dashboard",
    index: true, // This applies to the exact path "/"
    element: <AuthRedirect />,
  },
  {
    path: "/admin/dashboard",
    index: true, // This applies to the exact path "/"
    element: <AuthRedirect />,
  },
  {
    path: "/overview",
    index: true, // This applies to the exact path "/"
    element: <AuthRedirect />,
  },
  {
    path: "/admin",
    index: true, // This applies to the exact path "/"
    element: <AuthRedirect />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: routeGenerator(adminRoutes),
  },
  {
    path: "sign-in",
    element: <SignIn />,
  },
  {
    path: "login/otp-verify",
    element: <LoginOtpPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "forgot-password/otp-verify",
    element: <OTPVerify />,
  },
  {
    path: "update-password",
    element: <UpdatePassword />,
  },
  {
    path: "*", // Catch-all for undefined routes
    element: <NotFound />,
  },
];

// Create the router using createBrowserRouter
const routes = createBrowserRouter(router);

export default routes;
