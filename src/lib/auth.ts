import { Pengguna } from '@/types';

const AUTH_STORAGE_KEY = 'sia_user';

export const authService = {
  async login(username: string, password: string): Promise<Pengguna | null> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) return null;
      
      const user: Pengguna = await response.json();
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getUser(): Pengguna | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
};
