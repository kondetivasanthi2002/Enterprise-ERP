/**
 * ApexERP Enterprise Database Seed - Large-scale mock enterprise data
 */

export const INITIAL_CHART_OF_ACCOUNTS = [
  // Assets
  { accountCode: '10000', accountName: 'Operating Cash & Bank', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 485000.00, currency: 'USD' },
  { accountCode: '11000', accountName: 'Accounts Receivable', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 142500.00, currency: 'USD' },
  { accountCode: '12000', accountName: 'Inventory Control Asset', type: 'ASSET', subType: 'CURRENT_ASSET', balance: 320000.00, currency: 'USD' },
  { accountCode: '15000', accountName: 'Plant & Heavy Machinery', type: 'ASSET', subType: 'FIXED_ASSET', balance: 850000.00, currency: 'USD' },
  { accountCode: '15500', accountName: 'Office IT Hardware & Software', type: 'ASSET', subType: 'FIXED_ASSET', balance: 125000.00, currency: 'USD' },

  // Liabilities
  { accountCode: '20000', accountName: 'Accounts Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 98000.00, currency: 'USD' },
  { accountCode: '22000', accountName: 'Sales Tax & VAT Liability', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', balance: 34500.00, currency: 'USD' },
  { accountCode: '27000', accountName: 'Long Term Bank Credit Facility', type: 'LIABILITY', subType: 'LONG_TERM_LIABILITY', balance: 450000.00, currency: 'USD' },

  // Equity
  { accountCode: '30000', accountName: 'Shareholders Paid-In Capital', type: 'EQUITY', subType: 'OWNERS_EQUITY', balance: 1000000.00, currency: 'USD' },
  { accountCode: '32000', accountName: 'Retained Earnings Accumulation', type: 'EQUITY', subType: 'OWNERS_EQUITY', balance: 340000.00, currency: 'USD' },

  // Revenue
  { accountCode: '40000', accountName: 'Sales Revenue - Enterprise Software', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 750000.00, currency: 'USD' },
  { accountCode: '41000', accountName: 'Professional Services & Consulting', type: 'REVENUE', subType: 'OPERATING_REVENUE', balance: 220000.00, currency: 'USD' },

  // Expenses
  { accountCode: '50000', accountName: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', subType: 'COST_OF_GOODS_SOLD', balance: 310000.00, currency: 'USD' },
  { accountCode: '60000', accountName: 'Salaries & Wages Expense', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 380000.00, currency: 'USD' },
  { accountCode: '61000', accountName: 'Cloud Server Infrastructure', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 45000.00, currency: 'USD' },
  { accountCode: '62000', accountName: 'Research & Product Development', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', balance: 95000.00, currency: 'USD' }
];

export const INITIAL_ITEM_CATALOG = [
  { sku: 'APX-SER-001', name: 'Apex ERP Enterprise Server License', category: 'Software', costPrice: 1200.00, sellingPrice: 3500.00, reorderLevel: 5, totalQuantityOnHand: 45 },
  { sku: 'APX-HW-500', name: 'Industrial IoT Telemetry Sensor Gateway', category: 'Hardware', costPrice: 320.00, sellingPrice: 750.00, reorderLevel: 15, totalQuantityOnHand: 80 },
  { sku: 'APX-MOD-800', name: 'Ruggedized Warehouse Mobile Scanner', category: 'Hardware', costPrice: 450.00, sellingPrice: 990.00, reorderLevel: 10, totalQuantityOnHand: 35 },
  { sku: 'RAW-ALU-001', name: 'High-Grade Aluminum Chassis (Raw)', category: 'Raw Materials', costPrice: 45.00, sellingPrice: 90.00, reorderLevel: 100, totalQuantityOnHand: 450 },
  { sku: 'RAW-PCB-002', name: 'ARM Cortex Controller PCB Board', category: 'Components', costPrice: 85.00, sellingPrice: 160.00, reorderLevel: 50, totalQuantityOnHand: 220 }
];

export const INITIAL_CUSTOMERS = [
  { customerId: 'CUST-1001', companyName: 'Global Logistics Corp', contactName: 'Eleanor Vance', email: 'e.vance@globallogistics.com', currentBalance: 42500.00, creditLimit: 100000.00 },
  { customerId: 'CUST-1002', companyName: 'Apex Precision Engineering', contactName: 'Marcus Sterling', email: 'm.sterling@apexprecision.com', currentBalance: 28000.00, creditLimit: 75000.00 },
  { customerId: 'CUST-1003', companyName: 'Nexus Cloud Systems', contactName: 'Dr. Aris Thorne', email: 'a.thorne@nexuscloud.io', currentBalance: 72000.00, creditLimit: 150000.00 }
];

export const INITIAL_VENDORS = [
  { vendorId: 'VEND-5001', supplierName: 'Silicon Micro-Systems Ltd', contactPerson: 'Chen Wei', email: 'c.wei@siliconmicro.com', outstandingBalance: 34000.00 },
  { vendorId: 'VEND-5002', supplierName: 'Metals & Alloys Supply Co', contactPerson: 'Sarah Jenkins', email: 's.jenkins@metalsalloys.com', outstandingBalance: 64000.00 }
];

export const INITIAL_EMPLOYEES = [
  { employeeId: 'EMP-001', firstName: 'Alexander', lastName: 'Wright', department: 'Executive Management', designation: 'Chief Executive Officer', baseSalaryMonthly: 18500.00, allowancesMonthly: 2500.00, status: 'ACTIVE' },
  { employeeId: 'EMP-002', firstName: 'Sophia', lastName: 'Martinez', department: 'Finance & Accounting', designation: 'Chief Financial Officer', baseSalaryMonthly: 14500.00, allowancesMonthly: 1800.00, status: 'ACTIVE' },
  { employeeId: 'EMP-003', firstName: 'Julian', lastName: 'Kovac', department: 'Engineering & R&D', designation: 'Principal Architect', baseSalaryMonthly: 12500.00, allowancesMonthly: 1200.00, status: 'ACTIVE' },
  { employeeId: 'EMP-004', firstName: 'Elena', lastName: 'Rostova', department: 'Supply Chain & Operations', designation: 'Global Procurement Director', baseSalaryMonthly: 11000.00, allowancesMonthly: 1000.00, status: 'ACTIVE' }
];

export const INITIAL_BOMS = [
  {
    bomId: 'BOM-IOT-500',
    parentItemSku: 'APX-HW-500',
    description: 'Industrial IoT Telemetry Gateway Assembly',
    components: [
      { componentSku: 'RAW-ALU-001', quantityRequired: 1, unitCost: 45.00 },
      { componentSku: 'RAW-PCB-002', quantityRequired: 1, unitCost: 85.00 }
    ]
  }
];
