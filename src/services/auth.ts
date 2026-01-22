import { api } from './api';

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface LoginCredentials {
  name: string;
  password: string;
}

interface AuthResponse {
  user?: User;
  accessToken: string;
}

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {
    this.setupInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupInterceptors() {
    api.interceptors.request.use(
      (config) => {
        if (this.accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes('/auth/login') &&
          !originalRequest.url.includes('/auth/refresh')
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            this.accessToken = null;
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    this.accessToken = data.accessToken;
    return data.user!;
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        this.accessToken = data.accessToken;
        resolve(data.accessToken);
      } catch (error) {
        this.accessToken = null;
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } finally {
      this.accessToken = null;
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }
}

export const authService = AuthService.getInstance();