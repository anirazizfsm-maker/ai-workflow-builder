import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthService from '../services/authService';
import { useAppStore } from '../stores/useAppStore';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setAuthenticated } = useAppStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      AuthService.login(email, password),
    onSuccess: (data) => {
      setUser(data.user);
      setAuthenticated(true);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      throw error;
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) => 
      AuthService.register(name, email, password),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      throw error;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser, setAuthenticated } = useAppStore();

  return () => {
    AuthService.logout();
    setUser(null);
    setAuthenticated(false);
    // Clear all queries
    queryClient.clear();
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => AuthService.getCurrentUser(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAuth = () => {
  const { user, isAuthenticated } = useAppStore();
  
  return {
    user,
    isAuthenticated,
    login: useLogin(),
    register: useRegister(),
    logout: useLogout(),
  };
};