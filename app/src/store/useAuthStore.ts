import { create } from 'zustand';
import { dbService } from '../utils/dbService';

export interface User {
  id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
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
    
    // Determine payment status from user database if not admin
    let userPaid = false;
    if (user.isAdmin) {
      userPaid = true;
    } else {
      // For Supabase, the user profile is resolved directly during signIn.
      // But we double check in localStorage mock database if using local fallback.
      const storedHasPaid = localStorage.getItem('hasPaid');
      userPaid = storedHasPaid === 'true';
    }
    
    localStorage.setItem('hasPaid', userPaid.toString());
    set({ user, hasPaid: userPaid });
  },
  
  logout: () => {
    dbService.signOut().catch(console.error);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hasPaid');
    set({ user: null, hasPaid: false });
  },

  setPaid: (status) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && !currentUser.isAdmin) {
      dbService.updateProfilePayment(currentUser.email, status).catch(console.error);
    }
    
    localStorage.setItem('hasPaid', status.toString());
    set({ hasPaid: status });
  }
}));