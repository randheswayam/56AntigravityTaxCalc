import { useTaxStore } from '../../store/useTaxStore';

export default function Step5RentDetails() {
  const { paysRent, monthlyRent, isMetro, updateField } = useTaxStore();

  const handleTogglePaysRent = (value: boolean) => {
    updateField('paysRent', value);
    if (!value) {
      updateField('monthlyRent', 0);
      updateField('isMetro', false);
    }
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField('monthlyRent', value ? parseInt(value, 10) : 0);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">Tell us about your rent details</h2>
        <p className="text-text-secondary text-body">
          We use this to calculate either your HRA exemption (Section 10(13A)) or your rent deduction (Section 80GG).
        </p>
      </div>

      {/* Pays Rent Toggle */}
      <div className="space-y-3">
        <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
          Do you pay rent for your accommodation?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTogglePaysRent(true)}
            className={`flex-1 py-4 px-6 border-2 rounded-xl font-semibold transition-all ${
              paysRent
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-background text-text-secondary'
            }`}
          >
            Yes, I pay rent
          </button>
          <button
            type="button"
            onClick={() => handleTogglePaysRent(false)}
            className={`flex-1 py-4 px-6 border-2 rounded-xl font-semibold transition-all ${
              !paysRent
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-background text-text-secondary'
            }`}
          >
            No, I live in my own house
          </button>
        </div>
      </div>

      {paysRent && (
        <div className="space-y-6 animate-fade-in-up pt-4 border-t border-border">
          {/* Monthly Rent Input */}
          <div className="space-y-2">
            <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
              Monthly Rent Paid
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-body font-semibold text-text-secondary">₹</span>
              </div>
              <input
                type="text"
                value={monthlyRent > 0 ? monthlyRent.toLocaleString('en-IN') : ''}
                onChange={handleRentChange}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Metro vs Non-Metro selection */}
          <div className="space-y-3">
            <div>
              <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
                City Type
              </label>
              <p className="text-caption text-text-secondary">
                Legally, only Delhi, Mumbai, Kolkata, and Chennai qualify as Metro for HRA.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => updateField('isMetro', true)}
                className={`flex-1 py-3 px-4 border-2 rounded-xl font-semibold transition-all text-small ${
                  isMetro
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-background text-text-secondary'
                }`}
              >
                Metro City
                <span className="block text-caption font-normal mt-0.5 opacity-80">(Delhi, Mumbai, Kolkata, Chennai)</span>
              </button>
              <button
                type="button"
                onClick={() => updateField('isMetro', false)}
                className={`flex-1 py-3 px-4 border-2 rounded-xl font-semibold transition-all text-small ${
                  !isMetro
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-background text-text-secondary'
                }`}
              >
                Non-Metro City
                <span className="block text-caption font-normal mt-0.5 opacity-80">(Bangalore, Pune, Hyd, and others)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
