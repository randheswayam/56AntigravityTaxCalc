import { create } from 'zustand';

export interface User {
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
    
    // Determine payment status from user database
    let userPaid = false;
    if (user.isAdmin) {
      userPaid = true;
    } else {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const found = users.find((u: any) => u.email === user.email);
      if (found) {
        userPaid = !!found.hasPaid;
      }
    }
    
    localStorage.setItem('hasPaid', userPaid.toString());
    set({ user, hasPaid: userPaid });
  },
  
  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hasPaid');
    set({ user: null, hasPaid: false });
  },

  setPaid: (status) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && !currentUser.isAdmin) {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.email === currentUser.email ? { ...u, hasPaid: status } : u
      );
      localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    }
    
    localStorage.setItem('hasPaid', status.toString());
    set({ hasPaid: status });
  }
}));