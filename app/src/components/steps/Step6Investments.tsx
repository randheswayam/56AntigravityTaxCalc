import { useTaxStore } from '../../store/useTaxStore';

export default function Step6Investments() {
  const { has80C, total80C, pfDeduction, updateField } = useTaxStore();

  const handleToggleHas80C = (value: boolean) => {
    updateField('has80C', value);
    if (!value) {
      updateField('total80C', 0);
    }
  };

  const handle80CChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField('total80C', value ? parseInt(value, 10) : 0);
  };

  const annualPF = pfDeduction * 12;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">Do you have tax-saving investments?</h2>
        <p className="text-text-secondary text-body">
          Section 80C allows deductions up to ₹1,500,000 per year for investments like PPF, ELSS (mutual funds), NSC, tax-saving FDs, and employee Provident Fund (EPF).
        </p>
      </div>

      {/* Toggle */}
      <div className="space-y-3">
        <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
          Do you invest in PPF, ELSS, Life Insurance, or NPS?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleToggleHas80C(true)}
            className={`flex-1 py-4 px-6 border-2 rounded-xl font-semibold transition-all ${
              has80C
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-background text-text-secondary'
            }`}
          >
            Yes, I have investments
          </button>
          <button
            type="button"
            onClick={() => handleToggleHas80C(false)}
            className={`flex-1 py-4 px-6 border-2 rounded-xl font-semibold transition-all ${
              !has80C
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-background text-text-secondary'
            }`}
          >
            No, I don't invest
          </button>
        </div>
      </div>

      {/* Annual PF Info Box (always show if they have PF) */}
      {annualPF > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-small text-text-primary">
          ℹ️ Your EPF contribution from Step 4 (₹{annualPF.toLocaleString('en-IN')}/year) is automatically included in your Section 80C limit calculation. Do not count it again below.
        </div>
      )}

      {has80C && (
        <div className="space-y-4 animate-fade-in-up pt-4 border-t border-border">
          {/* Other 80C investments input */}
          <div className="space-y-2">
            <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
              Other 80C Investments (PPF, ELSS, NSC, FDs, etc.)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={total80C > 0 ? total80C.toLocaleString('en-IN') : ''}
                onChange={handle80CChange}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <p className="text-caption text-text-secondary">
              Total 80C deduction limit is ₹1,50,000 (including your EPF).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
