# Plan: Nicotine Impact Visualizer

## 1. Project overview
A web-based interactive tool for visualizing the physiological and financial impact of nicotine consumption (vaping and cigarettes). The goal is to turn abstract usage numbers into concrete, understandable estimates.

## 2. Core features

### A. User input modules
- [x] Vaping: puffs/day, 9 device profiles, nicotine concentration, e-liquid volume.
- [x] Cigarettes: cigarettes/day and strength.
- [x] Settings: local currency, e-liquid/pack costs, years of use and age.
- [x] Local autosave, shareable links and reset.

### B. Calculation engine
- [x] Absorbed nicotine estimate.
- [x] Tar and carbon monoxide estimates for cigarettes.
- [x] Aerosol/smoke volume estimate.
- [x] Cardiovascular estimates.
- [x] Daily, monthly, yearly, 10-year and until-age-80 cost projections.
- [x] Time-per-day/year, activity equivalencies and life-lost estimate.
- [x] Transparent relative risk score with factor breakdown.
- [x] Defensive input normalization (no NaN/Infinity).

### C. Visual dashboard
- [x] Summary metric cards.
- [x] Animated respiratory/lung visualizer.
- [x] Financial impact and investment opportunity-cost views.
- [x] Time donuts, timeline and live counters.
- [x] Risk gauge and factor bars.
- [x] Responsive dark UI with accessible focus states and reduced-motion support.

### D. What-if scenarios
- [x] Current usage baseline.
- [x] Cut down 50%.
- [x] Quit vaping only / quit smoking only (when applicable).
- [x] Quit entirely.
- [x] Side-by-side comparison table and savings estimates.

### E. Usability and distribution
- [x] Welcome/onboarding flow and sample report.
- [x] 40+ currencies.
- [x] Markdown report export.
- [x] Methodology and source accordion.
- [x] Quitting resources.
- [x] CI workflow for lint, type-check and build.
- [x] MIT license.

## 3. Ethical requirements
- [x] Prominent educational-use disclaimer.
- [x] No shaming or fear-based language.
- [x] Clearly label estimates and limitations.
- [x] Link to free quitting support.
- [x] Keep user data local by default.
