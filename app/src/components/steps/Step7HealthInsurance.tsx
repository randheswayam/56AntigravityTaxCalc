import { useTaxStore } from '../../store/useTaxStore';

export default function Step7HealthInsurance() {
  const { hasHealthInsurance, healthSelf, healthParents, parentsSenior, updateField } = useTaxStore();

  const handleToggleHasHealthInsurance = (value: boolean) => {
    updateField('hasHealthInsurance', value);
    if (!value) {
      updateField('healthSelf', 0);
      updateField('healthParents', 0);
      updateField('parentsSenior', false);
    }
  };

  const handleHealthSelfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField('healthSelf', value ? parseInt(value, 10) : 0);
  };

  const handleHealthParentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField('healthParents', value ? parseInt(value, 10) : 0);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">Do you pay for health insurance?</h2>
        <p className="text-text-secondary text-body">
          Section 80D allows tax deductions for health insurance premiums paid for yourself, spouse, children, and parents.
        </p>
      </div>

      {/* Toggle */}
      <div className="space-y-3">
        <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
          Do you pay health insurance premiums?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleToggleHasHealthInsurance(true)}
            className={`flex-1 py-4 px-6 border-2 rounded-xl font-semibold transition-all ${
              hasHealthInsurance
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-background text-text-secondary'
            }`}
          >
            Yes, I pay premiums
          </button>
          <button
            type="button"
            onClick={() => handleToggleHasHealthInsurance(false)}
            className={`flex-1 py-4 px-6 border-2 rounded-xl font-semibold transition-all ${
              !hasHealthInsurance
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-background text-text-secondary'
            }`}
          >
            No, I don't
          </button>
        </div>
      </div>

      {hasHealthInsurance && (
        <div className="space-y-6 animate-fade-in-up pt-4 border-t border-border">
          {/* Health Premium for Self/Spouse/Children */}
          <div className="space-y-2">
            <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
              Premium for Self, Spouse, and Dependent Children
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={healthSelf > 0 ? healthSelf.toLocaleString('en-IN') : ''}
                onChange={handleHealthSelfChange}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <p className="text-caption text-text-secondary">
              Maximum deduction is ₹25,000.
            </p>
          </div>

          {/* Premium for Parents */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                Are your parents senior citizens (60+ years)?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateField('parentsSenior', true)}
                  className={`flex-1 py-3 px-4 border-2 rounded-xl font-semibold transition-all text-small ${
                    parentsSenior
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-background text-text-secondary'
                  }`}
                >
                  Yes, senior citizens (60+)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('parentsSenior', false)}
                  className={`flex-1 py-3 px-4 border-2 rounded-xl font-semibold transition-all text-small ${
                    !parentsSenior
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-background text-text-secondary'
                  }`}
                >
                  No, under 60 years
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
                Premium paid for Parents
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-body font-semibold text-text-secondary">₹</span>
                </div>
                <input
                  type="text"
                  value={healthParents > 0 ? healthParents.toLocaleString('en-IN') : ''}
                  onChange={handleHealthParentsChange}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <p className="text-caption text-text-secondary">
                Maximum limit: {parentsSenior ? '₹50,000' : '₹25,000'}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
