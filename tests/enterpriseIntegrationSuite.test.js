/**
 * ApexERP Enterprise Integration Tests: Multi-Currency, Fixed Assets, EOQ, OEE, Commissions
 */
import { describe, it, expect } from 'vitest';
import { CurrencyEngine } from '../src/engine/finance/currencyEngine.js';
import { FixedAssetsEngine } from '../src/engine/finance/fixedAssetsEngine.js';
import { ReorderOptimizationEngine } from '../src/engine/inventory/reorderEngine.js';
import { CapacityPlanningEngine } from '../src/engine/mrp/capacityPlanningEngine.js';
import { CommissionEngine } from '../src/engine/sales/commissionEngine.js';

describe('Enterprise Subsystem Calculations Integration', () => {
  it('should convert foreign currency amounts accurately via triangular arbitrage', () => {
    const fx = new CurrencyEngine();
    // 1000 USD to EUR @ 0.92 = 920 EUR
    const eur = fx.convertAmount(1000, 'USD', 'EUR');
    expect(eur).toBe(920.00);

    const formatted = fx.formatCurrency(eur, 'EUR');
    expect(formatted).toContain('920');
  });

  it('should compute straight-line fixed asset depreciation and book values', () => {
    const assets = [
      { assetId: 'AST-100', assetName: 'Server Hardware', acquisitionCostUSD: 10000, salvageValueUSD: 1000, usefulLifeYears: 5, depreciationMethod: 'STRAIGHT_LINE' }
    ];
    const fa = new FixedAssetsEngine(assets);
    // Depreciable base = 9000 / 5 = 1800 / year
    const result = fa.postDepreciationForAsset('AST-100');
    expect(result.depreciationAmount).toBe(1800);
    expect(result.asset.bookValueUSD).toBe(8200);
  });

  it('should compute Economic Order Quantity (EOQ) correctly', () => {
    const reorder = new ReorderOptimizationEngine();
    // Demand = 1000, OrderCost = $50, HoldingCost = $4 -> EOQ = sqrt(100000 / 4) = sqrt(25000) = 158.11 -> 158
    const eoq = reorder.calculateEOQ({ annualDemandUnits: 1000, orderingCostPerOrder: 50, holdingCostPerUnitAnnual: 4 });
    expect(eoq).toBe(158);
  });

  it('should calculate Overall Equipment Effectiveness (OEE) for work centers', () => {
    const mrp = new CapacityPlanningEngine();
    // Planned 8h, Run 7h (avail = 7/8 = 0.875), Total 400, Good 380 (qual = 380/400 = 0.95), Ideal 1 min (perf = (400/60)/7 = 6.66/7 = 0.952)
    const oee = mrp.calculateOEE({
      plannedOperatingHours: 8,
      actualRunHours: 7,
      totalUnitsProduced: 400,
      goodUnitsProduced: 380,
      idealCycleTimeMinutesPerUnit: 1.0
    });

    expect(oee.availabilityPercentage).toBe(87.5);
    expect(oee.qualityPercentage).toBe(95.0);
    expect(oee.oeePercentage).toBeGreaterThan(70);
  });

  it('should calculate tiered sales commissions with target quota accelerators', () => {
    const comm = new CommissionEngine();
    const res = comm.calculateRepresentativeCommission({ totalSalesAmount: 200000, quarterlyQuota: 100000 });
    // 200k sales on 100k quota = 200% attainment -> 1.25x accelerator bonus
    expect(res.quotaAttainmentPercentage).toBe(200);
    expect(res.bonusMultiplier).toBe(1.25);
    expect(res.finalCommission).toBeGreaterThan(res.baseCommission);
  });
});
