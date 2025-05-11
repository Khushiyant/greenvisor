import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidEmail(email)) {
      setError(t("auth.invalidEmail", "Please enter a valid email address"));
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(
        t("auth.resetLinkSent", "Password reset link sent! Check your email.")
      );
    } catch (err: any) {
      setError(
        err?.message || t("auth.resetFailed", "Failed to send reset link")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {t("app.title")} - {t("auth.forgotPassword", "Forgot Password")}
        </title>
        <meta
          name="description"
          content={t(
            "auth.forgotPasswordDesc",
            "Enter your email and we’ll send you a reset link."
          )}
        />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("auth.forgotPassword", "Forgot Password")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t(
                "auth.forgotPasswordDesc",
                "Enter your email and we’ll send you a reset link."
              )}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="pb-2 block">
                  {t("auth.email", "Email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {error && (
                  <div className="text-sm text-destructive mt-1">{error}</div>
                )}
                {success && (
                  <div className="text-sm text-green-600 mt-1">{success}</div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? t("common.loading", "Loading...")
                  : t("auth.sendResetLink", "Send Reset Link")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
