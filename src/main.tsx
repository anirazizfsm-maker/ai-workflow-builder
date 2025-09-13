import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
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
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

  if (!convexUrl) {
    // Render children without Convex so the SPA still loads.
    return <>{children}</>;
  }

  const convex = new ConvexReactClient(convexUrl);
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
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
    <Route element={<RootLayout />}>
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