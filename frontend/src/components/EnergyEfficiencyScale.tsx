import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { GRADE_COLORS } from "@/lib/grade-colors";

type EnergyEfficiencyScaleProps = {
  currentGrade: string;
};

export default function EnergyEfficiencyScale({
  currentGrade,
}: EnergyEfficiencyScaleProps) {
  const { t } = useTranslation();
  const grades = ["H", "G", "F", "E", "D", "C", "B", "A", "A+"];

  return (
    <div className="px-2 py-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {t("dashboard.energyEfficiency", "Gesamtenergieeffizienz")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-10 sm:h-8 rounded-full flex overflow-hidden shadow-inner gap-[1px] bg-gray-100">
            {grades.map((grade) => (
              <div
                key={grade}
                className={cn(
                  "flex-1 min-w-[32px] sm:min-w-0 flex items-center justify-center text-xs sm:text-sm font-semibold text-white transition-all",
                  GRADE_COLORS[grade],
                  grade === currentGrade &&
                    `${GRADE_COLORS[grade]} relative z-10 scale-105 ring-2 ring-ring ring-offset-2 ring-offset-background`
                )}
                style={{ minWidth: 0 }}
              >
                {grade}
              </div>
            ))}
          </div>
          <div className="mt-2 text-base sm:text-sm text-center font-bold text-primary">
            {currentGrade}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
