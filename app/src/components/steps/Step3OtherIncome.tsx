import { useTaxStore } from '../../store/useTaxStore';

export default function Step3OtherIncome() {
  const { otherIncome, updateField } = useTaxStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField('otherIncome', value ? parseInt(value, 10) : 0);
  };

  const formattedValue = otherIncome > 0 ? otherIncome.toLocaleString('en-IN') : '';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">Do you have any other annual income?</h2>
        <p className="text-text-secondary text-body">
          Include bank interest (saving/FD), freelance income, rental returns, or any other income earned in the year.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
          Total Other Income (Annual)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-h3 font-semibold text-text-secondary">₹</span>
          </div>
          <input
            type="text"
            value={formattedValue}
            onChange={handleChange}
            placeholder="0"
            className="w-full pl-10 pr-4 py-4 text-h3 border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          />
        </div>
        <p className="text-small text-text-secondary">
          Leave it as 0 if you don't have other income sources.
        </p>
      </div>
    </div>
  );
}
