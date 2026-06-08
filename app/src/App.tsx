import { useState } from 'react';
import LandingPage from './components/LandingPage';
import WizardShell from './components/WizardShell';

function App() {
  const [isWizardStarted, setIsWizardStarted] = useState(false);

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