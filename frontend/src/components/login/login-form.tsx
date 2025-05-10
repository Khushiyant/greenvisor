import { cn } from "@/lib/utils";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.login")}</CardTitle>
          <CardDescription>{t("auth.enterEmail")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t("auth.forgotPassword")}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="somesuperstrongpassword"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t("auth.login")}
              </Button>
              <Button variant="outline" className="w-full">
                <Icons.discord />
                {t("auth.loginwithDiscord", "Login with Discord")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("auth.dontHaveAccount")}{" "}
              <a href="#" className="underline underline</svg>-offset-4">
                {t("auth.signup")}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
