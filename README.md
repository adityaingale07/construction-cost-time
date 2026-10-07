# BuildCost — Construction Cost Estimator

A professional, transparent Civil Engineering preliminary construction cost budgeting and Bill of Quantities (BOQ) calculation dashboard.

## 🏗️ Overview

**BuildCost** is designed for Civil Engineering students, quantity surveyors, project planners, and home builders to compute instant material takeoffs, itemized procurement costs, labor requirements, and structural budget breakdowns for residential and commercial RCC structures based on Indian Standard (IS) codes and CPWD schedule norms.

---

## 📐 Civil Engineering Estimation Methodology & Formulas

### 1. Built-up Area Computation
$$\text{Total Built-up Area} = \text{Built-up Area per Floor} \times \text{Number of Floors}$$
- **Automatic Mode**: Built-up Area per floor is computed directly from plot dimensions ($\text{Plot Length} \times \text{Plot Width}$).
- **Manual Mode**: Custom exact built-up area input per floor.

### 2. Material Consumption Norms (IS 456 / CPWD Thumb Rules)
Quantities include standard site wastage allowance (default $+5\%$):
$$\text{Estimated Quantity} = \text{Built-up Area} \times \text{Consumption Norm} \times (1 + \text{Wastage}\%)$$

| Material Category | Standard Norm | Unit | Market Reference (₹) |
| :--- | :--- | :--- | :--- |
| **Cement** | $0.40$ | Bags (50 kg) / sq.ft | ₹420 / bag |
| **Steel (TMT Rebar)** | $4.00$ | kg / sq.ft | ₹65 / kg |
| **Sand / Fine Aggregate** | $1.50$ | cu.ft / sq.ft | ₹55 / cu.ft |
| **Coarse Aggregate (10/20mm)** | $1.00$ | cu.ft / sq.ft | ₹50 / cu.ft |
| **Bricks / AAC Blocks** | $8.00$ | pieces / sq.ft | ₹10 / piece |
| **Site Wastage Factor** | $5.0\%$ | allowance factor | — |

### 3. Labour Cost Calculation Models
- **Model A (Per Unit Area)**: 
  $$\text{Labour Cost} = \text{Total Built-up Area} \times \text{Labour Rate per sq.ft}$$
  *(Default: ₹250 / sq.ft)*
- **Model B (Percentage Rule)**:
  $$\text{Labour Cost} = \text{Total Material Cost} \times \text{Labour Percentage}$$

### 4. Unit Rates
$$\text{Total Construction Cost} = \text{Total Material Cost} + \text{Total Labour Cost}$$
$$\text{Cost per sq.ft} = \frac{\text{Total Cost}}{\text{Total Built-up Area}}$$
$$\text{Cost per sq.m} = \text{Cost per sq.ft} \times 10.7639$$

---

## ✨ Features

- **Dynamic Bill of Quantities (BOQ)**: Live material takeoff table with categories, unit rates, wastage badges, and total expenditure.
- **Interactive Visualizations (Chart.js)**:
  - *Cost Contribution Breakdown* (Doughnut chart with percentage share).
  - *Expense Comparison by Category* (Bar chart in Indian Rupee denomination).
- **Executive Summary & Transparent Step-by-Step Formulas**: Live substitution showing the math behind every figure.
- **Indian Rupee Formatting (`en-IN`)**: Clean comma notation and currency representations (e.g., `₹22,14,060`).
- **Engineered Blueprint Grid Background**: Authentic subtle CSS vector blueprint grid without raster image dependencies.
- **Dark Mode / Light Mode**: Seamless theme toggle stored in browser `localStorage`.
- **One-Click Official PDF / Print Estimation Report**: Optimized `@media print` styling for clean A4 engineering documentation.
- **Fully Responsive**: Adapts across mobile, tablet, and desktop viewports.

---

## 📁 File Structure

```
├── index.html       # Semantic HTML5 engineering dashboard layout
├── style.css        # Clean CSS3 design system, blueprint grid, print rules, dark mode
├── script.js        # Pure Vanilla JavaScript ES6+ calculation engine & Chart.js logic
└── README.md        # Documentation and engineering reference guide
```

---

## 🏛️ Engineering References

- **IS 456:2000**: Plain and Reinforced Concrete — Code of Practice.
- **IS 1200**: Method of Measurement of Building and Civil Engineering Works.
- **CPWD DSR**: Central Public Works Department Delhi Schedule of Rates.
- **SP 16**: Design Aids for Reinforced Concrete to IS: 456-1978.

---

## 🚀 Running the Project

Open `index.html` in any modern web browser or host on GitHub Pages. No backend or build steps required.
