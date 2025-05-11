import { useState } from "react";
import { LoginForm } from "@/components/login/login-form";
import { SignupForm } from "@/components/login/signup-form";
import { Helmet } from "react-helmet-async";
import { t } from "i18next";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <Helmet>
        <title>
          {t("app.title")} - {t("auth.auth")}
        </title>
      </Helmet>
      <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {mode === "login" ? (
            <LoginForm toggleMode={() => setMode("signup")} />
          ) : (
            <SignupForm toggleMode={() => setMode("login")} />
          )}
        </div>
      </div>
    </>
  );
}
