/**
 * ApexERP Enterprise Projects - Resource Capacity Allocation & Utilization Grid Engine
 * Tracks consultant / engineer weekly allocation, prevents over-allocation, and calculates billable revenue.
 */

export class ResourceAllocationEngine {
  constructor() {
    this.resourceGridMap = new Map();
  }

  registerResource({ resourceId, name, role, standardHourlyRateUSD = 150, maxWeeklyHours = 40 }) {
    const id = String(resourceId).trim().toUpperCase();
    const res = {
      resourceId: id,
      name: String(name).trim(),
      role: String(role || 'Enterprise Consultant').trim(),
      standardHourlyRateUSD: Number(standardHourlyRateUSD || 150),
      maxWeeklyHours: Math.max(1, parseInt(maxWeeklyHours || 40, 10)),
      projectAllocations: []
    };

    this.resourceGridMap.set(id, res);
    return res;
  }

  allocateResourceToProject(resourceId, { projectId, projectName, allocatedHoursPerWeek }) {
    const res = this.resourceGridMap.get(String(resourceId).trim().toUpperCase());
    if (!res) throw new Error(`Resource '${resourceId}' not found.`);

    const hours = Math.max(1, Number(allocatedHoursPerWeek || 1));
    const alloc = {
      projectId: String(projectId).trim().toUpperCase(),
      projectName: String(projectName).trim(),
      allocatedHoursPerWeek: hours,
      weeklyBillableUSD: Number((hours * res.standardHourlyRateUSD).toFixed(2))
    };

    res.projectAllocations.push(alloc);
    return res;
  }

  calculateResourceUtilization(resourceId) {
    const res = this.resourceGridMap.get(String(resourceId).trim().toUpperCase());
    if (!res) throw new Error(`Resource '${resourceId}' not found.`);

    const totalAllocatedHours = res.projectAllocations.reduce((sum, a) => sum + a.allocatedHoursPerWeek, 0);
    const totalWeeklyBillableUSD = res.projectAllocations.reduce((sum, a) => sum + a.weeklyBillableUSD, 0);
    const utilizationRatePercent = Number(((totalAllocatedHours / res.maxWeeklyHours) * 100).toFixed(1));
    const isOverAllocated = totalAllocatedHours > res.maxWeeklyHours;

    return {
      resourceId: res.resourceId,
      name: res.name,
      role: res.role,
      maxWeeklyHours: res.maxWeeklyHours,
      totalAllocatedHours,
      utilizationRatePercent,
      isOverAllocated,
      totalWeeklyBillableUSD: Number(totalWeeklyBillableUSD.toFixed(2))
    };
  }

  exportResourceGridText(resourceId) {
    const util = this.calculateResourceUtilization(resourceId);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE PROJECTS - RESOURCE UTILIZATION SLIP',
      `Resource: [${util.resourceId}] ${util.name} (${util.role})`,
      '==================================================',
      `Standard Available Hours: ${util.maxWeeklyHours} Hours / Week`,
      `Allocated Workload Hours: ${util.totalAllocatedHours} Hours`,
      `Weekly Billable Revenue: $${util.totalWeeklyBillableUSD.toLocaleString()} USD`,
      `Utilization Percentage:   ${util.utilizationRatePercent}%`,
      `Allocation Health:       ${util.isOverAllocated ? '🚨 OVER-ALLOCATED RISK' : '✅ BALANCED ALLOCATION'}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalResourceAllocationEngine = new ResourceAllocationEngine();
