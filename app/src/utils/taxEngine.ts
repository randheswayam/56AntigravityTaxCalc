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

export function calculateOldRegimeTax(
  grossIncome: number, 
  ageCategory: AgeCategory,
  _deductions: any = {} // We'll type this properly later, using baseline for now
): TaxResult {
  // Step 1: Apply Standard Deduction
  const standardDeduction = 50000;

  // For Phase 3 baseline, we just use standard deduction
  // In later phases, we will sum up all real deductions
  const totalDeductions = standardDeduction;

  let taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Step 3: Get age-based slabs
  const slabs = getOldRegimeSlabs(ageCategory);

  // Step 4: Calculate tax
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

  // Step 5: Apply Section 87A Rebate
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = Math.min(tax, 12500);
  }
  tax -= rebate;

  // Step 6: Apply 4% Cess
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