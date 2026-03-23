import { Navigate } from "react-router-dom";
import useUserData from "../hooks/useUserData";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string;
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const user = useUserData();

  if (!user || user.role !== role) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
