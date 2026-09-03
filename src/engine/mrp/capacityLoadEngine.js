/**
 * ApexERP Enterprise MRP II - Work Center Rough-Cut Capacity Planning (RCCP) Engine
 * Evaluates machine hours, labor hours, work center utilization %, and bottlenecks.
 */

export class CapacityLoadEngine {
  constructor() {
    this.workCentersMap = new Map();
  }

  registerWorkCenter({ centerId, name, availableHoursPerWeek = 160, costPerHourUSD = 75 }) {
    const id = String(centerId).trim().toUpperCase();
    const center = {
      centerId: id,
      name: String(name).trim(),
      availableHoursPerWeek: Math.max(1, Number(availableHoursPerWeek || 160)),
      costPerHourUSD: Number(costPerHourUSD || 75),
      allocatedJobs: []
    };

    this.workCentersMap.set(id, center);
    return center;
  }

  allocateJobToWorkCenter(centerId, { jobId, requiredHours, priority = 'NORMAL' }) {
    const center = this.workCentersMap.get(String(centerId).trim().toUpperCase());
    if (!center) throw new Error(`Work center '${centerId}' not found.`);

    const reqHours = Math.max(1, Number(requiredHours || 1));
    const job = {
      jobId: String(jobId).trim(),
      requiredHours: reqHours,
      priority: String(priority).trim()
    };

    center.allocatedJobs.push(job);
    return center;
  }

  calculateWorkCenterLoad(centerId) {
    const center = this.workCentersMap.get(String(centerId).trim().toUpperCase());
    if (!center) throw new Error(`Work center '${centerId}' not found.`);

    const totalAllocatedHours = center.allocatedJobs.reduce((sum, j) => sum + j.requiredHours, 0);
    const utilizationPercent = Number(((totalAllocatedHours / center.availableHoursPerWeek) * 100).toFixed(1));
    const isOverloaded = utilizationPercent > 100.0;

    return {
      centerId: center.centerId,
      name: center.name,
      availableHoursPerWeek: center.availableHoursPerWeek,
      totalAllocatedHours,
      utilizationPercent,
      isOverloaded,
      jobCount: center.allocatedJobs.length
    };
  }

  exportCapacityReportText(centerId) {
    const load = this.calculateWorkCenterLoad(centerId);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE MRP II - ROUGH-CUT CAPACITY LOAD REPORT',
      `Work Center: [${load.centerId}] ${load.name}`,
      '==================================================',
      `Available Capacity: ${load.availableHoursPerWeek} Hours / Week`,
      `Allocated Load:    ${load.totalAllocatedHours} Hours (${load.jobCount} Jobs)`,
      `Utilization Rate:  ${load.utilizationPercent}%`,
      `Status: ${load.isOverloaded ? '🚨 OVERLOADED BOTTLENECK' : '✅ OPTIMAL CAPACITY'}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalCapacityLoadEngine = new CapacityLoadEngine();
