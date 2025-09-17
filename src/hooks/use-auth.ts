import * as ConvexAuth from "@convex-dev/auth/react";

// Read Convex URL with robust fallbacks: env -> global -> localStorage -> query param
function getConvexUrl(): string | undefined {
  const envUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
  const globalUrl = (globalThis as any).__CONVEX_URL as string | undefined;
  const localUrl = typeof localStorage !== "undefined" ? localStorage.getItem("convex_url") || undefined : undefined;
  const queryUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("convex") || undefined
      : undefined;

  // Final fallback to ensure auth always has a Convex URL
  const DEFAULT_CONVEX_URL = "https://giddy-condor-405.convex.cloud";
  const url = envUrl || globalUrl || queryUrl || localUrl || DEFAULT_CONVEX_URL;

  // Persist from query for subsequent visits
  if (queryUrl && typeof localStorage !== "undefined") {
    localStorage.setItem("convex_url", queryUrl);
  }
  return url;
}

export function useAuth() {
  // Replace direct env read with robust getter
  const convexUrl = getConvexUrl();

  if (convexUrl && (ConvexAuth as any)?.useAuth) {
    // Delegate to @convex-dev/auth when backend URL is available
    return (ConvexAuth as any).useAuth();
  }

  return {
    isLoading: false,
    isAuthenticated: false,
    user: undefined as any,
    signIn: async (..._args: any[]) => {
      throw new Error(
        "Authentication is not configured. Set VITE_CONVEX_URL (or use ?convex=YOUR_URL) to enable auth."
      );
    },
    signOut: async (..._args: any[]) => {
      // no-op
    },
  };
}