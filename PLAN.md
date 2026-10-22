# Plan: Nicotine Impact Visualizer

## 1. Project Overview
A web-based interactive tool designed to visualize the physiological and financial impact of nicotine consumption (vaping and cigarettes). The goal is to transform abstract usage numbers into concrete data regarding health risks and long-term consequences.

## 2. Core Features

### A. User Input Modules
The application will collect data through a clean, user-friendly interface.

#### 1. Vaping Module
* **Frequency:** Number of hits/puffs per day.
* **Device Type:** (e.g., Disposable, Pod System, Mod/Tank).
* **Nicotine Concentration:** mg/mL of nicotine.
* **E-Liquid Flavor/Type:** (To track variety/complexity, though primary focus is on nicotine/VG/PG content).
* **Volume:** Average milliliter amount used per day.

#### 2. Cigarette Module
* **Quantity:** Number of cigarettes smoked per day.
* **Type:** Brand/Strength (for smoke density calculations).

### B. The "Damage" Engine (Calculation Logic)
This backend/logic layer will translate inputs into health metrics. 
*Note: This will use statistical averages and medical estimates (not clinical diagnoses).*

* **Nicotine Load:** Total mg of nicotine absorbed daily.
* **Chemical Exposure:** Estimated volume of tar, carbon monoxide, and heavy metals (for cigarettes).
* **Lungs/Respiratory:** Estimated liters of aerosol/smoke inhaled per day.
* **Cardiovascular:** Estimated heart rate elevation/blood pressure impact.
* **Financial Cost:** Projected monthly/yearly/lifetime cost based on current usage.

### C. Visualizer Dashboard (The "Impact" View)
The core value of the app. Instead of just text, we will use:
* **The "Lungs" Visualizer:** A graphic representing lung capacity or "clean air" vs. "smoke/aerosol" volume.
* **The "Clock" Component:** A visualization of how much time is spent "in a hit" or how many hours of life are statistically impacted.
* **The "Wallet" Depletion:** A real-time counter of money "burned" or spent.
* **Comparative Risk Gauge:** A speedometer-style UI showing the user's current "Risk Level" (Low, Moderate, High, Critical).

## 3. Technical Stack (Proposed)
* **Frontend:** React.js or Next.js (for smooth state management).
* **Styling:** Tailwind CSS (for a modern, dark-themed, "medical/impactful" UI).
* **Data Visualization:** Framer Motion (for animations) or Recharts/D3.js (for complex charts).
* **Deployment:** Vercel or Netlify.

## 4. Implementation Phases

### Phase 1: Data Modeling & Logic (MVP)
- [ ] Define the mathematical formulas for nicotine/smoke conversion.
- [ ] Build the input forms with validation.
- [ ] Create a basic text-based summary of "Impact."

### Phase 2: Visual Development
- [ ] Implement the "Financial Loss" counter.
- [ ] Develop the "Lungs/Aerosol" visualizer using CSS/SVG.
- [ ] Build the "Risk Gauge" component.

### Phase 3: Refinement & UX
- [ ] Add "What If" mode (e.g., "What if you cut down 50%?").
- [ ] Implement dark/light mode (Dark mode preferred for "impact" feel).
- [ ] Add "Resource Links" (Help for quitting) to provide a constructive outlet for the user.

## 5. Ethical Disclaimer
**Important:** The application must include a prominent disclaimer stating: *"This tool is for educational/awareness purposes only and does not constitute medical advice. Calculations are estimates based on statistical averages."*
