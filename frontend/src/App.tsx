import { lazy, Suspense } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Welcome from "./pages/Welcome";
const LoginPage = lazy(() => import("./pages/Login"));
// const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navbar />
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
