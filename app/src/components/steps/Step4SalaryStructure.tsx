import { useTaxStore } from '../../store/useTaxStore';

export default function Step4SalaryStructure() {
  const { basicSalary, hraReceived, pfDeduction, updateField } = useTaxStore();

  const handleNumericChange = (field: 'basicSalary' | 'hraReceived' | 'pfDeduction') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateField(field, value ? parseInt(value, 10) : 0);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">Provide your salary structure details</h2>
        <p className="text-text-secondary text-body">
          These details are required to calculate your eligible HRA exemptions and PF tax savings. You can find them on your salary slip.
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Salary */}
        <div className="space-y-2">
          <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
            Basic Salary (Monthly)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-body font-semibold text-text-secondary">₹</span>
            </div>
            <input
              type="text"
              value={basicSalary > 0 ? basicSalary.toLocaleString('en-IN') : ''}
              onChange={handleNumericChange('basicSalary')}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
          <p className="text-caption text-text-secondary">
            Basic Salary is usually 40% - 50% of your gross monthly CTC.
          </p>
        </div>

        {/* HRA Received */}
        <div className="space-y-2">
          <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
            HRA Received (Monthly)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-body font-semibold text-text-secondary">₹</span>
            </div>
            <input
              type="text"
              value={hraReceived > 0 ? hraReceived.toLocaleString('en-IN') : ''}
              onChange={handleNumericChange('hraReceived')}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
          <p className="text-caption text-text-secondary">
            House Rent Allowance. Leave blank or 0 if you don't receive HRA.
          </p>
        </div>

        {/* PF Deduction */}
        <div className="space-y-2">
          <label className="text-caption font-semibold text-text-secondary uppercase tracking-wider block">
            Employee PF Contribution (Monthly)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-body font-semibold text-text-secondary">₹</span>
            </div>
            <input
              type="text"
              value={pfDeduction > 0 ? pfDeduction.toLocaleString('en-IN') : ''}
              onChange={handleNumericChange('pfDeduction')}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 text-body border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
          <p className="text-caption text-text-secondary">
            Deducted monthly under EPF from your paycheck. Counts towards your Section 80C limit.
          </p>
        </div>
      </div>
    </div>
  );
}
