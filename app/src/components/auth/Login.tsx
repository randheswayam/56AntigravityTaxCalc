import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Wallet } from 'lucide-react';

interface LoginProps {
  onGoToRegister: () => void;
}

export default function Login({ onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for admin credentials
    if (email === 'admin@taxcalc.com' && password === 'admin123') {
      login({ name: 'System Admin', email: 'admin@taxcalc.com', isAdmin: true });
      return;
    }

    // Fetch mock users from localStorage
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      if (user.isActive === false) {
        setError('Your account has been deactivated. Please contact support.');
        return;
      }
      login({ name: user.name, email: user.email });
    } else {
      setError('Invalid email or password. Please try again.');
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
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 mt-4"
          >
            Login →
          </button>
        </form>

        <div className="mt-6 text-center text-small text-text-secondary">
          Don't have an account?{' '}
          <button onClick={onGoToRegister} className="text-primary hover:underline font-medium">
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
}