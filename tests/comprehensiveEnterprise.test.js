import { describe, it, expect } from 'vitest';
import { GlobalAuditEngine } from '../src/engine/core/auditEngine.js';
import { GlobalRBACEngine, PERMISSIONS, ENTERPRISE_ROLES } from '../src/engine/core/rbacEngine.js';
import { GlobalWorkflowEngine, WORKFLOW_STATUS } from '../src/engine/core/workflowEngine.js';
import { GlobalConsolidationEngine } from '../src/engine/finance/consolidationEngine.js';
import { GlobalDepreciationEngine, DEPRECIATION_METHOD } from '../src/engine/finance/depreciationEngine.js';
import { GlobalTaxCalculator } from '../src/engine/finance/globalTaxEngine.js';
import { GlobalWarehouseRoutingEngine } from '../src/engine/inventory/warehouseRoutingEngine.js';
import { GlobalBOMExplosionResolver } from '../src/engine/mrp/bomExplosionEngine.js';
import { GlobalCriticalPathEngine } from '../src/engine/projects/criticalPathEngine.js';
import { GlobalPayrollTaxCalculator } from '../src/engine/hr/payrollTaxCalculator.js';
import { GlobalLeadScorer, LEAD_TIERS } from '../src/engine/sales/leadScoringEngine.js';

// Advanced Domain Engines
import { GlobalCashFlowEngine } from '../src/engine/finance/cashFlowEngine.js';
import { GlobalHedgingEngine } from '../src/engine/finance/multiCurrencyHedgingEngine.js';
import { GlobalCycleCountEngine } from '../src/engine/inventory/cycleCountEngine.js';
import { GlobalVendorRatingEngine } from '../src/engine/inventory/vendorRatingEngine.js';
import { GlobalCapacityLoadEngine } from '../src/engine/mrp/capacityLoadEngine.js';
import { GlobalQualityInspectionEngine } from '../src/engine/mrp/qualityInspectionEngine.js';
import { GlobalLeaveAccrualEngine } from '../src/engine/hr/leaveAccrualEngine.js';
import { GlobalPerformanceReviewEngine } from '../src/engine/hr/performanceReviewEngine.js';
import { GlobalQuoteToOrderEngine } from '../src/engine/sales/quoteToOrderEngine.js';
import { GlobalResourceAllocationEngine } from '../src/engine/projects/resourceAllocationEngine.js';
import { GlobalSystemHealthEngine } from '../src/engine/admin/systemHealthEngine.js';

// Additional Enterprise Engines
import { GlobalDeferredRevenueEngine } from '../src/engine/finance/deferredRevenueEngine.js';
import { GlobalBankReconciliationEngine } from '../src/engine/finance/bankReconciliationEngine.js';
import { GlobalLandedCostEngine } from '../src/engine/inventory/landedCostEngine.js';
import { GlobalFinancialRatioEngine } from '../src/engine/analytics/financialRatioEngine.js';
import { sanitizeString, isValidEmail, stripEmptyLinesFromText } from '../src/utils/validationSanitizer.js';

describe('Comprehensive Enterprise Engine Suite', () => {

  // 1. Audit Engine & Hash Chain Verification
  it('should compute deep diffs and verify tamper-evident hash chain integrity with zero blank lines', () => {
    const user = { id: 'usr-1', name: 'Alex Mercer', role: 'SUPER_ADMIN' };
    const prev = { status: 'PENDING', amount: 5000 };
    const curr = { status: 'APPROVED', amount: 7500 };

    const entry = GlobalAuditEngine.recordEvent({
      user,
      action: 'PO_AMOUNT_UPDATED',
      entity: 'PurchaseOrder',
      entityId: 'PO-1001',
      previousState: prev,
      newState: curr
    });

    expect(entry.diff.status.newValue).toBe('APPROVED');
    expect(entry.diff.amount.newValue).toBe(7500);

    const integrity = GlobalAuditEngine.verifyChainIntegrity();
    expect(integrity.isIntact).toBe(true);

    const exportText = GlobalAuditEngine.exportToFormattedLog();
    expect(exportText).toContain('APEX ENTERPRISE ERP - TAMPER-EVIDENT AUDIT TRAIL LOG');
    expect(exportText).not.toContain('\n\n\n');
    expect(exportText.trim()).toBe(exportText);
  });

  // 2. RBAC Permission Evaluator
  it('should enforce role-based access control policies correctly', () => {
    const adminUser = { id: 'u1', role: ENTERPRISE_ROLES.SUPER_ADMIN };
    const salesUser = { id: 'u2', role: ENTERPRISE_ROLES.SALES_EXECUTIVE };

    expect(GlobalRBACEngine.hasPermission(adminUser, PERMISSIONS.FINANCE_POST_JOURNAL)).toBe(true);
    expect(GlobalRBACEngine.hasPermission(salesUser, PERMISSIONS.FINANCE_POST_JOURNAL)).toBe(false);
    expect(GlobalRBACEngine.hasPermission(salesUser, PERMISSIONS.SALES_CREATE_LEAD)).toBe(true);

    const matrixReport = GlobalRBACEngine.exportSecurityMatrixReport();
    expect(matrixReport).toContain('APEX ENTERPRISE ERP - SECURITY POLICY MATRIX');
    expect(matrixReport).not.toContain('\n\n\n');
  });

  // 3. Workflow Approval Routing
  it('should route multi-tier approvals dynamically based on monetary threshold', () => {
    const wf = GlobalWorkflowEngine.createWorkflow({
      entityType: 'CAPEX_REQUEST',
      entityId: 'CAPEX-900',
      requestedBy: 'David Chen',
      amountUSD: 150000
    });

    expect(wf.requiredTiers.length).toBe(3);
    expect(wf.currentStatus).toBe(WORKFLOW_STATUS.PENDING_LEVEL1);

    GlobalWorkflowEngine.approveStep({ workflowId: wf.workflowId, actor: 'Supervisor', actorRole: 'STAFF_SUPERVISOR' });
    expect(wf.currentStatus).toBe(WORKFLOW_STATUS.PENDING_LEVEL2);

    const summary = GlobalWorkflowEngine.exportWorkflowSummary(wf.workflowId);
    expect(summary).toContain('APEX ERP WORKFLOW AUDIT');
    expect(summary).not.toContain('\n\n\n');
  });

  // 4. Multi-Subsidiary Financial Consolidation
  it('should consolidate multi-subsidiary financials into Group USD with intercompany eliminations', () => {
    GlobalConsolidationEngine.registerSubsidiaryBalances('sub-us', 'USD', [
      { code: '1010', name: 'Operating Cash', type: 'Asset', balance: 500000 },
      { code: '1200', name: 'Intercompany Receivable', type: 'Asset', balance: 100000, isIntercompany: true }
    ]);
    GlobalConsolidationEngine.registerSubsidiaryBalances('sub-emea', 'EUR', [
      { code: '1010', name: 'Operating Cash', type: 'Asset', balance: 400000 },
      { code: '2200', name: 'Intercompany Payable', type: 'Liability', balance: 92000, isIntercompany: true }
    ]);

    GlobalConsolidationEngine.addIntercompanyElimination('sub-us', 'sub-emea', '1200', 100000);

    const report = GlobalConsolidationEngine.consolidateGroupFinancials();
    expect(report.totalSubsidiariesConsolidated).toBeGreaterThanOrEqual(2);
    expect(report.totalEliminatedUSD).toBe(100000);

    const textReport = GlobalConsolidationEngine.exportConsolidatedStatementText();
    expect(textReport).toContain('APEX ENTERPRISE ERP - GROUP FINANCIAL CONSOLIDATION');
    expect(textReport.trim()).toBe(textReport);
  });

  // 5. Fixed Assets Depreciation Schedules
  it('should compute DDB and SYD depreciation schedules accurately', () => {
    const asset = GlobalDepreciationEngine.registerAsset({
      assetId: 'AST-SERVERS',
      assetName: 'Data Center Rack Servers',
      category: 'IT_HARDWARE',
      costUSD: 50000,
      salvageValueUSD: 5000,
      usefulLifeYears: 5,
      depreciationMethod: DEPRECIATION_METHOD.DOUBLE_DECLINING
    });

    expect(asset.schedule.length).toBe(5);
    expect(asset.schedule[0].depreciationExpense).toBe(20000);

    const scheduleText = GlobalDepreciationEngine.exportDepreciationScheduleText('AST-SERVERS');
    expect(scheduleText).toContain('APEX ENTERPRISE ERP - FIXED ASSET DEPRECIATION TABLE');
    expect(scheduleText).not.toContain('\n\n\n');
  });

  // 6. Global Jurisdiction Tax Calculator
  it('should calculate EU VAT reverse charge and India GST CGST/SGST components', () => {
    const euB2B = GlobalTaxCalculator.calculateTaxForOrder({ amount: 10000, jurisdictionCode: 'EU_DE', isB2B: true, customerVATIN: 'DE123456789' });
    expect(euB2B.isReverseChargeApplied).toBe(true);
    expect(euB2B.taxAmount).toBe(0);

    const indiaIntra = GlobalTaxCalculator.calculateTaxForOrder({ amount: 10000, jurisdictionCode: 'IN_KA' });
    expect(indiaIntra.taxComponents.length).toBe(2);
    expect(indiaIntra.taxComponents[0].name).toContain('CGST');
    expect(indiaIntra.taxAmount).toBe(1800);

    const taxSlip = GlobalTaxCalculator.exportTaxCalculationText(indiaIntra);
    expect(taxSlip).toContain('APEX ENTERPRISE ERP - TAX CALCULATION AUDIT SLIP');
    expect(taxSlip.trim()).toBe(taxSlip);
  });

  // 7. Warehouse FIFO Lot Picking Path Optimization
  it('should allocate inventory using strict FIFO lot order and optimize serpentine pick paths', () => {
    GlobalWarehouseRoutingEngine.registerBinLocation({ warehouseId: 'WH-01', binCode: 'A1-R2-L1', aisleNumber: 1, rackNumber: 2, levelNumber: 1 });
    GlobalWarehouseRoutingEngine.registerBinLocation({ warehouseId: 'WH-01', binCode: 'A2-R1-L1', aisleNumber: 2, rackNumber: 1, levelNumber: 1 });

    GlobalWarehouseRoutingEngine.receiveInventoryLot({ skuId: 'SKU-MICROCHIP', lotNumber: 'LOT-A', qtyReceived: 50, unitCostUSD: 10, binCode: 'A1-R2-L1', expirationDate: '2027-01-01' });
    GlobalWarehouseRoutingEngine.receiveInventoryLot({ skuId: 'SKU-MICROCHIP', lotNumber: 'LOT-B', qtyReceived: 50, unitCostUSD: 12, binCode: 'A2-R1-L1', expirationDate: '2027-06-01' });

    const allocation = GlobalWarehouseRoutingEngine.allocateStockFIFO('SKU-MICROCHIP', 75);
    expect(allocation.allocations.length).toBe(2);
    expect(allocation.allocations[0].qtyAllocated).toBe(50);
    expect(allocation.allocations[1].qtyAllocated).toBe(25);
    expect(allocation.totalCostUSD).toBe(800);

    const pickSlip = GlobalWarehouseRoutingEngine.exportPickingSlipText('SKU-MICROCHIP', 10);
    expect(pickSlip).toContain('APEX ENTERPRISE ERP - WAREHOUSE OPTIMIZED PICK SLIP');
    expect(pickSlip.trim()).toBe(pickSlip);
  });

  // 8. Multi-Level Recursive BOM Explosion Resolver
  it('should explode multi-level BOM trees recursively and aggregate total material demand', () => {
    GlobalBOMExplosionResolver.registerBOM({
      parentSku: 'DRONE-V4',
      parentName: 'Autonomous Surveillance Drone v4',
      components: [
        { componentSku: 'SUB-MOTOR', componentName: 'Brushless Motor Assembly', qtyPerParent: 4, isSubAssembly: true },
        { componentSku: 'FRAME-CARBON', componentName: 'Carbon Fiber Frame', qtyPerParent: 1, isSubAssembly: false }
      ]
    });
    GlobalBOMExplosionResolver.registerBOM({
      parentSku: 'SUB-MOTOR',
      parentName: 'Brushless Motor Assembly',
      components: [
        { componentSku: 'RAW-COPPER-WIRE', componentName: 'Copper Winding Spool', qtyPerParent: 2, isSubAssembly: false },
        { componentSku: 'RAW-MAGNET', componentName: 'Neodymium Magnet', qtyPerParent: 8, isSubAssembly: false }
      ]
    });

    const demand = GlobalBOMExplosionResolver.consolidateMaterialDemand('DRONE-V4', 10);
    const copperItem = demand.consolidatedDemand.find(d => d.sku === 'RAW-COPPER-WIRE');
    expect(copperItem.totalQtyRequired).toBe(80);

    const bomText = GlobalBOMExplosionResolver.exportBOMExplosionText('DRONE-V4', 5);
    expect(bomText).toContain('APEX ENTERPRISE MRP II - MULTI-LEVEL BOM EXPLOSION TREE');
    expect(bomText.trim()).toBe(bomText);
  });

  // 9. Critical Path Method (CPM) & Earned Value Management (EVM)
  it('should compute project Critical Path, float times, and EVM performance indexes', () => {
    GlobalCriticalPathEngine.addTask({ taskId: 'T1', name: 'Requirements & Architecture', durationDays: 5, predecessors: [], plannedCostUSD: 10000 });
    GlobalCriticalPathEngine.addTask({ taskId: 'T2', name: 'Core Engine Development', durationDays: 10, predecessors: ['T1'], plannedCostUSD: 20000 });
    GlobalCriticalPathEngine.addTask({ taskId: 'T3', name: 'Documentation & Training', durationDays: 3, predecessors: ['T1'], plannedCostUSD: 5000 });
    GlobalCriticalPathEngine.addTask({ taskId: 'T4', name: 'Integration & User Acceptance Testing', durationDays: 4, predecessors: ['T2', 'T3'], plannedCostUSD: 8000 });

    const cpm = GlobalCriticalPathEngine.calculateCriticalPath();
    expect(cpm.projectDurationDays).toBe(19);
    expect(cpm.criticalPathSequence).toEqual(['T1', 'T2', 'T4']);

    const task3 = cpm.tasks.find(t => t.taskId === 'T3');
    expect(task3.totalFloat).toBe(7);

    const cpmReport = GlobalCriticalPathEngine.exportCPMScheduleText();
    expect(cpmReport).toContain('APEX ENTERPRISE PROJECTS - CPM SCHEDULE & EVM AUDIT');
    expect(cpmReport.trim()).toBe(cpmReport);
  });

  // 10. HCM Payroll Tax Calculator
  it('should compute progressive federal withholding, state taxes, FICA, and 401(k) employer match', () => {
    const paystub = GlobalPayrollTaxCalculator.calculateMonthlyPaystub({
      employeeName: 'Sarah Jenkins',
      annualBaseSalary: 180000,
      stateCode: 'NY',
      k401ContributionPercent: 5,
      healthInsuranceMonthly: 200
    });

    expect(paystub.monthlyGross).toBe(15000);
    expect(paystub.preTaxDeductions.k401Deduction).toBe(750);
    expect(paystub.employerContributions.k401Match).toBe(600);

    const stubText = GlobalPayrollTaxCalculator.exportPaystubText(paystub);
    expect(stubText).toContain('APEX ENTERPRISE HCM - OFFICIAL MONTHLY PAYSTUB ADVICE');
    expect(stubText.trim()).toBe(stubText);
  });

  // 11. Lead Qualification Scoring Engine
  it('should score leads accurately and assign qualification tiers with zero whitespace errors', () => {
    const leadEval = GlobalLeadScorer.evaluateLead({
      companyName: 'Acme Enterprise Global',
      contactName: 'Elena Rostova',
      contactTitle: 'Chief Technology Officer',
      annualRevenueUSD: 100000000,
      employeeCount: 1200,
      isBudgetApproved: true,
      timeframeMonths: 2,
      hasLegacyERP: true
    });

    expect(leadEval.qualificationScore).toBe(100);
    expect(leadEval.leadTier).toBe(LEAD_TIERS.HOT);

    const leadSlip = GlobalLeadScorer.exportLeadQualificationText(leadEval);
    expect(leadSlip).toContain('APEX ENTERPRISE CRM - LEAD QUALIFICATION SCORECARD');
    expect(leadSlip.trim()).toBe(leadSlip);
  });

  // 12. Cash Flow Statement Engine
  it('should calculate direct/indirect cash flows across operating, investing, and financing activities', () => {
    GlobalCashFlowEngine.recordCashActivity({ category: 'OPERATING', description: 'Customer Collections', amountUSD: 500000, isInflow: true });
    GlobalCashFlowEngine.recordCashActivity({ category: 'INVESTING', description: 'Server Equipment Purchase', amountUSD: 150000, isInflow: false });
    GlobalCashFlowEngine.recordCashActivity({ category: 'FINANCING', description: 'Bank Credit Line Drawdown', amountUSD: 200000, isInflow: true });

    const stmt = GlobalCashFlowEngine.generateCashFlowStatement({ beginningCashUSD: 1000000 });
    expect(stmt.netOperatingCashUSD).toBe(500000);
    expect(stmt.netInvestingCashUSD).toBe(-150000);
    expect(stmt.netFinancingCashUSD).toBe(200000);
    expect(stmt.endingCashUSD).toBe(1550000);

    const stmtText = GlobalCashFlowEngine.exportStatementText();
    expect(stmtText).toContain('APEX ENTERPRISE ERP - STATEMENT OF CASH FLOWS');
    expect(stmtText.trim()).toBe(stmtText);
  });

  // 13. FX Hedging Engine
  it('should calculate Mark-to-Market (MTM) forward contract unrealized positions', () => {
    GlobalHedgingEngine.createForwardContract({
      contractId: 'HEDGE-EUR-101',
      pair: 'EUR/USD',
      notionalAmountForeign: 1000000,
      agreedForwardRate: 1.08,
      spotRateAtInception: 1.07,
      expiryDate: '2026-12-31'
    });

    const mtmGain = GlobalHedgingEngine.evaluateMarkToMarket('HEDGE-EUR-101', 1.11);
    expect(mtmGain.mtmGainLossUSD).toBe(30000);
    expect(mtmGain.isGain).toBe(true);
  });

  // 14. ABC Inventory & Cycle Count Discrepancy Reconciliation
  it('should categorize inventory by ABC dollar usage and calculate cycle count variances', () => {
    GlobalCycleCountEngine.registerItem({ skuId: 'SKU-A1', name: 'High-Value Sensor', annualUnitUsage: 1000, unitCostUSD: 500, physicalCount: 98, systemQtyOnRecord: 100 });
    GlobalCycleCountEngine.registerItem({ skuId: 'SKU-C1', name: 'Standard Bolt', annualUnitUsage: 5000, unitCostUSD: 0.50, physicalCount: 500, systemQtyOnRecord: 500 });

    const abc = GlobalCycleCountEngine.performABCAnalysis();
    expect(abc[0].skuId).toBe('SKU-A1');
    expect(abc[0].abcClass).toBe('A');

    const recon = GlobalCycleCountEngine.reconcileCycleCountDiscrepancy('SKU-A1');
    expect(recon.varianceUnits).toBe(-2);
    expect(recon.varianceValueUSD).toBe(-1000);
  });

  // 15. Vendor OTIF Scorecard Engine
  it('should rate vendor On-Time In-Full (OTIF) delivery performance and assign tiers', () => {
    const v1 = GlobalVendorRatingEngine.recordVendorDelivery({
      vendorId: 'VEND-01',
      vendorName: 'Global Silicon Foundry',
      totalOrders: 50,
      onTimeOrders: 48,
      inFullOrders: 49,
      defectiveUnits: 5,
      totalUnitsDelivered: 10000
    });

    expect(v1.otifScorePercent).toBeGreaterThanOrEqual(95);
    expect(v1.vendorTier).toBe('PREFERRED_TIER1');
  });

  // 16. Work Center Capacity Load Engine
  it('should calculate work center utilization rate and detect bottleneck overloading', () => {
    GlobalCapacityLoadEngine.registerWorkCenter({ centerId: 'WC-ASSEMBLY', name: 'Robotic Assembly Line 1', availableHoursPerWeek: 100 });
    GlobalCapacityLoadEngine.allocateJobToWorkCenter('WC-ASSEMBLY', { jobId: 'JOB-101', requiredHours: 60 });
    GlobalCapacityLoadEngine.allocateJobToWorkCenter('WC-ASSEMBLY', { jobId: 'JOB-102', requiredHours: 50 });

    const load = GlobalCapacityLoadEngine.calculateWorkCenterLoad('WC-ASSEMBLY');
    expect(load.utilizationPercent).toBe(110);
    expect(load.isOverloaded).toBe(true);
  });

  // 17. SPC Quality Inspection Engine
  it('should evaluate Statistical Process Control (SPC) inspection samples and route QA status', () => {
    const qaPass = GlobalQualityInspectionEngine.evaluateQualitySampleBatch({
      lotId: 'LOT-BATCH-100',
      productName: 'Precision Motor Shaft',
      sampleMeasurements: [100.1, 99.9, 100.2, 100.0, 99.8],
      targetNominal: 100.0,
      toleranceAllowed: 1.0
    });

    expect(qaPass.isBatchPassed).toBe(true);
    expect(qaPass.actionStatus).toBe('RELEASED_TO_FINISHED_GOODS');
  });

  // 18. Leave Accrual & Balance Engine
  it('should calculate monthly PTO accruals and process leave request deductions', () => {
    GlobalLeaveAccrualEngine.initializeEmployeeLeaveAccount('EMP-200', { ptoBalanceDays: 10, sickLeaveDays: 5 });
    GlobalLeaveAccrualEngine.accrueMonthlyLeave('EMP-200');

    const res = GlobalLeaveAccrualEngine.requestLeave('EMP-200', { leaveType: 'PTO', durationDays: 3, startDate: '2026-09-10' });
    expect(res.account.ptoBalanceDays).toBe(8.25);
  });

  // 19. 360 Performance & Merit Salary Increase Engine
  it('should evaluate 360 performance reviews and calculate merit salary increases', () => {
    const rev = GlobalPerformanceReviewEngine.evaluatePerformance({
      employeeId: 'EMP-300',
      employeeName: 'David Chen',
      currentSalaryUSD: 100000,
      managerScore: 4.8,
      peerScore: 4.5,
      goalAttainmentPercent: 110
    });

    expect(rev.compositeScore).toBeGreaterThanOrEqual(4.5);
    expect(rev.meritIncreasePercent).toBe(8.5);
    expect(rev.newSalaryUSD).toBe(108500);
  });

  // 20. Quote-to-Order Conversion & Margin Guard Engine
  it('should enforce gross margin threshold guards before converting quote to sales order', () => {
    const quote = GlobalQuoteToOrderEngine.createQuotation({
      quoteId: 'QUO-500',
      clientName: 'Nexus Cloud Corp',
      lineItems: [
        { sku: 'SKU-SERVER', description: 'High Performance Gateway Server', qty: 10, unitCostUSD: 1000, unitPriceUSD: 1500 }
      ],
      minMarginPercentThreshold: 20.0
    });

    expect(quote.grossMarginPercent).toBe(33.3);
    expect(quote.isMarginApproved).toBe(true);

    const order = GlobalQuoteToOrderEngine.convertQuoteToSalesOrder('QUO-500');
    expect(order.orderStatus).toBe('BOOKED_TO_FULFILLMENT');
  });

  // 21. Resource Capacity Allocation & Billable Revenue Engine
  it('should calculate resource utilization rate and billable revenue grid', () => {
    GlobalResourceAllocationEngine.registerResource({ resourceId: 'RES-01', name: 'Alex Mercer', role: 'Lead Architect', standardHourlyRateUSD: 200, maxWeeklyHours: 40 });
    GlobalResourceAllocationEngine.allocateResourceToProject('RES-01', { projectId: 'PRJ-101', projectName: 'Cloud Migration', allocatedHoursPerWeek: 30 });

    const util = GlobalResourceAllocationEngine.calculateResourceUtilization('RES-01');
    expect(util.utilizationRatePercent).toBe(75);
    expect(util.totalWeeklyBillableUSD).toBe(6000);
  });

  // 22. System Health & Operational Telemetry Engine
  it('should monitor node telemetry health metrics and generate snapshot reports', () => {
    const health = GlobalSystemHealthEngine.recordTelemetrySnapshot({ activeDbConnections: 15, memoryUsageMB: 500, apiLatencyMs: 30, errorRatePercent: 0.01 });
    expect(health.status).toBe('HEALTHY_ONLINE');

    const healthReport = GlobalSystemHealthEngine.exportHealthDashboardText();
    expect(healthReport).toContain('APEX ENTERPRISE ADMIN - NODE TELEMETRY HEALTH REPORT');
    expect(healthReport.trim()).toBe(healthReport);
  });

  // 23. Deferred Revenue (ASC 606) Recognition
  it('should recognize SaaS monthly revenue according to ASC 606 schedule', () => {
    GlobalDeferredRevenueEngine.registerContract({
      contractId: 'SAAS-CON-100',
      customerName: 'Acme Cloud Corp',
      totalContractValueUSD: 120000,
      contractTermMonths: 12,
      startDate: '2026-01-01'
    });

    const rec = GlobalDeferredRevenueEngine.recognizeMonthlyRevenue('SAAS-CON-100', 1);
    expect(rec.periodEntry.monthlyRecognizedRevenue).toBe(10000);
    expect(rec.contract.deferredLiabilityUSD).toBe(110000);
  });

  // 24. Bank Statement Clearing Reconciliation
  it('should match bank statement records against ledger cash entries and calculate deposits in transit', () => {
    GlobalBankReconciliationEngine.createReconciliationPeriod({
      accountCode: '10100',
      periodName: '2026-08',
      bankStatementEndingBalanceUSD: 1050000,
      ledgerEndingBalanceUSD: 1050000
    });

    GlobalBankReconciliationEngine.addReconciliationRecord('BANK-10100-2026-08', { recordId: 'B-01', source: 'BANK', amountUSD: 5000 });
    GlobalBankReconciliationEngine.addReconciliationRecord('BANK-10100-2026-08', { recordId: 'L-01', source: 'LEDGER', amountUSD: 5000 });

    const recon = GlobalBankReconciliationEngine.performAutomatedMatching('BANK-10100-2026-08');
    expect(recon.isReconciled).toBe(true);
  });

  // 25. Landed Cost Allocation Engine
  it('should allocate inbound freight and handling fees across line items by value share', () => {
    GlobalLandedCostEngine.createShipment({ shipmentId: 'SHIP-99', vendorName: 'Global Freight Ltd' });
    GlobalLandedCostEngine.addShipmentLineItem('SHIP-99', { itemSku: 'SKU-CHIP', name: 'Microchip', qty: 100, purchasePriceUSD: 50 });
    GlobalLandedCostEngine.addAdditionalCost('SHIP-99', { costType: 'FREIGHT', amountUSD: 500 });

    const landed = GlobalLandedCostEngine.allocateLandedCosts('SHIP-99');
    expect(landed.lineItems[0].unitLandedCostUSD).toBe(55); // ($5000 + $500) / 100 = 55
  });

  // 26. Financial Ratios & Altman Z-Score
  it('should compute financial liquidity, leverage, and Altman Z-Score solvency index', () => {
    const ratio = GlobalFinancialRatioEngine.calculateRatios({
      currentAssetsUSD: 2000000,
      currentLiabilitiesUSD: 1000000,
      cashUSD: 800000,
      totalDebtUSD: 500000,
      totalEquityUSD: 3000000,
      netIncomeUSD: 400000,
      totalRevenueUSD: 5000000,
      EBITUSD: 600000,
      totalAssetsUSD: 4000000,
      retainedEarningsUSD: 1500000,
      marketCapUSD: 10000000
    });

    expect(ratio.currentRatio).toBe(2.0);
    expect(ratio.altmanZScore).toBeGreaterThan(2.99);
    expect(ratio.distressStatus).toBe('SAFE_ZONE');
  });

  // 27. Validation & Sanitizer Utility
  it('should sanitize input strings, validate email format, and strip empty lines', () => {
    expect(sanitizeString('  Enterprise   ERP   ')).toBe('Enterprise ERP');
    expect(isValidEmail('admin@apexerp.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);

    const rawMultilines = 'Header\n\n\nData Line\n  \nFooter';
    const cleanLines = stripEmptyLinesFromText(rawMultilines);
    expect(cleanLines).toBe('Header\nData Line\nFooter');
    expect(cleanLines).not.toContain('\n\n');
  });

});
