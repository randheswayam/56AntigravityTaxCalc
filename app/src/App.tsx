import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/AdminDashboard';
import ResultPage from './components/ResultPage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const user = useAuthStore((state) => state.user);
  const hasPaid = useAuthStore((state) => state.hasPaid);
  const setPaid = useAuthStore((state) => state.setPaid);
  const logout = useAuthStore((state) => state.logout);

  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'wizard' | 'result'>('landing');

  // Active session gate for deactivated users
  useEffect(() => {
    if (user && !user.isAdmin) {
      const checkActiveStatus = () => {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const found = users.find((u: any) => u.email === user.email);
        if (found && found.isActive === false) {
          logout();
          setCurrentView('landing');
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

  // Handle successful login redirects
  useEffect(() => {
    if (user && !user.isAdmin) {
      if (currentView === 'login') {
        if (hasPaid) {
          setCurrentView('wizard');
        } else {
          setCurrentView('landing');
        }
      }
    } else if (!user) {
      if (currentView === 'wizard') {
        setCurrentView('landing');
      }
    }
  }, [user, hasPaid]);

  // Handle payment redirect parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' || params.get('status') === 'success' || params.has('payment_id')) {
      setPaid(true);
      // Clean up the URL so it doesn't re-trigger on manual refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // If user is logged in, automatically proceed to wizard
      if (useAuthStore.getState().user) {
        setCurrentView('wizard');
      }
    }
  }, [setPaid]);

  // If logged in as admin, render Admin Dashboard
  if (user && user.isAdmin) {
    return (
      <div className="App">
        <AdminDashboard />
      </div>
    );
  }

  // Render view based on state
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onGoToRegister={() => setCurrentView('register')} 
            onGoToHome={() => setCurrentView('landing')} 
          />
        );
      case 'register':
        return (
          <Register 
            onGoToLogin={() => setCurrentView('login')} 
            onGoToHome={() => setCurrentView('landing')} 
          />
        );
      case 'wizard':
        return (
          <WizardShell 
            onExit={() => setCurrentView('landing')} 
            onComplete={() => setCurrentView('result')} 
          />
        );
      case 'result':
        return <ResultPage onRestart={() => setCurrentView('landing')} />;
      case 'landing':
      default:
        return (
          <LandingPage 
            onStart={() => setCurrentView('wizard')} 
            onNavigateToRegister={() => setCurrentView('register')} 
            onNavigateToLogin={() => setCurrentView('login')} 
          />
        );
    }
  };

  return <div className="App">{renderView()}</div>;
}

export default App;