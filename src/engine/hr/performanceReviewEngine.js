/**
 * ApexERP Enterprise HCM - 360-Degree Performance Review & Merit Increase Engine
 * Evaluates goal weightages, competency ratings, and merit salary adjustment percentages.
 */

export class PerformanceReviewEngine {
  constructor() {
    this.reviewsMap = new Map();
  }

  evaluatePerformance({ employeeId, employeeName, currentSalaryUSD, managerScore = 4.0, peerScore = 4.2, goalAttainmentPercent = 95 }) {
    const empId = String(employeeId).trim().toUpperCase();
    const name = String(employeeName).trim();
    const salary = Math.max(0, Number(currentSalaryUSD || 0));

    const mgr = Math.min(5, Math.max(1, Number(managerScore || 3.0)));
    const peer = Math.min(5, Math.max(1, Number(peerScore || 3.0)));
    const goal = Math.min(150, Math.max(0, Number(goalAttainmentPercent || 100)));

    // Composite Rating Score out of 5.0
    const compositeScore = Number(((mgr * 0.4) + (peer * 0.3) + ((goal / 100) * 5.0 * 0.3)).toFixed(2));

    let meritIncreasePercent = 0;
    let performanceTier = 'MEETS_EXPECTATIONS';

    if (compositeScore >= 4.5) {
      meritIncreasePercent = 8.5;
      performanceTier = 'EXCEEDS_EXPECTATIONS';
    } else if (compositeScore >= 3.8) {
      meritIncreasePercent = 5.0;
      performanceTier = 'MEETS_EXPECTATIONS';
    } else if (compositeScore >= 3.0) {
      meritIncreasePercent = 2.5;
      performanceTier = 'NEEDS_IMPROVEMENT';
    } else {
      meritIncreasePercent = 0.0;
      performanceTier = 'UNSATISFACTORY';
    }

    const newSalaryUSD = Number((salary * (1 + meritIncreasePercent / 100)).toFixed(2));

    const review = {
      employeeId: empId,
      employeeName: name,
      compositeScore,
      performanceTier,
      meritIncreasePercent,
      currentSalaryUSD: salary,
      newSalaryUSD,
      annualSalaryIncreaseUSD: Number((newSalaryUSD - salary).toFixed(2))
    };

    this.reviewsMap.set(empId, review);
    return review;
  }

  exportPerformanceReportText(employeeId) {
    const rev = this.reviewsMap.get(String(employeeId).trim().toUpperCase());
    if (!rev) return '';

    const lines = [
      '==================================================',
      'APEX ENTERPRISE HCM - ANNUAL PERFORMANCE & MERIT SLIP',
      `Employee ID: ${rev.employeeId} | Name: ${rev.employeeName}`,
      '==================================================',
      `Composite Rating Score: ${rev.compositeScore} / 5.0`,
      `Performance Tier:       ${rev.performanceTier}`,
      `Approved Merit Increase: ${rev.meritIncreasePercent}%`,
      '--------------------------------------------------',
      `Previous Annual Salary: $${rev.currentSalaryUSD.toLocaleString()}`,
      `New Base Salary USD:    $${rev.newSalaryUSD.toLocaleString()} (+$${rev.annualSalaryIncreaseUSD.toLocaleString()})`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalPerformanceReviewEngine = new PerformanceReviewEngine();
