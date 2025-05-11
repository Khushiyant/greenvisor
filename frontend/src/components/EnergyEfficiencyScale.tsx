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
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.energyEfficiency", "Gesamtenergieeffizienz")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-8 rounded-full flex overflow-hidden shadow-inner">
            {grades.map((grade) => (
              <div
                key={grade}
                className={cn(
                  "flex-1 flex items-center justify-center text-xs font-semibold text-white transition-all",
                  GRADE_COLORS[grade],
                  grade === currentGrade &&
                    `${GRADE_COLORS[grade]} relative z-10 scale-105 ring-2 ring-ring ring-offset-2 ring-offset-background` // ensure selected keeps the same bg
                )}
              >
                {grade}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-center font-bold text-primary">
            {currentGrade}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
