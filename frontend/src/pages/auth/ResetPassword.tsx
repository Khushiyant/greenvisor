import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call your backend API here
      console.log("Reset password with:", { token, password });

      // Simulate success
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-background justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-md border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your new password.
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-green-600 text-sm text-center py-4">
              ✅ Password has been reset! You may now log in.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="block mb-1.5">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="block mb-1.5">
                  Confirm Password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 py-2"
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
