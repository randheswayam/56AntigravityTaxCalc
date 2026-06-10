import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTaxStore } from '../store/useTaxStore';
import { User, Key, CreditCard, RotateCcw, ArrowLeft, Save } from 'lucide-react';
import { dbService } from '../utils/dbService';
import { isSupabaseConfigured } from '../utils/supabaseClient';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const user = useAuthStore((state) => state.user);
  const hasPaid = useAuthStore((state) => state.hasPaid);
  
  const resetTaxData = useTaxStore((state) => state.resetTaxData);

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      if (user?.email) {
        await dbService.updateProfileName(user.email, name.trim());
        
        // Update local session info
        const updatedUser = { ...user, name: name.trim() };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        useAuthStore.getState().login(updatedUser as any);
        
        setMessage('Name updated successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update name.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    try {
      if (isSupabaseConfigured) {
        await dbService.updatePassword(newPassword);
      } else {
        // LocalStorage fallback password update
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const foundUserIndex = users.findIndex((u: any) => u.email === user?.email);

        if (foundUserIndex === -1) {
          setError('User not found.');
          return;
        }

        // Verify current password
        if (users[foundUserIndex].password !== currentPassword) {
          setError('Incorrect current password.');
          return;
        }

        // Update password
        users[foundUserIndex].password = newPassword;
        localStorage.setItem('mock_users', JSON.stringify(users));
      }
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setMessage('Password changed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your tax inputs? This cannot be undone.')) {
      resetTaxData();
      alert('Tax calculator progress has been reset to defaults.');
    }
  };

  const handlePaymentRedirect = () => {
    const returnUrl = encodeURIComponent(window.location.origin + '?payment=success');
    window.location.href = `https://superprofile.bio/vp/tax-calculator-app?redirect_url=${returnUrl}&return_url=${returnUrl}`;
  };

  return (
    <div className="min-h-screen bg-background text-text-primary py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Navigation header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 border border-border bg-card rounded-xl hover:bg-background-dark/20 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h2 font-bold text-text-primary">Profile settings</h1>
            <p className="text-text-secondary text-body">Manage your account information and preferences.</p>
          </div>
        </div>

        {/* Global messages */}
        {message && (
          <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl text-small text-center font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-small text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          
          {/* Section 1: Basic Profile */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-h3 font-bold text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <User className="w-5 h-5 text-primary" />
              <span>Personal details</span>
            </h3>
            
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="space-y-2">
                <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">Email Address (Non-changeable)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background-dark/30 text-text-secondary outline-none opacity-80 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-light text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          </div>

          {/* Section 2: Change Password */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-h3 font-bold text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <Key className="w-5 h-5 text-primary" />
              <span>Security settings</span>
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-light text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-md"
              >
                <Key className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Section 3: Premium Access Status */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-h3 font-bold text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Premium Access</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background-dark/20 p-5 rounded-2xl border border-border">
              <div>
                <p className="font-semibold text-body">Calculator Status</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${hasPaid ? 'bg-success animate-pulse' : 'bg-text-secondary'}`} />
                  <span className={`text-small font-bold ${hasPaid ? 'text-success' : 'text-text-secondary'}`}>
                    {hasPaid ? 'Paid (Unlocked)' : 'Unpaid (Locked)'}
                  </span>
                </div>
              </div>
              {!hasPaid && (
                <button
                  onClick={handlePaymentRedirect}
                  className="w-full sm:w-auto bg-success hover:bg-success/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Unlock Calculator</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Data Clean Up */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-h3 font-bold text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span>Data maintenance</span>
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-semibold text-body">Reset Tax Calculator Inputs</p>
                <p className="text-caption text-text-secondary mt-1">This clears your answers across all 8 wizard steps and resets the inputs back to defaults.</p>
              </div>
              <button
                onClick={handleResetProgress}
                className="w-full sm:w-auto border border-error/30 hover:border-error bg-card text-error hover:bg-error/5 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
