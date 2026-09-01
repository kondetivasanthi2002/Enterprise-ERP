/**
 * ApexERP Enterprise Transaction Ledger History Repository
 */

export const ENTERPRISE_TRANSACTION_HISTORY = [
  {
    journalNumber: 'JNL-2026-001',
    postingDate: '2026-01-05T09:00:00.000Z',
    description: 'Q1 Enterprise SaaS Software License Revenue Recognition',
    totalDebit: 1250000.00,
    totalCredit: 1250000.00,
    isBalanced: true,
    lineItems: [
      { accountCode: '10100', description: 'Primary Checking Cash Receipt', debit: 1250000.00, credit: 0 },
      { accountCode: '40100', description: 'SaaS Software Annual Subscriptions', debit: 0, credit: 1250000.00 }
    ]
  },
  {
    journalNumber: 'JNL-2026-002',
    postingDate: '2026-01-12T14:30:00.000Z',
    description: 'Procurement of ARM Microcontroller PCBs & Aluminum Billets',
    totalDebit: 450000.00,
    totalCredit: 450000.00,
    isBalanced: true,
    lineItems: [
      { accountCode: '12400', description: 'Raw Materials - Aluminum Alloys', debit: 150000.00, credit: 0 },
      { accountCode: '12500', description: 'Raw Materials - Controller PCBs', debit: 300000.00, credit: 0 },
      { accountCode: '20100', description: 'Accounts Payable - Domestic Vendors', debit: 0, credit: 450000.00 }
    ]
  },
  {
    journalNumber: 'JNL-2026-003',
    postingDate: '2026-01-31T17:00:00.000Z',
    description: 'Monthly Payroll Run Execution & Benefits Payment',
    totalDebit: 850000.00,
    totalCredit: 850000.00,
    isBalanced: true,
    lineItems: [
      { accountCode: '60100', description: 'Engineering & Staff Salaries Expense', debit: 850000.00, credit: 0 },
      { accountCode: '22500', description: 'Statutory Payroll Tax Payable', debit: 0, credit: 180000.00 },
      { accountCode: '10200', description: 'Payroll Clearing Bank Cash Payout', debit: 0, credit: 670000.00 }
    ]
  }
];
