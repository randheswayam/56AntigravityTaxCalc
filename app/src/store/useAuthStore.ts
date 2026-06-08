import { create } from 'zustand';

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  hasPaid: boolean;
  login: (user: User) => void;
  logout: () => void;
  setPaid: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  hasPaid: localStorage.getItem('hasPaid') === 'true',
  
  login: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    set({ user });
  },
  
  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hasPaid');
    set({ user: null, hasPaid: false });
  },

  setPaid: (status) => {
    localStorage.setItem('hasPaid', status.toString());
    set({ hasPaid: status });
  }
}));