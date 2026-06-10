import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Step1Age from './steps/Step1Age';
import Step2Income from './steps/Step2Income';
import Step3OtherIncome from './steps/Step3OtherIncome';
import Step4SalaryStructure from './steps/Step4SalaryStructure';
import Step5RentDetails from './steps/Step5RentDetails';
import Step6Investments from './steps/Step6Investments';
import Step7HealthInsurance from './steps/Step7HealthInsurance';
import Step8OtherDeductions from './steps/Step8OtherDeductions';
import LivePreview from './LivePreview';

interface WizardShellProps {
  onExit: () => void;
  onComplete: () => void;
}

const TOTAL_STEPS = 8;

const stepFAQs: Record<number, { q: string; a: string }[]> = {
  1: [
    {
      q: "Why does my age category matter?",
      a: "In the Old Regime, senior citizens (60-80) and super senior citizens (80+) get higher basic tax exemption limits (₹3 Lakhs and ₹5 Lakhs respectively) compared to individuals under 60 (₹2.5 Lakhs)."
    },
    {
      q: "Are the slabs different in the New Regime?",
      a: "No, in the New Regime, the slabs are identical for all age groups, including senior citizens."
    }
  ],
  2: [
    {
      q: "What should I enter here?",
      a: "Enter the net amount deposited in your bank account each month after deductions. We use this to estimate your base gross salary."
    }
  ],
  3: [
    {
      q: "What counts as 'Other Income'?",
      a: "This includes interest earned on savings accounts/FDs, dividend income, rental income from properties, freelancing income, or capital gains."
    }
  ],
  4: [
    {
      q: "Where do I find my Basic Salary?",
      a: "You can find your Basic Salary, HRA received, and PF deduction on your monthly salary slip."
    },
    {
      q: "Why do we need this structure?",
      a: "It helps us accurately calculate your eligible HRA exemptions and PF contributions under Section 80C."
    }
  ],
  5: [
    {
      q: "What's the Metro vs Non-Metro distinction?",
      a: "For HRA exemption, only Delhi, Mumbai, Kolkata, and Chennai qualify as Metro (50% of Basic). All other cities (like Bangalore, Hyderabad) are Non-Metro (40%)."
    }
  ],
  6: [
    {
      q: "What is the limit for Section 80C?",
      a: "The maximum limit is ₹1,50,000 per financial year. This includes PPF, ELSS mutual funds, EPF, life insurance premium, and home loan principal."
    }
  ],
  7: [
    {
      q: "Can I claim deductions for parents' health insurance?",
      a: "Yes! You can claim up to ₹25,000 for premiums paid for your parents. If your parents are senior citizens (60+), the limit is increased to ₹50,000."
    }
  ],
  8: [
    {
      q: "What is the NPS Section 80CCD(1B) deduction?",
      a: "You can claim an additional deduction of up to ₹50,000 for contributions to NPS (Tier-1), which is over and above the ₹1.5L limit of Section 80C."
    },
    {
      q: "Is Home Loan Interest deduction capped?",
      a: "Yes, interest on home loans (Section 24) is capped at ₹2,00,000 per year for self-occupied properties in the Old Regime."
    }
  ]
};

export default function WizardShell({ onExit, onComplete }: WizardShellProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(c => c + 1);
      setOpenFaq(null); // Reset FAQ accordion on page change
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(c => c - 1);
      setOpenFaq(null);
    } else {
      onExit();
    }
  };

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Age />;
      case 2:
        return <Step2Income />;
      case 3:
        return <Step3OtherIncome />;
      case 4:
        return <Step4SalaryStructure />;
      case 5:
        return <Step5RentDetails />;
      case 6:
        return <Step6Investments />;
      case 7:
        return <Step7HealthInsurance />;
      case 8:
        return <Step8OtherDeductions />;
      default:
        return null;
    }
  };

  const currentFaqs = stepFAQs[currentStep] || [];

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      {/* Progress Bar Header */}
      <div className="sticky top-0 bg-card border-b border-border z-20 shadow-sm">
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
          <div className="w-16 text-right">
            {currentStep < TOTAL_STEPS && (
              <button 
                onClick={nextStep}
                className="text-primary hover:text-primary-light transition-colors font-semibold text-small"
              >
                Skip →
              </button>
            )}
          </div>
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
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-3/5 space-y-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 min-h-[420px] flex flex-col justify-between">
              
              <div className="flex-grow">
                {renderStep()}
              </div>
              
              {/* Navigation Buttons */}
              <div className="pt-8 mt-8 flex justify-between items-center border-t border-border">
                {currentStep > 1 && (
                  <button 
                    onClick={prevStep}
                    className="text-text-secondary hover:text-text-primary font-semibold py-3 px-6 rounded-xl transition-colors border border-border hover:bg-background-dark/20"
                  >
                    ← Back
                  </button>
                )}
                {currentStep < TOTAL_STEPS ? (
                  <button 
                    onClick={nextStep}
                    className="ml-auto bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button 
                    onClick={onComplete}
                    className="ml-auto bg-success hover:bg-success/90 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md animate-pulse-slow"
                  >
                    See Results
                  </button>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            {currentFaqs.length > 0 && (
              <div className="mt-12 hidden lg:block">
                <h3 className="text-h3 mb-6 text-text-primary font-bold">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {currentFaqs.map((faq, index) => (
                    <div key={index} className="border border-border rounded-xl overflow-hidden transition-all duration-300 bg-card shadow-sm">
                      <button
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-background-dark/20 transition-colors"
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      >
                        <span className="font-semibold text-body text-text-primary">{faq.q}</span>
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
                        <p className="text-text-secondary text-body leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Panel */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-[5.5rem] z-10 order-first lg:order-last mb-8 lg:mb-0">
            <LivePreview />
          </div>
          
        </div>
      </div>
    </div>
  );
}