# Phased Execution Plan: TaxCalc India (FY 2025-26)

This document outlines a phased development plan for the TaxCalc India web application. Each phase is scoped to be small enough for a single session and guarantees a runnable, testable application at the end of it.

## Phase 1: Project Scaffolding & Landing Page
**Goal:** Initialize the project and build the static entry point.
* **Tasks:**
  * Scaffold a React + TypeScript project (e.g., using Vite).
  * Install and configure Tailwind CSS.
  * Define the color palette and typography in the Tailwind config based on the PRD.
  * Build the Landing Page (Hero section, trust badges, dummy preview card, footer).
  * Setup a basic router or state toggle to transition from the Landing Page to the Wizard.
* **Runnable State:** You can open the app in a browser, view the fully styled landing page, and verify responsive layout (desktop split vs mobile single-column).

## Phase 2: State Management & Wizard Shell
**Goal:** Establish the data layer and the navigation shell for the step-by-step wizard.
* **Tasks:**
  * Setup global state management (Zustand or React Context) using the `TaxState` interface defined in the PRD.
  * Build the Wizard Shell component (Progress Bar, Next/Back buttons, FAQ accordion placeholder).
  * Implement Step 1 (Age Category) and Step 2 (Monthly Take-Home Salary) UI components.
  * Bind these inputs to the global state.
* **Runnable State:** You can click "Start" on the landing page, see the Wizard UI, answer the first two questions, use Next/Back buttons, and verify (via dev tools or console) that the state is capturing the data.

## Phase 3: Core Tax Engine & Live Preview
**Goal:** Implement the base calculation logic and visualize it in real-time.
* **Tasks:**
  * Implement `calculateNewRegimeTax`.
  * Implement the baseline of `calculateOldRegimeTax` (handling only gross income, standard deduction, and Rebate 87A — no extra deductions yet).
  * Build the Live Preview Panel component (Income Summary, Estimate blocks, Mini Slab Table).
  * Dock the Live Preview Panel to the right (desktop) or bottom (mobile).
  * Connect the Live Preview to the state and tax engine.
* **Runnable State:** As you enter your age and take-home salary in the wizard, the Live Preview Panel instantly calculates and displays the base tax for both regimes side-by-side. 

## Phase 4: Salary Components & HRA Exemption (Steps 3-5)
**Goal:** Add complex income breakdown and rent-based deductions.
* **Tasks:**
  * Implement UI for Step 3 (Other Income), Step 4 (Salary Structure), and Step 5 (Rent Details).
  * Implement the `calculateHRAExemption` function.
  * Update the Old Regime calculation engine to process HRA and Section 80GG (Rent without HRA) logic.
  * Wire the new steps to the global state and live preview.
* **Runnable State:** The wizard now has 5 steps. Entering basic salary, HRA, and rent dynamically updates the Old Regime tax in the preview panel, accurately reflecting HRA/80GG exemptions.

## Phase 5: Investments & Health Insurance (Steps 6-7)
**Goal:** Integrate the most common tax-saving instruments.
* **Tasks:**
  * Implement UI for Step 6 (80C Investments) and Step 7 (Health Insurance).
  * Implement the `get80DLimit` function based on age.
  * Update the Old Regime calculation engine to subtract 80C (capped at 1.5L) and 80D limits.
  * Ensure PF entered in Step 4 automatically counts towards the 80C total limit.
* **Runnable State:** You can progress through 7 steps. Adding PPF, ELSS, or health insurance premiums visibly drops the Old Regime tax burden in the Live Preview in real-time, respecting all statutory caps.

## Phase 6: Edge Cases & Remaining Deductions (Step 8)
**Goal:** Finalize the tax calculation engine with all remaining sections.
* **Tasks:**
  * Implement UI for Step 8 (Other Deductions: Home loan, Education loan, NPS, Professional Tax, etc.).
  * Implement `get80TTALimit` (interest income deduction).
  * Finalize the `calculateOldRegimeTax` engine by wiring in Section 24, 80E, 80CCD(1B), 80TTA/80TTB, etc.
  * Add UI validation warnings (e.g., negative numbers, exceeding max caps).
* **Runnable State:** The full 8-step wizard is functional. 100% of the tax logic is applied. The Live Preview accurately represents the final tax liability for any scenario covered in the PRD.

## Phase 7: Final Result Page & Polish
**Goal:** Build the final payoff screen and refine the UX.
* **Tasks:**
  * Build the Result Page component (Big Winner Card, Detailed Side-by-Side Comparison Table, Slab Breakdown).
  * Implement the "Personalized Education Section" and "Practical Suggestions" based on user inputs.
  * Add "Start Over" and "Share Result" buttons.
  * Polish animations (smooth number count-ups, step transitions) and ensure strict adherence to accessibility (WCAG 2.1 AA) and responsive design breakpoints.
* **Runnable State:** The entire application is complete. Completing the wizard routes to a polished, highly detailed final report page. The app is ready for user testing and deployment.