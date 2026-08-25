/**
 * Test Case 4: Tax Calculation Engine Tests
 */
import { describe, it, expect } from 'vitest';
import { TaxEngine } from '../src/engine/finance/taxEngine.js';

describe('Multi-Jurisdiction Tax Engine', () => {
  const taxEngine = new TaxEngine();

  it('should calculate standard VAT tax amounts on net sales', () => {
    const result = taxEngine.calculateTax({ netAmount: 1000, taxCode: 'VAT_STANDARD' });
    expect(result.taxRate).toBe(0.20);
    expect(result.taxAmount).toBe(200);
    expect(result.grossAmount).toBe(1200);
  });

  it('should extract tax from tax-inclusive sales correctly', () => {
    const result = taxEngine.calculateTax({ netAmount: 1200, taxCode: 'VAT_STANDARD', isTaxInclusive: true });
    expect(result.netAmount).toBe(1000);
    expect(result.taxAmount).toBe(200);
    expect(result.grossAmount).toBe(1200);
  });

  it('should zero out tax when customer is tax-exempt', () => {
    const result = taxEngine.calculateTax({ netAmount: 5000, taxCode: 'VAT_STANDARD', isCustomerExempt: true });
    expect(result.taxAmount).toBe(0);
    expect(result.grossAmount).toBe(5000);
  });
});
