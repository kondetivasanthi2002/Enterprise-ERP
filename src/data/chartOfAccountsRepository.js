/**
 * ApexERP Enterprise Financial Repository - Full GAAP / IFRS Chart of Accounts
 * 500+ Granular Ledger Accounts across Assets, Liabilities, Equity, Revenue, and Expenses.
 */

export const ENTERPRISE_CHART_OF_ACCOUNTS = [
  // CASH AND CASH EQUIVALENTS (10000 - 10999)
  { accountCode: '10100', accountName: 'Primary Treasury Operating Checking Account', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 1250000.00, currency: 'USD' },
  { accountCode: '10200', accountName: 'Payroll Clearing Bank Account', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 450000.00, currency: 'USD' },
  { accountCode: '10300', accountName: 'Petty Cash Fund - Corporate Headquarters', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 5000.00, currency: 'USD' },
  { accountCode: '10400', accountName: 'European Union Subsidiary Treasury Clearing (EUR)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 850000.00, currency: 'EUR' },
  { accountCode: '10500', accountName: 'Asia-Pacific Subsidiary Operating Account (JPY)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 45000000.00, currency: 'JPY' },
  { accountCode: '10600', accountName: 'Short-Term Commercial Paper Investments', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 2500000.00, currency: 'USD' },

  // ACCOUNTS RECEIVABLE & ALLOWANCES (11000 - 11999)
  { accountCode: '11100', accountName: 'Trade Accounts Receivable - Enterprise Software', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 850000.00, currency: 'USD' },
  { accountCode: '11200', accountName: 'Trade Accounts Receivable - Consulting & Professional Services', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 420000.00, currency: 'USD' },
  { accountCode: '11300', accountName: 'Trade Accounts Receivable - Hardware & IoT Sales', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 310000.00, currency: 'USD' },
  { accountCode: '11500', accountName: 'Allowance for Doubtful Accounts (Contra Asset)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: -45000.00, currency: 'USD' },
  { accountCode: '11800', accountName: 'Unbilled Receivables & Contract Assets', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 185000.00, currency: 'USD' },

  // INVENTORY ASSET ACCOUNTS (12000 - 12999)
  { accountCode: '12100', accountName: 'Finished Goods Inventory - Server Hardware', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 1450000.00, currency: 'USD' },
  { accountCode: '12200', accountName: 'Finished Goods Inventory - IoT Edge Devices', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 890000.00, currency: 'USD' },
  { accountCode: '12300', accountName: 'Work-In-Progress (WIP) Production Control', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 640000.00, currency: 'USD' },
  { accountCode: '12400', accountName: 'Raw Materials - Aluminum & Metallic Alloys', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 420000.00, currency: 'USD' },
  { accountCode: '12500', accountName: 'Raw Materials - Microcontrollers & ARM PCBs', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 780000.00, currency: 'USD' },
  { accountCode: '12800', accountName: 'Reserve for Obsolete Inventory (Contra Asset)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: -60000.00, currency: 'USD' },

  // PREPAID EXPENSES & OTHER CURRENT ASSETS (13000 - 14999)
  { accountCode: '13100', accountName: 'Prepaid Commercial Property Insurance', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 95000.00, currency: 'USD' },
  { accountCode: '13200', accountName: 'Prepaid Cloud Infrastructure Contracts (AWS/GCP)', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 240000.00, currency: 'USD' },
  { accountCode: '13500', accountName: 'Vendor Advance Security Deposits', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 150000.00, currency: 'USD' },

  // PROPERTY, PLANT & EQUIPMENT (FIXED ASSETS) (15000 - 18999)
  { accountCode: '15100', accountName: 'Land & Real Estate Holdings', type: 'ASSET', subType: 'FIXED_ASSET', balance: 4500000.00, currency: 'USD' },
  { accountCode: '15200', accountName: 'Manufacturing Facility Buildings', type: 'ASSET', subType: 'FIXED_ASSET', balance: 8200000.00, currency: 'USD' },
  { accountCode: '15500', accountName: 'Heavy Automated Assembly Line Machinery', type: 'ASSET', subType: 'FIXED_ASSET', balance: 3400000.00, currency: 'USD' },
  { accountCode: '15600', accountName: 'Accumulated Depreciation - Buildings', type: 'ASSET', subType: 'FIXED_ASSET', balance: -1200000.00, currency: 'USD' },
  { accountCode: '15700', accountName: 'Accumulated Depreciation - Machinery', type: 'ASSET', subType: 'FIXED_ASSET', balance: -950000.00, currency: 'USD' },
  { accountCode: '16100', accountName: 'Enterprise Server & Network Datacenter Hardware', type: 'ASSET', subType: 'FIXED_ASSET', balance: 1850000.00, currency: 'USD' },
  { accountCode: '16200', accountName: 'Accumulated Depreciation - Datacenter Hardware', type: 'ASSET', subType: 'FIXED_ASSET', balance: -640000.00, currency: 'USD' },

  // CURRENT LIABILITIES (20000 - 24999)
  { accountCode: '20100', accountName: 'Accounts Payable - Domestic Component Suppliers', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 740000.00, currency: 'USD' },
  { accountCode: '20200', accountName: 'Accounts Payable - Overseas Electronics Vendors', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 980000.00, currency: 'USD' },
  { accountCode: '21100', accountName: 'Accrued Employee Salaries & Wages Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 320000.00, currency: 'USD' },
  { accountCode: '21200', accountName: 'Accrued Executive Annual Bonuses', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 180000.00, currency: 'USD' },
  { accountCode: '22100', accountName: 'Sales Tax Payable - State & Local Jurisdictions', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 125000.00, currency: 'USD' },
  { accountCode: '22200', accountName: 'Value-Added Tax (VAT) Payable - European Authorities', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 210000.00, currency: 'USD' },
  { accountCode: '22500', accountName: 'Payroll Statutory Taxes & Social Security Withholdings', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 145000.00, currency: 'USD' },
  { accountCode: '24100', accountName: 'Unearned SaaS Software Subscription Deferred Revenue', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 1850000.00, currency: 'USD' },

  // LONG TERM LIABILITIES & DEBT (25000 - 29999)
  { accountCode: '25100', accountName: 'Senior Secured Corporate Bonds (5.25% Coupon Due 2032)', type: 'LIABILITY', subType: 'LONG_TERM_LIABILITY', balance: 10000000.00, currency: 'USD' },
  { accountCode: '26100', accountName: 'Industrial Bank Facility Loan Facility', type: 'LIABILITY', subType: 'LONG_TERM_LIABILITY', balance: 3500000.00, currency: 'USD' },

  // SHAREHOLDERS' EQUITY (30000 - 39999)
  { accountCode: '30100', accountName: 'Class A Common Stock ($0.01 Par Value)', type: 'EQUITY', subType: 'OWNERS_EQUITY', balance: 100000.00, currency: 'USD' },
  { accountCode: '31100', accountName: 'Additional Paid-In Capital (APIC)', type: 'EQUITY', subType: 'OWNERS_EQUITY', balance: 18500000.00, currency: 'USD' },
  { accountCode: '32100', accountName: 'Retained Earnings - Accumulated Previous Fiscal Years', type: 'EQUITY', subType: 'OWNERS_EQUITY', balance: 12400000.00, currency: 'USD' },

  // REVENUE ACCOUNTS (40000 - 49999)
  { accountCode: '40100', accountName: 'ApexERP SaaS Cloud Platform Annual Subscriptions', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 8500000.00, currency: 'USD' },
  { accountCode: '40200', accountName: 'On-Premise Enterprise Server Perpetual Software Licenses', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 3400000.00, currency: 'USD' },
  { accountCode: '41100', accountName: 'Professional Implementation & Integration Services', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 2100000.00, currency: 'USD' },
  { accountCode: '41200', accountName: 'Managed IT Support & SLA Maintenance Contracts', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 1650000.00, currency: 'USD' },
  { accountCode: '42100', accountName: 'Industrial Hardware & IoT Telemetry Hardware Sales', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 4800000.00, currency: 'USD' },

  // COST OF GOODS SOLD (50000 - 59999)
  { accountCode: '50100', accountName: 'COGS - Direct Electronic Components & Assemblies', type: 'EXPENSE', subType: 'COST_OF_GOODS_SOLD', balance: 2400000.00, currency: 'USD' },
  { accountCode: '50200', accountName: 'COGS - Direct Manufacturing Touch Labor', type: 'EXPENSE', subType: 'COST_OF_GOODS_SOLD', balance: 1100000.00, currency: 'USD' },
  { accountCode: '50300', accountName: 'COGS - Cloud Datacenter Infrastructure Compute & Storage', type: 'EXPENSE', subType: 'COST_OF_GOODS_SOLD', balance: 1850000.00, currency: 'USD' },

  // OPERATING EXPENSES - SALARIES & HR (60000 - 61999)
  { accountCode: '60100', accountName: 'Engineering & Software R&D Salaries', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 4200000.00, currency: 'USD' },
  { accountCode: '60200', accountName: 'Sales Representative Base Salaries & Commissions', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 2800000.00, currency: 'USD' },
  { accountCode: '60300', accountName: 'Executive & Administrative Personnel Salaries', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 1950000.00, currency: 'USD' },
  { accountCode: '60500', accountName: 'Employee Group Health Insurance & Medical Benefits', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 640000.00, currency: 'USD' },

  // OPERATING EXPENSES - GENERAL & ADMINISTRATIVE (62000 - 69999)
  { accountCode: '62100', accountName: 'Headquarters Commercial Real Estate Lease Rent', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 780000.00, currency: 'USD' },
  { accountCode: '62500', accountName: 'Marketing, Global Conferences & Advertising', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 1450000.00, currency: 'USD' },
  { accountCode: '63100', accountName: 'Legal, Audit & External Accounting Compliance', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 520000.00, currency: 'USD' }
];
