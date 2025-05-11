import { useState } from "react";
import { cn, isValidEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Icons } from "../ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  toggleMode?: () => void;
};

export function LoginForm({ className, toggleMode, ...props }: LoginFormProps) {
  const { t } = useTranslation();
  const { login, loginWithDiscord } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: typeof errors = {};

    if (!isValidEmail(email)) {
      newErrors.email = t(
        "auth.invalidEmail",
        "Please enter a valid email address"
      );
      valid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = t(
        "auth.invalidPassword",
        "Password must be at least 6 characters"
      );
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err: any) {
      setErrors({
        password: err?.message || t("auth.loginFailed", "Login failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.login")}</CardTitle>
          <CardDescription>{t("auth.enterEmail")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="text-sm text-destructive">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <button
                    type="button"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    onClick={handleForgotPassword}
                    disabled={loading}
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="somesuperstrongpassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                {errors.password && (
                  <span className="text-sm text-destructive">
                    {errors.password}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("common.loading", "Loading...") : t("auth.login")}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={loginWithDiscord}
                disabled={loading}
              >
                <Icons.discord />
                {t("auth.loginwithDiscord", "Login with Discord")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("auth.dontHaveAccount")}{" "}
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={toggleMode}
                disabled={loading}
              >
                {t("auth.signup")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
