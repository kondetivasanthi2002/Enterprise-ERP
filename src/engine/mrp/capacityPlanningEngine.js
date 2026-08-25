/**
 * ApexERP Enterprise Manufacturing - Work Center Capacity Planning & OEE Engine
 * Overall Equipment Effectiveness (OEE) = Availability * Performance * Quality
 */

export class CapacityPlanningEngine {
  constructor(workCenters = []) {
    this.workCentersMap = new Map();
    const defaults = [
      { id: 'WC-CNC-01', name: '5-Axis CNC Milling Station', dailyCapacityHours: 16, currentLoadHours: 12 },
      { id: 'WC-ASSY-02', name: 'Automated Surface Mount PCB Assembly Line', dailyCapacityHours: 24, currentLoadHours: 20 },
      { id: 'WC-TEST-03', name: 'Final Quality & Environment Test Chamber', dailyCapacityHours: 8, currentLoadHours: 6 }
    ];

    [...defaults, ...workCenters].forEach(wc => this.workCentersMap.set(wc.id, wc));
  }

  /**
   * Calculate Overall Equipment Effectiveness (OEE)
   */
  calculateOEE({ plannedOperatingHours, actualRunHours, totalUnitsProduced, goodUnitsProduced, idealCycleTimeMinutesPerUnit }) {
    if (plannedOperatingHours <= 0 || actualRunHours <= 0) return { oeePercentage: 0 };

    // 1. Availability Factor = Actual Run Time / Planned Operating Time
    const availability = actualRunHours / plannedOperatingHours;

    // 2. Performance Factor = (Ideal Cycle Time * Total Units) / Actual Run Time
    const idealRunHours = (totalUnitsProduced * idealCycleTimeMinutesPerUnit) / 60;
    const performance = Math.min(1.0, idealRunHours / actualRunHours);

    // 3. Quality Factor = Good Units / Total Units
    const quality = totalUnitsProduced > 0 ? (goodUnitsProduced / totalUnitsProduced) : 1.0;

    const oee = availability * performance * quality;

    return {
      availabilityPercentage: Number((availability * 100).toFixed(2)),
      performancePercentage: Number((performance * 100).toFixed(2)),
      qualityPercentage: Number((quality * 100).toFixed(2)),
      oeePercentage: Number((oee * 100).toFixed(2)),
      isWorldClass: (oee >= 0.85) // 85% is World Class OEE benchmark
    };
  }

  /**
   * Check Work Center Capacity for a proposed Work Order
   */
  checkCapacityAvailability(workCenterId, requiredHours) {
    const wc = this.workCentersMap.get(workCenterId);
    if (!wc) throw new Error(`Work Center '${workCenterId}' not found.`);

    const remainingCapacity = wc.dailyCapacityHours - wc.currentLoadHours;
    const isFeasible = remainingCapacity >= requiredHours;

    return {
      workCenterId,
      name: wc.name,
      dailyCapacityHours: wc.dailyCapacityHours,
      currentLoadHours: wc.currentLoadHours,
      remainingCapacityHours: Math.max(0, remainingCapacity),
      requiredHours,
      isFeasible,
      utilizationPercentage: Number(((wc.currentLoadHours / wc.dailyCapacityHours) * 100).toFixed(2))
    };
  }
}
