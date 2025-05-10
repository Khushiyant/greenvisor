import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/i18n"; // Import i18n configuration
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
