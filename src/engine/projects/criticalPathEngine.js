/**
 * ApexERP Enterprise Projects - Critical Path Method (CPM) & Earned Value Management (EVM) Engine
 * Calculates CPM scheduling (ES, EF, LS, LF, Float) and EVM performance metrics (CPI, SPI, EAC).
 */

export class CriticalPathEngine {
  constructor() {
    this.tasksMap = new Map();
  }

  /**
   * Register project activity task with dependencies
   */
  addTask({ taskId, name, durationDays, predecessors = [], plannedCostUSD = 0 }) {
    const id = String(taskId).trim().toUpperCase();
    const task = {
      taskId: id,
      name: String(name).trim(),
      durationDays: Math.max(1, parseInt(durationDays || 1, 10)),
      predecessors: predecessors.map(p => String(p).trim().toUpperCase()),
      plannedCostUSD: Number(plannedCostUSD || 0),
      actualCostUSD: 0,
      completionPercentage: 0,
      earlyStart: 0,
      earlyFinish: 0,
      lateStart: 0,
      lateFinish: 0,
      totalFloat: 0,
      isCritical: false
    };

    this.tasksMap.set(id, task);
    return task;
  }

  /**
   * Run Forward Pass to compute Early Start (ES) and Early Finish (EF)
   */
  runForwardPass() {
    const tasks = Array.from(this.tasksMap.values());
    let maxProjectFinish = 0;

    tasks.forEach(task => {
      if (task.predecessors.length === 0) {
        task.earlyStart = 0;
      } else {
        let maxPredEF = 0;
        task.predecessors.forEach(predId => {
          const pred = this.tasksMap.get(predId);
          if (pred) {
            maxPredEF = Math.max(maxPredEF, pred.earlyFinish);
          }
        });
        task.earlyStart = maxPredEF;
      }
      task.earlyFinish = task.earlyStart + task.durationDays;
      maxProjectFinish = Math.max(maxProjectFinish, task.earlyFinish);
    });

    return maxProjectFinish;
  }

  /**
   * Run Backward Pass to compute Late Start (LS), Late Finish (LF), and Total Float (Slack)
   */
  calculateCriticalPath() {
    const projectDuration = this.runForwardPass();
    const tasks = Array.from(this.tasksMap.values()).reverse();

    // Map successors
    const successorsMap = new Map();
    tasks.forEach(t => successorsMap.set(t.taskId, []));
    tasks.forEach(t => {
      t.predecessors.forEach(predId => {
        if (successorsMap.has(predId)) {
          successorsMap.get(predId).push(t.taskId);
        }
      });
    });

    // Backward pass
    tasks.forEach(task => {
      const successors = successorsMap.get(task.taskId) || [];
      if (successors.length === 0) {
        task.lateFinish = projectDuration;
      } else {
        let minSuccLS = Infinity;
        successors.forEach(succId => {
          const succ = this.tasksMap.get(succId);
          if (succ) {
            minSuccLS = Math.min(minSuccLS, succ.lateStart);
          }
        });
        task.lateFinish = minSuccLS === Infinity ? projectDuration : minSuccLS;
      }
      task.lateStart = task.lateFinish - task.durationDays;
      task.totalFloat = task.lateFinish - task.earlyFinish;
      task.isCritical = task.totalFloat === 0;
    });

    const sortedTasks = Array.from(this.tasksMap.values()).sort((a, b) => a.earlyStart - b.earlyStart);
    const criticalTasks = sortedTasks.filter(t => t.isCritical);

    return {
      projectDurationDays: projectDuration,
      tasks: sortedTasks,
      criticalPathSequence: criticalTasks.map(t => t.taskId)
    };
  }

  /**
   * Compute Earned Value Management (EVM) metrics
   */
  calculateEarnedValueMetrics() {
    let totalPlannedValuePV = 0;
    let totalEarnedValueEV = 0;
    let totalActualCostAC = 0;

    this.tasksMap.forEach(task => {
      const pv = task.plannedCostUSD;
      const ev = pv * (task.completionPercentage / 100);
      const ac = task.actualCostUSD;

      totalPlannedValuePV += pv;
      totalEarnedValueEV += ev;
      totalActualCostAC += ac;
    });

    const costVarianceCV = totalEarnedValueEV - totalActualCostAC;
    const scheduleVarianceSV = totalEarnedValueEV - totalPlannedValuePV;

    const cpi = totalActualCostAC > 0 ? Number((totalEarnedValueEV / totalActualCostAC).toFixed(2)) : 1.0;
    const spi = totalPlannedValuePV > 0 ? Number((totalEarnedValueEV / totalPlannedValuePV).toFixed(2)) : 1.0;
    const eac = cpi > 0 ? Number((totalPlannedValuePV / cpi).toFixed(2)) : totalPlannedValuePV;

    return {
      plannedValuePV: Number(totalPlannedValuePV.toFixed(2)),
      earnedValueEV: Number(totalEarnedValueEV.toFixed(2)),
      actualCostAC: Number(totalActualCostAC.toFixed(2)),
      costVarianceCV: Number(costVarianceCV.toFixed(2)),
      scheduleVarianceSV: Number(scheduleVarianceSV.toFixed(2)),
      costPerformanceIndexCPI: cpi,
      schedulePerformanceIndexSPI: spi,
      estimateAtCompletionEAC: eac
    };
  }

  /**
   * Export CPM Schedule summary text with zero empty whitespace lines
   */
  exportCPMScheduleText() {
    const cpm = this.calculateCriticalPath();
    const evm = this.calculateEarnedValueMetrics();

    const lines = [
      '==================================================',
      'APEX ENTERPRISE PROJECTS - CPM SCHEDULE & EVM AUDIT',
      `Calculated Project Duration: ${cpm.projectDurationDays} Days`,
      `Critical Path Sequence: [${cpm.criticalPathSequence.join(' -> ')}]`,
      '==================================================',
      'ACTIVITY SCHEDULE BREAKDOWN:'
    ];

    cpm.tasks.forEach(t => {
      const critTag = t.isCritical ? '🚨 [CRITICAL]' : '   [NORMAL]  ';
      lines.push(`${critTag} Task: ${t.taskId} (${t.name}) | Dur: ${t.durationDays}d | ES: ${t.earlyStart}d EF: ${t.earlyFinish}d | Float: ${t.totalFloat}d`);
    });

    lines.push('--------------------------------------------------');
    lines.push('EARNED VALUE MANAGEMENT (EVM) METRICS:');
    lines.push(`  • Planned Value (PV): $${evm.plannedValuePV.toLocaleString()}`);
    lines.push(`  • Earned Value (EV):  $${evm.earnedValueEV.toLocaleString()}`);
    lines.push(`  • Actual Cost (AC):   $${evm.actualCostAC.toLocaleString()}`);
    lines.push(`  • Cost Performance Index (CPI): ${evm.costPerformanceIndexCPI} (${evm.costPerformanceIndexCPI >= 1 ? 'Under Budget' : 'Over Budget'})`);
    lines.push(`  • Schedule Performance Index (SPI): ${evm.schedulePerformanceIndexSPI} (${evm.schedulePerformanceIndexSPI >= 1 ? 'Ahead of Schedule' : 'Behind Schedule'})`);
    lines.push(`  • Estimate at Completion (EAC): $${evm.estimateAtCompletionEAC.toLocaleString()}`);

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalCriticalPathEngine = new CriticalPathEngine();
