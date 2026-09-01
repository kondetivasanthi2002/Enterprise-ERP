/**
 * Test Case 1: Financial General Ledger & Accounting Integrity Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { GeneralLedgerEngine } from '../src/engine/finance/ledger.js';
import { INITIAL_CHART_OF_ACCOUNTS } from '../src/data/mockEnterpriseDatabase.js';

describe('General Ledger & Double-Entry Accounting Engine', () => {
  let ledger;

  beforeEach(() => {
    ledger = new GeneralLedgerEngine(INITIAL_CHART_OF_ACCOUNTS);
  });

  it('should post a valid balanced journal entry and update account balances correctly', () => {
    const cashAccBefore = ledger.getAccount('10000').balance;
    const revenueAccBefore = ledger.getAccount('40000').balance;

    const entry = {
      description: 'Consulting Service Invoice Payment',
      lineItems: [
        { accountCode: '10000', debit: 5000.00, credit: 0 },
        { accountCode: '40000', debit: 0, credit: 5000.00 }
      ]
    };

    const posted = ledger.postJournalEntry(entry, { name: 'Test Accountant', role: 'ACCOUNTANT' });
    expect(posted.isBalanced).toBe(true);
    expect(posted.totalDebit).toBe(5000.00);
    expect(posted.totalCredit).toBe(5000.00);

    const cashAccAfter = ledger.getAccount('10000').balance;
    const revenueAccAfter = ledger.getAccount('40000').balance;

    expect(cashAccAfter).toBe(cashAccBefore + 5000.00);
    expect(revenueAccAfter).toBe(revenueAccBefore + 5000.00);
  });

  it('should throw an error and reject unbalanced journal entries', () => {
    const unbalancedEntry = {
      description: 'Invalid Unbalanced Entry',
      lineItems: [
        { accountCode: '10000', debit: 1000.00, credit: 0 },
        { accountCode: '40000', debit: 0, credit: 800.00 } // Off by 200
      ]
    };

    expect(() => ledger.postJournalEntry(unbalancedEntry)).toThrow(/unbalanced/i);
  });

  it('should generate a balanced Trial Balance where total debits equal total credits', () => {
    const tb = ledger.generateTrialBalance();
    expect(tb.isBalanced).toBe(true);
    expect(tb.totalDebits).toBeGreaterThan(0);
    expect(tb.totalCredits).toBe(tb.totalDebits);
  });
});
