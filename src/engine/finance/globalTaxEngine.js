/**
 * ApexERP Enterprise Finance - Global Multi-Jurisdiction Tax & Compliance Engine
 * Handles US State Sales Tax, EU VAT (OSS), UK VAT, and India GST (CGST, SGST, IGST).
 */

export const TAX_JURISDICTIONS = {
  US_NY: { code: 'US_NY', name: 'USA - New York State', rate: 0.08875, type: 'SALES_TAX' },
  US_CA: { code: 'US_CA', name: 'USA - California', rate: 0.0725, type: 'SALES_TAX' },
  EU_DE: { code: 'EU_DE', name: 'Germany (EU VAT Standard)', rate: 0.19, type: 'VAT' },
  EU_FR: { code: 'EU_FR', name: 'France (EU VAT Standard)', rate: 0.20, type: 'VAT' },
  UK_GB: { code: 'UK_GB', name: 'United Kingdom VAT', rate: 0.20, type: 'VAT' },
  IN_KA: { code: 'IN_KA', name: 'India - Karnataka (Intrastate GST)', rate: 0.18, type: 'GST_INTRA' },
  IN_MH: { code: 'IN_MH', name: 'India - Maharashtra (Interstate GST)', rate: 0.18, type: 'GST_INTER' }
};

export class GlobalTaxEngine {
  constructor() {
    this.customRatesMap = new Map();
  }

  /**
   * Compute tax breakdown for a transaction line item or total order
   */
  calculateTaxForOrder({ amount, jurisdictionCode = 'US_NY', isB2B = false, customerVATIN = '', itemCategory = 'STANDARD' }) {
    const numericAmount = Number(amount || 0);
    const code = String(jurisdictionCode).trim().toUpperCase();
    const jurisdiction = TAX_JURISDICTIONS[code] || TAX_JURISDICTIONS.US_NY;

    // B2B Reverse Charge Exemption for EU/UK VAT
    if (isB2B && customerVATIN.trim().length > 0 && (jurisdiction.type === 'VAT' || jurisdiction.type === 'GST_INTER')) {
      return {
        jurisdiction: jurisdiction.name,
        jurisdictionCode: jurisdiction.code,
        taxType: jurisdiction.type,
        taxableAmount: numericAmount,
        appliedRate: 0.0,
        taxAmount: 0.0,
        totalAmount: numericAmount,
        isReverseChargeApplied: true,
        note: 'Reverse Charge Mechanism (RCM) Applied - Zero Tax Rated'
      };
    }

    let appliedRate = jurisdiction.rate;

    // Reduced tax rate categories
    if (itemCategory === 'ESSENTIAL_FOOD' || itemCategory === 'MEDICAL') {
      appliedRate = 0.0;
    } else if (itemCategory === 'DIGITAL_SERVICES') {
      appliedRate = Math.max(appliedRate, 0.10);
    }

    let taxAmount = 0;
    let taxComponents = [];

    if (jurisdiction.type === 'GST_INTRA') {
      // Split into CGST (9%) and SGST (9%)
      const cgst = Number((numericAmount * (appliedRate / 2)).toFixed(2));
      const sgst = Number((numericAmount * (appliedRate / 2)).toFixed(2));
      taxAmount = cgst + sgst;
      taxComponents = [
        { name: 'Central GST (CGST)', rate: appliedRate / 2, amount: cgst },
        { name: 'State GST (SGST)', rate: appliedRate / 2, amount: sgst }
      ];
    } else if (jurisdiction.type === 'GST_INTER') {
      taxAmount = Number((numericAmount * appliedRate).toFixed(2));
      taxComponents = [{ name: 'Integrated GST (IGST)', rate: appliedRate, amount: taxAmount }];
    } else {
      taxAmount = Number((numericAmount * appliedRate).toFixed(2));
      taxComponents = [{ name: `${jurisdiction.type} (${(appliedRate * 100).toFixed(2)}%)`, rate: appliedRate, amount: taxAmount }];
    }

    const totalAmount = Number((numericAmount + taxAmount).toFixed(2));

    return {
      jurisdiction: jurisdiction.name,
      jurisdictionCode: jurisdiction.code,
      taxType: jurisdiction.type,
      taxableAmount: numericAmount,
      appliedRate,
      taxAmount,
      totalAmount,
      taxComponents,
      isReverseChargeApplied: false,
      note: 'Standard Jurisdiction Tax Calculated'
    };
  }

  /**
   * Format tax calculation breakdown report with zero trailing whitespace
   */
  exportTaxCalculationText(calculationResult) {
    const res = calculationResult;
    const lines = [
      '==================================================',
      'APEX ENTERPRISE ERP - TAX CALCULATION AUDIT SLIP',
      `Jurisdiction: ${res.jurisdiction} (${res.jurisdictionCode})`,
      `Tax Mechanism Type: ${res.taxType}`,
      '==================================================',
      `Taxable Base Amount: $${res.taxableAmount.toLocaleString()}`,
      `Total Tax Assessed:  $${res.taxAmount.toLocaleString()}`
    ];

    if (res.taxComponents && res.taxComponents.length > 0) {
      lines.push('TAX COMPONENTS BREAKDOWN:');
      res.taxComponents.forEach(comp => {
        lines.push(`  • ${comp.name}: $${comp.amount.toLocaleString()} (${(comp.rate * 100).toFixed(2)}%)`);
      });
    }

    lines.push('--------------------------------------------------');
    lines.push(`TOTAL INVOICE GROSS AMOUNT: $${res.totalAmount.toLocaleString()}`);
    lines.push(`Compliance Note: ${res.note}`);

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalTaxCalculator = new GlobalTaxEngine();
