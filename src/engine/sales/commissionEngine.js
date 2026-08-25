/**
 * ApexERP Enterprise Sales - Tiered Sales Commission & Quota Engine
 */

export class CommissionEngine {
  constructor(tierStructure = []) {
    this.tierStructure = tierStructure.length > 0 ? tierStructure : [
      { minSales: 0, maxSales: 50000, commissionRate: 0.03 },
      { minSales: 50000, maxSales: 150000, commissionRate: 0.05 },
      { minSales: 150000, maxSales: 300000, commissionRate: 0.08 },
      { minSales: 300000, maxSales: Infinity, commissionRate: 0.12 }
    ];
  }

  /**
   * Calculate Commission for a Sales Representative based on Period Sales
   */
  calculateRepresentativeCommission({ totalSalesAmount, quarterlyQuota = 100000 }) {
    let totalCommission = 0;

    let remainingSales = totalSalesAmount;

    for (const tier of this.tierStructure) {
      if (remainingSales <= 0) break;

      const tierCap = tier.maxSales - tier.minSales;
      const salesInTier = Math.min(remainingSales, tierCap);

      totalCommission += (salesInTier * tier.commissionRate);
      remainingSales -= salesInTier;
    }

    const quotaAttainmentPercentage = Number(((totalSalesAmount / quarterlyQuota) * 100).toFixed(2));
    let bonusMultiplier = 1.0;

    if (quotaAttainmentPercentage >= 150) {
      bonusMultiplier = 1.25; // 25% accelerator bonus
    } else if (quotaAttainmentPercentage >= 100) {
      bonusMultiplier = 1.10; // 10% target bonus
    }

    const finalCommission = totalCommission * bonusMultiplier;

    return {
      totalSalesAmount: Number(totalSalesAmount.toFixed(2)),
      quarterlyQuota,
      quotaAttainmentPercentage,
      baseCommission: Number(totalCommission.toFixed(2)),
      bonusMultiplier,
      finalCommission: Number(finalCommission.toFixed(2))
    };
  }
}
