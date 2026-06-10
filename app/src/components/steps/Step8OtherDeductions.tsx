import { useTaxStore } from '../../store/useTaxStore';

export default function Step8OtherDeductions() {
  const {
    hasHomeLoan,
    homeLoanInterest,
    hasNPS,
    npsAmount,
    hasEducationLoan,
    educationLoanInterest,
    hasProfessionalTax,
    professionalTaxAmount,
    updateField
  } = useTaxStore();

  const handleNumericChange = (field: 'homeLoanInterest' | 'npsAmount' | 'educationLoanInterest' | 'professionalTaxAmount') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField(field, value ? parseInt(value, 10) : 0);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">Any other deductions?</h2>
        <p className="text-text-secondary text-body">
          We want to capture remaining common deductions like Home Loan interest, NPS contributions, and Education Loan interest.
        </p>
      </div>

      <div className="space-y-6 divide-y divide-border">
        {/* Home Loan Interest */}
        <div className="space-y-3 pt-4 first:pt-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-body text-text-primary">Home Loan Interest (Section 24(b))</h3>
              <p className="text-caption text-text-secondary">Excludes principal repayment (already under 80C).</p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateField('hasHomeLoan', !hasHomeLoan);
                if (hasHomeLoan) updateField('homeLoanInterest', 0);
              }}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all border ${
                hasHomeLoan
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-background border-border text-text-secondary hover:bg-background-dark'
              }`}
            >
              {hasHomeLoan ? 'Selected' : 'Add'}
            </button>
          </div>
          {hasHomeLoan && (
            <div className="relative animate-fade-in-up">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={homeLoanInterest > 0 ? homeLoanInterest.toLocaleString('en-IN') : ''}
                onChange={handleNumericChange('homeLoanInterest')}
                placeholder="Interest paid (Max ₹2,00,000)"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* NPS Contribution */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-body text-text-primary">National Pension Scheme (Section 80CCD(1B))</h3>
              <p className="text-caption text-text-secondary">Additional deduction up to ₹50,000.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateField('hasNPS', !hasNPS);
                if (hasNPS) updateField('npsAmount', 0);
              }}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all border ${
                hasNPS
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-background border-border text-text-secondary hover:bg-background-dark'
              }`}
            >
              {hasNPS ? 'Selected' : 'Add'}
            </button>
          </div>
          {hasNPS && (
            <div className="relative animate-fade-in-up">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={npsAmount > 0 ? npsAmount.toLocaleString('en-IN') : ''}
                onChange={handleNumericChange('npsAmount')}
                placeholder="NPS contribution (Max ₹50,000)"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Education Loan Interest */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-body text-text-primary">Education Loan Interest (Section 80E)</h3>
              <p className="text-caption text-text-secondary">Interest paid on higher education loan for self, spouse, or children.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateField('hasEducationLoan', !hasEducationLoan);
                if (hasEducationLoan) updateField('educationLoanInterest', 0);
              }}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all border ${
                hasEducationLoan
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-background border-border text-text-secondary hover:bg-background-dark'
              }`}
            >
              {hasEducationLoan ? 'Selected' : 'Add'}
            </button>
          </div>
          {hasEducationLoan && (
            <div className="relative animate-fade-in-up">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={educationLoanInterest > 0 ? educationLoanInterest.toLocaleString('en-IN') : ''}
                onChange={handleNumericChange('educationLoanInterest')}
                placeholder="Interest paid on loan"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Professional Tax */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-body text-text-primary">Professional Tax</h3>
              <p className="text-caption text-text-secondary">Tax deducted by employer (Max ₹2,500).</p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateField('hasProfessionalTax', !hasProfessionalTax);
                if (hasProfessionalTax) updateField('professionalTaxAmount', 0);
              }}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all border ${
                hasProfessionalTax
                  ? 'bg-primary/5 border-primary text-primary'
                  : 'bg-background border-border text-text-secondary hover:bg-background-dark'
              }`}
            >
              {hasProfessionalTax ? 'Selected' : 'Add'}
            </button>
          </div>
          {hasProfessionalTax && (
            <div className="relative animate-fade-in-up">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={professionalTaxAmount > 0 ? professionalTaxAmount.toLocaleString('en-IN') : ''}
                onChange={handleNumericChange('professionalTaxAmount')}
                placeholder="Professional tax amount (Max ₹2,500)"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
