import { useState } from 'react';
import LandingPage from './components/LandingPage';

function App() {
  const [isWizardStarted, setIsWizardStarted] = useState(false);

  return (
    <div className="App">
      {!isWizardStarted ? (
        <LandingPage onStart={() => setIsWizardStarted(true)} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
          <h1 className="text-h2 mb-4 text-primary">Wizard Started</h1>
          <button 
            onClick={() => setIsWizardStarted(false)}
            className="text-primary-light hover:underline"
          >
            ← Back to Landing Page
          </button>
        </div>
      )}
    </div>
  );
}

export default App;