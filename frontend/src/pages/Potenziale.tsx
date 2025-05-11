import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Potenziale() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background/80 py-10 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-4xl w-full mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          {t("potenziale.header")}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t("potenziale.subline1")}
          <br />
          {t("potenziale.subline2")}
        </p>
      </div>

      {/* Gesamtauswertung Card */}
      <Card className="w-full max-w-5xl mb-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between bg-green-200/80 px-6 py-3 rounded-t-lg border-b border-green-300">
          <span className="font-semibold text-lg">
            {t("potenziale.overview")}
          </span>
          <Button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded px-4 py-2">
            {t("potenziale.addBudget")}
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.aspect")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.statusQuo")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.greenCheck")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-3">
                    {t("potenziale.heatConsumption")}
                  </td>
                  <td className="px-6 py-3">20.000 kWh/Jahr</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      2.000 kWh/Jahr
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded ml-2">
                        <ArrowDown className="w-3 h-3 mr-1" /> 90%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">
                    {t("potenziale.electricityConsumption")}
                  </td>
                  <td className="px-6 py-3">4.500 kWh/Jahr</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      0 kWh/Jahr
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded ml-2">
                        <ArrowDown className="w-3 h-3 mr-1" /> 100%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">{t("potenziale.heatingCosts")}</td>
                  <td className="px-6 py-3">4.100 €/Jahr</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      740 €/Jahr
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded ml-2">
                        <ArrowDown className="w-3 h-3 mr-1" /> 82%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">
                    {t("potenziale.electricityCosts")}
                  </td>
                  <td className="px-6 py-3">1.200 €/Jahr</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      900 €/Jahr
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded ml-2">
                        <ArrowDown className="w-3 h-3 mr-1" /> 25%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">
                    {t("potenziale.energyEfficiency")}
                  </td>
                  <td className="px-6 py-3">F</td>
                  <td className="px-6 py-3">A</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">{t("potenziale.emissions")}</td>
                  <td className="px-6 py-3">8.500 kg/Jahr</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      1.950 kg/Jahr
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded ml-2">
                        <ArrowDown className="w-3 h-3 mr-1" /> 77%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">
                    {t("potenziale.totalInvestment")}
                  </td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">34.000 €</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">{t("potenziale.subsidies")}</td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">
                    {t("potenziale.subsidyHint1")}
                    <br />
                    {t("potenziale.subsidyHint2")}
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      {t("potenziale.learnMore")}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Einzelmaßnahmen Card */}
      <Card className="w-full max-w-5xl mb-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between bg-green-200/80 px-6 py-3 rounded-t-lg border-b border-green-300">
          <span className="font-semibold text-lg">
            {t("potenziale.individualMeasures")}
          </span>
          <Button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded px-4 py-2">
            {t("potenziale.addBudget")}
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.measure")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.exampleProduct")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.investment")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.heatingSavings")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.co2Savings")}
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    {t("potenziale.subsidies")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-3">{t("potenziale.heating")}</td>
                  <td className="px-6 py-3">Viessmann Vitocal 250-A</td>
                  <td className="px-6 py-3">11.000 €</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 90%
                      </span>
                      2.200 €/Jahr {t("potenziale.to")} 300 €/Jahr
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 100%
                      </span>
                      8.000 kg/Jahr
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {t("potenziale.upTo")}
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      {t("potenziale.moreInfo")}
                    </a>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">{t("potenziale.windowsDoors")}</td>
                  <td className="px-6 py-3">EcoTherm Dreifachverglasung</td>
                  <td className="px-6 py-3">15.000 €</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 75%
                      </span>
                      1.200 €/Jahr {t("potenziale.to")} 300 €/Jahr
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 75%
                      </span>
                      2.000 kg/Jahr
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {t("potenziale.upTo40")}
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      {t("potenziale.moreInfo")}
                    </a>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">
                    {t("potenziale.ventilationSystem")}
                  </td>
                  <td className="px-6 py-3">AirPro 200</td>
                  <td className="px-6 py-3">8.000 €</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 80%
                      </span>
                      700 €/Jahr {t("potenziale.to")} 140 €/Jahr
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 67%
                      </span>
                      1.500 kg/Jahr
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {t("potenziale.upTo35")}
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      {t("potenziale.moreInfo")}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Unsicher Card */}
      <Card className="w-full max-w-5xl shadow-lg border border-gray-200">
        <CardContent className="p-0">
          <div className="bg-green-500 rounded-b-lg px-8 py-10 flex flex-col items-start">
            <h2 className="text-white text-3xl font-bold mb-2">
              {t("potenziale.unsure")}
            </h2>
            <p className="text-white text-lg mb-6">
              {t("potenziale.expertHelp")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button className="bg-white text-green-700 hover:bg-green-100 font-semibold px-6 py-3 rounded w-full sm:w-auto">
                {t("potenziale.contactCraftsman")}
              </Button>
              <Button className="bg-white text-green-700 hover:bg-green-100 font-semibold px-6 py-3 rounded w-full sm:w-auto">
                {t("potenziale.contactEnergyConsultant")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
