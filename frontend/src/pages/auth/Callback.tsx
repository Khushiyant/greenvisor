import { account } from "@/providers/appwrite-providers";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    (async () => {
      if (userId && secret) {
        await account.createSession(userId, secret);
        window.location.href = "/";
      }
    })();
  }, [userId, secret]);

  return <></>;
}
