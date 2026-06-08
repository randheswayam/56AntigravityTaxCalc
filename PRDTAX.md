# Product Requirements Document (PRD)

## India Tax Regime Chooser (FY 2025-26)

### "Start from Salary in Bank Account, Not CTC"

---

# 1. Product Overview

## Product Name

**TaxWise India** (working title)

## One-line Value Proposition

> "Find out which tax regime saves you more money in under 5 minutes."

Most Indian tax calculators start with CTC, gross salary, taxable income, exemptions, and tax jargon.

Most salaried employees don't know any of those.

They know:

* How much salary comes into their bank account
* Whether they pay rent
* Whether PF is deducted
* Whether they have a home loan

This product reverses the process.

Instead of asking:

> "Enter gross salary and deductions under Section 80C"

It asks:

> "How much money lands in your bank account every month?"

and gradually reconstructs taxable income.

---

# 2. Target Audience

## Primary Users

### Freshers (21–28)

First job.

Confused about:

* Old regime
* New regime
* Form 16
* HRA
* 80C

### Mid-career Salaried Employees (28–45)

Need:

* Regime comparison
* Savings suggestions

### Senior Salaried Employees

Need:

* Accurate old regime calculations
* Home loan deductions
* HRA calculations

---

# 3. Product Goals

### Goal 1

Tell users:

> "Choose Old Regime"

or

> "Choose New Regime"

### Goal 2

Show exact savings amount.

Example:

> New Regime saves ₹22,340/year

### Goal 3

Educate users.

Example:

> Your HRA exemption reduced taxable income by ₹96,000.

### Goal 4

Privacy-first.

Everything calculated in browser.

No login.

No storage.

---

# 4. Design Principles

## Design Language

Minimal

Modern

Trustworthy

Professional

Not government-like.

Not Excel-like.

Not CA software.

Think:

* Stripe
* Linear
* Notion
* Zerodha

---

# 5. Landing Page

---

## Hero Section

### Headline

# Find Out Which Tax Regime Saves You More Money

### Subheading

Compare Old vs New Tax Regime for FY 2025-26 in minutes.

No CTC needed.
Start with your monthly salary.

### CTA

Start Tax Check →

---

## Right Side Preview Card

Mock result:

Old Regime Tax: ₹42,500

New Regime Tax: ₹28,700

Savings: ₹13,800

Recommendation:

✅ Choose New Regime

---

## Trust Features

### Privacy First

Everything runs in browser.

### No Login

No account needed.

### FY 2025-26 Updated

Latest tax rules.

---

## How It Works

### Step 1

Tell us about your salary.

### Step 2

Tell us about rent, PF and investments.

### Step 3

Get your best regime.

---

## FAQ Section

Common questions:

* Is this free?
* Is my data stored?
* How accurate is this?
* Does it work for salaried employees?

---

# 6. Wizard Flow

---

# Progress UI

Top bar:

Step 1 of 8

Progress indicator:

● ● ● ○ ○ ○ ○ ○

---

# Layout

Two-column desktop.

## Left

Question wizard.

## Right

Live Tax Preview.

---

# 7. Live Preview Panel

Updates after every answer.

Shows:

## Income

Monthly Salary

Annual Salary Estimate

PF

Bonus

Other Income

---

## Deductions

80C

80D

Home Loan

HRA

Professional Tax

NPS

---

## Tax Comparison

| Regime | Tax |
| ------ | --- |
| Old    | ₹XX |
| New    | ₹YY |

---

## Slab Table

Detailed slab-by-slab tax.

Example:

### New Regime

0–4L → 0

4–8L → ₹20,000

8–12L → ₹40,000

etc.

---

# 8. Wizard Questions

---

# STEP 1

## Salary

Question:

How much money usually lands in your bank account every month?

Input:

₹

Validation:

10,000–10,00,000

FAQ

### Why not ask CTC?

Most people don't know CTC.

We estimate salary from actual take-home income.

---

# STEP 2

## PF

Question

Does your company deduct PF?

Options:

* Yes
* No
* Not sure

If Yes

Question:

Approx PF deduction/month?

---

FAQ

How do I check PF?

Look at salary slip.

Usually listed as EPF.

---

# STEP 3

## Bonus

Question

Do you receive annual bonus?

Options

* No
* Yes

If Yes

Bonus amount.

---

# STEP 4

## Rent & HRA

Question

Do you live in rented accommodation?

Options:

* Yes
* No

If Yes

Ask:

Monthly Rent

City Type:

* Metro
* Non-Metro

Ask:

Do you receive HRA in salary?

* Yes
* No
* Not sure

---

FAQ

What's HRA?

House Rent Allowance paid by employer.

Usually visible on salary slip.

---

# STEP 5

## Tax Saving Investments

Question

Did you invest in any of these?

Checklist:

* EPF
* PPF
* ELSS
* Life Insurance
* Tax Saving FD
* Sukanya

Input total amount.

Map to:

80C

Max ₹1.5 lakh.

---

FAQ

What's 80C?

Government-approved tax-saving investments.

---

# STEP 6

## Health Insurance

Question

Did you pay health insurance premium?

Options

* Self/family
* Parents
* Both
* No

Collect:

Premium amounts.

Map:

80D

---

# STEP 7

## Home Loan

Question

Do you have a home loan?

Options:

Yes/No

If Yes

Ask:

Interest paid this year

Principal repaid

Self occupied?

---

# STEP 8

## Other Tax Benefits

Ask:

### NPS

Contribution amount.

### Savings Interest

Interest earned.

### FD Interest

Interest earned.

### Professional Tax

Deducted?

Amount.

---

# 9. Tax Engine

---

# Financial Year

FY 2025-26

AY 2026-27

---

# Old Regime

## Standard Deduction

₹50,000

---

## Basic Exemption

Below 60:

₹2.5 lakh

60–80:

₹3 lakh

80+:

₹5 lakh

([cleartax][1])

---

## Tax Slabs

### Below 60

0–2.5L = 0%

2.5–5L = 5%

5–10L = 20%

10L+ = 30%

([cleartax][2])

---

## Rebate

Section 87A

Up to ₹5 lakh taxable income.

Maximum rebate:

₹12,500

([cleartax][2])

---

# New Regime

## Standard Deduction

₹75,000

([cleartax][2])

---

## Basic Exemption

₹4 lakh

All ages

([cleartax][2])

---

## Slabs FY 2025-26

| Income    | Rate |
| --------- | ---- |
| 0–4L      | 0%   |
| 4–8L      | 5%   |
| 8–12L     | 10%  |
| 12–16L    | 15%  |
| 16–20L    | 20%  |
| 20–24L    | 25%  |
| Above 24L | 30%  |

([cleartax][2])

---

## Rebate

Section 87A

Up to ₹60,000 rebate.

Taxable income up to ₹12 lakh becomes tax-free.

For salaried users with ₹75,000 standard deduction, effective zero-tax salary can reach approximately ₹12.75 lakh.

Marginal relief must be implemented around the ₹12 lakh threshold.

([cleartax][2])

---

## Health & Education Cess

4%

Both regimes.

([cleartax][1])

---

# 10. Supported Deductions

## Old Regime

### Standard Deduction

₹50,000

### HRA Exemption

Formula:

Minimum of:

1. Actual HRA received
2. Rent – 10% Salary
3. 50% salary (metro)
4. 40% salary (non-metro)

### 80C

Maximum:

₹1.5 lakh

Includes:

* EPF
* PPF
* ELSS
* LIC
* Tax Saver FD
* Sukanya

### 80CCD(1B)

NPS

Additional ₹50,000

### 80D

Health Insurance

### Home Loan Interest

Section 24(b)

Up to ₹2 lakh

(Self-occupied)

### Professional Tax

Deductible

### Savings Interest

80TTA

Up to ₹10,000

---

# New Regime Allowed Items

Allow:

### Standard Deduction

₹75,000

### Employer NPS Contribution

80CCD(2)

(if implemented)

Disallow:

* HRA
* 80C
* 80D
* Home loan interest (self occupied)
* 80TTA

---

# 11. Result Screen

Hero Card

---

# Recommended Regime

✅ Choose Old Regime

You save ₹28,460/year

compared to New Regime.

---

# Comparison

| Category          | Old | New |
| ----------------- | --- | --- |
| Taxable Income    |     |     |
| Tax Before Rebate |     |     |
| Rebate            |     |     |
| Cess              |     |     |
| Final Tax         |     |     |

---

# Tax Slab Breakdown

Expandable.

---

# Personalized Insights

Examples:

### HRA Impact

Your rent reduced taxable income by ₹92,000.

### 80C Impact

Your investments saved approximately ₹31,200.

### Home Loan Impact

Home loan interest reduced tax by ₹42,000.

---

# Actionable Suggestions

Example:

### Increase 80C

You have only used ₹60,000 of ₹1.5 lakh limit.

Potential additional savings:

₹18,720

---

### Add NPS

Investing ₹50,000 in NPS may save approximately ₹15,600.

---

# 12. Validation Rules

Salary cannot be negative.

Rent cannot exceed annual salary.

80C capped at ₹1.5 lakh.

80CCD(1B) capped at ₹50,000.

80TTA capped at ₹10,000.

Home loan interest capped at ₹2 lakh.

Health insurance caps based on age category.

---

# 13. Technical Requirements

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* ShadCN UI
* Recharts

---

## State Management

Zustand

---

## Calculations

Client-side only.

No API required.

---

## Privacy

No account.

No cookies.

No tracking.

No server-side storage.

---

# 14. Future Features (Out of Scope v1)

Do NOT include:

* Capital gains
* Crypto
* Freelance income
* Business income
* Surcharge
* HUF
* ITR filing
* PDF export
* Tax filing service

---

# Definition of Done

A user with no tax knowledge should:

1. Open landing page.
2. Enter monthly salary.
3. Answer plain-English questions.
4. Receive accurate old vs new regime comparison.
5. Understand why one regime is better.
6. Leave with confidence about which regime to select.

This PRD is sufficiently detailed for a developer, AI coding assistant, or product team to build the complete application from scratch, with FY 2025-26 tax rules and salaried-user-focused tax calculations.

[1]: https://cleartax.in/s/income-tax-slab-for-senior-citizen?utm_source=chatgpt.com "Income Tax Slab for Senior Citizens FY 2025-26 | Old and New Regime Rates"
[2]: https://cleartax.in/guide/taxes?utm_source=chatgpt.com "Income Tax Slabs and Rates - Old and New Tax Regime FY 2025-26 (AY 2026-27)"
