import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const [isWizardStarted, setIsWizardStarted] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');
  
  const user = useAuthStore((state) => state.user);
  const setPaid = useAuthStore((state) => state.setPaid);
  const logout = useAuthStore((state) => state.logout);

  // Active session gate for deactivated users
  useEffect(() => {
    if (user && !user.isAdmin) {
      const checkActiveStatus = () => {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const found = users.find((u: any) => u.email === user.email);
        if (found && found.isActive === false) {
          logout();
          alert('Your session has been terminated because your account was deactivated.');
        }
      };

      // Check on mount and listen to storage events (cross-tab sync)
      checkActiveStatus();
      window.addEventListener('storage', checkActiveStatus);
      return () => {
        window.removeEventListener('storage', checkActiveStatus);
      };
    }
  }, [user, logout]);

  useEffect(() => {
    // Check if we just returned from a successful payment redirection
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' || params.get('status') === 'success' || params.has('payment_id')) {
      setPaid(true);
      // Clean up the URL so it doesn't re-trigger on manual refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setPaid]);

  // If user is not logged in, show Auth screens
  if (!user) {
    return (
      <div className="App">
        {authView === 'login' ? (
          <Login onGoToRegister={() => setAuthView('register')} />
        ) : (
          <Register onGoToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // If logged in as admin, render Admin Dashboard
  if (user.isAdmin) {
    return (
      <div className="App">
        <AdminDashboard />
      </div>
    );
  }

  // If user is logged in, proceed to normal flow
  return (
    <div className="App">
      {!isWizardStarted ? (
        <LandingPage onStart={() => setIsWizardStarted(true)} />
      ) : (
        <WizardShell onExit={() => setIsWizardStarted(false)} />
      )}
    </div>
  );
}

export default App;