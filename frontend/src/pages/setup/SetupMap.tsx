import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { Loader2, MapPin, Search } from "lucide-react";
import { useMap } from "@/hooks/useMap";
import { MapSearch } from "@/components/map/MapSearch";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Add global styles to ensure dialog appears above map
const globalStyles = `
  .leaflet-pane,
  .leaflet-control,
  .leaflet-top,
  .leaflet-bottom {
    z-index: 400 !important;
  }
  
 /* Make sure dialog appears above leaflet elements */
  [data-radix-popper-content-wrapper] {
    z-index: 1000 !important;
  }
  
  /* Ensure search dropdown appears above map */
  .map-search-wrapper {
    position: relative;
    z-index: 2000 !important;
  }
      
  /* Ensure Leaflet markers are visible */
  .leaflet-marker-icon {
    z-index: 10000 !important; 
  }
  
  .leaflet-marker-shadow {
    z-index: 9999 !important;
  }
  
  /* Make DIV icon markers visible */
  .custom-map-marker {
    z-index: 10000 !important;
    pointer-events: auto !important;
  }
  
  /* Force all map elements to respect z-index */
  .leaflet-map-pane * {
    z-index: auto;
  }
`;

export default function SetupMap() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success, error } = useToast();

  // Use our custom map hook
  const {
    coordinates,
    mapContainer,
    mapLoaded,
    isLoading,
    mapError,
    locationError,
    manualLat,
    manualLng,
    setManualLat,
    setManualLng,
    handleManualCoordinates,
    handleRetryLocation,
    updateMarker,
  } = useMap({ defaultZoom: 2, defaultCenter: [0, 0] });

  const handleContinue = () => {
    if (coordinates.lat && coordinates.lng) {
      localStorage.setItem("setupCoordinates", JSON.stringify(coordinates));
      success(t("setup.locationSaved", "Location saved successfully"));
      navigate("/setup/finalize");
    } else {
      error(t("setup.noLocation", "Please select a location on the map"));
    }
  };

  // Handle location selection from search
  const handleSearchLocationSelect = (
    lat: number,
    lng: number,
    name: string
  ) => {
    updateMarker(lat, lng, 19); // Maximum zoom
    success(t("setup.locationFound", { name }));
    console.log(t("setup.locationFound", { name }), t("setup.locationFound"));
  };

  return (
    <main className="min-h-screen flex items-center bg-background justify-center px-4 py-8">
      {/* Add global styles to fix z-index issues */}
      <style>{globalStyles}</style>

      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t("setup.selectLocation")}</CardTitle>
            <CardDescription>
              {t(
                "setup.locationDescription",
                "We'll use this to get accurate location data of your home"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Add search box at the top */}
              {mapLoaded && !mapError && (
                <MapSearch
                  onSelectLocation={handleSearchLocationSelect}
                  placeholder={t(
                    "setup.searchLocation",
                    "Search for a city, address, or landmark..."
                  )}
                  className="mb-2"
                />
              )}

              {mapError ? (
                <div className="w-full h-[500px] rounded-md flex items-center justify-center bg-muted">
                  <div className="text-center p-4">
                    <p className="text-red-500 mb-2">
                      ⚠️ {t("setup.mapError", mapError)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "setup.mapErrorHint",
                        "Please try refreshing the page or using a different browser."
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-[500px]">
                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                        <p>{t("setup.loadingMap")}</p>
                      </div>
                    </div>
                  )}

                  {/* Map container */}
                  <div
                    ref={mapContainer}
                    className="w-full h-full rounded-md border"
                    style={{ position: "relative" }}
                  />

                  {/* Location buttons overlay */}
                  {mapLoaded && (
                    <div className="absolute bottom-4 right-4 z-[500] flex flex-col gap-2">
                      <Button
                        onClick={handleRetryLocation}
                        size="sm"
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        <MapPin size={16} />
                        {t("setup.useMyLocation", "Use my location")}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Search size={16} />
                            {t("setup.enterCoordinates", "Enter coordinates")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="z-[2000]">
                          <DialogHeader>
                            <DialogTitle>
                              {t("setup.enterCoordinates", "Enter coordinates")}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label htmlFor="latitude">
                                {t("setup.latitude", "Latitude (-90 to 90)")}
                              </label>
                              <Input
                                id="latitude"
                                value={manualLat}
                                onChange={(e) => setManualLat(e.target.value)}
                                placeholder={t(
                                  "setup.latitudePlaceholder",
                                  "e.g. 51.5074"
                                )}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="longitude">
                                {t(
                                  "setup.longitude",
                                  "Longitude (-180 to 180)"
                                )}
                              </label>
                              <Input
                                id="longitude"
                                value={manualLng}
                                onChange={(e) => setManualLng(e.target.value)}
                                placeholder={t(
                                  "setup.longitudePlaceholder",
                                  "e.g. -0.1278"
                                )}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleManualCoordinates}>
                              {t("setup.setLocation", "Set Location")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              )}

              {locationError && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                  <p className="font-medium">
                    {t("setup.locationAccessFailed", "Location access failed")}
                  </p>
                  <p>{locationError}</p>
                  <p className="mt-1">
                    {t(
                      "setup.locationAccessHint",
                      'You can click on the map or use the "Enter coordinates" button instead.'
                    )}
                  </p>
                </div>
              )}

              {coordinates.lat !== null && coordinates.lng !== null && (
                <p className="text-sm text-muted-foreground text-center">
                  {t("setup.selectedCoordinates")}: {coordinates.lat.toFixed(6)}
                  , {coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              onClick={handleContinue}
              disabled={coordinates.lat === null || coordinates.lng === null}
            >
              {t("common.continue")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
