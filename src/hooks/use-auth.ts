import * as ConvexAuth from "@convex-dev/auth/react";

export function useAuth() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

  if (convexUrl && (ConvexAuth as any)?.useAuth) {
    // Delegate to @convex-dev/auth when backend URL is available
    return (ConvexAuth as any).useAuth();
  }

  return {
    isLoading: false,
    isAuthenticated: false,
    user: undefined as any,
    // Make signIn a no-op in demo mode instead of throwing
    signIn: async (..._args: any[]) => {
      console.warn("Auth is not configured (VITE_CONVEX_URL missing). Running in demo mode; signIn is a no-op.");
      return;
    },
    signOut: async (..._args: any[]) => {
      // no-op
    },
  };
}