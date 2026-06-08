import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield } from 'lucide-react';

interface RegisterProps {
  onGoToLogin: () => void;
}

export default function Register({ onGoToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fetch mock users
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === email)) {
      alert('Account with this email already exists!');
      return;
    }

    // Save new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));

    // Auto-login after registration
    login({ name: newUser.name, email: newUser.email });
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
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 mt-4"
          >
            Sign Up →
          </button>
        </form>

        <div className="mt-6 text-center text-small text-text-secondary">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="text-primary hover:underline font-medium">
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}