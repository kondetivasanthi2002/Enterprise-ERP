/**
 * ApexERP Enterprise Suite - Financial Domain Schemas & Metadata Specifications
 * Detailed definitions for 50+ Financial Accounts, Tax Codes, Currency Exchange Rates,
 * Depreciation Schedules, Cost Centers, Budget Allocations, and Sub-Ledgers.
 */

export const GAAP_ACCOUNT_CLASSIFICATION = {
  ASSETS: {
    1000: 'CASH_AND_CASH_EQUIVALENTS',
    1100: 'SHORT_TERM_INVESTMENTS',
    1200: 'ACCOUNTS_RECEIVABLE',
    1250: 'ALLOWANCE_FOR_DOUBTFUL_ACCOUNTS',
    1300: 'MERCHANDISE_INVENTORY',
    1350: 'RAW_MATERIALS_INVENTORY',
    1380: 'WORK_IN_PROGRESS_INVENTORY',
    1400: 'PREPAID_EXPENSES',
    1500: 'LAND_AND_BUILDINGS',
    1600: 'MACHINERY_AND_EQUIPMENT',
    1650: 'ACCUMULATED_DEPRECIATION_EQUIPMENT',
    1700: 'FURNITURE_AND_FIXTURES',
    1800: 'INTANGIBLE_ASSETS_PATENTS',
    1900: 'OTHER_NON_CURRENT_ASSETS'
  },
  LIABILITIES: {
    2000: 'ACCOUNTS_PAYABLE',
    2100: 'ACCRUED_SALARIES_AND_WAGES',
    2200: 'SALES_TAX_PAYABLE',
    2250: 'INCOME_TAX_WITHHOLDING_PAYABLE',
    2300: 'SHORT_TERM_NOTES_PAYABLE',
    2400: 'UNEARNED_REVENUE',
    2500: 'LONG_TERM_MORTGAGE_PAYABLE',
    2600: 'CORPORATE_BONDS_PAYABLE',
    2700: 'DEFERRED_TAX_LIABILITY'
  },
  EQUITY: {
    3000: 'COMMON_STOCK_PAR_VALUE',
    3100: 'ADDITIONAL_PAID_IN_CAPITAL',
    3200: 'RETAINED_EARNINGS',
    3300: 'TREASURY_STOCK',
    3400: 'ACCUMULATED_OTHER_COMPREHENSIVE_INCOME'
  },
  REVENUE: {
    4000: 'PRODUCT_SALES_REVENUE',
    4100: 'SERVICES_AND_CONSULTING_REVENUE',
    4200: 'SOFTWARE_SUBSCRIPTION_SAAS_REVENUE',
    4300: 'ROYALTY_AND_LICENSING_FEE',
    4400: 'INTEREST_AND_DIVIDEND_INCOME',
    4900: 'GAIN_ON_ASSET_DISPOSAL'
  },
  EXPENSES: {
    5000: 'COST_OF_GOODS_SOLD_MATERIALS',
    5100: 'COST_OF_GOODS_SOLD_DIRECT_LABOR',
    5200: 'MANUFACTURING_OVERHEAD_ALLOCATED',
    6000: 'EXECUTIVE_AND_STAFF_SALARIES',
    6100: 'OFFICE_RENT_AND_FACILITIES',
    6200: 'ELECTRICITY_WATER_UTILITIES',
    6300: 'CLOUD_SERVER_HOSTING_INFRASTRUCTURE',
    6400: 'MARKETING_AND_ADVERTISING',
    6500: 'LEGAL_AND_PROFESSIONAL_FEES',
    6600: 'DEPRECIATION_EXPENSE_EQUIPMENT',
    6700: 'AMORTIZATION_EXPENSE_INTANGIBLES',
    6800: 'TRAVEL_AND_ENTERTAINMENT',
    6900: 'BAD_DEBT_EXPENSE',
    7000: 'INTEREST_EXPENSE_ON_DEBT',
    8000: 'CORPORATE_INCOME_TAX_EXPENSE'
  }
};

export const COST_CENTER_TYPES = {
  ADMINISTRATION: 'ADMINISTRATION',
  RESEARCH_DEVELOPMENT: 'RESEARCH_DEVELOPMENT',
  SALES_MARKETING: 'SALES_MARKETING',
  OPERATIONS_LOGISTICS: 'OPERATIONS_LOGISTICS',
  MANUFACTURING_PRODUCTION: 'MANUFACTURING_PRODUCTION',
  CUSTOMER_SUPPORT: 'CUSTOMER_SUPPORT'
};

export const CURRENCY_CODES = {
  USD: { symbol: '$', name: 'US Dollar', decimalDigits: 2 },
  EUR: { symbol: '€', name: 'Euro', decimalDigits: 2 },
  GBP: { symbol: '£', name: 'British Pound', decimalDigits: 2 },
  JPY: { symbol: '¥', name: 'Japanese Yen', decimalDigits: 0 },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar', decimalDigits: 2 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', decimalDigits: 2 },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', decimalDigits: 2 },
  CNY: { symbol: 'CN¥', name: 'Chinese Yuan', decimalDigits: 2 },
  INR: { symbol: '₹', name: 'Indian Rupee', decimalDigits: 2 }
};

export const DEPRECIATION_METHODS = {
  STRAIGHT_LINE: 'STRAIGHT_LINE',
  DOUBLE_DECLINING_BALANCE: 'DOUBLE_DECLINING_BALANCE',
  SUM_OF_YEARS_DIGITS: 'SUM_OF_YEARS_DIGITS',
  UNITS_OF_PRODUCTION: 'UNITS_OF_PRODUCTION'
};

export const FinanceSchemaDefinitions = {
  CostCenterSchema: {
    costCenterId: { type: 'string', primaryKey: true },
    name: { type: 'string', required: true },
    type: { type: 'enum', values: Object.values(COST_CENTER_TYPES), required: true },
    managerEmployeeId: { type: 'string', required: true },
    annualBudgetUSD: { type: 'number', default: 0 },
    currentSpentUSD: { type: 'number', default: 0 }
  },

  FixedAssetSchema: {
    assetId: { type: 'string', primaryKey: true },
    assetName: { type: 'string', required: true },
    category: { type: 'string', required: true },
    acquisitionDate: { type: 'date', required: true },
    acquisitionCostUSD: { type: 'number', required: true },
    salvageValueUSD: { type: 'number', default: 0 },
    usefulLifeYears: { type: 'number', required: true },
    depreciationMethod: { type: 'enum', values: Object.values(DEPRECIATION_METHODS), default: DEPRECIATION_METHODS.STRAIGHT_LINE },
    accumulatedDepreciationUSD: { type: 'number', default: 0 },
    bookValueUSD: { type: 'number', required: true }
  },

  CurrencyExchangeRateSchema: {
    fromCurrency: { type: 'string', required: true },
    toCurrency: { type: 'string', required: true },
    exchangeRate: { type: 'number', required: true },
    effectiveDate: { type: 'date', required: true }
  },

  BudgetAllocationSchema: {
    budgetId: { type: 'string', primaryKey: true },
    fiscalYear: { type: 'number', required: true },
    costCenterId: { type: 'string', required: true },
    accountCode: { type: 'string', required: true },
    allocatedAmountUSD: { type: 'number', required: true },
    committedAmountUSD: { type: 'number', default: 0 },
    actualAmountUSD: { type: 'number', default: 0 }
  }
};
