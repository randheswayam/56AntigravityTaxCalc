import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Users, 
  CreditCard, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Trash2, 
  RefreshCw, 
  Calculator,
  UserCheck,
  Ban
} from 'lucide-react';

interface UserRecord {
  name: string;
  email: string;
  createdAt: string;
  hasPaid: boolean;
  isActive: boolean;
}

const DEFAULT_MOCK_USERS: UserRecord[] = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    hasPaid: true,
    isActive: true,
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    hasPaid: false,
    isActive: true,
  },
  {
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    hasPaid: true,
    isActive: true,
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    hasPaid: false,
    isActive: false, // Deactivated
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    hasPaid: true,
    isActive: true,
  }
];

export default function AdminDashboard() {
  const logout = useAuthStore((state) => state.logout);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  // Load and seed mock users on mount
  useEffect(() => {
    const stored = localStorage.getItem('mock_users');
    if (!stored) {
      localStorage.setItem('mock_users', JSON.stringify(DEFAULT_MOCK_USERS));
      setUsers(DEFAULT_MOCK_USERS);
    } else {
      setUsers(JSON.parse(stored));
    }
  }, []);

  const saveUsers = (updatedUsers: UserRecord[]) => {
    localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Toggle Payment Status
  const handleTogglePayment = (email: string) => {
    const updated = users.map((u) => 
      u.email === email ? { ...u, hasPaid: !u.hasPaid } : u
    );
    saveUsers(updated);
  };

  // Toggle Active/Inactive status
  const handleToggleActive = (email: string) => {
    const updated = users.map((u) => 
      u.email === email ? { ...u, isActive: !u.isActive } : u
    );
    saveUsers(updated);
  };

  // Delete User
  const handleDeleteUser = (email: string) => {
    if (window.confirm(`Are you sure you want to delete the user account for ${email}?`)) {
      const updated = users.filter((u) => u.email !== email);
      saveUsers(updated);
    }
  };

  // Stats Calculations
  const totalUsers = users.length;
  const paidUsers = users.filter((u) => u.hasPaid).length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const totalRevenue = paidUsers * 499;

  // Filtered Users List
  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-h3">
            <Calculator className="w-6 h-6" />
            <span>TaxCalc India <span className="text-small bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1 font-semibold">Admin</span></span>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 hover:bg-error/5 text-error px-4 py-2 rounded-xl transition-colors font-medium border border-transparent hover:border-error/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Section */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-h1 text-text-primary">System Administration</h1>
            <p className="text-text-secondary text-body mt-1">Manage user database, payments, and system access.</p>
          </div>
          
          {/* Tabs control */}
          <div className="flex bg-card p-1 rounded-xl border border-border w-full md:w-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-body font-semibold transition-all ${
                activeTab === 'overview' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-body font-semibold transition-all ${
                activeTab === 'users' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Users Directory
            </button>
          </div>
        </div>

        {/* Tab contents */}
        {activeTab === 'overview' ? (
          <div className="space-y-8 animate-fade-in-up">
            {/* Overview Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Users */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110 duration-300" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-small font-medium text-text-secondary">Registered Users</p>
                    <h3 className="text-h1 font-bold text-text-primary mt-2">{totalUsers}</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-caption text-text-secondary">
                  Total users signed up on platform
                </div>
              </div>

              {/* Card 2: Revenue */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full transition-transform group-hover:scale-110 duration-300" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-small font-medium text-text-secondary">Total Revenue</p>
                    <h3 className="text-h1 font-bold text-success mt-2">₹{totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-caption text-text-secondary">
                  Based on {paidUsers} successful payments
                </div>
              </div>

              {/* Card 3: Active Users */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full transition-transform group-hover:scale-110 duration-300" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-small font-medium text-text-secondary">Active Accounts</p>
                    <h3 className="text-h1 font-bold text-primary mt-2">{activeUsers}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 text-primary rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-caption text-text-secondary">
                  {totalUsers - activeUsers} accounts currently deactivated
                </div>
              </div>

              {/* Card 4: Conversion Rate */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full transition-transform group-hover:scale-110 duration-300" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-small font-medium text-text-secondary">Conversion Rate</p>
                    <h3 className="text-h1 font-bold text-text-primary mt-2">
                      {totalUsers > 0 ? `${((paidUsers / totalUsers) * 100).toFixed(1)}%` : '0%'}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-caption text-text-secondary">
                  Percentage of registered users who paid
                </div>
              </div>
            </div>

            {/* Quick Overview Table / Activity Info */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-h3 font-bold text-text-primary mb-4">Admin System Notice</h2>
              <div className="space-y-3 text-body text-text-secondary">
                <p>✓ All user changes apply in real-time to the local database.</p>
                <p>✓ Deactivating a user immediately blocks them from logging in and terminates active sessions on next refresh.</p>
                <p>✓ Toggling payment status enables or disables full wizard reports instantly for that user.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
            {/* Search and control bar */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-text-secondary absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              
              <div className="text-small text-text-secondary flex items-center gap-2 self-end sm:self-auto">
                <RefreshCw className="w-4 h-4 text-primary animate-spin-hover cursor-pointer" onClick={() => setUsers(JSON.parse(localStorage.getItem('mock_users') || '[]'))} />
                <span>Showing {filteredUsers.length} of {totalUsers} users</span>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border text-caption text-text-secondary uppercase font-semibold text-left">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Account Access</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-body">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.email} className="hover:bg-primary/5 transition-colors">
                        {/* Name and Email */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-text-primary">{u.name}</div>
                          <div className="text-small text-text-secondary mt-0.5">{u.email}</div>
                        </td>
                        
                        {/* Joined Date */}
                        <td className="px-6 py-4 text-text-secondary text-small">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleTogglePayment(u.email)}
                            className={`px-3 py-1.5 rounded-full text-caption font-semibold transition-all flex items-center gap-1.5 ${
                              u.hasPaid 
                                ? 'bg-success/10 text-success hover:bg-success/20' 
                                : 'bg-text-secondary/10 text-text-secondary hover:bg-text-secondary/20'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${u.hasPaid ? 'bg-success' : 'bg-text-secondary'}`} />
                            {u.hasPaid ? 'Paid' : 'Unpaid'}
                          </button>
                        </td>

                        {/* Account Access */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(u.email)}
                            className={`px-3 py-1.5 rounded-full text-caption font-semibold transition-all flex items-center gap-1.5 ${
                              u.isActive 
                                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                                : 'bg-error/10 text-error hover:bg-error/20'
                            }`}
                          >
                            {u.isActive ? (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4" />
                                <span>Deactivated</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Delete Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.email)}
                            className="p-2 text-text-secondary hover:text-error rounded-lg hover:bg-error/5 transition-all inline-flex items-center"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                        No users match your search terms.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
