/**
 * ApexERP Enterprise HCM - Payroll Tax Withholding & Benefit Deductions Engine
 * Calculates US Federal progressive tax, FICA (Social Security & Medicare), State tax, and 401(k) match.
 */

export class PayrollTaxCalculator {
  /**
   * Federal Progressive Tax Withholding Brackets (Annualized 2026 Table)
   */
  calculateFederalTaxAnnual(annualGrossSalary) {
    const gross = Math.max(0, Number(annualGrossSalary || 0));
    let tax = 0;

    if (gross <= 11600) {
      tax = gross * 0.10;
    } else if (gross <= 47150) {
      tax = 1160 + (gross - 11600) * 0.12;
    } else if (gross <= 100525) {
      tax = 5426 + (gross - 47150) * 0.22;
    } else if (gross <= 191950) {
      tax = 17168.50 + (gross - 100525) * 0.24;
    } else if (gross <= 243725) {
      tax = 39110.50 + (gross - 191950) * 0.32;
    } else {
      tax = 55678.50 + (gross - 243725) * 0.35;
    }

    return Number(tax.toFixed(2));
  }

  /**
   * Compute comprehensive monthly paystub deductions
   */
  calculateMonthlyPaystub({ employeeName, annualBaseSalary, stateCode = 'NY', k401ContributionPercent = 5, healthInsuranceMonthly = 150 }) {
    const name = String(employeeName).trim();
    const annualSalary = Math.max(0, Number(annualBaseSalary || 0));
    const monthlyGross = Number((annualSalary / 12).toFixed(2));

    // 401(k) Pre-Tax Deduction
    const k401Rate = Math.min(Math.max(0, Number(k401ContributionPercent || 0)), 50) / 100;
    const k401Deduction = Number((monthlyGross * k401Rate).toFixed(2));
    const employerK401Match = Number((monthlyGross * Math.min(k401Rate, 0.04)).toFixed(2)); // Up to 4% match

    // Taxable Wages after pre-tax 401(k) & Health
    const preTaxDeductions = k401Deduction + Number(healthInsuranceMonthly || 0);
    const taxableWagesMonthly = Math.max(0, monthlyGross - preTaxDeductions);

    // Federal Tax
    const annualFederalTax = this.calculateFederalTaxAnnual(taxableWagesMonthly * 12);
    const monthlyFederalTax = Number((annualFederalTax / 12).toFixed(2));

    // FICA Deductions: Social Security (6.2% up to $168,600) + Medicare (1.45%)
    const socialSecurity = Number((Math.min(monthlyGross, 14050) * 0.062).toFixed(2));
    const medicare = Number((monthlyGross * 0.0145).toFixed(2));
    const ficaTotal = socialSecurity + medicare;

    // State Tax Estimation (e.g. NY ~5.5%, CA ~7.0%)
    const stateTaxRate = stateCode.toUpperCase() === 'CA' ? 0.07 : stateCode.toUpperCase() === 'NY' ? 0.055 : 0.04;
    const monthlyStateTax = Number((taxableWagesMonthly * stateTaxRate).toFixed(2));

    const totalDeductions = Number((monthlyFederalTax + monthlyStateTax + ficaTotal + preTaxDeductions).toFixed(2));
    const netTakeHomePay = Number((monthlyGross - totalDeductions).toFixed(2));

    return {
      employeeName: name,
      monthlyGross,
      preTaxDeductions: {
        k401Deduction,
        healthInsuranceMonthly: Number(healthInsuranceMonthly || 0),
        totalPreTax: preTaxDeductions
      },
      taxes: {
        federalIncomeTax: monthlyFederalTax,
        stateIncomeTax: monthlyStateTax,
        socialSecurity,
        medicare,
        totalTaxes: Number((monthlyFederalTax + monthlyStateTax + ficaTotal).toFixed(2))
      },
      employerContributions: {
        k401Match: employerK401Match,
        employerFICA: ficaTotal
      },
      totalDeductions,
      netTakeHomePay
    };
  }

  /**
   * Export official paystub statement text with zero trailing whitespace
   */
  exportPaystubText(paystubData) {
    const stub = paystubData;
    const lines = [
      '==================================================',
      'APEX ENTERPRISE HCM - OFFICIAL MONTHLY PAYSTUB ADVICE',
      `Employee Name: ${stub.employeeName}`,
      `Pay Period Gross Earnings: $${stub.monthlyGross.toLocaleString()}`,
      '==================================================',
      'EARNINGS & PRE-TAX DEDUCTIONS:',
      `  • Gross Monthly Base:    $${stub.monthlyGross.toLocaleString()}`,
      `  • 401(k) Employee Plan:  -$${stub.preTaxDeductions.k401Deduction.toLocaleString()}`,
      `  • Health Insurance Premium: -$${stub.preTaxDeductions.healthInsuranceMonthly.toLocaleString()}`,
      '--------------------------------------------------',
      'STATUTORY TAX WITHHOLDINGS:',
      `  • Federal Income Tax:    -$${stub.taxes.federalIncomeTax.toLocaleString()}`,
      `  • State Income Tax:      -$${stub.taxes.stateIncomeTax.toLocaleString()}`,
      `  • Social Security (FICA): -$${stub.taxes.socialSecurity.toLocaleString()}`,
      `  • Medicare (FICA):        -$${stub.taxes.medicare.toLocaleString()}`,
      '--------------------------------------------------',
      `EMPLOYER 401(k) MATCH:   +$${stub.employerContributions.k401Match.toLocaleString()}`,
      `TOTAL DEDUCTIONS:        -$${stub.totalDeductions.toLocaleString()}`,
      `NET DIRECT DEPOSIT PAY:   $${stub.netTakeHomePay.toLocaleString()}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalPayrollTaxCalculator = new PayrollTaxCalculator();
