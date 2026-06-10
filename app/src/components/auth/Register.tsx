import { useState } from 'react';
import { Shield } from 'lucide-react';
import { dbService } from '../../utils/dbService';
import { useAuthStore } from '../../store/useAuthStore';

interface RegisterProps {
  onGoToLogin: () => void;
  onGoToHome: () => void;
}

export default function Register({ onGoToLogin, onGoToHome }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await dbService.signUp(email, password, name);
      if (result.emailConfirmationRequired) {
        alert('Registration successful! A confirmation email has been sent. Please confirm your email before logging in.');
        onGoToLogin();
      } else {
        alert('Registration successful!');
        if (result.user) {
          localStorage.setItem('hasPaid', 'false');
          login(result.user);
          onGoToHome();
        } else {
          onGoToLogin();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-h2 text-text-primary">Create an Account</h2>
          <p className="text-text-secondary text-body mt-2">Sign up to calculate your taxes privately</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

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
              minLength={6}
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
            {isLoading ? 'Signing up...' : 'Sign Up →'}
          </button>
        </form>

        <div className="mt-6 text-center text-small text-text-secondary space-y-3">
          <div>
            Already have an account?{' '}
            <button onClick={onGoToLogin} className="text-primary hover:underline font-medium">
              Login here
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