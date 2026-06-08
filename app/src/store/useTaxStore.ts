import { create } from 'zustand';

export type AgeCategory = 'below60' | 'senior60to80' | 'superSenior80plus';

export interface TaxState {
  // Step 1: Basic Info
  ageCategory: AgeCategory;

  // Step 2: Income
  monthlyTakeHome: number;
  otherIncome: number;

  // Step 3: Salary Structure
  basicSalary: number;
  hraReceived: number;
  pfDeduction: number;

  // Step 4: Rent
  paysRent: boolean;
  monthlyRent: number;
  city: string;
  isMetro: boolean;

  // Step 5: Investments
  has80C: boolean;
  total80C: number;

  // Step 6: Health Insurance
  hasHealthInsurance: boolean;
  healthSelf: number;
  healthParents: number;
  parentsSenior: boolean;

  // Step 7: Home Loan
  hasHomeLoan: boolean;
  homeLoanInterest: number;

  // Step 8: Other Deductions
  hasNPS: boolean;
  npsAmount: number;
  hasEducationLoan: boolean;
  educationLoanInterest: number;
  hasProfessionalTax: boolean;
  professionalTaxAmount: number;

  // Actions
  updateField: <K extends keyof Omit<TaxState, 'updateField'>>(field: K, value: TaxState[K]) => void;
}

export const useTaxStore = create<TaxState>((set) => ({
  // Default values
  ageCategory: 'below60',
  monthlyTakeHome: 0,
  otherIncome: 0,
  basicSalary: 0,
  hraReceived: 0,
  pfDeduction: 0,
  paysRent: false,
  monthlyRent: 0,
  city: '',
  isMetro: false,
  has80C: false,
  total80C: 0,
  hasHealthInsurance: false,
  healthSelf: 0,
  healthParents: 0,
  parentsSenior: false,
  hasHomeLoan: false,
  homeLoanInterest: 0,
  hasNPS: false,
  npsAmount: 0,
  hasEducationLoan: false,
  educationLoanInterest: 0,
  hasProfessionalTax: false,
  professionalTaxAmount: 0,

  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
}));