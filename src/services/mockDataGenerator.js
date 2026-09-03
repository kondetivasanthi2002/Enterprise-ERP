// Comprehensive Mock Data Generator for ApexERP Enterprise Platform
// Enforces MAX_BATCH_SIZE = 1000, crypto.randomUUID() PKs, and string sanitization (.trim())

export const SUBSIDIARIES = [
  { id: 'sub-global', name: 'Apex Global HQ (New York)', currency: 'USD', symbol: '$' },
  { id: 'sub-india', name: 'Apex India Pvt Ltd (Bengaluru / Mumbai)', currency: 'INR', symbol: '₹' },
  { id: 'sub-emea', name: 'Apex EMEA Ltd (London)', currency: 'GBP', symbol: '£' },
  { id: 'sub-apac', name: 'Apex APAC Pte (Singapore)', currency: 'SGD', symbol: 'S$' },
  { id: 'sub-latam', name: 'Apex LATAM S.A. (São Paulo)', currency: 'BRL', symbol: 'R$' }
];

export const MODULES_INFO = [
  { id: 'dashboard', name: 'Executive Control Center', category: 'Core', icon: 'LayoutDashboard' },
  { id: 'finance', name: 'Finance & Accounting', category: 'Financials', icon: 'DollarSign' },
  { id: 'inventory', name: 'Supply Chain & Inventory', category: 'Operations', icon: 'Package' },
  { id: 'sales', name: 'Sales & CRM Pipeline', category: 'Commercial', icon: 'Users' },
  { id: 'hcm', name: 'Human Capital & Payroll', category: 'Human Capital', icon: 'UserCheck' },
  { id: 'procurement', name: 'Procurement & Vendors', category: 'Operations', icon: 'ShoppingCart' },
  { id: 'mrp', name: 'Manufacturing & MRP', category: 'Operations', icon: 'Cpu' },
  { id: 'projects', name: 'Projects & Gantt Timeline', category: 'Management', icon: 'Briefcase' },
  { id: 'analytics', name: 'BI & Custom Analytics', category: 'Intelligence', icon: 'BarChart3' },
  { id: 'admin', name: 'Admin, RBAC & Audit', category: 'System', icon: 'ShieldCheck' }
];

// Maximum Batch Generation Safety Cap
export const MAX_BATCH_SIZE = 1000;

// Helper to get crypto UUID cleanly
export const generateUUID = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID format
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Generate 12-Month Financial Performance Data
export const generateFinancialHistory = (requestedLength = 12) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({ length: safeLength }, (_, idx) => {
    const month = months[idx % months.length].trim();
    const revenue = Math.floor(1800000 + ((idx * 73000) % 900000));
    const expenses = Math.floor(1100000 + ((idx * 41000) % 500000));
    const netProfit = revenue - expenses;
    return {
      month,
      revenue,
      expenses,
      netProfit,
      margin: ((netProfit / revenue) * 100).toFixed(1)
    };
  });
};

// Generate Chart of Accounts
export const generateChartOfAccounts = () => [
  { code: '1010', name: 'Operating Cash - Chase NYC'.trim(), type: 'Asset', balance: 4250000, status: 'Active' },
  { code: '1020', name: 'Accounts Receivable'.trim(), type: 'Asset', balance: 1840000, status: 'Active' },
  { code: '1050', name: 'Raw Material Inventory'.trim(), type: 'Asset', balance: 3120000, status: 'Active' },
  { code: '1510', name: 'Plant Equipment & Machinery'.trim(), type: 'Fixed Asset', balance: 8900000, status: 'Active' },
  { code: '2010', name: 'Accounts Payable'.trim(), type: 'Liability', balance: 940000, status: 'Active' },
  { code: '2040', name: 'Accrued Payroll Liabilities'.trim(), type: 'Liability', balance: 410000, status: 'Active' },
  { code: '3010', name: 'Common Paid-In Stock Equity'.trim(), type: 'Equity', balance: 12000000, status: 'Active' },
  { code: '4010', name: 'Enterprise Cloud SaaS Revenue'.trim(), type: 'Revenue', balance: 14500000, status: 'Active' },
  { code: '4020', name: 'Hardware & Gateway Sales'.trim(), type: 'Revenue', balance: 6200000, status: 'Active' },
  { code: '5010', name: 'Cost of Goods Sold (COGS)'.trim(), type: 'Expense', balance: 7400000, status: 'Active' },
  { code: '5040', name: 'R&D Engineering Expense'.trim(), type: 'Expense', balance: 2800000, status: 'Active' },
  { code: '5080', name: 'Sales & Marketing Expenses'.trim(), type: 'Expense', balance: 1950000, status: 'Active' }
];

// Generate Invoices with MAX_BATCH_SIZE cap and crypto.randomUUID() ID fallback
export const generateInvoices = (requestedLength = 30) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const clients = ['Tata Consultancy Services', 'Acme Tech Corp', 'Infosys Global Solutions', 'Nexus Global Systems', 'Reliance Enterprise', 'Starlight Logistics', 'Mahindra Tech', 'Vanguard Health'];
  const statuses = ['Paid', 'Pending', 'Overdue', 'Draft'];
  
  return Array.from({ length: safeLength }, (_, i) => {
    const amount = Math.floor(12000 + ((i * 3500) % 140000));
    const tax = Math.floor(amount * 0.08);
    const total = amount + tax;
    const client = clients[i % clients.length].trim();
    const status = statuses[i % statuses.length];
    const uuid = generateUUID();
    
    return {
      id: `INV-2026-${(100 + i).toString()}`.trim(),
      uuid: uuid,
      client,
      date: `2026-0${(i % 8) + 1}-${10 + (i % 18)}`.trim(),
      dueDate: `2026-0${(i % 8) + 2}-${10 + (i % 18)}`.trim(),
      amount,
      tax,
      total,
      status,
      currency: 'USD'
    };
  });
};

// Generate Inventory SKUs with MAX_BATCH_SIZE cap and string sanitization
export const generateInventorySKUs = (requestedLength = 28) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const categories = ['Hardware Components', 'Robotic Sensors', 'Semiconductor Chips', 'Networking Equipment', 'Power Supplies'];
  const warehouses = ['WH-India (Bengaluru)', 'WH-Alpha (Chicago)', 'WH-Beta (Frankfurt)', 'WH-Gamma (Tokyo)', 'WH-Delta (Dallas)'];
  
  return Array.from({ length: safeLength }, (_, i) => {
    const qtyOnHand = Math.floor(20 + ((i * 47) % 800));
    const reorderLevel = 150;
    const unitCost = parseFloat((45 + ((i * 19) % 450)).toFixed(2));
    const isLowStock = qtyOnHand < reorderLevel;
    const uuid = generateUUID();

    return {
      id: `SKU-${1000 + i}`.trim(),
      uuid: uuid,
      name: `Enterprise Module Component #${i + 1}`.trim(),
      category: categories[i % categories.length].trim(),
      warehouse: warehouses[i % warehouses.length].trim(),
      qtyOnHand,
      reorderLevel,
      unitCost,
      totalValue: (qtyOnHand * unitCost).toFixed(2),
      barcode: `890129038${i}42`.trim(),
      status: isLowStock ? 'Low Stock Warning' : 'Optimal Stock'
    };
  });
};

// Generate CRM Leads & Pipeline with MAX_BATCH_SIZE cap
export const generateCRMLeads = (requestedLength = 24) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const stages = ['New Lead', 'Qualification', 'Proposal Sent', 'Contract Negotiation', 'Closed Won', 'Closed Lost'];
  const companies = ['Tata Tech Innovations', 'BioGenX Labs', 'CyberSec Sentinel', 'Infosys Digital', 'Orbital Aerospace', 'FinTech Horizon'];
  const reps = ['Aarav Sharma', 'Priya Patel', 'Sarah Jenkins', 'David Chen', 'Marcus Vance'];

  return Array.from({ length: safeLength }, (_, i) => {
    const value = Math.floor(50000 + ((i * 12000) % 350000));
    const stage = stages[i % stages.length];
    const uuid = generateUUID();
    const companyName = `${companies[i % companies.length]} (${i + 1})`.trim();
    
    return {
      id: `LEAD-${300 + i}`.trim(),
      uuid: uuid,
      company: companyName,
      contactName: `Executive Contact ${i + 1}`.trim(),
      email: `contact${i + 1}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.com`.trim(),
      value,
      stage,
      probability: stage === 'Closed Won' ? 100 : stage === 'Closed Lost' ? 0 : Math.floor(20 + ((i * 7) % 70)),
      owner: reps[i % reps.length].trim(),
      createdDate: `2026-07-${10 + (i % 15)}`.trim()
    };
  });
};

// Generate Employees & Payroll with MAX_BATCH_SIZE cap
export const generateEmployees = (requestedLength = 25) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const departments = ['Engineering', 'Finance', 'Sales', 'Operations', 'Human Resources', 'Executive'];
  const roles = ['Senior Systems Architect', 'Financial Controller', 'Account Executive', 'Supply Chain Director', 'HR Business Partner', 'VP Engineering'];
  
  return Array.from({ length: safeLength }, (_, i) => {
    const department = departments[i % departments.length].trim();
    const role = roles[i % roles.length].trim();
    const salary = Math.floor(75000 + ((i * 4500) % 110000));
    const uuid = generateUUID();

    return {
      id: `EMP-${500 + i}`.trim(),
      uuid: uuid,
      name: `Employee Name ${i + 1}`.trim(),
      email: `emp${i + 1}@apexerp.com`.trim(),
      department,
      role,
      salary,
      monthlyPayroll: (salary / 12).toFixed(2),
      status: i % 7 === 0 ? 'On Leave' : 'Active',
      joinDate: `2024-03-${10 + (i % 15)}`.trim(),
      location: i % 2 === 0 ? 'HQ New York' : 'Remote'
    };
  });
};

// Generate Procurement Vendor POs with MAX_BATCH_SIZE cap
export const generateProcurementPOs = (requestedLength = 20) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const vendors = ['Silicon Foundry Corp', 'Global Logistics Freight', 'Precision Machining Co', 'Industrial Microchips Ltd'];
  const statuses = ['Approved', 'In Transit', 'Pending Approval', 'Received'];

  return Array.from({ length: safeLength }, (_, i) => {
    const totalAmount = Math.floor(18000 + ((i * 9500) % 210000));
    const uuid = generateUUID();
    return {
      id: `PO-2026-${(700 + i).toString()}`.trim(),
      uuid: uuid,
      vendor: vendors[i % vendors.length].trim(),
      itemsCount: Math.floor(2 + (i % 14)),
      totalAmount,
      status: statuses[i % statuses.length],
      orderDate: `2026-08-0${(i % 9) + 1}`.trim(),
      expectedDelivery: `2026-08-${15 + (i % 10)}`.trim()
    };
  });
};

// Generate MRP Bills of Materials & Work Orders with MAX_BATCH_SIZE cap
export const generateMRPWorkOrders = (requestedLength = 16) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const products = ['Autonomous Drone Chassis (v4)', 'Industrial IoT Gateway Server', 'Solar Power Inverter Box', 'High-Density Server Rack'];
  const statuses = ['In Production', 'Queued', 'Quality Inspection', 'Completed'];

  return Array.from({ length: safeLength }, (_, i) => {
    const targetQty = Math.floor(50 + ((i * 25) % 400));
    const completedQty = Math.floor(targetQty * 0.75);
    const uuid = generateUUID();

    return {
      id: `WO-2026-${(800 + i).toString()}`.trim(),
      uuid: uuid,
      product: products[i % products.length].trim(),
      targetQty,
      completedQty,
      workCenter: `Assembly Station #${(i % 4) + 1}`.trim(),
      status: statuses[i % statuses.length],
      startDate: `2026-08-${(i % 10) + 1}`.trim(),
      yieldPercentage: `${Math.floor(94 + (i % 6))}%`.trim()
    };
  });
};

// Generate Projects & Gantt Timeline Tasks with MAX_BATCH_SIZE cap
export const generateProjects = (requestedLength = 4) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const baseProjects = [
    {
      id: 'PRJ-101',
      name: 'Global Cloud Migration Phase 2'.trim(),
      client: 'Internal Infrastructure'.trim(),
      budget: 850000,
      actualCost: 610000,
      completion: 78,
      status: 'On Track',
      manager: 'Sarah Jenkins'.trim(),
      startDate: '2026-05-01',
      endDate: '2026-10-31'
    },
    {
      id: 'PRJ-102',
      name: 'AI-Powered Automated Warehouse Setup'.trim(),
      client: 'Starlight Logistics'.trim(),
      budget: 1400000,
      actualCost: 1150000,
      completion: 92,
      status: 'Ahead of Schedule',
      manager: 'Marcus Vance'.trim(),
      startDate: '2026-03-15',
      endDate: '2026-09-15'
    },
    {
      id: 'PRJ-103',
      name: 'SAP & Legacy ERP System Integration'.trim(),
      client: 'Vanguard Health'.trim(),
      budget: 620000,
      actualCost: 590000,
      completion: 45,
      status: 'At Risk',
      manager: 'David Chen'.trim(),
      startDate: '2026-06-01',
      endDate: '2026-12-15'
    },
    {
      id: 'PRJ-104',
      name: 'Next-Gen Robotics Assembly Line'.trim(),
      client: 'Hyperion Dynamics'.trim(),
      budget: 2100000,
      actualCost: 980000,
      completion: 30,
      status: 'On Track',
      manager: 'Elena Rostova'.trim(),
      startDate: '2026-07-01',
      endDate: '2027-02-28'
    }
  ];

  return baseProjects.slice(0, safeLength).map(p => ({ ...p, uuid: generateUUID() }));
};

// Generate System Audit Security Logs with MAX_BATCH_SIZE cap
export const generateAuditLogs = (requestedLength = 25) => {
  const safeLength = Math.min(Math.max(1, requestedLength), MAX_BATCH_SIZE);
  const actions = ['USER_LOGIN', 'INVOICE_APPROVED', 'STOCK_ADJUSTMENT', 'PAYROLL_EXECUTED', 'RBAC_ROLE_UPDATED', 'PO_CREATED'];
  const users = ['admin@apexerp.com', 'finance_head@apexerp.com', 'warehouse_mgr@apexerp.com', 'hcm_lead@apexerp.com'];

  return Array.from({ length: safeLength }, (_, i) => {
    const uuid = generateUUID();
    return {
      id: `AUD-${uuid.substring(0, 8)}`.trim(),
      uuid: uuid,
      timestamp: `2026-08-25 ${(10 + i % 12).toString().padStart(2, '0')}:${(i * 3 % 60).toString().padStart(2, '0')}:${(i * 7 % 60).toString().padStart(2, '0')}`.trim(),
      user: users[i % users.length].trim(),
      action: actions[i % actions.length].trim(),
      ipAddress: `192.168.1.${10 + (i % 40)}`.trim(),
      status: i % 11 === 0 ? 'WARNING' : 'SUCCESS',
      details: `Execution log details for event sequence #${i + 1042}`.trim()
    };
  });
};
