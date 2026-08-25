/**
 * ApexERP Enterprise Finance - Tax Calculator Engine
 * Multi-jurisdiction VAT, GST, Sales Tax calculation engine with tax exemptions
 */

export class TaxEngine {
  constructor(taxRules = []) {
    this.taxRules = new Map();
    const defaults = [
      { code: 'VAT_STANDARD', name: 'Standard VAT (20%)', rate: 0.20, type: 'VAT', isExempt: false },
      { code: 'VAT_REDUCED', name: 'Reduced VAT (5%)', rate: 0.05, type: 'VAT', isExempt: false },
      { code: 'GST_STANDARD', name: 'Standard GST (18%)', rate: 0.18, type: 'GST', isExempt: false },
      { code: 'SALES_TAX_US', name: 'US State Sales Tax (8.5%)', rate: 0.085, type: 'SALES_TAX', isExempt: false },
      { code: 'ZERO_RATED', name: 'Zero Rated (0%)', rate: 0.0, type: 'VAT', isExempt: true }
    ];

    [...defaults, ...taxRules].forEach(rule => this.taxRules.set(rule.code, rule));
  }

  getTaxRule(taxCode) {
    return this.taxRules.get(taxCode) || this.taxRules.get('VAT_STANDARD');
  }

  calculateTax({ netAmount, taxCode, isTaxInclusive = false, isCustomerExempt = false }) {
    if (isCustomerExempt) {
      return {
        netAmount: Number(netAmount.toFixed(2)),
        taxRate: 0,
        taxAmount: 0,
        grossAmount: Number(netAmount.toFixed(2)),
        taxCode: 'EXEMPT'
      };
    }

    const rule = this.getTaxRule(taxCode);
    const rate = rule.rate;

    let taxAmount = 0;
    let net = netAmount;

    if (isTaxInclusive) {
      net = netAmount / (1 + rate);
      taxAmount = netAmount - net;
    } else {
      taxAmount = netAmount * rate;
    }

    const grossAmount = net + taxAmount;

    return {
      netAmount: Number(net.toFixed(2)),
      taxRate: rate,
      taxAmount: Number(taxAmount.toFixed(2)),
      grossAmount: Number(grossAmount.toFixed(2)),
      taxCode: rule.code,
      taxName: rule.name
    };
  }
}

export const GlobalTaxEngine = new TaxEngine();
