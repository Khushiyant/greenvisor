import { lazy, Suspense } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Toaster } from "sonner";
import { Loading } from "./components/Loading";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { SessionProvider } from "@/context/AuthContext";
import RootRedirect from "@/pages/RootRedirect";

const Callback = lazy(() => import("./pages/auth/Callback"));
const Welcome = lazy(() => import("./pages/Welcome"));
const AuthPage = lazy(() => import("./pages/auth/auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SetupMap = lazy(() => import("./pages/setup/SetupMap"));
const FinalizeSetup = lazy(() => import("./pages/setup/FinalizeSetup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SessionProvider>
        <BrowserRouter>
          <Toaster />
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Welcome />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<Callback />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<RootRedirect />} />
                <Route path="/setup" element={<SetupMap />} />
                <Route path="/setup/finalize" element={<FinalizeSetup />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SessionProvider>
    </ThemeProvider>
  );
}
