import { create } from 'zustand';
import api, { setAuthToken } from '../lib/api';
import { toast } from 'sonner';

const TOKEN_KEY = 'ptm_token';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const persistToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  token: getStoredToken(),
  isAuthenticated: Boolean(getStoredToken()),
  isLoading: false,
  isChecking: Boolean(getStoredToken()),
  init: async () => {
    const token = getStoredToken();
    if (!token) return;
    set({ isChecking: true });
    setAuthToken(token);
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, token, isAuthenticated: true, isChecking: false });
    } catch {
      setAuthToken(null);
      persistToken(null);
      set({ user: null, token: null, isAuthenticated: false, isChecking: false });
    }
  },
  login: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', payload);
      setAuthToken(data.token);
      persistToken(data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      toast.success('Welcome back');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      set({ isLoading: false });
      return false;
    }
  },
  register: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', payload);
      setAuthToken(data.token);
      persistToken(data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      toast.success('Account created');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      set({ isLoading: false });
      return false;
    }
  },
  logout: () => {
    setAuthToken(null);
    persistToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
