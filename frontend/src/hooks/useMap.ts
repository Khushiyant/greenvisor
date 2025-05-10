import { useState, useRef, useEffect, useCallback } from "react";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/useToast";

// --- Types ---
export interface Coordinates {
    lat: number | null;
    lng: number | null;
}
export interface UseMapProps {
    defaultCenter?: [number, number];
    defaultZoom?: number;
    maxZoom?: number;
    onCoordinatesChange?: (coords: Coordinates) => void;
}
export interface UseMapReturn {
    coordinates: Coordinates;
    mapContainer: React.RefObject<HTMLDivElement | null>;
    mapLoaded: boolean;
    isLoading: boolean;
    mapError: string;
    locationError: string;
    manualLat: string;
    manualLng: string;
    setManualLat: (v: string) => void;
    setManualLng: (v: string) => void;
    updateMarker: (lat: number, lng: number, zoom?: number) => void;
    handleManualCoordinates: () => void;
    handleRetryLocation: () => void;
    resetView: () => void;
}

// --- Hook ---
export function useMap({
    defaultCenter = [20, 0],
    defaultZoom = 2,
    maxZoom = 19,
    onCoordinatesChange,
}: UseMapProps): UseMapReturn {
    const { t } = useTranslation();
    const { success, error, info } = useToast();

    // State
    const [coordinates, setCoordinates] = useState<Coordinates>({ lat: null, lng: null });
    const [manualLat, setManualLat] = useState("");
    const [manualLng, setManualLng] = useState("");
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState("");
    const [locationError, setLocationError] = useState("");

    // Refs
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const marker = useRef<L.Marker | null>(null);

    // --- Marker logic ---
    const updateMarker = useCallback((lat: number, lng: number, zoom?: number) => {
        setCoordinates({ lat, lng });
        if (onCoordinatesChange) onCoordinatesChange({ lat, lng });
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));

        if (!map.current) return;

        // Remove old marker
        if (marker.current) {
            marker.current.remove();
            marker.current = null;
        }

        // Use default Leaflet icon for reliability
        marker.current = L.marker([lat, lng], {
            title: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            riseOnHover: true,
            zIndexOffset: 1000,
        }).addTo(map.current);

        marker.current.bindPopup(
            `<b>${t("setup.selectedLocation", "Selected Location")}</b><br>Latitude: ${lat.toFixed(6)}<br>Longitude: ${lng.toFixed(6)}`
        ).openPopup();

        // Zoom logic
        let targetZoom = zoom;
        if (targetZoom === undefined) {
            const currentZoom = map.current.getZoom();
            targetZoom = currentZoom < 8 ? Math.min(maxZoom, 15) : currentZoom;
        }
        map.current.setView([lat, lng], targetZoom);
    }, [onCoordinatesChange, t, maxZoom]);

    // --- Map initialization ---
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        // Create map
        map.current = L.map(mapContainer.current, {
            center: defaultCenter,
            zoom: defaultZoom,
            maxZoom,
            zoomControl: true,
            attributionControl: true,
            closePopupOnClick: false,
        });

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom,
        }).addTo(map.current);

        // Add scale
        L.control.scale().addTo(map.current);

        // Map click handler
        map.current.on("click", (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            const currentZoom = map.current!.getZoom();
            const targetZoom = currentZoom < 8 ? Math.min(maxZoom, 15) : currentZoom;
            updateMarker(lat, lng, targetZoom);
        });

        map.current.whenReady(() => {
            setMapLoaded(true);
            setIsLoading(false);
            // Try to get user location on load
            requestUserLocation();
        });

        map.current.on("error", (e: any) => {
            setMapError(e?.message || "Unknown map error");
            setIsLoading(false);
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
        // eslint-disable-next-line
    }, []);

    // --- Location logic ---
    const tryIpLocation = useCallback(async () => {
        try {
            info(t("setup.estimatingLocation", "Estimating your location..."));
            const res = await fetch("https://ipapi.co/json/");
            if (!res.ok) throw new Error("IP location service unavailable");
            const data = await res.json();
            if (data.latitude && data.longitude) {
                updateMarker(data.latitude, data.longitude, 10);
                info(t("setup.ipBasedLocation", "Approximate location found."));
            }
        } catch {
            setLocationError(t("setup.locationUnavailable", "Could not determine your location."));
        }
    }, [info, t, updateMarker]);

    const requestUserLocation = useCallback(() => {
        setLocationError("");
        if (!navigator.geolocation) {
            setLocationError(t("setup.locationNotSupported", "Geolocation not supported."));
            tryIpLocation();
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                updateMarker(pos.coords.latitude, pos.coords.longitude, maxZoom);
                success(t("setup.locationFound", "Location found!"));
            },
            () => {
                setLocationError(t("setup.locationUnavailable", "Could not determine your location."));
                tryIpLocation();
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }, [success, t, updateMarker, maxZoom, tryIpLocation]);

    // --- Manual coordinate entry ---
    const handleManualCoordinates = useCallback(() => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            error(t("setup.invalidCoordinates", "Invalid coordinates"));
            return;
        }
        updateMarker(lat, lng, maxZoom);
        success(t("setup.coordinatesSet", "Coordinates set successfully"));
    }, [manualLat, manualLng, updateMarker, maxZoom, success, error, t]);

    // --- Reset view ---
    const resetView = useCallback(() => {
        if (map.current) {
            map.current.setView(defaultCenter, defaultZoom, { animate: true });
            if (marker.current) {
                marker.current.remove();
                marker.current = null;
            }
            setCoordinates({ lat: null, lng: null });
            setManualLat("");
            setManualLng("");
        }
    }, [defaultCenter, defaultZoom]);

    // --- Retry location ---
    const handleRetryLocation = useCallback(() => {
        requestUserLocation();
    }, [requestUserLocation]);

    return {
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
        updateMarker,
        handleManualCoordinates,
        handleRetryLocation,
        resetView,
    };
}