import { useTranslation } from "react-i18next";
import { Icons } from "./ui/icons";

export function Loading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center py-12">
        <Icons.loader className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <span className="text-muted-foreground text-sm">
          {t("common.loading")}
        </span>
      </div>
    </div>
  );
}
