import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTaxStore } from '../../store/useTaxStore';
import { Wallet } from 'lucide-react';
import { dbService } from '../../utils/dbService';

interface LoginProps {
  onGoToRegister: () => void;
  onGoToHome: () => void;
}

export default function Login({ onGoToRegister, onGoToHome }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authenticatedUser = await dbService.signIn(email, password);
      
      // Write user details to Auth Store (sets currentUser & hasPaid)
      localStorage.setItem('hasPaid', (!!authenticatedUser.hasPaid).toString());
      login(authenticatedUser);

      // Load saved calculations
      if (!authenticatedUser.isAdmin) {
        await useTaxStore.getState().loadCalculations(authenticatedUser.email);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-h2 text-text-primary">Welcome Back</h2>
          <p className="text-text-secondary text-body mt-2">Login to access your tax calculator</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error rounded-lg text-small text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className="mt-6 text-center text-small text-text-secondary space-y-3">
          <div>
            Don't have an account?{' '}
            <button onClick={onGoToRegister} className="text-primary hover:underline font-medium">
              Sign up here
            </button>
          </div>
          <div className="pt-2 border-t border-border">
            <button 
              onClick={onGoToHome} 
              className="text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}