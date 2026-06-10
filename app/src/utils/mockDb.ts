export interface UserRecord {
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  hasPaid: boolean;
  isActive: boolean;
}

export const DEFAULT_MOCK_USERS: UserRecord[] = [];

export const seedMockUsers = () => {
  // Migration to force clear old dummy data from client local storage
  const isReset = localStorage.getItem('mock_users_reset_v2');
  if (!isReset) {
    localStorage.setItem('mock_users', JSON.stringify([]));
    localStorage.setItem('mock_users_reset_v2', 'true');
  } else {
    const stored = localStorage.getItem('mock_users');
    if (!stored) {
      localStorage.setItem('mock_users', JSON.stringify([]));
    }
  }
};
