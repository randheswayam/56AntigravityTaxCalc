import { useTaxStore } from '../../store/useTaxStore';

export default function Step2Income() {
  const { monthlyTakeHome, updateField } = useTaxStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField('monthlyTakeHome', value ? parseInt(value, 10) : 0);
  };

  const formattedValue = monthlyTakeHome > 0 ? monthlyTakeHome.toLocaleString('en-IN') : '';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">What amount lands in your bank account every month?</h2>
        <p className="text-text-secondary text-body">
          This is your in-hand salary after all deductions. Don't worry about CTC or gross salary.
        </p>
      </div>

      <div className="space-y-2">
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
          Not sure? Check your last salary slip or bank statement.
        </p>
        
        {monthlyTakeHome > 0 && monthlyTakeHome < 1000 && (
          <p className="text-small text-error">Amount should be at least ₹1,000</p>
        )}
        {monthlyTakeHome > 1000000 && (
          <p className="text-small text-warning">Please verify this is your monthly amount, not annual.</p>
        )}
      </div>
    </div>
  );
}