# 🎓 Teaching Guide: Recreating the Tax Calculator Web App Step-by-Step

This guide is designed for your upcoming teaching sessions. It breaks down the creation of the **56 Antigravity Tax Calculator** into **8 structured sessions**. Each session contains a learning objective, a copy-pasteable **AI Prompt**, and an explanation of the expected outcomes.

---

## 📅 Session Curriculum Overview

```
Session 1: Scaffolding the React App & 8-Step Wizard Layout
    │
    ▼
Session 2: Client-Side Auth (Register/Login Store)
    │
    ▼
Session 3: Premium Landing Page & SuperProfile Paywall Modal
    │
    ▼
Session 4: Admin Dashboard Bypass Panel (?admin=true)
    │
    ▼
Session 5: Income & Allowance Inputs (Steps 1 to 5)
    │
    ▼
Session 6: Deductions & Savings Inputs (Steps 6 to 8)
    │
    ▼
Session 7: Tax Slab Comparison Engine & PDF Downloader
    │
    ▼
Session 8: Profile Settings Dashboard & State Cleanups
```

---

## 📝 Step-by-Step Session Prompts

### 🔹 Session 1: Project Initialization & Wizard Layout
* **Learning Objective:** Scaffold the base React app and establish the responsive 8-step wizard shell with a sticky live preview card.
* **Student Focus:** Modern flex/grid CSS layouts and responsive sidebar state.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Create a React + Vite + TypeScript web application with a clean modern styling system (Vanilla CSS in App.css / index.css). 
> Implement a WizardShell layout which splits the viewport on desktop:
> 1. A main wizard body (left/center) that displays sequential wizard steps (Step 1 to Step 8) with back/next navigation and a visual progress indicator.
> 2. A sticky sidebar card (right) containing a "Live Preview" of the tax calculation which dynamically summarizes inputs in real-time.
> Ensure the design is premium (Outfit/Inter font, soft borders, clean shadows, HSL tailored variables). For now, render placeholder content for steps 3 to 8.
> ```

---

### 🔹 Session 2: Client-Side Authentication Store
* **Learning Objective:** Implement user sign-up and login pages and persist credentials on the client using a store.
* **Student Focus:** State management (Zustand or React Context) and browser storage keys.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Add an authentication layer to the application using a client-side mock store (Zustand or React Context). 
> 1. Create a Register screen asking for Name, Email, and Password.
> 2. Create a Login screen asking for Email and Password.
> 3. Save registered users in localStorage. Authenticate users locally by comparing input values against stored user profiles.
> 4. Guard access: If the user is not authenticated, they should not be able to view the WizardShell or LandingPage, and should be redirected to register/login.
> ```

---

### 🔹 Session 3: Premium Landing Page & SuperProfile Paywall
* **Learning Objective:** Build a beautiful presentation landing page that locks the tax calculator behind an external checkout page redirect.
* **Student Focus:** UX gating flows, window redirection listeners, and confirmation parameter processing.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Create a premium Landing Page that explains the benefits of the Indian Tax Calculator with interactive FAQ accordions. 
> 1. Add a primary "Start Your Tax Check" button. 
> 2. Implement the following access rules:
>    - If not logged in -> redirect to login/register.
>    - If logged in but not paid -> display a modern checkout overlay modal.
> 3. In the modal, provide a button linking to 'https://superprofile.bio/Tanveer2115/CxQblUOPax' which opens in the same tab.
> 4. Implement a hook: When the user is redirected back to the app with the query parameter `?payment=success` or `?status=success`, flag the user as 'paid' in the store, show a premium successful transaction modal, and route them directly into the calculator.
> ```

---

### 🔹 Session 4: Admin Bypass Dashboard
* **Learning Objective:** Develop a secret administrative control room to monitor, toggle, or wipe mock accounts.
* **Student Focus:** Query parameters, list filtering, and administrative overrides.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Add an Admin Dashboard component to manage registrations and mock billing.
> 1. Set the dashboard to render when the URL query contains `?admin=true` (e.g. localhost:5173/?admin=true).
> 2. Read the registered users list from localStorage and display them in a clean table showing: ID, Name, Email, Creation Date, Payment Status, and Active Status.
> 3. Provide buttons to:
>    - Toggle Payment Status (Paid / Unpaid)
>    - Toggle Access Status (Activated / Deactivated)
>    - Delete User account
> 4. Ensure that toggling a user to 'Paid' instantly lets them enter the tax calculator when they switch back to the main user view.
> ```

---

### 🔹 Session 5: Income & Allowance Stages (Steps 1 to 5)
* **Learning Objective:** Integrate form inputs for basic income metrics and rent/home loan exemptions.
* **Student Focus:** Dynamic input sanitization, radio-card states, and live state sync.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Expand the tax wizard to implement Steps 1 through 5:
> - Step 1: Age Selection. Render 3 radio cards with visual icons for "Individual (Under 60)", "Senior Citizen (60-80)", and "Super Senior (80+)".
> - Step 2: Salary Input. Collect Monthly Basic Salary and Annual Special Allowances with currency formatting (prefixing with ₹).
> - Step 3: HRA & Rent. Ask if the user lives in rented housing. If yes, collect rent paid and HRA allowance.
> - Step 4: LTA. Collect annual Leave Travel Allowance.
> - Step 5: Home Loan. Collect interest paid on home loans (Section 24b).
> Wire all input state changes to the Live Preview panel on the right so it updates calculations instantly.
> ```

---

### 🔹 Session 6: Tax Deductions (Steps 6 to 8)
* **Learning Objective:** Collect Section 80C, 80D, and other generic tax savings schemes.
* **Student Focus:** Nested form structures, upper limit constraints (e.g. 1.5 Lakh cap for 80C).

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Implement steps 6, 7, and 8 of the tax wizard:
> - Step 6: Section 80C Savings. Provide fields for Provident Fund (EPF/PPF), ELSS Mutual Funds, Life Insurance Premium, and School Tuition fees. Impose a visual cap of ₹1,500,000.
> - Step 7: Section 80D Health Insurance. Provide sliders or inputs for medical premiums for Self/Family and Senior Parents.
> - Step 8: Other Deductions. Collect savings for NPS (80CCD), Bank Interest (80TTA), and Charitable Donations (80G).
> Ensure all steps enforce clean numeric inputs and auto-save current step progress.
> ```

---

### 🔹 Session 7: Slab Calculator Engine & PDF Generator
* **Learning Objective:** Compute the final taxes for Old vs New regimes (FY 2025-26 rules) and print comparison summaries.
* **Student Focus:** Math processing logic, conditional slab offsets, and print stylesheet configurations.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Build the final result page of the calculator:
> 1. Implement the calculation logic comparing the Old Tax Regime and New Tax Regime for FY 2025-26:
>    - New Regime: Standard deduction ₹75,000. Tax rebate up to ₹7,00,000 (effectively zero tax up to 7L income). Apply slabs: 0-4L (0%), 4-8L (5%), 8-12L (10%), 12-16L (15%), 16-20L (20%), 20L+ (30%).
>    - Old Regime: Standard deduction ₹50,000. Exempt HRA, LTA, home loan interest, and 80C/80D deductions. Apply standard old regime slabs based on the selected age card.
> 2. Present a clear side-by-side slab breakdown comparison.
> 3. Display a prominent highlight banner: "Pick the New/Old Regime. You save ₹X,XXX!"
> 4. Add a "Download Report" button that uses clean print stylesheets (`window.print()`) styled specifically for paper layout structures.
> ```

---

### 🔹 Session 8: User Profile Panel & Reset Operations
* **Learning Objective:** Create a final configuration page where users can review profile details, change passwords, and clear calculator data.
* **Student Focus:** Dropdown navigation headers, password validation forms, and state resets.

> [!TIP]
> **Prompt to copy/paste:**
> ```text
> Add the finishing details:
> 1. In the header bar, create a user dropdown menu containing: Name, Email, "My Profile", and "Logout".
> 2. Clicking "My Profile" should render a settings section inside the main content view.
> 3. In this Profile page:
>    - Show current user details and a "Paid Member" badge.
>    - Allow updating user name and changing password (requiring current password validation).
>    - Provide a "Reset Calculator Data" button that wipes all wizard progress back to Step 1 without deleting the account.
> ```

---

## 💡 Teaching Tips & Exercises for Your Students

1. **Step-by-Step Evolution:** Let students run each prompt in order and see how the codebase changes. Highlight how the UI design remains consistent by leveraging predefined variables in `index.css`.
2. **Local vs Serverless Discussion:** Use the transition from SQLite (Sessions 1-2) to Mock LocalStorage (Sessions 3-4) to teach students about the differences between persistent server environments and Serverless hosts (like Vercel).
3. **Exemption Logic Validation:** Have students write unit tests validating the HRA exemption calculation:
   $$\text{HRA Exemption} = \min(\text{Actual HRA}, \text{Rent Paid} - 10\% \text{ Basic}, 50\% \text{ Basic (Metro)})$$
