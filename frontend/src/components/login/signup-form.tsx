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
import { useAuth } from "@/context/AuthContext";

type SignupFormProps = React.ComponentPropsWithoutRef<"div"> & {
  toggleMode?: () => void;
};

export function SignupForm({
  className,
  toggleMode,
  ...props
}: SignupFormProps) {
  const { t } = useTranslation();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t("auth.invalidName", "Please enter your name");
      valid = false;
    }
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
      await signUp(email, password, name);
    } catch (err: any) {
      setErrors({
        password: err?.message || t("auth.signupFailed", "Signup failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.signup")}</CardTitle>
          <CardDescription>
            {t(
              "auth.enterEmail",
              "Enter your email below to create your account"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("auth.name", "Name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("auth.namePlaceholder", "Your name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
                {errors.name && (
                  <span className="text-sm text-destructive">
                    {errors.name}
                  </span>
                )}
              </div>
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
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t(
                    "auth.passwordPlaceholder",
                    "Choose a strong password"
                  )}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
                {errors.password && (
                  <span className="text-sm text-destructive">
                    {errors.password}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("common.loading", "Loading...") : t("auth.signup")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("auth.alreadyHaveAccount", "Already have an account?")}{" "}
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={toggleMode}
                disabled={loading}
              >
                {t("auth.login")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
