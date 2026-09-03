/**
 * ApexERP Enterprise HCM - Paid Time Off (PTO) Leave Accrual & Balance Engine
 * Calculates monthly PTO accruals, sick leave rollover, and leave request deductions.
 */

export class LeaveAccrualEngine {
  constructor() {
    this.employeeLeaveBalances = new Map();
  }

  initializeEmployeeLeaveAccount(employeeId, { ptoBalanceDays = 15, sickLeaveDays = 10 }) {
    const empId = String(employeeId).trim().toUpperCase();
    const account = {
      employeeId: empId,
      ptoBalanceDays: Number(ptoBalanceDays || 15),
      sickLeaveDays: Number(sickLeaveDays || 10),
      accrualRatePerMonth: 1.25, // 15 days annual / 12 months
      leaveRequests: []
    };

    this.employeeLeaveBalances.set(empId, account);
    return account;
  }

  accrueMonthlyLeave(employeeId) {
    const empId = String(employeeId).trim().toUpperCase();
    const account = this.employeeLeaveBalances.get(empId);
    if (!account) throw new Error(`Employee '${empId}' leave account not found.`);

    account.ptoBalanceDays = Number((account.ptoBalanceDays + account.accrualRatePerMonth).toFixed(2));
    return account;
  }

  requestLeave(employeeId, { leaveType = 'PTO', durationDays, startDate }) {
    const empId = String(employeeId).trim().toUpperCase();
    const account = this.employeeLeaveBalances.get(empId);
    if (!account) throw new Error(`Employee '${empId}' leave account not found.`);

    const duration = Math.max(1, parseInt(durationDays || 1, 10));
    const type = String(leaveType).toUpperCase().trim();

    if (type === 'PTO' && account.ptoBalanceDays < duration) {
      throw new Error(`Insufficient PTO balance: Required ${duration} days, Available: ${account.ptoBalanceDays} days.`);
    }

    if (type === 'PTO') {
      account.ptoBalanceDays = Number((account.ptoBalanceDays - duration).toFixed(2));
    } else if (type === 'SICK') {
      account.sickLeaveDays = Math.max(0, account.sickLeaveDays - duration);
    }

    const req = {
      requestId: `LEAVE-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 8)}`,
      leaveType: type,
      durationDays: duration,
      startDate: String(startDate || new Date().toISOString().split('T')[0]).trim(),
      status: 'APPROVED'
    };

    account.leaveRequests.push(req);
    return { account, request: req };
  }

  exportLeaveStatementText(employeeId) {
    const account = this.employeeLeaveBalances.get(String(employeeId).trim().toUpperCase());
    if (!account) return '';

    const lines = [
      '==================================================',
      'APEX ENTERPRISE HCM - PTO LEAVE ACCRUAL STATEMENT',
      `Employee ID: ${account.employeeId}`,
      '==================================================',
      `Available PTO Balance:   ${account.ptoBalanceDays} Days`,
      `Available Sick Balance:  ${account.sickLeaveDays} Days`,
      `Monthly Accrual Rate:    ${account.accrualRatePerMonth} Days / Month`,
      '--------------------------------------------------',
      'APPROVED LEAVE HISTORY:'
    ];

    account.leaveRequests.forEach(r => {
      lines.push(`  • [${r.startDate}] ${r.leaveType}: ${r.durationDays} Day(s) [${r.status}]`);
    });

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalLeaveAccrualEngine = new LeaveAccrualEngine();
