import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';

function App() {
  const [isWizardStarted, setIsWizardStarted] = useState(false);

  useEffect(() => {
    // Check if we just returned from a successful payment redirection
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' || params.get('status') === 'success' || params.has('payment_id')) {
      setIsWizardStarted(true);
      // Clean up the URL so it doesn't re-trigger on manual refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="App">
      {!isWizardStarted ? (
        <LandingPage />
      ) : (
        <WizardShell onExit={() => setIsWizardStarted(false)} />
      )}
    </div>
  );
}

export default App;