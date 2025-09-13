import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { useEffect, useState } from "react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);

  const [isLoading, setIsLoading] = useState(true);

  // This effect updates the loading state once auth is loaded and user data is available
  // It ensures we only show content when both authentication state and user data are ready
  useEffect(() => {
    if (!isAuthLoading && user !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthLoading, user]);

  // Provide safe no-op auth actions when an auth provider isn't mounted.
  // This avoids runtime crashes on pages that consume useAuth without a provider present.
  const signIn = async (..._args: any[]) => {
    throw new Error("Auth actions are unavailable: no auth provider mounted.");
  };
  const signOut = async (..._args: any[]) => {
    // no-op
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}