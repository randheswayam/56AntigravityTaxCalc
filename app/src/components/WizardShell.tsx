import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Step1Age from './steps/Step1Age';
import Step2Income from './steps/Step2Income';

interface WizardShellProps {
  onExit: () => void;
}

const TOTAL_STEPS = 8;

export default function WizardShell({ onExit }: WizardShellProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(c => c + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
    else onExit();
  };

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Age />;
      case 2:
        return <Step2Income />;
      default:
        return (
          <div className="py-12 text-center text-text-secondary">
            <h2 className="text-h2 mb-4">Step {currentStep}</h2>
            <p>This step is coming in a later phase.</p>
          </div>
        );
    }
  };

  // Dummy FAQs for now, step components can pass FAQs via props later or we can lift them up
  const faqs = [
    { q: "Placeholder FAQ 1", a: "Answer for FAQ 1" },
    { q: "Placeholder FAQ 2", a: "Answer for FAQ 2" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Progress Bar Header */}
      <div className="sticky top-0 bg-card border-b border-border z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={prevStep}
            className="text-text-secondary hover:text-primary transition-colors font-medium text-small"
          >
            ← {currentStep === 1 ? 'Exit' : 'Previous'}
          </button>
          <div className="text-center font-medium text-small">
            Step {currentStep} of {TOTAL_STEPS}
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-border w-full">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out" 
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-3/5 space-y-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 min-h-[400px] flex flex-col">
              
              <div className="flex-grow">
                {renderStep()}
              </div>
              
              {/* Navigation Buttons */}
              <div className="pt-8 mt-auto flex justify-between items-center border-t border-border">
                {currentStep < TOTAL_STEPS ? (
                  <button 
                    onClick={nextStep}
                    className="ml-auto bg-primary hover:bg-primary-light text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-md"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button 
                    onClick={() => {}} // Go to result page in future
                    className="ml-auto bg-success hover:bg-success/90 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-md"
                  >
                    See Results
                  </button>
                )}
              </div>
            </div>

            {/* FAQ Section Placeholder */}
            <div className="mt-12">
              <h3 className="text-h3 mb-6 text-text-primary">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden transition-all duration-300 bg-card">
                    <button
                      className="w-full text-left p-4 flex justify-between items-center hover:bg-background transition-colors"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span className="font-semibold text-body">{faq.q}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-text-secondary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-secondary" />
                      )}
                    </button>
                    <div 
                      className={`px-4 overflow-hidden transition-all duration-300 ${
                        openFaq === index ? "max-h-40 py-4 border-t border-border bg-card" : "max-h-0"
                      }`}
                    >
                      <p className="text-text-secondary text-body">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Panel Placeholder */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24 hidden lg:block">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <h3 className="text-h3 font-bold text-text-primary">Live Preview</h3>
                <p className="text-small text-text-secondary">Updates as you type</p>
              </div>
              <div className="py-12 text-center text-text-secondary text-small border-2 border-dashed border-border rounded-lg">
                Preview Panel Coming in Phase 3
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}