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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { tryJsonParse } from "@/lib/utils";
import type { Coordinates } from "@/hooks/useMap";

// Schema definition (unchanged)
const formSchema = z.object({
  buildingType: z.string().min(1, "setup.validation.buildingType"),
  constructionYear: z
    .number()
    .min(1800, "setup.validation.constructionYearMin")
    .max(new Date().getFullYear(), "setup.validation.constructionYearMax"),
  livingArea: z.number().min(1, "setup.validation.livingArea"),
  floors: z.number().min(1, "setup.validation.floors"),
  roofType: z.string().min(1, "setup.validation.roofType"),
  heatingSystem: z.string().min(1, "setup.validation.heatingSystem"),
  insulationStatus: z.string().min(1, "setup.validation.insulationStatus"),
  windows: z.string().min(1, "setup.validation.windows"),
});

type FormData = z.infer<typeof formSchema>;

const FinaliseSetupForm: React.FC = () => {
  const { t } = useTranslation();
  const { info, success } = useToast();
  const coordinates: Coordinates = tryJsonParse<Coordinates>(
    localStorage.getItem("coordinates") || "{lat: 0, lng: 0}"
  ); // Default to {lat: 0, lng: 0} if not found

  // Localized select options
  const buildingTypes = [
    {
      value: "einfamilienhaus",
      label: t("setup.buildingTypes.einfamilienhaus"),
    },
    {
      value: "zweifamilienhaus",
      label: t("setup.buildingTypes.zweifamilienhaus"),
    },
    {
      value: "mehrfamilienhaus",
      label: t("setup.buildingTypes.mehrfamilienhaus"),
    },
    { value: "reihenhaus", label: t("setup.buildingTypes.reihenhaus") },
    {
      value: "doppelhaushälfte",
      label: t("setup.buildingTypes.doppelhaushälfte"),
    },
    { value: "wohnung", label: t("setup.buildingTypes.wohnung") },
  ];

  const roofTypes = [
    { value: "satteldach", label: t("setup.roofTypes.satteldach") },
    { value: "flachdach", label: t("setup.roofTypes.flachdach") },
    { value: "pultdach", label: t("setup.roofTypes.pultdach") },
    { value: "walmdach", label: t("setup.roofTypes.walmdach") },
    { value: "mansarddach", label: t("setup.roofTypes.mansarddach") },
  ];

  const heatingSystems = [
    { value: "gas", label: t("setup.heatingSystems.gas") },
    { value: "öl", label: t("setup.heatingSystems.öl") },
    { value: "wärmepumpe", label: t("setup.heatingSystems.wärmepumpe") },
    { value: "fernwaerme", label: t("setup.heatingSystems.fernwaerme") },
    { value: "pellets", label: t("setup.heatingSystems.pellets") },
    { value: "elektro", label: t("setup.heatingSystems.elektro") },
  ];

  const insulationStatuses = [
    { value: "keine", label: t("setup.insulationStatuses.keine") },
    { value: "teilweise", label: t("setup.insulationStatuses.teilweise") },
    {
      value: "vollstaendig",
      label: t("setup.insulationStatuses.vollstaendig"),
    },
  ];

  const windowTypes = [
    { value: "einfach", label: t("setup.windowTypes.einfach") },
    { value: "doppel", label: t("setup.windowTypes.doppel") },
    { value: "dreifach", label: t("setup.windowTypes.dreifach") },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingType: "",
      constructionYear: 2000,
      livingArea: 100,
      floors: 1,
      roofType: "",
      heatingSystem: "",
      insulationStatus: "",
      windows: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
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
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          {t("setup.calculatorTitle", "Sanierungsrechner")}
        </h1>
        <p className="mb-6">
          {t(
            "setup.calculatorIntro",
            "Geben Sie die Daten Ihres Gebäudes ein, um eine Abschätzung des Energieeffizienzzustands zu erhalten."
          )}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="buildingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("setup.buildingType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("setup.selectType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="constructionYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("setup.constructionYear", "Baujahr")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t(
                        "setup.constructionYearPlaceholder",
                        "z.B. 1990"
                      )}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="livingArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("setup.livingArea", "Wohnfläche (m²)")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("setup.livingAreaPlaceholder", "z.B. 150")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("setup.floors", "Anzahl der Stockwerke")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("setup.floorsPlaceholder", "z.B. 2")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roofType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("setup.roofType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("setup.selectRoofType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roofTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heatingSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("setup.heatingSystem")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("setup.selectHeatingSystem")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {heatingSystems.map((system) => (
                        <SelectItem key={system.value} value={system.value}>
                          {system.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insulationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("setup.insulationStatus")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("setup.selectInsulationStatus")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {insulationStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="windows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("setup.windows")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("setup.selectWindowType")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {windowTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <Button type="submit">{t("common.submit", "Berechnen")}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FinaliseSetupForm;
