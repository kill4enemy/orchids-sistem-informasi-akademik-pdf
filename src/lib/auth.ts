import { Pengguna } from '@/types';

const AUTH_STORAGE_KEY = 'sia_user';

export const authService = {
  async login(username: string, password: string): Promise<Pengguna | null> {
    try {
      const response = await fetch(`/api/pengguna?username=${username}`);
      if (!response.ok) return null;
      
      const user: Pengguna = await response.json();
      
      // Simple password verification (in production, verify with bcrypt on backend)
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) return null;
      
      // Store user without password
      const userWithoutPassword = { ...user, password: '' };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
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
