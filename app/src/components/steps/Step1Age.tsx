import { User, Users, GraduationCap } from 'lucide-react';
import { useTaxStore, type AgeCategory } from '../../store/useTaxStore';

export default function Step1Age() {
  const { ageCategory, updateField } = useTaxStore();

  const options: { id: AgeCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'below60', label: 'Below 60 years', icon: <User className="w-6 h-6" /> },
    { id: 'senior60to80', label: '60 to 80 years (Senior Citizen)', icon: <Users className="w-6 h-6" /> },
    { id: 'superSenior80plus', label: 'Above 80 years (Super Senior Citizen)', icon: <GraduationCap className="w-6 h-6" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-h2 mb-2">How old are you?</h2>
        <p className="text-text-secondary text-body">Your age affects tax slabs and deductions available to you.</p>
      </div>

      <div className="space-y-4">
        {options.map((option) => {
          const isSelected = ageCategory === option.id;
          return (
            <button
              key={option.id}
              onClick={() => updateField('ageCategory', option.id)}
              className={`w-full flex items-center p-5 rounded-xl border-2 text-left transition-all duration-200 ease-in-out ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-sm transform -translate-y-0.5' 
                  : 'border-border bg-card hover:border-primary-light hover:shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              }`}>
                {option.icon}
              </div>
              <span className={`font-semibold text-body ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}