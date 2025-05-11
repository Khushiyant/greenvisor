import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";
import { useUserData } from "@/hooks/useUserData";

export default function RootRedirect() {
  const { data: userData, isLoading } = useUserData().fetch;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // still loading
    if (!userData) {
      navigate("/setup", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [userData, navigate, isLoading]);

  return <Loading />;
}
