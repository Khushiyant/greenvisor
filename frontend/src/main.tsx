import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/i18n"; // Import i18n configuration
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";
import { SessionProvider } from "./context/AuthContext.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ErrorBoundary>
          <SessionProvider>
            <App />
          </SessionProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>
);
