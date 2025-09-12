import { apiEndpoints } from './api';

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    // Check for existing token in localStorage
    this.token = localStorage.getItem('lethimdo_token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<any> {
    try {
      const response = await apiEndpoints.auth.login({ email, password });
      
      if (response.data.success && response.data.token) {
        this.token = response.data.token;
        localStorage.setItem('lethimdo_token', this.token);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  public async register(name: string, email: string, password: string): Promise<any> {
    try {
      const response = await apiEndpoints.auth.register({ name, email, password });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem('lethimdo_token');
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public async getCurrentUser(): Promise<any> {
    try {
      const response = await apiEndpoints.auth.me();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
  }

  public async refreshToken(): Promise<void> {
    // In a real implementation, this would refresh the token
    // For now, we'll just check if we have a valid token
    if (!this.token) {
      throw new Error('No token available');
    }
  }
}

export default AuthService.getInstance();