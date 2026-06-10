import { useTaxStore } from '../store/useTaxStore';
import { calculateNewRegimeTax, calculateOldRegimeTax } from '../utils/taxEngine';
import { Printer, RotateCcw, Award, Info, FileText } from 'lucide-react';

interface ResultPageProps {
  onRestart: () => void;
}

export default function ResultPage({ onRestart }: ResultPageProps) {
  const state = useTaxStore();
  const grossIncome = (state.monthlyTakeHome * 12) + state.otherIncome;
  
  const newRegime = calculateNewRegimeTax(grossIncome, state.ageCategory);
  const oldRegime = calculateOldRegimeTax(grossIncome, state.ageCategory, state);

  const newTax = Math.round(newRegime.totalTax);
  const oldTax = Math.round(oldRegime.totalTax);
  
  const diff = oldTax - newTax;
  const winner = diff > 0 ? 'New Regime' : diff < 0 ? 'Old Regime' : 'Tie';
  const savings = Math.abs(diff);

  const handlePrint = () => {
    window.print();
  };

  // Generate personalized tips
  const tips: string[] = [];
  if (winner === 'New Regime' && diff > 0) {
    tips.push(
      `By choosing the New Regime, you save ₹${savings.toLocaleString('en-IN')} without blocking your money in long-term investments (like PPF, FDs) or insurance.`
    );
  }
  if (state.paysRent && state.hraReceived === 0) {
    tips.push(
      "You are paying rent but not receiving HRA from your employer. You can discuss restructuring your salary components to include HRA for better tax relief under the Old Regime."
    );
  }
  if (!state.has80C && oldTax > newTax) {
    const potential80CSavings = Math.min(150000, grossIncome) * 0.20; // estimate
    tips.push(
      `You haven't declared Section 80C investments. Investing up to ₹1.5 Lakhs in PPF or ELSS could reduce your Old Regime tax liability by up to ₹${potential80CSavings.toLocaleString('en-IN')}.`
    );
  }
  if (!state.hasNPS && oldTax > newTax) {
    tips.push(
      "Contributing up to ₹50,000 in NPS (National Pension Scheme) under Section 80CCD(1B) provides an extra tax deduction that is only available in the Old Regime."
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary py-12 px-4 font-sans print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header (hidden on print) */}
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-h2 font-bold text-primary flex items-center gap-2">
            <Award className="w-8 h-8" />
            <span>Tax Regime Comparison Report</span>
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 border border-border bg-card hover:bg-background-dark text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl transition-all font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onRestart}
              className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          </div>
        </div>

        {/* Print-only Header */}
        <div className="hidden print:block border-b border-black pb-4 mb-8">
          <h1 className="text-3xl font-bold text-center">TaxCalc India Regime Report</h1>
          <p className="text-center text-gray-500">Financial Year 2025-26 (Assessment Year 2026-27)</p>
        </div>

        {/* Winner Callout Card */}
        <div className={`p-6 md:p-8 rounded-3xl border text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden ${
          winner === 'Tie'
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500'
            : winner === 'New Regime'
              ? 'bg-gradient-to-br from-success/90 to-emerald-700 border-success/30'
              : 'bg-gradient-to-br from-primary to-indigo-800 border-primary/30'
        }`}>
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-caption font-bold tracking-wide uppercase">
              Recommendation
            </span>
            {winner === 'Tie' ? (
              <h2 className="text-h1 font-black leading-tight">It's a Tie!</h2>
            ) : (
              <h2 className="text-h1 font-black leading-tight">
                Go with the <span className="underline decoration-wavy">{winner}</span>
              </h2>
            )}
            <p className="text-h3 opacity-90 max-w-xl">
              {winner === 'Tie'
                ? "Both regimes result in the exact same tax liability. You can pick either regime."
                : `You save ₹${savings.toLocaleString('en-IN')} by choosing the ${winner} for your FY 2025-26 taxes.`}
            </p>
          </div>
          {winner !== 'Tie' && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center min-w-[200px] z-10 animate-pulse-slow">
              <p className="text-small opacity-85 font-medium uppercase tracking-wider">Annual Savings</p>
              <p className="text-h1 font-black mt-1">₹{savings.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>

        {/* Detailed Side-by-Side Comparison */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-background-dark/20 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-h3 font-bold text-text-primary">regime Comparison details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-dark/40 border-b border-border text-caption font-bold text-text-secondary uppercase">
                  <th className="px-6 py-4">Tax Parameter</th>
                  <th className="px-6 py-4 text-right">Old Regime</th>
                  <th className="px-6 py-4 text-right">New Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-body text-text-secondary">
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">Gross Annual Income</td>
                  <td className="px-6 py-4 text-right">₹{grossIncome.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">₹{grossIncome.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">Standard Deduction</td>
                  <td className="px-6 py-4 text-right text-error">- ₹50,000</td>
                  <td className="px-6 py-4 text-right text-error">- ₹75,000</td>
                </tr>
                {/* Breakdowns of old deductions if applicable */}
                {oldRegime.totalDeductions && oldRegime.totalDeductions > 50000 && (
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary">Declared Deductions (80C, 80D, HRA, etc.)</td>
                    <td className="px-6 py-4 text-right text-error">- ₹{(oldRegime.totalDeductions - 50000).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">-</td>
                  </tr>
                )}
                <tr className="hover:bg-primary/5 transition-colors font-semibold bg-background-dark/10">
                  <td className="px-6 py-4 text-text-primary">Taxable Net Income</td>
                  <td className="px-6 py-4 text-right text-text-primary">₹{Math.round(oldRegime.taxableIncome).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right text-text-primary">₹{Math.round(newRegime.taxableIncome).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">Tax Liability (Slabs)</td>
                  <td className="px-6 py-4 text-right">₹{Math.round(oldRegime.taxBeforeRebate).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">₹{Math.round(newRegime.taxBeforeRebate).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">Section 87A Rebate</td>
                  <td className="px-6 py-4 text-right text-success">- ₹{Math.round(oldRegime.rebate).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right text-success">- ₹{Math.round(newRegime.rebate).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">Health & Education Cess (4%)</td>
                  <td className="px-6 py-4 text-right">₹{Math.round(oldRegime.cess).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">₹{Math.round(newRegime.cess).toLocaleString('en-IN')}</td>
                </tr>
                <tr className={`font-bold border-t-2 border-border text-h3 ${
                  winner === 'Tie'
                    ? 'text-text-primary'
                    : 'bg-primary/5'
                }`}>
                  <td className="px-6 py-5 text-text-primary">Total Tax Payable</td>
                  <td className={`px-6 py-5 text-right ${winner === 'Old Regime' ? 'text-success text-h2' : 'text-text-secondary'}`}>
                    ₹{oldTax.toLocaleString('en-IN')}
                    {winner === 'Old Regime' && <span className="block text-caption font-semibold mt-1">Recommended</span>}
                  </td>
                  <td className={`px-6 py-5 text-right ${winner === 'New Regime' ? 'text-success text-h2' : 'text-text-secondary'}`}>
                    ₹{newTax.toLocaleString('en-IN')}
                    {winner === 'New Regime' && <span className="block text-caption font-semibold mt-1">Recommended</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Personalized Practical Suggestions */}
        {tips.length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="text-h3 font-bold text-text-primary flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <span>Personalized Tax Optimization Tips</span>
            </h3>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-body text-text-secondary">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-small">
                    {index + 1}
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer print footer */}
        <div className="text-center text-caption text-text-secondary pt-8 border-t border-border">
          <p>⚠️ Disclaimer: This tax calculation report is an estimate based on your self-reported inputs. Actual taxes may vary. Consult a certified financial planner or tax advisor for professional guidance.</p>
          <p className="mt-1">Generated via TaxCalc India (FY 2025-26)</p>
        </div>

      </div>
    </div>
  );
}
