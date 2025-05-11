import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";

export default function Potenziale() {
  return (
    <div className="min-h-screen bg-background/80 py-10 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-4xl w-full mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          Deine Potenziale auf einen Blick!
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Hier siehst du dein persönliches Einsparpotenzial passend zu deinem
          Eigenheim, das in einem klimaneutralen Szenario erreicht werden kann.
          <br />
          Setze ein weiteres Budget, um zu vergleichen.
        </p>
      </div>

      {/* Gesamtauswertung Card */}
      <Card className="w-full max-w-5xl mb-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between bg-green-200/80 px-6 py-3 rounded-t-lg border-b border-green-300">
          <span className="font-semibold text-lg">Gesamtauswertung</span>
          <Button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded px-4 py-2">
            Budget hinzufügen
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Aspekt
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Status Quo
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Grün.Check
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-3">Wärmeverbrauch</td>
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
                  <td className="px-6 py-3">Stromverbrauch</td>
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
                  <td className="px-6 py-3">Heizkosten</td>
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
                  <td className="px-6 py-3">Stromkosten</td>
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
                  <td className="px-6 py-3">Energieeffizienz</td>
                  <td className="px-6 py-3">F</td>
                  <td className="px-6 py-3">A</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">Emissionen</td>
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
                  <td className="px-6 py-3">Gesamtinvestition</td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">34.000 €</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">Förderungen</td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3">
                    Möglichkeit zur Förderung
                    <br />
                    von bis zu 50%
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      Erfahre mehr
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
          <span className="font-semibold text-lg">Einzelmaßnahmen</span>
          <Button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded px-4 py-2">
            Budget hinzufügen
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Maßnahme
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Beispielprodukt
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Investitionen
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Heizkostenersparnis
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    CO₂-Ersparnis
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Förderungen
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-3">Heizung</td>
                  <td className="px-6 py-3">Viessmann Vitocal 250-A</td>
                  <td className="px-6 py-3">11.000 €</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 90%
                      </span>
                      2.200 €/Jahr auf 300 €/Jahr
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
                    Bis zu 50%
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      mehr Infos
                    </a>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">Fenster & Türen</td>
                  <td className="px-6 py-3">EcoTherm Dreifachverglasung</td>
                  <td className="px-6 py-3">15.000 €</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 75%
                      </span>
                      1.200 €/Jahr auf 300 €/Jahr
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
                    Bis zu 40%
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      mehr Infos
                    </a>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-3">Lüftungssystem</td>
                  <td className="px-6 py-3">AirPro 200</td>
                  <td className="px-6 py-3">8.000 €</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center text-green-600 font-semibold text-xs bg-green-100 px-2 py-0.5 rounded mb-1 w-fit">
                        <ArrowDown className="w-3 h-3 mr-1" /> 80%
                      </span>
                      700 €/Jahr auf 140 €/Jahr
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
                    Bis zu 35%
                    <br />
                    <a href="#" className="text-green-700 underline text-xs">
                      mehr Infos
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
            <h2 className="text-white text-3xl font-bold mb-2">Unsicher?</h2>
            <p className="text-white text-lg mb-6">
              Unser Expert:innenpool hilft dir gerne weiter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button className="bg-white text-green-700 hover:bg-green-100 font-semibold px-6 py-3 rounded w-full sm:w-auto">
                Handwerker:in kontaktieren
              </Button>
              <Button className="bg-white text-green-700 hover:bg-green-100 font-semibold px-6 py-3 rounded w-full sm:w-auto">
                Energieberater:in kontaktieren
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
