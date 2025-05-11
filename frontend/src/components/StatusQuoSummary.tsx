import { Button } from "@/components/ui/button";

export default function StatusQuoSummary() {
  return (
    <div className="max-w-lg mx-auto mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4">
        <span className="text-gray-800">
          Dein ermittelter <b>Gebäude Status Quo</b> hat eine Energieeffizienz
          von <b>D</b>.
        </span>
      </div>

      {/* Table */}
      <div className="px-4 py-2">
        <table className="w-full text-sm mb-4">
          <tbody>
            <tr>
              <th
                colSpan={2}
                className="bg-gray-200 text-center py-2 font-semibold"
              >
                Eckdaten
              </th>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Grundstücksgröße</td>
              <td className="py-1 px-2 text-right">200m2</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Hausgröße</td>
              <td className="py-1 px-2 text-right">120m2</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Geschossanzahl</td>
              <td className="py-1 px-2 text-right">2</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Personenanzahl</td>
              <td className="py-1 px-2 text-right">4</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Baujahr</td>
              <td className="py-1 px-2 text-right">1967</td>
            </tr>
            <tr>
              <th
                colSpan={2}
                className="bg-gray-200 text-center py-2 font-semibold"
              >
                Heizung
              </th>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Art</td>
              <td className="py-1 px-2 text-right">Gasheizung</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Verbrauch</td>
              <td className="py-1 px-2 text-right">ca. 20.000 kWh/Jahr</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Zulieferer</td>
              <td className="py-1 px-2 text-right">Badenova</td>
            </tr>
            <tr>
              <th
                colSpan={2}
                className="bg-gray-200 text-center py-2 font-semibold"
              >
                Strom
              </th>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Art</td>
              <td className="py-1 px-2 text-right">Erdgas</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Verbrauch</td>
              <td className="py-1 px-2 text-right">ca. 4.500 kWh/Jahr</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700">Zulieferer</td>
              <td className="py-1 px-2 text-right">Badenova</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <div className="bg-gray-100 rounded-md p-3 mb-3 text-gray-800 text-sm">
          Um die Status Quo Analyse abzuschließen, überprüfen &amp; ergänze alle
          8 Themenbereich.
        </div>
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
          Status Quo prüfen
        </Button>
      </div>
    </div>
  );
}
