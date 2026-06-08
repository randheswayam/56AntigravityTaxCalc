import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const [isWizardStarted, setIsWizardStarted] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');
  
  const user = useAuthStore((state) => state.user);
  const setPaid = useAuthStore((state) => state.setPaid);

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