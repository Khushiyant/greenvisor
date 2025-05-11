import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loading } from "@/components/Loading";

export function ProtectedRoute({
  redirectTo = "/",
  children,
}: {
  redirectTo?: string;
  children?: React.ReactNode;
}) {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState === "pending") {
    return <Loading />;
  }

  if (authState !== "authenticated") {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If children are provided, render them, else render <Outlet /> for nested routes
  return children ? <>{children}</> : <Outlet />;
}
