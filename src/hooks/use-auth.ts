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
    signIn: async (..._args: any[]) => {
      throw new Error(
        "Authentication is not configured. Set VITE_CONVEX_URL to enable auth."
      );
    },
    signOut: async (..._args: any[]) => {
      // no-op
    },
  };
}