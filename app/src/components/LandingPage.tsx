import { useState } from 'react';
import { CheckCircle2, Wallet, Shield, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Is this really free?",
      a: "Yes, completely free. No signup, no ads, no data collection."
    },
    {
      q: "How accurate is this?",
      a: "We use the official FY 2025-26 tax slabs and deduction limits. Results are estimates based on your inputs."
    },
    {
      q: "What's the difference between Old and New regime?",
      a: "Old regime allows deductions (80C, HRA, etc.) but has higher tax rates. New regime has lower rates but only standard deduction."
    },
    {
      q: "Can I switch between regimes?",
      a: "Yes, salaried employees can choose every year when filing ITR."
    },
    {
      q: "Is my data safe?",
      a: "Absolutely. All calculations happen in your browser. We don't store or transmit any of your financial information."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Privacy Notice Banner */}
      <div className="bg-primary-light/10 text-primary text-small text-center py-2 px-4">
        🔒 Your data never leaves this device. All calculations happen in your browser.
      </div>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side (60%) */}
          <div className="lg:w-3/5 space-y-8">
            <h1 className="text-h1">
              Find out which tax regime saves you more money
            </h1>
            <p className="text-h3 text-text-secondary">
              Answer 8 simple questions about your salary, rent, and investments. Get a clear, personalized comparison of Old vs New tax regime for FY 2025-26.
            </p>
            
            <div className="space-y-3 text-body">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-success w-6 h-6" />
                <span>Updated for FY 2025-26 (AY 2026-27)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-success w-6 h-6" />
                <span>100% Private — No data leaves your device</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-success w-6 h-6" />
                <span>Plain English — No CA required</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button 
                onClick={onStart}
                className="bg-primary hover:bg-primary-light text-white font-semibold py-4 px-8 rounded-xl text-h3 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Your Free Tax Check →
              </button>
              <a href="#how-it-works" className="text-primary hover:text-primary-light font-medium text-body">
                How does this work?
              </a>
            </div>
          </div>

          {/* Right Side (40%) */}
          <div className="lg:w-2/5 w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="bg-success text-white text-center py-4 font-bold text-h3">
                You save ₹47,500 by choosing New Regime
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-end border-b border-border pb-4">
                  <div className="text-center w-1/2">
                    <div className="text-small text-text-secondary mb-1">Old Regime</div>
                    <div className="text-h3 line-through text-text-secondary">₹1,24,800</div>
                  </div>
                  <div className="text-center w-1/2 border-l border-border">
                    <div className="text-small text-text-secondary mb-1">New Regime</div>
                    <div className="text-h2 text-success">₹77,300</div>
                  </div>
                </div>
                <div className="text-center text-text-secondary text-small">
                  This is what your result will look like.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Below the fold: How it works */}
        <div id="how-it-works" className="mt-32">
          <h2 className="text-h2 text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-h3">1. Tell us about your salary & rent</h3>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-h3">2. Add your investments & insurance</h3>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-h3">3. Get your regime comparison</h3>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-h2 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden transition-all duration-300">
                <button
                  className="w-full text-left p-4 flex justify-between items-center bg-card hover:bg-background transition-colors"
                  onClick={() => toggleFaq(index)}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-24 bg-card">
        <div className="container mx-auto px-4 text-center text-small text-text-secondary space-y-2">
          <p>This calculator is for informational purposes only. Consult a tax professional for advice.</p>
          <p>Built for FY 2025-26 (AY 2026-27)</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;