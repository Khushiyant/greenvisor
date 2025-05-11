import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "@/components/Loading";

export function PublicRoute({ children }: { children?: React.ReactNode }) {
  const { authState } = useAuth();

  if (authState === "pending") {
    return <Loading />;
  }

  // If authenticated, redirect to the protected root ("/home" or "/")
  if (authState === "authenticated") {
    return <Navigate to="/home" replace />;
  }

  // Otherwise, render public routes
  return children ? <>{children}</> : <Outlet />;
}
