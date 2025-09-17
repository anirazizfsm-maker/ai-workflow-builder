import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import * as ConvexAuthReact from "@convex-dev/auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  useLocation,
  Outlet,
} from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./types/global.d.ts";
import Plans from "./pages/Plans.tsx";
import Pricing from "./pages/Pricing.tsx";

function SafeConvexProvider({ children }: { children: React.ReactNode }) {
  // Robust convex URL resolution: env -> global -> query -> localStorage
  const envUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
  const globalUrl = (globalThis as any).__CONVEX_URL as string | undefined;
  const queryUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("convex") || undefined
      : undefined;
  const localUrl =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("convex_url") || undefined
      : undefined;

  // Add a final, safe default fallback so auth works even if envs aren't injected
  const DEFAULT_CONVEX_URL = "https://giddy-condor-405.convex.cloud";
  const convexUrl = envUrl || globalUrl || queryUrl || localUrl || DEFAULT_CONVEX_URL;

  // Persist from query for future reloads
  if (queryUrl && typeof localStorage !== "undefined") {
    localStorage.setItem("convex_url", queryUrl);
  }

  if (!convexUrl) {
    return <>{children}</>;
  }

  const convex = new ConvexReactClient(convexUrl);
  const Any: any = ConvexAuthReact as any;
  // Ensure we always have a valid provider; fall back to ConvexProvider from convex/react
  const Provider =
    Any.ConvexProviderWithAuth ??
    Any.ConvexAuthProvider ??
    Any.ConvexProvider ??
    Any.Provider ??
    ConvexProvider;

  return <Provider client={convex}>{children}</Provider>;
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

function RootLayout() {
  return (
    <>
      <RouteSyncer />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<RootLayout />}
      errorElement={
        <div className="p-6 text-white">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-sm opacity-75 mt-2">
            Please refresh the page. If this continues, try an incognito window or disable extensions.
          </p>
        </div>
      }
    >
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstrumentationProvider>
      <SafeConvexProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SafeConvexProvider>
    </InstrumentationProvider>
  </StrictMode>,
);