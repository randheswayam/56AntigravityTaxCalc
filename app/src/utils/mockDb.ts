export interface UserRecord {
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  hasPaid: boolean;
  isActive: boolean;
}

export const DEFAULT_MOCK_USERS: UserRecord[] = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    hasPaid: true,
    isActive: true,
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    hasPaid: false,
    isActive: true,
  },
  {
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    hasPaid: true,
    isActive: true,
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    hasPaid: false,
    isActive: false, // Deactivated
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    hasPaid: true,
    isActive: true,
  }
];

export const seedMockUsers = () => {
  const stored = localStorage.getItem('mock_users');
  if (!stored) {
    localStorage.setItem('mock_users', JSON.stringify(DEFAULT_MOCK_USERS));
  }
};
