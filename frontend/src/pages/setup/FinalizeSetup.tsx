import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Zod Schema ---
const formSchema = z.object({
  // Section 1
  baujahr: z.string().min(1, "setup.validation.baujahr"),
  anzahl_wohneinheiten: z
    .number()
    .min(1, "setup.validation.anzahl_wohneinheiten"),
  wohnflaeche_qm: z.number().min(1, "setup.validation.wohnflaeche_qm"),
  anzahl_vollgeschosse: z
    .number()
    .min(1, "setup.validation.anzahl_vollgeschosse"),
  angrenzende_gebaeude: z
    .string()
    .min(1, "setup.validation.angrenzende_gebaeude"),
  gebaeude_nachtraeglich_gedaemmt: z
    .string()
    .min(1, "setup.validation.gebaeude_nachtraeglich_gedaemmt"),
  postleitzahl_immobilie: z.string().optional(),

  // Section 2
  heizung_energietraeger: z
    .string()
    .min(1, "setup.validation.heizung_energietraeger"),
  heizung_baujahr: z.string().min(1, "setup.validation.heizung_baujahr"),
  heizung_heizflaechen: z
    .string()
    .min(1, "setup.validation.heizung_heizflaechen"),
  heizung_rohre_gedaemmt: z
    .string()
    .min(1, "setup.validation.heizung_rohre_gedaemmt"),

  // Section 3
  warmwasseraufbereitung: z
    .string()
    .min(1, "setup.validation.warmwasseraufbereitung"),

  // Section 4
  dach_form: z.string().min(1, "setup.validation.dach_form"),
  dach_ausrichtung: z.string().min(1, "setup.validation.dach_ausrichtung"),
  dach_dachboden_nutzung_zustand: z
    .string()
    .min(1, "setup.validation.dach_dachboden_nutzung_zustand"),
  dach_unbeheizte_flaeche_nutzung: z.string().optional(),
  dach_anzahl_dachgauben_dachfenster: z.string().optional(),

  // Section 5
  fassade_bauweise: z.string().min(1, "setup.validation.fassade_bauweise"),
  fassade_zustand: z.string().min(1, "setup.validation.fassade_zustand"),

  // Section 6
  fenster_verglasung: z.string().min(1, "setup.validation.fenster_verglasung"),
  fenster_rahmenmaterial: z
    .string()
    .min(1, "setup.validation.fenster_rahmenmaterial"),
  fenster_erneuerung_jahr: z
    .string()
    .min(1, "setup.validation.fenster_erneuerung_jahr"),
  fenster_anteil_verglasung_prozent: z
    .number()
    .min(0)
    .max(100, "setup.validation.fenster_anteil_verglasung_prozent"),

  // Section 7
  keller_vorhanden: z.string().min(1, "setup.validation.keller_vorhanden"),
  keller_art_kellerdecke: z
    .string()
    .min(1, "setup.validation.keller_art_kellerdecke"),
  keller_gewoelbekeller: z
    .string()
    .min(1, "setup.validation.keller_gewoelbekeller"),
  keller_raumhoehe: z.string().min(1, "setup.validation.keller_raumhoehe"),

  // Section 8
  photovoltaik_vorhanden: z
    .string()
    .min(1, "setup.validation.photovoltaik_vorhanden"),

  // Section 9
  sanierungswunsch_massnahmen: z
    .array(z.string())
    .min(1, "setup.validation.sanierungswunsch_massnahmen"),

  // Section 10
  foerderbonus_heizung_einkommensbonus: z.boolean().optional(),
  foerderbonus_heizung_klimageschwindigkeitsbonus: z.boolean().optional(),
  foerderbonus_isfp: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const FinaliseSetupForm: React.FC = () => {
  const { t } = useTranslation();
  const { info, success } = useToast();

  // --- Options ---
  const angrenzendeGebaeudeOptions = [
    "Nein",
    "An einer Seite",
    "An beiden Seiten",
  ];
  const jaNeinOptions = [t("common.Ja", "Ja"), t("common.Nein", "Nein")];
  const heizungEnergietraegerOptions = [
    t("setup.heizung_energietraeger.Erdgas", "Erdgas"),
    t("setup.heizung_energietraeger.Öl", "Öl"),
    t("setup.heizung_energietraeger.Pellets", "Pellets"),
    t("setup.heizung_energietraeger.Strom", "Strom"),
    t("setup.heizung_energietraeger.Stückholz", "Stückholz"),
    t("setup.heizung_energietraeger.Fernwärme", "Fernwärme"),
    t("setup.heizung_energietraeger.Anderes", "Anderes"),
  ];
  const heizungBaujahrOptions = [
    t("setup.heizung_baujahr.Wie Baujahr des Hauses", "Wie Baujahr des Hauses"),
    t("setup.heizung_baujahr.Anderes", "Anderes"),
  ];
  const heizungHeizflaechenOptions = [
    t("setup.heizung_heizflaechen.Fußbodenheizung", "Fußbodenheizung"),
    t("setup.heizung_heizflaechen.Heizkörper", "Heizkörper"),
  ];
  const warmwasseraufbereitungOptions = [
    t("setup.warmwasser.ueber_heizung", "Ausschließlich über Heizung"),
    t("setup.warmwasser.mit_solar", "Mit Solarunterstützung"),
    t("setup.warmwasser.durchlauferhitzer", "Durchlauferhitzer leinboiler"),
  ];
  const dachFormOptions = [
    t("setup.dach_form.Walmdach", "Walmdach"),
    t("setup.dach_form.Satteldach", "Satteldach"),
    t("setup.dach_form.Pultdach", "Pultdach"),
    t("setup.dach_form.Flachdach", "Flachdach"),
    t("setup.dach_form.Mansarddach", "Mansarddach"),
  ];
  const dachAusrichtungOptions = [
    t("setup.dach_ausrichtung.Nord", "Nord"),
    t("setup.dach_ausrichtung.Nord-Ost", "Nord-Ost"),
    t("setup.dach_ausrichtung.Ost", "Ost"),
    t("setup.dach_ausrichtung.Süd-Ost", "Süd-Ost"),
    t("setup.dach_ausrichtung.Süd", "Süd"),
    t("setup.dach_ausrichtung.Süd-West", "Süd-West"),
    t("setup.dach_ausrichtung.West", "West"),
    t("setup.dach_ausrichtung.Nord-West", "Nord-West"),
  ];
  const dachbodenNutzungOptions = [
    t("setup.dachboden.teilweise", "Teilweise genutzt/beheizt"),
    t("setup.dachboden.vollstaendig", "Vollständig genutzt/beheizt"),
    t("setup.dachboden.nicht", "Nicht genutzt/beheizt"),
  ];
  const dachUnbeheizteFlaecheNutzungOptions = [
    t("setup.dach.unbeheizt.gar_nicht", "Gar nicht"),
    t("setup.dach.unbeheizt.ausbauen", "Ausbauen und nutzen"),
  ];
  const fassadeBauweiseOptions = [
    t("setup.fassade.holz", "Holz"),
    t("setup.fassade.massiv", "Massiv"),
  ];
  const fassadeZustandOptions = [
    t("setup.fassade.keine_schaeden", "Keine Schäden"),
    t("setup.fassade.neu_streichen", "Muss neu gestrichen werden"),
    t("setup.fassade.risse", "Kleine Risse röckelnder Putz"),
  ];
  const fensterVerglasungOptions = [
    t("setup.fenster.einfach", "Einfach"),
    t("setup.fenster.zweifach", "Zweifach"),
    t("setup.fenster.dreifach", "Dreifach"),
    t("setup.fenster.kastenfenster", "Kastenfenster"),
  ];
  const fensterRahmenmaterialOptions = [
    t("setup.fenster.holz", "Holz"),
    t("setup.fenster.kunststoff", "Kunststoff"),
  ];
  const kellerVorhandenOptions = [
    t("setup.keller.nein", "Nein"),
    t("setup.keller.beheizt", "Ja - beheizt"),
    t("setup.keller.teilweise", "Ja - teilweise beheizt"),
    t("setup.keller.unbeheizt", "Ja - unbeheizt"),
  ];
  const kellerArtKellerdeckeOptions = [
    t("setup.keller.massiv", "Massiv"),
    t("setup.keller.andere", "Andere (z.B. Holz)"),
  ];
  const kellerGewoelbekellerOptions = [
    t("common.Ja", "Ja"),
    t("common.Nein", "Nein"),
  ];
  const kellerRaumhoeheOptions = [
    t("setup.keller.weniger_2m", "Weniger als 2 m"),
    t("setup.keller.2_2_2m", "2,00 - 2,20 m"),
    t("setup.keller.mehr_2_2m", "mehr als 2,20 m"),
  ];
  const photovoltaikVorhandenOptions = [
    t("common.Ja", "Ja"),
    t("common.Nein", "Nein"),
  ];
  const sanierungswunschMassnahmenOptions = [
    t("setup.sanierung.heizung", "Heizung eizsystem erneuern"),
    t("setup.sanierung.fassade", "Fassade sanieren"),
    t("setup.sanierung.dach", "Dach sanieren"),
    t("setup.sanierung.eingangstuer", "Eingangstür erneuern"),
    t("setup.sanierung.photovoltaik", "Photovoltaikanlage installieren"),
    t("setup.sanierung.solarthermie", "Solarthermische Anlage installieren"),
    t("setup.sanierung.fenster", "Fenster austauschen"),
    t("setup.sanierung.kellerdeckendaemmung", "Kellerdeckendämmung"),
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baujahr: "",
      anzahl_wohneinheiten: 1,
      wohnflaeche_qm: 100,
      anzahl_vollgeschosse: 1,
      angrenzende_gebaeude: "",
      gebaeude_nachtraeglich_gedaemmt: "",
      postleitzahl_immobilie: "",
      heizung_energietraeger: "",
      heizung_baujahr: "",
      heizung_heizflaechen: "",
      heizung_rohre_gedaemmt: "",
      warmwasseraufbereitung: "",
      dach_form: "",
      dach_ausrichtung: "",
      dach_dachboden_nutzung_zustand: "",
      dach_unbeheizte_flaeche_nutzung: "",
      dach_anzahl_dachgauben_dachfenster: "",
      fassade_bauweise: "",
      fassade_zustand: "",
      fenster_verglasung: "",
      fenster_rahmenmaterial: "",
      fenster_erneuerung_jahr: "",
      fenster_anteil_verglasung_prozent: 0,
      keller_vorhanden: "",
      keller_art_kellerdecke: "",
      keller_gewoelbekeller: "",
      keller_raumhoehe: "",
      photovoltaik_vorhanden: "",
      sanierungswunsch_massnahmen: [],
      foerderbonus_heizung_einkommensbonus: false,
      foerderbonus_heizung_klimageschwindigkeitsbonus: false,
      foerderbonus_isfp: false,
    },
  });

  const onSubmit = (data: FormData) => {
    info(t("setup.calculationStarted"), {
      description: t("setup.calculationProcessing"),
    });
    setTimeout(() => {
      success(t("setup.calculationFinished"), {
        description: t("setup.calculationReady"),
      });
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="shadow rounded-lg p-6 bg-card text-card-foreground">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            {t("setup.calculatorTitle", "KFW Sanierungsrechner")}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section1.title", "1/10 - Objekt allgemein")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="baujahr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("setup.section1.baujahr")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="anzahl_wohneinheiten"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section1.anzahl_wohneinheiten")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wohnflaeche_qm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section1.wohnflaeche_qm")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="anzahl_vollgeschosse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section1.anzahl_vollgeschosse")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="angrenzende_gebaeude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section1.angrenzende_gebaeude")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {angrenzendeGebaeudeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {t(`setup.angrenzende_gebaeude.${opt}`, opt)}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gebaeude_nachtraeglich_gedaemmt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section1.gebaeude_nachtraeglich_gedaemmt")}
                        </FormLabel>
                        <div className="flex gap-4">
                          {jaNeinOptions.map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                value={opt}
                                checked={field.value === opt}
                                onChange={() => field.onChange(opt)}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postleitzahl_immobilie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section1.postleitzahl_immobilie")}
                        </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section2.title", "2/10 - Heizung")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="heizung_energietraeger"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.heizung_energietraeger.label")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {heizungEnergietraegerOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heizung_baujahr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.heizung_baujahr.label")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {heizungBaujahrOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heizung_heizflaechen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.heizung_heizflaechen.label")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {heizungHeizflaechenOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heizung_rohre_gedaemmt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section2.heizung_rohre_gedaemmt")}
                        </FormLabel>
                        <div className="flex gap-4">
                          {jaNeinOptions.map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                value={opt}
                                checked={field.value === opt}
                                onChange={() => field.onChange(opt)}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section3.title", "3/10 - Warmwasser")}
                </h2>
                <FormField
                  control={form.control}
                  name="warmwasseraufbereitung"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("setup.section3.warmwasseraufbereitung")}
                      </FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col gap-2"
                      >
                        {warmwasseraufbereitungOptions.map((opt, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value={opt} id={opt} />
                            </FormControl>
                            <label htmlFor={opt} className="ml-2">
                              {opt}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section4.title", "4/10 - Dach")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dach_form"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("setup.section4.dach_form")}</FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {dachFormOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dach_ausrichtung"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section4.dach_ausrichtung")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {dachAusrichtungOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dach_dachboden_nutzung_zustand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section4.dach_dachboden_nutzung_zustand")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {dachbodenNutzungOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dach_unbeheizte_flaeche_nutzung"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section4.dach_unbeheizte_flaeche_nutzung")}
                        </FormLabel>
                        <div className="flex gap-4">
                          {dachUnbeheizteFlaecheNutzungOptions.map((opt, i) => (
                            <label key={i} className="flex items-center gap-2">
                              <input
                                type="radio"
                                value={opt}
                                checked={field.value === opt}
                                onChange={() => field.onChange(opt)}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dach_anzahl_dachgauben_dachfenster"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "setup.section4.dach_anzahl_dachgauben_dachfenster"
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section5.title", "5/10 - Fassade")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fassade_bauweise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section5.fassade_bauweise")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {fassadeBauweiseOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fassade_zustand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section5.fassade_zustand")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {fassadeZustandOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section6.title", "6/10 - Fenster")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fenster_verglasung"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section6.fenster_verglasung")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {fensterVerglasungOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fenster_rahmenmaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section6.fenster_rahmenmaterial")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {fensterRahmenmaterialOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fenster_erneuerung_jahr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section6.fenster_erneuerung_jahr")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fenster_anteil_verglasung_prozent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "setup.section6.fenster_anteil_verglasung_prozent"
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section7.title", "7/10 - Keller")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="keller_vorhanden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section7.keller_vorhanden")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {kellerVorhandenOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="keller_art_kellerdecke"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section7.keller_art_kellerdecke")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {kellerArtKellerdeckeOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="keller_gewoelbekeller"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section7.keller_gewoelbekeller")}
                        </FormLabel>
                        <div className="flex gap-4">
                          {kellerGewoelbekellerOptions.map((opt, i) => (
                            <label key={i} className="flex items-center gap-2">
                              <input
                                type="radio"
                                value={opt}
                                checked={field.value === opt}
                                onChange={() => field.onChange(opt)}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="keller_raumhoehe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("setup.section7.keller_raumhoehe")}
                        </FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">
                              {t("setup.selectOption", "Bitte wählen...")}
                            </option>
                            {kellerRaumhoeheOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section8.title", "8/10 - Photovoltaik")}
                </h2>
                <FormField
                  control={form.control}
                  name="photovoltaik_vorhanden"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("setup.section8.photovoltaik_vorhanden")}
                      </FormLabel>
                      <div className="flex gap-4">
                        {photovoltaikVorhandenOptions.map((opt, i) => (
                          <label key={i} className="flex items-center gap-2">
                            <input
                              type="radio"
                              value={opt}
                              checked={field.value === opt}
                              onChange={() => field.onChange(opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section9.title", "9/10 - Sanierungswunsch")}
                </h2>
                <FormField
                  control={form.control}
                  name="sanierungswunsch_massnahmen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("setup.section9.sanierungswunsch_massnahmen")}
                      </FormLabel>
                      <div className="flex flex-col gap-2">
                        {sanierungswunschMassnahmenOptions.map((opt, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(opt)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      opt,
                                    ]);
                                  } else {
                                    field.onChange(
                                      (field.value || []).filter(
                                        (v: string) => v !== opt
                                      )
                                    );
                                  }
                                }}
                                id={opt}
                              />
                            </FormControl>
                            <label htmlFor={opt} className="ml-2">
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  {t("setup.section10.title", "10/10 - Förderboni")}
                </h2>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="foerderbonus_heizung_einkommensbonus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="foerderbonus_heizung_einkommensbonus"
                        />
                        <FormLabel htmlFor="foerderbonus_heizung_einkommensbonus">
                          {t(
                            "setup.section10.foerderbonus_heizung_einkommensbonus"
                          )}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foerderbonus_heizung_klimageschwindigkeitsbonus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="foerderbonus_heizung_klimageschwindigkeitsbonus"
                        />
                        <FormLabel htmlFor="foerderbonus_heizung_klimageschwindigkeitsbonus">
                          {t(
                            "setup.section10.foerderbonus_heizung_klimageschwindigkeitsbonus"
                          )}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foerderbonus_isfp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="foerderbonus_isfp"
                        />
                        <FormLabel htmlFor="foerderbonus_isfp">
                          {t("setup.section10.foerderbonus_isfp")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <div className="pt-8">
                <Button type="submit">{t("common.submit", "Berechnen")}</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default FinaliseSetupForm;
