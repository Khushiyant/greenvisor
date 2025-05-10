import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";

export default function FinalizeSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Set up form validation schema with Zod
  const formSchema = z.object({
    buildingName: z.string().min(2, {
      message: t(
        "validation.buildingNameRequired",
        "Building name is required"
      ),
    }),
    buildingType: z.string({
      required_error: t(
        "validation.buildingTypeRequired",
        "Please select a building type"
      ),
    }),
    yearBuilt: z.string().regex(/^\d{4}$/, {
      message: t("validation.yearBuiltFormat", "Year must be a 4-digit number"),
    }),
    squareMeters: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
      message: t("validation.squareMetersNumber", "Must be a valid number"),
    }),
    hasRenovated: z.boolean().default(false),
  });

  // Get coordinates from localStorage (from previous step)
  useEffect(() => {
    const storedCoordinates = localStorage.getItem("setupCoordinates");
    if (storedCoordinates) {
      setCoordinates(JSON.parse(storedCoordinates));
    } else {
      // If no coordinates, go back to the map step
      navigate("/setup");
    }
  }, [navigate]);

  // Set up react-hook-form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingName: "",
      buildingType: "",
      yearBuilt: "",
      squareMeters: "",
      hasRenovated: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Combine form data with coordinates
    const fullData = {
      ...values,
      coordinates,
    };

    console.log("Submitting data:", fullData);

    // Here you would send the data to your backend API
    // For now, we'll just simulate success and redirect
    alert("Setup complete! Data saved successfully.");
    navigate("/");
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("setup.finalizeSetup", "Finalize Setup")}</CardTitle>
          <CardDescription>
            {t(
              "setup.completeDetails",
              "Complete your building details to finish setup"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Building name */}
              <FormField
                control={form.control}
                name="buildingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("setup.buildingName", "Building Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "setup.enterBuildingName",
                          "Enter building name"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Building type */}
              <FormField
                control={form.control}
                name="buildingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("setup.buildingType", "Building Type")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "setup.selectType",
                              "Select building type"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">
                          {t("setup.residential", "Residential")}
                        </SelectItem>
                        <SelectItem value="commercial">
                          {t("setup.commercial", "Commercial")}
                        </SelectItem>
                        <SelectItem value="industrial">
                          {t("setup.industrial", "Industrial")}
                        </SelectItem>
                        <SelectItem value="mixed">
                          {t("setup.mixed", "Mixed Use")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year built */}
              <FormField
                control={form.control}
                name="yearBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("setup.yearBuilt", "Year Built")}</FormLabel>
                    <FormControl>
                      <Input placeholder="1990" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "setup.yearBuiltDescription",
                        "Enter the year the building was constructed"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Square meters */}
              <FormField
                control={form.control}
                name="squareMeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("setup.squareMeters", "Square Meters")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="150" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "setup.totalArea",
                        "Total area of the building in square meters"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Has been renovated */}
              <FormField
                control={form.control}
                name="hasRenovated"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t("setup.previouslyRenovated", "Previously Renovated")}
                      </FormLabel>
                      <FormDescription>
                        {t(
                          "setup.renovatedDescription",
                          "Has this building been renovated before?"
                        )}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Coordinates display (read-only) */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">
                  {t("setup.locationCoordinates", "Location Coordinates")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {coordinates.lat
                    ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(
                        6
                      )}`
                    : "No coordinates selected"}
                </p>
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/setup")}
                >
                  {t("common.back", "Back")}
                </Button>
                <Button type="submit">
                  {t("setup.complete", "Complete Setup")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
