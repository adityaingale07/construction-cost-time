/**
 * BuildCost — Construction Cost Estimator
 * Professional Civil Engineering Calculation & Takeoff Engine
 * Strict Clean Empty State & Real User-Driven Calculation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Standard Empirical Norms (IS 456 / CPWD Preliminary Guidelines)
  const DEFAULT_NORMS = {
    cement: 0.4,       // bags/sq.ft
    steel: 4.0,        // kg/sq.ft
    sand: 1.5,         // cu.ft/sq.ft
    aggregate: 1.0,    // cu.ft/sq.ft
    bricks: 8.0,       // pieces/sq.ft
    wastage: 5.0       // percentage (%)
  };

  let calculationState = {
    isCalculated: false,
    areaMode: 'auto',        // 'auto' or 'manual'
    labourModel: 'per_area', // 'per_area' or 'percentage'
    unit: 'sqft',
    
    plotFootprint: 0,
    plotFootprintSqm: 0,
    builtUpArea: 0,
    builtUpAreaSqm: 0,
    
    quantities: {},
    costs: {},
    totalMaterialCost: 0,
    totalLabourCost: 0,
    grandTotalCost: 0,
    costPerSqft: 0,
    costPerSqm: 0
  };

  let costBreakdownChart = null;
  let expenseComparisonChart = null;

  // DOM Elements: Project Details
  const projectNameInput = document.getElementById('projectName');
  const measurementUnitSelect = document.getElementById('measurementUnit');
  const plotLengthInput = document.getElementById('plotLength');
  const plotWidthInput = document.getElementById('plotWidth');
  const numFloorsInput = document.getElementById('numFloors');
  const constructionTypeSelect = document.getElementById('constructionType');
  const lengthUnitLabel = document.getElementById('lengthUnitLabel');
  const widthUnitLabel = document.getElementById('widthUnitLabel');

  const btnModeAuto = document.getElementById('btnModeAuto');
  const btnModeManual = document.getElementById('btnModeManual');
  const manualAreaGroup = document.getElementById('manualAreaGroup');
  const manualAreaPerFloorInput = document.getElementById('manualAreaPerFloor');
  const manualAreaUnitLabel = document.getElementById('manualAreaUnitLabel');

  const previewPlotFootprint = document.getElementById('previewPlotFootprint');
  const previewBuiltUpArea = document.getElementById('previewBuiltUpArea');

  // Hero Diagram Elements
  const heroBadgeRateVal = document.getElementById('heroBadgeRateVal');
  const heroBadgeRateSub = document.getElementById('heroBadgeRateSub');
  const heroBadgeSteelVal = document.getElementById('heroBadgeSteelVal');
  const heroBadgeSteelSub = document.getElementById('heroBadgeSteelSub');
  const cadPlotSpan = document.getElementById('cadPlotSpan');
  const cadFloorsLabel = document.getElementById('cadFloorsLabel');

  // DOM Elements: Rates
  const rateCementInput = document.getElementById('rateCement');
  const rateSteelInput = document.getElementById('rateSteel');
  const rateSandInput = document.getElementById('rateSand');
  const rateAggregateInput = document.getElementById('rateAggregate');
  const rateBricksInput = document.getElementById('rateBricks');

  // Labour Model Elements
  const modelPerAreaCard = document.getElementById('modelPerAreaCard');
  const modelPercentageCard = document.getElementById('modelPercentageCard');
  const labourPerAreaInputWrap = document.getElementById('labourPerAreaInputWrap');
  const labourPercentageInputWrap = document.getElementById('labourPercentageInputWrap');
  const labourRatePerSqftInput = document.getElementById('labourRatePerSqft');
  const labourPercentageInput = document.getElementById('labourPercentage');

  // Accordion & Norms
  const accordionTrigger = document.getElementById('accordionTrigger');
  const accordionContent = document.getElementById('accordionContent');
  const normCementInput = document.getElementById('normCement');
  const normSteelInput = document.getElementById('normSteel');
  const normSandInput = document.getElementById('normSand');
  const normAggregateInput = document.getElementById('normAggregate');
  const normBricksInput = document.getElementById('normBricks');
  const siteWastageInput = document.getElementById('siteWastage');
  const btnResetNorms = document.getElementById('btnResetNorms');

  // Validation Banner
  const validationNotice = document.getElementById('validationNotice');
  const validationMessage = document.getElementById('validationMessage');

  // Action Buttons
  const btnCalculateMain = document.getElementById('btnCalculateMain');
  const headerCalcBtn = document.getElementById('headerCalcBtn');
  const btnResetAll = document.getElementById('btnResetAll');
  const btnReportPrintBottom = document.getElementById('btnReportPrintBottom');
  const btnHeroStart = document.getElementById('btnHeroStart');

  // Theme & Mobile Menu
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavMenu = document.getElementById('mobileNavMenu');

  // Dashboard & Empty State
  const emptyStateGuidanceCard = document.getElementById('emptyStateGuidanceCard');
  const dashBuiltUpArea = document.getElementById('dashBuiltUpArea');
  const dashBuiltUpSubtext = document.getElementById('dashBuiltUpSubtext');
  const dashMaterialCost = document.getElementById('dashMaterialCost');
  const dashMaterialSubtext = document.getElementById('dashMaterialSubtext');
  const dashLabourCost = document.getElementById('dashLabourCost');
  const dashLabourSubtext = document.getElementById('dashLabourSubtext');
  const dashTotalCost = document.getElementById('dashTotalCost');
  const dashCostPerSqft = document.getElementById('dashCostPerSqft');
  const dashCostPerSqm = document.getElementById('dashCostPerSqm');

  // Table
  const takeoffBadge = document.getElementById('takeoffBadge');
  const materialTableBody = document.getElementById('materialTableBody');
  const tableTotalMaterialCost = document.getElementById('tableTotalMaterialCost');

  // Charts
  const chartPlaceholder1 = document.getElementById('chartPlaceholder1');
  const chartPlaceholder2 = document.getElementById('chartPlaceholder2');
  const costBreakdownCanvas = document.getElementById('costBreakdownChart');
  const expenseComparisonCanvas = document.getElementById('expenseComparisonChart');

  // Summary Card
  const sumProjectTitle = document.getElementById('sumProjectTitle');
  const sumPlotFootprint = document.getElementById('sumPlotFootprint');
  const sumBuiltUpArea = document.getElementById('sumBuiltUpArea');
  const sumMaterialCost = document.getElementById('sumMaterialCost');
  const sumLabourCost = document.getElementById('sumLabourCost');
  const sumCostPerSqft = document.getElementById('sumCostPerSqft');
  const sumCostPerSqm = document.getElementById('sumCostPerSqm');
  const sumGrandBudget = document.getElementById('sumGrandBudget');

  // Formulas
  const formulaBox1 = document.getElementById('formulaBox1');
  const formulaRule2 = document.getElementById('formulaRule2');
  const formulaBox2 = document.getElementById('formulaBox2');
  const formulaRule3 = document.getElementById('formulaRule3');
  const formulaBox3 = document.getElementById('formulaBox3');
  const formulaRule4 = document.getElementById('formulaRule4');
  const formulaBox4 = document.getElementById('formulaBox4');
  const formulaBox5 = document.getElementById('formulaBox5');

  // Currency & Number Formatters (Indian Standards)
  const inCurrencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  const inNumberFormatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  });

  const inDecimalFormatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });

  function formatCurrency(val) {
    if (isNaN(val) || val === null || val === undefined) return '₹0';
    return inCurrencyFormatter.format(Math.round(val));
  }

  function formatNumber(val) {
    if (isNaN(val) || val === null || val === undefined) return '0';
    return inNumberFormatter.format(Math.round(val));
  }

  // =========================================================================
  // Live Dimension Footprint Preview (Updates Step 1 dashed box & CAD graphic)
  // =========================================================================
  function updateLiveFootprintPreview() {
    const isManual = calculationState.areaMode === 'manual';
    const floors = parseInt(numFloorsInput.value, 10) || 0;
    const unitSuffix = calculationState.unit === 'sqm' ? 'sq.m' : 'sq.ft';

    let plotFootprint = 0;
    let builtUpArea = 0;

    if (isManual) {
      const manualVal = parseFloat(manualAreaPerFloorInput.value) || 0;
      plotFootprint = manualVal;
      builtUpArea = manualVal * (floors > 0 ? floors : 1);
    } else {
      const length = parseFloat(plotLengthInput.value) || 0;
      const width = parseFloat(plotWidthInput.value) || 0;
      if (length > 0 && width > 0) {
        plotFootprint = length * width;
        builtUpArea = plotFootprint * (floors > 0 ? floors : 1);
      }
    }

    if (plotFootprint > 0) {
      const footprintSqm = plotFootprint / 10.76391;
      previewPlotFootprint.textContent = `${inDecimalFormatter.format(plotFootprint)} ${unitSuffix} (${inDecimalFormatter.format(footprintSqm)} sq.m)`;
      previewBuiltUpArea.textContent = `${inDecimalFormatter.format(builtUpArea)} ${unitSuffix}`;

      // Update CAD diagram labels if available
      const lengthVal = parseFloat(plotLengthInput.value);
      if (lengthVal > 0) {
        const lengthM = (lengthVal * 0.3048).toFixed(1);
        cadPlotSpan.textContent = `PLOT SPAN: ${lengthVal}'-0" [${lengthM} m]`;
      }
      if (floors > 0) {
        cadFloorsLabel.textContent = `${floors} FLOOR${floors > 1 ? 'S' : ''} RCC`;
      }
    } else {
      previewPlotFootprint.textContent = '--';
      previewBuiltUpArea.textContent = '--';
      cadPlotSpan.textContent = 'PLOT SPAN: ENTER DIMENSIONS';
      cadFloorsLabel.textContent = 'RCC STRUCTURE';
    }
  }

  // =========================================================================
  // Input Validation & Error Highlighting
  // =========================================================================
  function clearValidationErrors() {
    validationNotice.style.display = 'none';
    const invalidInputs = document.querySelectorAll('.input-invalid');
    invalidInputs.forEach(el => el.classList.remove('input-invalid'));
  }

  function markInvalid(inputElement) {
    if (inputElement) {
      inputElement.classList.add('input-invalid');
      inputElement.addEventListener('input', () => {
        inputElement.classList.remove('input-invalid');
        if (!document.querySelector('.input-invalid')) {
          validationNotice.style.display = 'none';
        }
      }, { once: true });
    }
  }

  function validateInputs() {
    clearValidationErrors();
    const missingFields = [];

    // Check Dimensions
    if (calculationState.areaMode === 'auto') {
      const length = parseFloat(plotLengthInput.value);
      const width = parseFloat(plotWidthInput.value);
      if (isNaN(length) || length <= 0) {
        markInvalid(plotLengthInput);
        missingFields.push('Plot Length');
      }
      if (isNaN(width) || width <= 0) {
        markInvalid(plotWidthInput);
        missingFields.push('Plot Width');
      }
    } else {
      const manualArea = parseFloat(manualAreaPerFloorInput.value);
      if (isNaN(manualArea) || manualArea <= 0) {
        markInvalid(manualAreaPerFloorInput);
        missingFields.push('Area per Floor');
      }
    }

    // Check Floors
    const floors = parseInt(numFloorsInput.value, 10);
    if (isNaN(floors) || floors < 1) {
      markInvalid(numFloorsInput);
      missingFields.push('Number of Floors');
    }

    // Check Construction Type
    if (!constructionTypeSelect.value) {
      markInvalid(constructionTypeSelect);
      missingFields.push('Construction Type');
    }

    // Check Material Rates
    const rateCement = parseFloat(rateCementInput.value);
    const rateSteel = parseFloat(rateSteelInput.value);
    const rateSand = parseFloat(rateSandInput.value);
    const rateAggregate = parseFloat(rateAggregateInput.value);
    const rateBricks = parseFloat(rateBricksInput.value);

    if (isNaN(rateCement) || rateCement <= 0) {
      markInvalid(rateCementInput);
      missingFields.push('Cement Rate');
    }
    if (isNaN(rateSteel) || rateSteel <= 0) {
      markInvalid(rateSteelInput);
      missingFields.push('Steel Rate');
    }
    if (isNaN(rateSand) || rateSand <= 0) {
      markInvalid(rateSandInput);
      missingFields.push('Sand Rate');
    }
    if (isNaN(rateAggregate) || rateAggregate <= 0) {
      markInvalid(rateAggregateInput);
      missingFields.push('Aggregate Rate');
    }
    if (isNaN(rateBricks) || rateBricks <= 0) {
      markInvalid(rateBricksInput);
      missingFields.push('Bricks Rate');
    }

    // Check Labour Rate
    if (calculationState.labourModel === 'per_area') {
      const labourRate = parseFloat(labourRatePerSqftInput.value);
      if (isNaN(labourRate) || labourRate <= 0) {
        markInvalid(labourRatePerSqftInput);
        missingFields.push('Labour Rate per Sq.ft');
      }
    } else {
      const labourPct = parseFloat(labourPercentageInput.value);
      if (isNaN(labourPct) || labourPct <= 0) {
        markInvalid(labourPercentageInput);
        missingFields.push('Labour Percentage');
      }
    }

    if (missingFields.length > 0) {
      validationMessage.textContent = `Please enter valid values for: ${missingFields.slice(0, 4).join(', ')}${missingFields.length > 4 ? ' and others.' : '.'}`;
      validationNotice.style.display = 'flex';
      validationNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    return true;
  }

  // =========================================================================
  // Calculation Pipeline (Genuinely Driven by User Inputs)
  // =========================================================================
  function calculateBuiltUpArea() {
    const floors = parseInt(numFloorsInput.value, 10) || 1;
    let areaPerFloor = 0;
    let plotFootprint = 0;

    if (calculationState.areaMode === 'auto') {
      const length = parseFloat(plotLengthInput.value) || 0;
      const width = parseFloat(plotWidthInput.value) || 0;
      plotFootprint = length * width;
      areaPerFloor = plotFootprint;
    } else {
      areaPerFloor = parseFloat(manualAreaPerFloorInput.value) || 0;
      plotFootprint = areaPerFloor;
    }

    const totalBuiltUpArea = areaPerFloor * floors;
    const plotFootprintSqm = plotFootprint / 10.76391;
    const totalBuiltUpAreaSqm = totalBuiltUpArea / 10.76391;

    calculationState.plotFootprint = plotFootprint;
    calculationState.plotFootprintSqm = plotFootprintSqm;
    calculationState.builtUpArea = totalBuiltUpArea;
    calculationState.builtUpAreaSqm = totalBuiltUpAreaSqm;

    updateLiveFootprintPreview();
    return totalBuiltUpArea;
  }

  function calculateMaterialQuantities() {
    const area = calculationState.builtUpArea;
    const wastagePercent = parseFloat(siteWastageInput.value) || DEFAULT_NORMS.wastage;
    const wastageFactor = 1 + (wastagePercent / 100);

    const normCement = parseFloat(normCementInput.value) || DEFAULT_NORMS.cement;
    const normSteel = parseFloat(normSteelInput.value) || DEFAULT_NORMS.steel;
    const normSand = parseFloat(normSandInput.value) || DEFAULT_NORMS.sand;
    const normAgg = parseFloat(normAggregateInput.value) || DEFAULT_NORMS.aggregate;
    const normBricks = parseFloat(normBricksInput.value) || DEFAULT_NORMS.bricks;

    const cementBase = area * normCement;
    const steelBase = area * normSteel;

    const cementQty = Math.round(cementBase * wastageFactor);
    const steelQty = Math.round(steelBase * wastageFactor);
    const sandQty = Math.round(area * normSand * wastageFactor);
    const aggregateQty = Math.round(area * normAgg * wastageFactor);
    const bricksQty = Math.round(area * normBricks * wastageFactor);

    calculationState.quantities = {
      cementBase,
      steelBase,
      cement: cementQty,
      steel: steelQty,
      sand: sandQty,
      aggregate: aggregateQty,
      bricks: bricksQty
    };

    return calculationState.quantities;
  }

  function calculateMaterialCosts() {
    const q = calculationState.quantities;
    const rateCement = parseFloat(rateCementInput.value) || 0;
    const rateSteel = parseFloat(rateSteelInput.value) || 0;
    const rateSand = parseFloat(rateSandInput.value) || 0;
    const rateAgg = parseFloat(rateAggregateInput.value) || 0;
    const rateBricks = parseFloat(rateBricksInput.value) || 0;

    const cementCost = q.cement * rateCement;
    const steelCost = q.steel * rateSteel;
    const sandCost = q.sand * rateSand;
    const aggCost = q.aggregate * rateAgg;
    const bricksCost = q.bricks * rateBricks;

    const totalMaterial = cementCost + steelCost + sandCost + aggCost + bricksCost;

    calculationState.costs = {
      cement: cementCost,
      steel: steelCost,
      sand: sandCost,
      aggregate: aggCost,
      bricks: bricksCost
    };
    calculationState.totalMaterialCost = totalMaterial;

    return calculationState.costs;
  }

  function calculateLabourCost() {
    let labourTotal = 0;
    if (calculationState.labourModel === 'per_area') {
      const ratePerSqft = parseFloat(labourRatePerSqftInput.value) || 0;
      labourTotal = calculationState.builtUpArea * ratePerSqft;
    } else {
      const pct = parseFloat(labourPercentageInput.value) || 0;
      labourTotal = calculationState.totalMaterialCost * (pct / 100);
    }

    calculationState.totalLabourCost = Math.round(labourTotal);
    return calculationState.totalLabourCost;
  }

  function calculateTotalCost() {
    calculationState.grandTotalCost = calculationState.totalMaterialCost + calculationState.totalLabourCost;
    return calculationState.grandTotalCost;
  }

  function calculateUnitRates() {
    const area = calculationState.builtUpArea;
    if (area > 0) {
      calculationState.costPerSqft = Math.round(calculationState.grandTotalCost / area);
      calculationState.costPerSqm = Math.round(calculationState.costPerSqft * 10.76391);
    } else {
      calculationState.costPerSqft = 0;
      calculationState.costPerSqm = 0;
    }
  }

  // =========================================================================
  // UI Renderers (When Calculation is Successfully Performed)
  // =========================================================================
  function renderDashboardMetrics() {
    const state = calculationState;
    const floors = parseInt(numFloorsInput.value, 10) || 1;

    dashBuiltUpArea.textContent = formatNumber(state.builtUpArea);
    dashBuiltUpSubtext.textContent = `(${inDecimalFormatter.format(state.builtUpAreaSqm)} sq.m across ${floors} floor${floors > 1 ? 's' : ''})`;
    
    dashMaterialCost.textContent = formatCurrency(state.totalMaterialCost);
    dashMaterialSubtext.textContent = 'Cement, Steel, Aggregates & Bricks';

    dashLabourCost.textContent = formatCurrency(state.totalLabourCost);
    dashLabourSubtext.textContent = calculationState.labourModel === 'per_area'
      ? `Rate: ₹${parseFloat(labourRatePerSqftInput.value) || 0}/sq.ft`
      : `${parseFloat(labourPercentageInput.value) || 0}% of Material Cost`;

    dashTotalCost.textContent = formatCurrency(state.grandTotalCost);
    
    dashCostPerSqft.textContent = formatCurrency(state.costPerSqft);
    dashCostPerSqm.textContent = `${formatCurrency(state.costPerSqm)} / sq.m`;

    // Overview Card on Left
    const projectName = projectNameInput.value.trim() || 'Untitled Project';
    sumProjectTitle.textContent = projectName;
    sumPlotFootprint.textContent = `${inDecimalFormatter.format(state.plotFootprint)} sq.ft (${inDecimalFormatter.format(state.plotFootprintSqm)} sq.m)`;
    sumBuiltUpArea.textContent = `${formatNumber(state.builtUpArea)} sq.ft (${inDecimalFormatter.format(state.builtUpAreaSqm)} sq.m)`;
    sumMaterialCost.textContent = formatCurrency(state.totalMaterialCost);
    
    if (state.labourModel === 'per_area') {
      const labourRate = parseFloat(labourRatePerSqftInput.value) || 0;
      sumLabourCost.textContent = `${formatCurrency(state.totalLabourCost)} (₹${labourRate}/sq.ft)`;
    } else {
      const pct = parseFloat(labourPercentageInput.value) || 0;
      sumLabourCost.textContent = `${formatCurrency(state.totalLabourCost)} (${pct}% of materials)`;
    }

    sumCostPerSqft.textContent = `${formatCurrency(state.costPerSqft)} / sq.ft`;
    sumCostPerSqm.textContent = `${formatCurrency(state.costPerSqm)} / sq.m`;
    sumGrandBudget.textContent = formatCurrency(state.grandTotalCost);

    // Update Hero Badges with Real Calculated Values
    heroBadgeRateVal.innerHTML = `${formatCurrency(state.costPerSqft)} <span class="badge-unit">/sq.ft</span>`;
    heroBadgeRateSub.textContent = 'Civil BOQ Analysis';

    heroBadgeSteelVal.textContent = `${formatNumber(state.quantities.steel)} kg`;
    const steelNorm = parseFloat(normSteelInput.value) || DEFAULT_NORMS.steel;
    heroBadgeSteelSub.textContent = `Norm: ${steelNorm} kg/sq.ft`;
  }

  function renderTakeoffTable() {
    const q = calculationState.quantities;
    const c = calculationState.costs;
    const wastage = parseFloat(siteWastageInput.value) || DEFAULT_NORMS.wastage;
    const wastageText = `+${wastage}%`;

    const rateCement = parseFloat(rateCementInput.value) || 0;
    const rateSteel = parseFloat(rateSteelInput.value) || 0;
    const rateSand = parseFloat(rateSandInput.value) || 0;
    const rateAgg = parseFloat(rateAggregateInput.value) || 0;
    const rateBricks = parseFloat(rateBricksInput.value) || 0;

    // Dynamically build 5 rows
    const rowsHtml = `
      <tr>
        <td>
          <div class="material-name-cell">
            <span class="table-row-icon">📄</span>
            <span class="material-title">Cement</span>
          </div>
        </td>
        <td class="text-right font-mono font-bold">${formatNumber(q.cement)}</td>
        <td class="text-muted">Bags (50kg)</td>
        <td class="text-right font-mono">${formatCurrency(rateCement)}</td>
        <td class="text-center font-mono text-muted">${wastageText}</td>
        <td class="text-right font-mono font-bold color-orange-text">${formatCurrency(c.cement)}</td>
      </tr>
      <tr>
        <td>
          <div class="material-name-cell">
            <span class="table-row-icon">⚙</span>
            <span class="material-title">Steel (TMT Rebar)</span>
          </div>
        </td>
        <td class="text-right font-mono font-bold">${formatNumber(q.steel)}</td>
        <td class="text-muted">Kg</td>
        <td class="text-right font-mono">${formatCurrency(rateSteel)}</td>
        <td class="text-center font-mono text-muted">${wastageText}</td>
        <td class="text-right font-mono font-bold color-orange-text">${formatCurrency(c.steel)}</td>
      </tr>
      <tr>
        <td>
          <div class="material-name-cell">
            <span class="table-row-icon">⏳</span>
            <span class="material-title">Sand / Fine Aggregate</span>
          </div>
        </td>
        <td class="text-right font-mono font-bold">${formatNumber(q.sand)}</td>
        <td class="text-muted">Cu.Ft</td>
        <td class="text-right font-mono">${formatCurrency(rateSand)}</td>
        <td class="text-center font-mono text-muted">${wastageText}</td>
        <td class="text-right font-mono font-bold color-orange-text">${formatCurrency(c.sand)}</td>
      </tr>
      <tr>
        <td>
          <div class="material-name-cell">
            <span class="table-row-icon">🪨</span>
            <span class="material-title">Coarse Aggregate (10/20mm)</span>
          </div>
        </td>
        <td class="text-right font-mono font-bold">${formatNumber(q.aggregate)}</td>
        <td class="text-muted">Cu.Ft</td>
        <td class="text-right font-mono">${formatCurrency(rateAgg)}</td>
        <td class="text-center font-mono text-muted">${wastageText}</td>
        <td class="text-right font-mono font-bold color-orange-text">${formatCurrency(c.aggregate)}</td>
      </tr>
      <tr>
        <td>
          <div class="material-name-cell">
            <span class="table-row-icon">🧱</span>
            <span class="material-title">Bricks / AAC Blocks</span>
          </div>
        </td>
        <td class="text-right font-mono font-bold">${formatNumber(q.bricks)}</td>
        <td class="text-muted">Pieces</td>
        <td class="text-right font-mono">${formatCurrency(rateBricks)}</td>
        <td class="text-center font-mono text-muted">${wastageText}</td>
        <td class="text-right font-mono font-bold color-orange-text">${formatCurrency(c.bricks)}</td>
      </tr>
    `;

    materialTableBody.innerHTML = rowsHtml;
    tableTotalMaterialCost.textContent = formatCurrency(calculationState.totalMaterialCost);
    takeoffBadge.textContent = 'TAKEOFF VERIFIED';
  }

  function renderFormulaCards() {
    const state = calculationState;
    const floors = parseInt(numFloorsInput.value, 10) || 1;
    const wastage = parseFloat(siteWastageInput.value) || DEFAULT_NORMS.wastage;

    const normCement = parseFloat(normCementInput.value) || DEFAULT_NORMS.cement;
    const normSteel = parseFloat(normSteelInput.value) || DEFAULT_NORMS.steel;
    const rateCement = parseFloat(rateCementInput.value) || 0;
    const rateSteel = parseFloat(rateSteelInput.value) || 0;

    // 1. Total Built-up Area
    const areaPerFloor = state.builtUpArea / floors;
    formulaBox1.textContent = `${inDecimalFormatter.format(areaPerFloor)} sq.ft/floor × ${floors} floors = ${formatNumber(state.builtUpArea)} sq.ft (${inDecimalFormatter.format(state.builtUpAreaSqm)} m²)`;

    // 2. Cement Requirement
    formulaRule2.textContent = `Built-up Area (${formatNumber(state.builtUpArea)} sq.ft) × ${normCement} bags/sq.ft × (1 + ${wastage}% wastage)`;
    formulaBox2.textContent = `Base: ${inDecimalFormatter.format(state.quantities.cementBase)} bags → Wastage-Adjusted: ${formatNumber(state.quantities.cement)} bags × ₹${rateCement}/bag = ${formatCurrency(state.costs.cement)}`;

    // 3. Steel Reinforcement
    formulaRule3.textContent = `Built-up Area (${formatNumber(state.builtUpArea)} sq.ft) × ${normSteel} kg/sq.ft × (1 + ${wastage}% wastage)`;
    formulaBox3.textContent = `Base: ${inDecimalFormatter.format(state.quantities.steelBase)} kg → Wastage-Adjusted: ${formatNumber(state.quantities.steel)} kg × ₹${rateSteel}/kg = ${formatCurrency(state.costs.steel)}`;

    // 4. Labour Cost Computation
    if (state.labourModel === 'per_area') {
      const labourRate = parseFloat(labourRatePerSqftInput.value) || 0;
      formulaRule4.textContent = `Rate Rule: Built-up Area (${formatNumber(state.builtUpArea)} sq.ft) × ₹${labourRate}/sq.ft`;
      formulaBox4.textContent = `${formatNumber(state.builtUpArea)} sq.ft × ₹${labourRate} = ${formatCurrency(state.totalLabourCost)}`;
    } else {
      const pct = parseFloat(labourPercentageInput.value) || 0;
      formulaRule4.textContent = `Percentage Rule: ${pct}% of Material Cost`;
      formulaBox4.textContent = `${pct}% of ${formatCurrency(state.totalMaterialCost)} = ${formatCurrency(state.totalLabourCost)}`;
    }

    // 5. Grand Construction Cost & Unit Rates
    formulaBox5.innerHTML = `${formatCurrency(state.totalMaterialCost)} + ${formatCurrency(state.totalLabourCost)} = ${formatCurrency(state.grandTotalCost)}<br>Cost / sq.ft = ${formatCurrency(state.costPerSqft)} | Cost / m² = ${formatCurrency(state.costPerSqm)}`;
  }

  function renderCharts() {
    // Show canvases and hide placeholder states
    chartPlaceholder1.style.display = 'none';
    chartPlaceholder2.style.display = 'none';
    costBreakdownCanvas.style.display = 'block';
    expenseComparisonCanvas.style.display = 'block';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.07)';

    const labels = ['Cement', 'Steel', 'Sand', 'Aggregate', 'Bricks', 'Labour'];
    const dataValues = [
      calculationState.costs.cement || 0,
      calculationState.costs.steel || 0,
      calculationState.costs.sand || 0,
      calculationState.costs.aggregate || 0,
      calculationState.costs.bricks || 0,
      calculationState.totalLabourCost || 0
    ];

    const chartColors = [
      '#64748b', // Cement - slate
      '#0ea5e9', // Steel - sky/blue
      '#f59e0b', // Sand - amber
      '#475569', // Aggregate - dark slate
      '#f43f5e', // Bricks - red
      '#f97316'  // Labour - construction orange
    ];

    // 1. Doughnut Chart: Cost Contribution Breakdown
    const doughnutCtx = costBreakdownCanvas.getContext('2d');
    if (costBreakdownChart) {
      costBreakdownChart.data.datasets[0].data = dataValues;
      costBreakdownChart.options.plugins.legend.labels.color = textColor;
      costBreakdownChart.update();
    } else {
      costBreakdownChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: dataValues,
            backgroundColor: chartColors,
            borderColor: isDark ? '#131d33' : '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '58%',
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                padding: 12,
                color: textColor,
                font: {
                  family: "'Inter', sans-serif",
                  size: 11,
                  weight: '500'
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const val = context.raw || 0;
                  const total = calculationState.grandTotalCost || 1;
                  const pct = ((val / total) * 100).toFixed(1);
                  return ` ${label}: ${formatCurrency(val)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }

    // 2. Bar Chart: Expense Comparison by Category
    const barCtx = expenseComparisonCanvas.getContext('2d');
    if (expenseComparisonChart) {
      expenseComparisonChart.data.datasets[0].data = dataValues;
      expenseComparisonChart.options.scales.x.ticks.color = textColor;
      expenseComparisonChart.options.scales.y.ticks.color = textColor;
      expenseComparisonChart.options.scales.y.grid.color = gridColor;
      expenseComparisonChart.update();
    } else {
      expenseComparisonChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cost (₹)',
            data: dataValues,
            backgroundColor: chartColors,
            borderRadius: 4,
            maxBarThickness: 34
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return ` Expenditure: ${formatCurrency(context.raw)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: textColor,
                font: {
                  family: "'Inter', sans-serif",
                  size: 11
                }
              }
            },
            y: {
              grid: {
                color: gridColor
              },
              ticks: {
                color: textColor,
                font: {
                  family: "'Inter', sans-serif",
                  size: 10.5
                },
                callback: function (val) {
                  if (val >= 100000) {
                    return '₹' + (val / 100000).toFixed(1) + 'L';
                  } else if (val >= 1000) {
                    return '₹' + (val / 1000).toFixed(0) + 'k';
                  }
                  return '₹' + val;
                }
              }
            }
          }
        }
      });
    }
  }

  // =========================================================================
  // Main Action: Calculate Estimate
  // =========================================================================
  function calculateAll() {
    if (!validateInputs()) {
      return;
    }

    calculateBuiltUpArea();
    calculateMaterialQuantities();
    calculateMaterialCosts();
    calculateLabourCost();
    calculateTotalCost();
    calculateUnitRates();

    calculationState.isCalculated = true;

    // Hide empty state guidance card
    emptyStateGuidanceCard.style.display = 'none';

    // Render all results with user's actual data
    renderDashboardMetrics();
    renderTakeoffTable();
    renderCharts();
    renderFormulaCards();

    // Smooth scroll down to Results Dashboard
    const resultsSection = document.getElementById('results-dashboard');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // =========================================================================
  // Main Action: Reset Estimate (Pristine Clean Empty State)
  // =========================================================================
  function resetEstimate() {
    // 1. Clear All Inputs
    projectNameInput.value = '';
    plotLengthInput.value = '';
    plotWidthInput.value = '';
    numFloorsInput.value = '';
    constructionTypeSelect.selectedIndex = 0;
    manualAreaPerFloorInput.value = '';

    setAreaMode('auto');
    setLabourModel('per_area');

    rateCementInput.value = '';
    rateSteelInput.value = '';
    rateSandInput.value = '';
    rateAggregateInput.value = '';
    rateBricksInput.value = '';
    labourRatePerSqftInput.value = '';
    labourPercentageInput.value = '';

    normCementInput.value = DEFAULT_NORMS.cement;
    normSteelInput.value = DEFAULT_NORMS.steel;
    normSandInput.value = DEFAULT_NORMS.sand;
    normAggregateInput.value = DEFAULT_NORMS.aggregate;
    normBricksInput.value = DEFAULT_NORMS.bricks;
    siteWastageInput.value = DEFAULT_NORMS.wastage;

    clearValidationErrors();

    // 2. Reset Calculation State
    calculationState.isCalculated = false;
    calculationState.plotFootprint = 0;
    calculationState.plotFootprintSqm = 0;
    calculationState.builtUpArea = 0;
    calculationState.builtUpAreaSqm = 0;
    calculationState.quantities = {};
    calculationState.costs = {};
    calculationState.totalMaterialCost = 0;
    calculationState.totalLabourCost = 0;
    calculationState.grandTotalCost = 0;
    calculationState.costPerSqft = 0;
    calculationState.costPerSqm = 0;

    // 3. Reset Live Previews
    previewPlotFootprint.textContent = '--';
    previewBuiltUpArea.textContent = '--';
    cadPlotSpan.textContent = 'PLOT SPAN: ENTER DIMENSIONS';
    cadFloorsLabel.textContent = 'RCC STRUCTURE';

    // 4. Reset Hero Badges
    heroBadgeRateVal.innerHTML = '-- <span class="badge-unit">/sq.ft</span>';
    heroBadgeRateSub.textContent = 'Enter project rates';
    heroBadgeSteelVal.textContent = '-- kg';
    heroBadgeSteelSub.textContent = 'Norm: 4 kg/sq.ft';

    // 5. Restore Empty State Card
    emptyStateGuidanceCard.style.display = 'flex';

    // 6. Restore 5 Metric Cards
    dashBuiltUpArea.textContent = '--';
    dashBuiltUpSubtext.textContent = 'Enter plot dimensions above';
    dashMaterialCost.textContent = '₹--';
    dashMaterialSubtext.textContent = 'Awaiting material rates';
    dashLabourCost.textContent = '₹--';
    dashLabourSubtext.textContent = 'Awaiting labour parameters';
    dashTotalCost.textContent = '₹--';
    dashCostPerSqft.textContent = '₹--';
    dashCostPerSqm.textContent = '-- / sq.m';

    // 7. Restore Table to Empty Row
    takeoffBadge.textContent = 'AWAITING CALCULATION';
    materialTableBody.innerHTML = `
      <tr id="tableEmptyRow" class="table-empty-row">
        <td colspan="6">
          <div class="empty-table-prompt">
            <span class="empty-table-icon">🏗️</span>
            <p>No material takeoff generated yet.</p>
            <span class="empty-table-sub">Fill in dimensions and material procurement rates above, then click Calculate Estimate to compute required quantities.</span>
          </div>
        </td>
      </tr>
    `;
    tableTotalMaterialCost.textContent = '₹--';

    // 8. Restore Charts to Empty State
    if (costBreakdownChart) {
      costBreakdownChart.destroy();
      costBreakdownChart = null;
    }
    if (expenseComparisonChart) {
      expenseComparisonChart.destroy();
      expenseComparisonChart = null;
    }
    costBreakdownCanvas.style.display = 'none';
    expenseComparisonCanvas.style.display = 'none';
    chartPlaceholder1.style.display = 'flex';
    chartPlaceholder2.style.display = 'flex';

    // 9. Restore Summary Card
    sumProjectTitle.textContent = '--';
    sumPlotFootprint.textContent = '--';
    sumBuiltUpArea.textContent = '--';
    sumMaterialCost.textContent = '₹--';
    sumLabourCost.textContent = '₹--';
    sumCostPerSqft.textContent = '₹--';
    sumCostPerSqm.textContent = '₹--';
    sumGrandBudget.textContent = '₹--';

    // 10. Restore Formula Boxes
    formulaBox1.textContent = 'Enter plot dimensions above to calculate built-up area';
    formulaRule2.textContent = 'Built-up Area × 0.4 bags/sq.ft × (1 + 5% wastage)';
    formulaBox2.textContent = 'Enter dimensions and cement procurement rate to calculate';
    formulaRule3.textContent = 'Built-up Area × 4 kg/sq.ft × (1 + 5% wastage)';
    formulaBox3.textContent = 'Enter dimensions and steel procurement rate to calculate';
    formulaRule4.textContent = 'Rate Rule: Built-up Area × Labour Rate';
    formulaBox4.textContent = 'Enter labour rate or percentage to calculate';
    formulaBox5.innerHTML = 'Total Material Cost + Labour Cost = Grand Budget';

    // Scroll to Top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // Area & Labour Mode Switching
  // =========================================================================
  function setAreaMode(mode) {
    calculationState.areaMode = mode;
    if (mode === 'auto') {
      btnModeAuto.classList.add('active');
      btnModeManual.classList.remove('active');
      manualAreaGroup.style.display = 'none';
    } else {
      btnModeAuto.classList.remove('active');
      btnModeManual.classList.add('active');
      manualAreaGroup.style.display = 'block';
    }
    updateLiveFootprintPreview();
  }

  function setLabourModel(model) {
    calculationState.labourModel = model;
    if (model === 'per_area') {
      modelPerAreaCard.classList.add('active');
      modelPercentageCard.classList.remove('active');
      labourPerAreaInputWrap.style.display = 'block';
      labourPercentageInputWrap.style.display = 'none';
    } else {
      modelPerAreaCard.classList.remove('active');
      modelPercentageCard.classList.add('active');
      labourPerAreaInputWrap.style.display = 'none';
      labourPercentageInputWrap.style.display = 'block';
    }
  }

  // =========================================================================
  // Theme Switching
  // =========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem('buildcost-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('buildcost-theme', newTheme);

    if (calculationState.isCalculated) {
      if (costBreakdownChart) {
        costBreakdownChart.destroy();
        costBreakdownChart = null;
      }
      if (expenseComparisonChart) {
        expenseComparisonChart.destroy();
        expenseComparisonChart = null;
      }
      renderCharts();
    }
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  btnModeAuto.addEventListener('click', () => setAreaMode('auto'));
  btnModeManual.addEventListener('click', () => setAreaMode('manual'));

  modelPerAreaCard.addEventListener('click', () => setLabourModel('per_area'));
  modelPercentageCard.addEventListener('click', () => setLabourModel('percentage'));

  accordionTrigger.addEventListener('click', () => {
    const isExpanded = accordionTrigger.getAttribute('aria-expanded') === 'true';
    accordionTrigger.setAttribute('aria-expanded', !isExpanded);
    accordionTrigger.classList.toggle('open');
    accordionContent.classList.toggle('open');
  });

  btnResetNorms.addEventListener('click', () => {
    normCementInput.value = DEFAULT_NORMS.cement;
    normSteelInput.value = DEFAULT_NORMS.steel;
    normSandInput.value = DEFAULT_NORMS.sand;
    normAggregateInput.value = DEFAULT_NORMS.aggregate;
    normBricksInput.value = DEFAULT_NORMS.bricks;
    siteWastageInput.value = DEFAULT_NORMS.wastage;
    if (calculationState.isCalculated) {
      calculateAll();
    }
  });

  btnCalculateMain.addEventListener('click', calculateAll);
  headerCalcBtn.addEventListener('click', calculateAll);
  btnResetAll.addEventListener('click', resetEstimate);

  btnReportPrintBottom.addEventListener('click', () => {
    if (!calculationState.isCalculated) {
      validationMessage.textContent = 'Please enter project details and click Calculate Estimate before generating a report.';
      validationNotice.style.display = 'flex';
      validationNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    window.print();
  });

  themeToggleBtn.addEventListener('click', toggleTheme);

  mobileMenuBtn.addEventListener('click', () => {
    mobileNavMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNavMenu.classList.remove('open');
    });
  });

  // Live input events for dimension preview
  [plotLengthInput, plotWidthInput, numFloorsInput, manualAreaPerFloorInput].forEach(inp => {
    inp.addEventListener('input', updateLiveFootprintPreview);
  });

  // Clear invalid outline when user changes selection
  constructionTypeSelect.addEventListener('change', () => {
    constructionTypeSelect.classList.remove('input-invalid');
  });

  measurementUnitSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    calculationState.unit = val;
    if (val === 'sqm') {
      lengthUnitLabel.textContent = 'M';
      widthUnitLabel.textContent = 'M';
      manualAreaUnitLabel.textContent = 'sq.m';
    } else {
      lengthUnitLabel.textContent = 'FT';
      widthUnitLabel.textContent = 'FT';
      manualAreaUnitLabel.textContent = 'sq.ft';
    }
    updateLiveFootprintPreview();
    if (calculationState.isCalculated) {
      calculateAll();
    }
  });

  // Initialize
  initTheme();
  // Ensure the page starts in a 100% clean, pristine empty state
  resetEstimate();
});
