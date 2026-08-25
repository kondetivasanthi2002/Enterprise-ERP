/**
 * ApexERP Historical General Ledger Transaction Archive
 * 1,000+ double-entry journal transactions representing 2 years of enterprise operations.
 */

export const HISTORICAL_LEDGER_ARCHIVE = [];

const transactionTypes = [
  { desc: 'SaaS Software Cloud Annual Subscription Billing', debitAcc: '11100', creditAcc: '40100' },
  { desc: 'Enterprise Server Perpetual License Sale', debitAcc: '10100', creditAcc: '40200' },
  { desc: 'Procurement of ARM Microcontroller PCBs & Components', debitAcc: '12500', creditAcc: '20200' },
  { desc: 'Procurement of Aerospace Aluminum Billets', debitAcc: '12400', creditAcc: '20100' },
  { desc: 'Monthly Software R&D Staff Payroll Execution', debitAcc: '60100', creditAcc: '10200' },
  { desc: 'Sales Representative Commission Payment', debitAcc: '60200', creditAcc: '10100' },
  { desc: 'Headquarters Lease Rent Payment', debitAcc: '62100', creditAcc: '10100' },
  { desc: 'Cloud Datacenter Infrastructure Compute Invoice', debitAcc: '63000', creditAcc: '20100' }
];

for (let i = 1; i <= 1200; i++) {
  const t = transactionTypes[i % transactionTypes.length];
  const amount = Number((1500 + ((i * 342.50) % 150000)).toFixed(2));
  const dateStr = new Date(1735689600000 + (i * 43200000)).toISOString();

  HISTORICAL_LEDGER_ARCHIVE.push({
    journalNumber: `JNL-HIST-${String(i).padStart(5, '0')}`,
    postingDate: dateStr,
    description: `${t.desc} (Batch #${i})`,
    totalDebit: amount,
    totalCredit: amount,
    isBalanced: true,
    status: 'POSTED',
    lineItems: [
      { accountCode: t.debitAcc, description: 'Debit Entry Line', debit: amount, credit: 0 },
      { accountCode: t.creditAcc, description: 'Credit Entry Line', debit: 0, credit: amount }
    ]
  });
}
