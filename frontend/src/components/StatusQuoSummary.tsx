import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StatusQuoSummary() {
  const [minimized, setMinimized] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-lg mx-auto mt-4 md:mt-8 bg-background rounded-xl shadow-lg overflow-hidden border border-border  flex flex-col">
      {/* Header */}
      <div className="bg-muted px-4 py-3 md:px-6 md:py-4 shrink-0 flex items-center justify-between">
        <span className="text-foreground text-sm md:text-base">
          {t("dashboard.statusQuoHeader", "Dein ermittelter ")}
          <b>{t("sidebar.Eckdaten", "Gebäude Status Quo")}</b>{" "}
          {t("dashboard.statusQuoHas", "hat eine Energieeffizienz von")}
          <b> D</b>.
        </span>
        <button
          type="button"
          className="ml-2 p-1 rounded hover:bg-accent hover:text-accent-foreground transition"
          aria-label={
            minimized
              ? t("common.maximize", "Maximieren")
              : t("common.minimize", "Minimieren")
          }
          onClick={() => setMinimized((m) => !m)}
        >
          {minimized ? (
            <ChevronUp className="text-foreground" size={20} />
          ) : (
            <ChevronDown className="text-foreground" size={20} />
          )}
        </button>
      </div>

      {!minimized && (
        <>
          {/* Table */}
          <div className="px-2 py-2 md:px-4 flex-1 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm mb-4">
                <tbody>
                  <tr>
                    <th
                      colSpan={2}
                      className="bg-muted text-center py-2 font-semibold text-foreground"
                    >
                      {t("sidebar.Eckdaten", "Eckdaten")}
                    </th>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.squareMeters", "Grundstücksgröße")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      200m2
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.livingArea", "Hausgröße")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      120m2
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.floors", "Geschossanzahl")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">2</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t(
                        "setup.section1.anzahl_wohneinheiten",
                        "Personenanzahl"
                      )}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">4</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.yearBuilt", "Baujahr")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      1967
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      className="bg-muted text-center py-2 font-semibold text-foreground"
                    >
                      {t("sidebar.Heizung", "Heizung")}
                    </th>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.heatingSystem", "Art")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      {t("setup.heatingSystems.gas", "Gasheizung")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.section2.heizung_energietraeger", "Verbrauch")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      ca. 20.000 kWh/Jahr
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.section2.heizung_baujahr", "Zulieferer")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      Badenova
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      className="bg-muted text-center py-2 font-semibold text-foreground"
                    >
                      {t("dashboard.window", "Strom")}
                    </th>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.heatingSystems.elektro", "Art")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      Erdgas
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.section2.heizung_energietraeger", "Verbrauch")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      ca. 4.500 kWh/Jahr
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 text-muted-foreground">
                      {t("setup.section2.heizung_baujahr", "Zulieferer")}
                    </td>
                    <td className="py-1 px-2 text-right text-foreground">
                      Badenova
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 pb-4 shrink-0">
            <div className="bg-muted rounded-md p-2 md:p-3 mb-3 text-foreground text-xs md:text-sm">
              {t(
                "dashboard.statusQuoFooter",
                "Um die Status Quo Analyse abzuschließen, überprüfen & ergänze alle 8 Themenbereich."
              )}
            </div>
            <Button className="w-full">
              {t("dashboard.statusQuoButton", "Status Quo prüfen")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
