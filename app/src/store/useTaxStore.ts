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
  updateField: <K extends keyof Omit<TaxState, 'updateField' | 'resetTaxData' | 'loadCalculations'>>(field: K, value: TaxState[K]) => void;
  resetTaxData: () => void;
  loadCalculations: (email: string) => Promise<void>;
}

const defaultValues = {
  ageCategory: 'below60' as AgeCategory,
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
};

import { dbService } from '../utils/dbService';

export const useTaxStore = create<TaxState>((set) => ({
  ...defaultValues,

  updateField: (field, value) => {
    set((state) => {
      const newState = { ...state, [field]: value };
      
      // Async database persistence
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser && !currentUser.isAdmin) {
        const { updateField, resetTaxData, loadCalculations, ...dataToSave } = newState;
        dbService.saveTaxData(currentUser.email, dataToSave).catch(console.error);
      }
      
      return newState;
    });
  },

  resetTaxData: () => {
    set((state) => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser && !currentUser.isAdmin) {
        dbService.saveTaxData(currentUser.email, defaultValues).catch(console.error);
      }
      return { ...state, ...defaultValues };
    });
  },

  loadCalculations: async (email) => {
    try {
      const data = await dbService.loadTaxData(email);
      if (data) {
        set((state) => ({ ...state, ...data }));
      }
    } catch (err) {
      console.error('Failed to load calculations:', err);
    }
  }
}));