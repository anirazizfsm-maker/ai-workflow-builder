import { useAuth as useAuthHook } from './useAuth';

export function useAuth() {
  const { user, isAuthenticated, login, register, logout } = useAuthHook();
  
  return {
    isLoading: false, // Since we're not using Convex, we don't have loading states
    isAuthenticated,
    user,
    signIn: login,
    signOut: logout,
  };
}