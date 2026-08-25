/**
 * ApexERP Enterprise Supply Chain - Safety Stock & Economic Order Quantity (EOQ) Engine
 */

export class ReorderOptimizationEngine {
  /**
   * Economic Order Quantity (EOQ) Formula:
   * EOQ = sqrt( (2 * AnnualDemand * OrderCost) / HoldingCostPerUnit )
   */
  calculateEOQ({ annualDemandUnits, orderingCostPerOrder, holdingCostPerUnitAnnual }) {
    if (annualDemandUnits <= 0 || orderingCostPerOrder <= 0 || holdingCostPerUnitAnnual <= 0) {
      throw new Error('All parameters for EOQ calculation must be positive numbers.');
    }

    const eoq = Math.sqrt((2 * annualDemandUnits * orderingCostPerOrder) / holdingCostPerUnitAnnual);
    return Number(Math.round(eoq));
  }

  /**
   * Reorder Point (ROP) Formula with Safety Stock:
   * ROP = (LeadTimeDays * DailyDemand) + SafetyStock
   * SafetyStock = Z * StdDevDailyDemand * sqrt(LeadTimeDays)
   */
  calculateReorderPoint({ averageDailyDemand, leadTimeDays, safetyStockUnits = 0 }) {
    const leadTimeDemand = averageDailyDemand * leadTimeDays;
    const rop = leadTimeDemand + safetyStockUnits;
    return Number(Math.ceil(rop));
  }

  /**
   * Calculate Safety Stock for 95% or 99% Service Level
   * Z-Score: 95% = 1.645, 99% = 2.326
   */
  calculateSafetyStock({ stdDevDailyDemand, leadTimeDays, serviceLevel = 0.95 }) {
    const zScore = serviceLevel >= 0.99 ? 2.326 : 1.645;
    const safetyStock = zScore * stdDevDailyDemand * Math.sqrt(leadTimeDays);
    return Number(Math.ceil(safetyStock));
  }
}
