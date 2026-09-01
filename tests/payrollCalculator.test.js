/**
 * Test Case 3: HR & Payroll Gross-to-Net Calculation Tests
 */
import { describe, it, expect } from 'vitest';
import { PayrollEngine } from '../src/engine/hr/payrollEngine.js';

describe('Payroll Engine & Tax Withholding Calculator', () => {
  it('should compute progressive tax withholding accurately based on tax brackets', () => {
    const payroll = new PayrollEngine();

    // $1,000 monthly gross = $12,000 annual -> Bracket 0 (<= 15k): 0 tax
    expect(payroll.calculateTaxWithholding(1000)).toBe(0);

    // $3,000 monthly gross = $36,000 annual -> Bracket 1 (15k - 45k @ 12%): (36k - 15k) * 0.12 = 2520 annual / 12 = $210 monthly
    expect(payroll.calculateTaxWithholding(3000)).toBe(210);
  });

  it('should compute complete employee monthly payslip with overtime, allowances, and deductions', () => {
    const employees = [
      { employeeId: 'EMP-TEST-01', firstName: 'John', lastName: 'Doe', department: 'Engineering', designation: 'Developer', baseSalaryMonthly: 5000, allowancesMonthly: 500, status: 'ACTIVE' }
    ];

    const payroll = new PayrollEngine(employees);
    const payslip = payroll.computeEmployeePayslip({
      employeeId: 'EMP-TEST-01',
      overtimeHours: 10, // Hourly rate = 5000 / 160 = 31.25 * 1.5 = 46.875 * 10 = 468.75
      bonusAmount: 200
    });

    expect(payslip.grossSalary).toBe(6168.75); // 5000 + 500 + 468.75 + 200
    expect(payslip.netSalary).toBeLessThan(payslip.grossSalary);
    expect(payslip.totalDeductions).toBe(payslip.incomeTax + payslip.healthDeduction);
  });
});
