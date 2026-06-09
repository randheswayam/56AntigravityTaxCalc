import { type AgeCategory } from '../store/useTaxStore';

export interface TaxResult {
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  totalDeductions?: number;
}

export function calculateNewRegimeTax(grossIncome: number, _ageCategory: AgeCategory): TaxResult {
  // Step 1: Apply Standard Deduction
  const standardDeduction = 75000;
  let taxableIncome = Math.max(0, grossIncome - standardDeduction);

  // Step 2: Calculate tax using slabs
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 }
  ];

  let tax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabAmount = Math.min(remainingIncome, slab.limit - previousLimit);
    if (slabAmount <= 0) break;
    tax += slabAmount * slab.rate;
    remainingIncome -= slabAmount;
    previousLimit = slab.limit;
  }

  // Step 3: Apply Section 87A Rebate
  let rebate = 0;
  if (taxableIncome <= 1200000) {
    rebate = Math.min(tax, 60000);
  }
  tax -= rebate;

  // Step 4: Apply 4% Cess
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    taxableIncome,
    taxBeforeRebate: tax + rebate,
    rebate,
    taxAfterRebate: tax,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0
  };
}

export function calculateHRAExemption(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): number {
  const annualBasic = basicSalary * 12;
  const annualHRA = hraReceived * 12;
  const annualRent = rentPaid * 12;

  // Condition 1: Actual HRA received
  const condition1 = annualHRA;

  // Condition 2: Rent paid minus 10% of basic
  const condition2 = Math.max(0, annualRent - 0.10 * annualBasic);

  // Condition 3: 50% for metro, 40% for non-metro of basic
  const metroPercentage = isMetro ? 0.50 : 0.40;
  const condition3 = metroPercentage * annualBasic;

  // Exemption is the least of the three
  return Math.min(condition1, condition2, condition3);
}

export function calculate80GGDeduction(
  grossIncome: number,
  rentPaid: number
): number {
  const annualRent = rentPaid * 12;
  
  // Condition 1: ₹5,000/month (₹60,000 annually)
  const condition1 = 60000;
  
  // Condition 2: 25% of gross income
  const condition2 = 0.25 * grossIncome;
  
  // Condition 3: Rent paid minus 10% of gross income
  const condition3 = Math.max(0, annualRent - 0.10 * grossIncome);

  // Deduction is the least of the three
  return Math.min(condition1, condition2, condition3);
}

export function calculateOldRegimeTax(
  grossIncome: number, 
  ageCategory: AgeCategory,
  state: any = {}
): TaxResult {
  // Step 1: Apply Standard Deduction
  const standardDeduction = 50000;

  // Step 2: Calculate HRA Exemption or 80GG Rent Deduction (mutually exclusive)
  let hraExemption = 0;
  let section80GG = 0;

  if (state.paysRent && state.monthlyRent > 0) {
    if (state.hraReceived > 0) {
      hraExemption = calculateHRAExemption(
        state.basicSalary || 0,
        state.hraReceived || 0,
        state.monthlyRent || 0,
        state.isMetro || false
      );
    } else {
      section80GG = calculate80GGDeduction(grossIncome, state.monthlyRent || 0);
    }
  }

  // Step 3: Calculate PF (contributes to 80C)
  const annualPF = (state.pfDeduction || 0) * 12;
  const total80C = Math.min((state.total80C || 0) + annualPF, 150000);

  // Future sections (80D, 24, etc.) are pre-structured here
  const section80D = Math.min(state.healthSelf || 0, 25000) + Math.min(state.healthParents || 0, state.parentsSenior ? 50000 : 25000);
  const section24 = Math.min(state.homeLoanInterest || 0, 200000);
  const npsAmount = Math.min(state.npsAmount || 0, 50000); // 80CCD(1B)
  const educationLoanInterest = state.educationLoanInterest || 0; // 80E
  const professionalTax = Math.min(state.professionalTaxAmount || 0, 2500);

  const totalDeductions = standardDeduction + 
    total80C + 
    section80D + 
    section24 + 
    npsAmount + 
    educationLoanInterest + 
    professionalTax + 
    hraExemption + 
    section80GG;

  let taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Step 4: Get age-based slabs
  const slabs = getOldRegimeSlabs(ageCategory);

  // Step 5: Calculate tax
  let tax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabAmount = Math.min(remainingIncome, slab.limit - previousLimit);
    if (slabAmount <= 0) break;
    tax += slabAmount * slab.rate;
    remainingIncome -= slabAmount;
    previousLimit = slab.limit;
  }

  // Step 6: Apply Section 87A Rebate
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = Math.min(tax, 12500);
  }
  tax -= rebate;

  // Step 7: Apply 4% Cess
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    taxableIncome,
    totalDeductions,
    taxBeforeRebate: tax + rebate,
    rebate,
    taxAfterRebate: tax,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0
  };
}

function getOldRegimeSlabs(ageCategory: AgeCategory) {
  if (ageCategory === 'superSenior80plus') {
    return [
      { limit: 500000, rate: 0 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];
  } else if (ageCategory === 'senior60to80') {
    return [
      { limit: 300000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];
  } else {
    // Below 60
    return [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];
  }
}