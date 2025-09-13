export function useAuth() {
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