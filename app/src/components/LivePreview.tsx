import { useEffect, useState } from 'react';
import { useTaxStore } from '../store/useTaxStore';
import { calculateNewRegimeTax, calculateOldRegimeTax, type TaxResult } from '../utils/taxEngine';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function LivePreview() {
  const state = useTaxStore();
  const [isCalculating, setIsCalculating] = useState(false);
  
  const grossIncome = (state.monthlyTakeHome * 12) + state.otherIncome;

  const [newRegime, setNewRegime] = useState<TaxResult>({
    taxableIncome: 0, taxBeforeRebate: 0, rebate: 0, taxAfterRebate: 0, cess: 0, totalTax: 0, effectiveRate: 0
  });

  const [oldRegime, setOldRegime] = useState<TaxResult>({
    taxableIncome: 0, taxBeforeRebate: 0, rebate: 0, taxAfterRebate: 0, cess: 0, totalTax: 0, effectiveRate: 0, totalDeductions: 50000
  });

  // Debounced calculation
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      setNewRegime(calculateNewRegimeTax(grossIncome, state.ageCategory));
      setOldRegime(calculateOldRegimeTax(grossIncome, state.ageCategory, state));
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    grossIncome,
    state.ageCategory,
    state.basicSalary,
    state.hraReceived,
    state.pfDeduction,
    state.paysRent,
    state.monthlyRent,
    state.isMetro,
    state.total80C
  ]);

  const diff = oldRegime.totalTax - newRegime.totalTax;
  const isNewBetter = diff > 0;
  const isOldBetter = diff < 0;
  const savings = Math.abs(diff);

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-all duration-300">
      
      {/* Header / Recommendation Preview */}
      <div className={`p-6 text-center text-white transition-colors duration-300 ${
        grossIncome === 0 ? 'bg-primary' : (isNewBetter ? 'bg-success' : (isOldBetter ? 'bg-primary' : 'bg-text-secondary'))
      }`}>
        {isCalculating ? (
          <div className="animate-pulse">Calculating...</div>
        ) : grossIncome === 0 ? (
          <div>
            <div className="text-small opacity-90 mb-1">Enter your income to see</div>
            <div className="text-h3 font-bold">Tax Estimates</div>
          </div>
        ) : (
          <div>
            <div className="text-small opacity-90 mb-1">
              {isNewBetter ? 'New Regime looks better' : (isOldBetter ? 'Old Regime looks better' : 'Both are equal')}
            </div>
            <div className="text-h3 font-bold">
              {savings > 0 ? `Potential savings: ${formatCurrency(savings)}` : 'No difference'}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Income Summary */}
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="text-text-secondary font-medium">Annual Income</span>
          <span className="text-h3 font-bold">{formatCurrency(grossIncome)}</span>
        </div>

        {/* Estimates Side by Side */}
        <div className="flex gap-4">
          
          {/* Old Regime Column */}
          <div className={`flex-1 rounded-xl p-4 border-2 transition-all ${isOldBetter ? 'border-primary bg-primary/5' : 'border-border opacity-70'}`}>
            <div className="text-center mb-4">
              <div className="text-small text-text-secondary mb-1">Old Regime</div>
              <div className={`text-h3 font-bold ${isOldBetter ? 'text-primary' : 'text-text-primary'}`}>
                {formatCurrency(oldRegime.totalTax)}
              </div>
            </div>
            <div className="space-y-2 text-caption">
              <div className="flex justify-between text-success">
                <span>Deductions</span>
                <span className="font-medium">-{formatCurrency(oldRegime.totalDeductions || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Taxable Inc.</span>
                <span className="font-medium">{formatCurrency(oldRegime.taxableIncome)}</span>
              </div>
              {oldRegime.rebate > 0 && (
                <div className="flex justify-between text-success">
                  <span>Rebate (87A)</span>
                  <span className="font-medium">-{formatCurrency(oldRegime.rebate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* New Regime Column */}
          <div className={`flex-1 rounded-xl p-4 border-2 transition-all ${isNewBetter ? 'border-success bg-success/5' : 'border-border opacity-70'}`}>
            <div className="text-center mb-4">
              <div className="text-small text-text-secondary mb-1">New Regime</div>
              <div className={`text-h3 font-bold ${isNewBetter ? 'text-success' : 'text-text-primary'}`}>
                {formatCurrency(newRegime.totalTax)}
              </div>
            </div>
            <div className="space-y-2 text-caption">
              <div className="flex justify-between text-success">
                <span>Deductions</span>
                <span className="font-medium">-₹75,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Taxable Inc.</span>
                <span className="font-medium">{formatCurrency(newRegime.taxableIncome)}</span>
              </div>
              {newRegime.rebate > 0 && (
                <div className="flex justify-between text-success">
                  <span>Rebate (87A)</span>
                  <span className="font-medium">-{formatCurrency(newRegime.rebate)}</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}