/**
 * ApexERP Enterprise HR & Payroll Engine
 * Gross-to-Net payroll processing, progressive tax withholding brackets, benefits deductions
 */

import { EMPLOYEE_STATUS } from '../../models/schemas.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class PayrollEngine {
  constructor(initialEmployees = [], ledgerEngine = null) {
    this.employeesMap = new Map();
    this.payrollRuns = [];
    this.ledgerEngine = ledgerEngine;

    initialEmployees.forEach(emp => this.employeesMap.set(emp.employeeId, { ...emp }));
  }

  getEmployee(employeeId) {
    const emp = this.employeesMap.get(employeeId);
    if (!emp) throw new Error(`Employee '${employeeId}' not found in Employee Master.`);
    return emp;
  }

  getAllEmployees() {
    return Array.from(this.employeesMap.values());
  }

  /**
   * Progressive Income Tax Withholding Calculator
   */
  calculateTaxWithholding(grossSalaryMonthly) {
    const annualGross = grossSalaryMonthly * 12;
    let annualTax = 0;

    // Progressive tax brackets
    if (annualGross <= 15000) {
      annualTax = 0;
    } else if (annualGross <= 45000) {
      annualTax = (annualGross - 15000) * 0.12;
    } else if (annualGross <= 95000) {
      annualTax = (30000 * 0.12) + (annualGross - 45000) * 0.22;
    } else {
      annualTax = (30000 * 0.12) + (50000 * 0.22) + (annualGross - 95000) * 0.32;
    }

    const monthlyTax = annualTax / 12;
    return Number(monthlyTax.toFixed(2));
  }

  /**
   * Compute single employee monthly payslip
   */
  computeEmployeePayslip({ employeeId, overtimeHours = 0, bonusAmount = 0, unpaidLeaveDays = 0 }) {
    const emp = this.getEmployee(employeeId);

    const hourlyRate = (emp.baseSalaryMonthly / 160); // 160 std monthly hours
    const overtimePay = Number((overtimeHours * hourlyRate * 1.5).toFixed(2));
    const leaveDeduction = Number((unpaidLeaveDays * (emp.baseSalaryMonthly / 22)).toFixed(2)); // 22 working days

    const grossSalary = Number((emp.baseSalaryMonthly + (emp.allowancesMonthly || 0) + overtimePay + bonusAmount - leaveDeduction).toFixed(2));
    const incomeTax = this.calculateTaxWithholding(grossSalary);
    const socialSecurityHealthDeduction = Number((grossSalary * 0.05).toFixed(2)); // 5% mandatory health/retirement
    const totalDeductions = Number((incomeTax + socialSecurityHealthDeduction).toFixed(2));
    const netSalary = Number((grossSalary - totalDeductions).toFixed(2));

    return {
      employeeId: emp.employeeId,
      fullName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      baseSalary: emp.baseSalaryMonthly,
      allowances: emp.allowancesMonthly || 0,
      overtimePay,
      bonusAmount,
      leaveDeduction,
      grossSalary,
      incomeTax,
      healthDeduction: socialSecurityHealthDeduction,
      totalDeductions,
      netSalary
    };
  }

  /**
   * Run Monthly Company-Wide Payroll & Post Salary Journal Entries
   */
  executeMonthlyPayrollRun({ periodName = '2026-08', user = null }) {
    const activeEmployees = Array.from(this.employeesMap.values()).filter(e => e.status === EMPLOYEE_STATUS.ACTIVE);

    let totalGross = 0;
    let totalTax = 0;
    let totalHealth = 0;
    let totalNetPay = 0;
    const payslips = [];

    activeEmployees.forEach(emp => {
      const payslip = this.computeEmployeePayslip({ employeeId: emp.employeeId });
      payslips.push(payslip);

      totalGross += payslip.grossSalary;
      totalTax += payslip.incomeTax;
      totalHealth += payslip.healthDeduction;
      totalNetPay += payslip.netSalary;
    });

    const payrollRun = {
      runId: `PAY-${periodName}-${Date.now()}`,
      periodName,
      executionDate: new Date().toISOString(),
      employeeCount: activeEmployees.length,
      payslips,
      totalGross: Number(totalGross.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      totalHealth: Number(totalHealth.toFixed(2)),
      totalNetPay: Number(totalNetPay.toFixed(2))
    };

    this.payrollRuns.unshift(payrollRun);

    // General Ledger Posting (Salary Expense, Payroll Tax Payable, Cash Payable)
    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `Monthly Payroll Run - ${periodName}`,
        lineItems: [
          { accountCode: '60000', description: 'Salaries & Wages Expense', debit: payrollRun.totalGross, credit: 0 },
          { accountCode: '22000', description: 'Payroll Income Tax Payable', debit: 0, credit: payrollRun.totalTax },
          { accountCode: '22000', description: 'Health & Benefit Liability', debit: 0, credit: payrollRun.totalHealth },
          { accountCode: '10000', description: 'Operating Cash Bank Account', debit: 0, credit: payrollRun.totalNetPay }
        ]
      }, user);
    }

    GlobalAuditLogger.logEvent({ user, action: 'EXECUTE_PAYROLL_RUN', entity: 'PayrollRun', entityId: payrollRun.runId, newState: payrollRun });
    GlobalEventBus.publish('PAYROLL_RUN_COMPLETED', payrollRun);

    return payrollRun;
  }
}
