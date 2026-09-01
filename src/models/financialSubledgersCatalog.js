/**
 * ApexERP Enterprise Financial Sub-Ledger Catalog & Account Specifications
 * Detailed GAAP/IFRS account definitions across Cost Centers, Subsidiaries, and Sub-ledgers.
 */

export const GENERATED_SUBLEDGER_ACCOUNTS = [];

const assetCategories = [
  'Cash Operating Bank', 'Petty Cash Local', 'Short-Term Commercial Paper', 'Trade Accounts Receivable Domestic',
  'Trade Accounts Receivable Export', 'Allowance for Doubtful Debts', 'Finished Goods Server Hardware',
  'Finished Goods IoT Devices', 'Finished Goods Mobile Terminals', 'Work in Progress Assembly',
  'Raw Material Aluminum Billets', 'Raw Material Microcontroller PCBs', 'Raw Material Thermal Paste',
  'Prepaid Insurance Contracts', 'Prepaid Cloud Infrastructure', 'Vendor Security Advances',
  'Corporate Real Estate Buildings', 'Automated Machinery Line', 'Datacenter Server Racks', 'Intangible Enterprise Patents'
];

const liabilityCategories = [
  'Accounts Payable Domestic Vendors', 'Accounts Payable Overseas Component Suppliers', 'Accrued Employee Salaries',
  'Accrued Executive Bonuses', 'Sales Tax Payable State', 'VAT Payable European Union',
  'Payroll Taxes Withholding', 'Deferred SaaS Subscription Revenue', 'Senior Secured Corporate Bonds',
  'Industrial Bank Facility'
];

const revenueCategories = [
  'ApexERP Cloud SaaS Subscriptions', 'On-Premise Software Perpetual Licenses', 'Professional Implementation Services',
  'Managed IT Support SLAs', 'Industrial IoT Hardware Sales', 'Consulting & Advisory Services',
  'Software Customization Fees', 'Training & Certification Revenue', 'Royalty & Patent Licensing',
  'Interest Income Treasury'
];

const expenseCategories = [
  'Cost of Goods Sold Electronic Parts', 'Cost of Goods Sold Direct Labor', 'Cost of Goods Sold Cloud Compute',
  'Software R&D Salaries', 'Sales Commissions & Bonuses', 'Executive Administrative Salaries',
  'Employee Health Insurance', 'Commercial Office Rent', 'Marketing & Global Conferences',
  'Legal & Audit Compliance', 'Datacenter Electricity Utilities', 'Hardware Depreciation Expense',
  'Intangible Patent Amortization', 'Travel & Executive Lodging', 'Bad Debt Expense Writeoff'
];

let codeCounter = 10000;

function populateCategory(categoryArray, accountType, subType) {
  categoryArray.forEach((catName, idx) => {
    for (let sub = 1; sub <= 25; sub++) {
      codeCounter += 10;
      GENERATED_SUBLEDGER_ACCOUNTS.push({
        accountCode: String(codeCounter),
        accountName: `${catName} - Sub-Ledger Account ${sub}`,
        type: accountType,
        subType: subType,
        balance: Number(((idx + 1) * sub * 1240.50).toFixed(2)),
        currency: sub % 3 === 0 ? 'EUR' : sub % 5 === 0 ? 'GBP' : 'USD',
        isHeader: false,
        allowDirectPosting: true,
        isReconciled: true,
        createdAt: '2026-01-01T00:00:00.000Z'
      });
    }
  });
}

populateCategory(assetCategories, 'ASSET', 'CURRENT_ASSET');
populateCategory(liabilityCategories, 'LIABILITY', 'CURRENT_LIABILITY');
populateCategory(revenueCategories, 'REVENUE', 'OPERATING_REVENUE');
populateCategory(expenseCategories, 'EXPENSE', 'OPERATING_EXPENSE');
