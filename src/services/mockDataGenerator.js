// Comprehensive Mock Data Generator for ApexERP Enterprise Platform

export const SUBSIDIARIES = [
  { id: 'sub-global', name: 'Apex Global HQ (New York)', currency: 'USD', symbol: '$' },
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

// Generate 12-Month Financial Performance Data
export const generateFinancialHistory = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => {
    const revenue = Math.floor(1800000 + Math.random() * 900000);
    const expenses = Math.floor(1100000 + Math.random() * 500000);
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
  { code: '1010', name: 'Operating Cash - Chase NYC', type: 'Asset', balance: 4250000, status: 'Active' },
  { code: '1020', name: 'Accounts Receivable', type: 'Asset', balance: 1840000, status: 'Active' },
  { code: '1050', name: 'Raw Material Inventory', type: 'Asset', balance: 3120000, status: 'Active' },
  { code: '1510', name: 'Plant Equipment & Machinery', type: 'Fixed Asset', balance: 8900000, status: 'Active' },
  { code: '2010', name: 'Accounts Payable', type: 'Liability', balance: 940000, status: 'Active' },
  { code: '2040', name: 'Accrued Payroll Liabilities', type: 'Liability', balance: 410000, status: 'Active' },
  { code: '3010', name: 'Common Paid-In Stock Equity', type: 'Equity', balance: 12000000, status: 'Active' },
  { code: '4010', name: 'Enterprise Cloud SaaS Revenue', type: 'Revenue', balance: 14500000, status: 'Active' },
  { code: '4020', name: 'Hardware & Gateway Sales', type: 'Revenue', balance: 6200000, status: 'Active' },
  { code: '5010', name: 'Cost of Goods Sold (COGS)', type: 'Expense', balance: 7400000, status: 'Active' },
  { code: '5040', name: 'R&D Engineering Expense', type: 'Expense', balance: 2800000, status: 'Active' },
  { code: '5080', name: 'Sales & Marketing Expenses', type: 'Expense', balance: 1950000, status: 'Active' }
];

// Generate Invoices
export const generateInvoices = () => {
  const clients = ['Acme Tech Corp', 'Nexus Global Systems', 'Starlight Logistics', 'Vanguard Health', 'Hyperion Dynamics', 'Aetherium Energy', 'Quantum Dynamics', 'Omni Retail Partners'];
  const statuses = ['Paid', 'Pending', 'Overdue', 'Draft'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const amount = Math.floor(12000 + Math.random() * 140000);
    const tax = Math.floor(amount * 0.08);
    const total = amount + tax;
    const client = clients[i % clients.length];
    const status = statuses[i % statuses.length];
    
    return {
      id: `INV-2026-${(100 + i).toString()}`,
      client,
      date: `2026-0${(i % 8) + 1}-${10 + (i % 18)}`,
      dueDate: `2026-0${(i % 8) + 2}-${10 + (i % 18)}`,
      amount,
      tax,
      total,
      status,
      currency: 'USD'
    };
  });
};

// Generate Inventory SKUs
export const generateInventorySKUs = () => {
  const categories = ['Hardware Components', 'Robotic Sensors', 'Semiconductor Chips', 'Networking Equipment', 'Power Supplies'];
  const warehouses = ['WH-Alpha (Chicago)', 'WH-Beta (Frankfurt)', 'WH-Gamma (Tokyo)', 'WH-Delta (Dallas)'];
  
  return Array.from({ length: 28 }, (_, i) => {
    const qtyOnHand = Math.floor(20 + Math.random() * 800);
    const reorderLevel = 150;
    const unitCost = parseFloat((45 + Math.random() * 450).toFixed(2));
    const isLowStock = qtyOnHand < reorderLevel;

    return {
      id: `SKU-${1000 + i}`,
      name: `Enterprise Module Component #${i + 1}`,
      category: categories[i % categories.length],
      warehouse: warehouses[i % warehouses.length],
      qtyOnHand,
      reorderLevel,
      unitCost,
      totalValue: (qtyOnHand * unitCost).toFixed(2),
      barcode: `890129038${i}42`,
      status: isLowStock ? 'Low Stock Warning' : 'Optimal Stock'
    };
  });
};

// Generate CRM Leads & Pipeline
export const generateCRMLeads = () => {
  const stages = ['New Lead', 'Qualification', 'Proposal Sent', 'Contract Negotiation', 'Closed Won', 'Closed Lost'];
  const companies = ['BioGenX Labs', 'CyberSec Sentinel', 'Orbital Aerospace', 'FinTech Horizon', 'Titan Mining Solutions', 'CloudScale Inc'];
  const reps = ['Sarah Jenkins', 'David Chen', 'Marcus Vance', 'Elena Rostova'];

  return Array.from({ length: 24 }, (_, i) => {
    const value = Math.floor(50000 + Math.random() * 350000);
    const stage = stages[i % stages.length];
    
    return {
      id: `LEAD-${300 + i}`,
      company: companies[i % companies.length] + ` (${i + 1})`,
      contactName: `Executive Contact ${i + 1}`,
      email: `contact${i + 1}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.com`,
      value,
      stage,
      probability: stage === 'Closed Won' ? 100 : stage === 'Closed Lost' ? 0 : Math.floor(20 + Math.random() * 70),
      owner: reps[i % reps.length],
      createdDate: `2026-07-${10 + (i % 15)}`
    };
  });
};

// Generate Employees & Payroll
export const generateEmployees = () => {
  const departments = ['Engineering', 'Finance', 'Sales', 'Operations', 'Human Resources', 'Executive'];
  const roles = ['Senior Systems Architect', 'Financial Controller', 'Account Executive', 'Supply Chain Director', 'HR Business Partner', 'VP Engineering'];
  
  return Array.from({ length: 25 }, (_, i) => {
    const department = departments[i % departments.length];
    const role = roles[i % roles.length];
    const salary = Math.floor(75000 + Math.random() * 110000);

    return {
      id: `EMP-${500 + i}`,
      name: `Employee Name ${i + 1}`,
      email: `emp${i + 1}@apexerp.com`,
      department,
      role,
      salary,
      monthlyPayroll: (salary / 12).toFixed(2),
      status: i % 7 === 0 ? 'On Leave' : 'Active',
      joinDate: `2024-03-${10 + (i % 15)}`,
      location: i % 2 === 0 ? 'HQ New York' : 'Remote'
    };
  });
};

// Generate Procurement Vendor POs
export const generateProcurementPOs = () => {
  const vendors = ['Silicon Foundry Corp', 'Global Logistics Freight', 'Precision Machining Co', 'Industrial Microchips Ltd'];
  const statuses = ['Approved', 'In Transit', 'Pending Approval', 'Received'];

  return Array.from({ length: 20 }, (_, i) => {
    const totalAmount = Math.floor(18000 + Math.random() * 210000);
    return {
      id: `PO-2026-${(700 + i).toString()}`,
      vendor: vendors[i % vendors.length],
      itemsCount: Math.floor(2 + Math.random() * 15),
      totalAmount,
      status: statuses[i % statuses.length],
      orderDate: `2026-08-0${(i % 9) + 1}`,
      expectedDelivery: `2026-08-${15 + (i % 10)}`
    };
  });
};

// Generate MRP Bills of Materials & Work Orders
export const generateMRPWorkOrders = () => {
  const products = ['Autonomous Drone Chassis (v4)', 'Industrial IoT Gateway Server', 'Solar Power Inverter Box', 'High-Density Server Rack'];
  const statuses = ['In Production', 'Queued', 'Quality Inspection', 'Completed'];

  return Array.from({ length: 16 }, (_, i) => {
    const targetQty = Math.floor(50 + Math.random() * 400);
    const completedQty = Math.floor(targetQty * (Math.random() * 0.9));

    return {
      id: `WO-2026-${(800 + i).toString()}`,
      product: products[i % products.length],
      targetQty,
      completedQty,
      workCenter: `Assembly Station #${(i % 4) + 1}`,
      status: statuses[i % statuses.length],
      startDate: `2026-08-${(i % 10) + 1}`,
      yieldPercentage: Math.floor(94 + Math.random() * 5.9) + '%'
    };
  });
};

// Generate Projects & Gantt Timeline Tasks
export const generateProjects = () => {
  return [
    {
      id: 'PRJ-101',
      name: 'Global Cloud Migration Phase 2',
      client: 'Internal Infrastructure',
      budget: 850000,
      actualCost: 610000,
      completion: 78,
      status: 'On Track',
      manager: 'Sarah Jenkins',
      startDate: '2026-05-01',
      endDate: '2026-10-31'
    },
    {
      id: 'PRJ-102',
      name: 'AI-Powered Automated Warehouse Setup',
      client: 'Starlight Logistics',
      budget: 1400000,
      actualCost: 1150000,
      completion: 92,
      status: 'Ahead of Schedule',
      manager: 'Marcus Vance',
      startDate: '2026-03-15',
      endDate: '2026-09-15'
    },
    {
      id: 'PRJ-103',
      name: 'SAP & Legacy ERP System Integration',
      client: 'Vanguard Health',
      budget: 620000,
      actualCost: 590000,
      completion: 45,
      status: 'At Risk',
      manager: 'David Chen',
      startDate: '2026-06-01',
      endDate: '2026-12-15'
    },
    {
      id: 'PRJ-104',
      name: 'Next-Gen Robotics Assembly Line',
      client: 'Hyperion Dynamics',
      budget: 2100000,
      actualCost: 980000,
      completion: 30,
      status: 'On Track',
      manager: 'Elena Rostova',
      startDate: '2026-07-01',
      endDate: '2027-02-28'
    }
  ];
};

// Generate System Audit Security Logs
export const generateAuditLogs = () => {
  const actions = ['USER_LOGIN', 'INVOICE_APPROVED', 'STOCK_ADJUSTMENT', 'PAYROLL_EXECUTED', 'RBAC_ROLE_UPDATED', 'PO_CREATED'];
  const users = ['admin@apexerp.com', 'finance_head@apexerp.com', 'warehouse_mgr@apexerp.com', 'hcm_lead@apexerp.com'];

  return Array.from({ length: 25 }, (_, i) => {
    return {
      id: `AUD-900${i + 1}`,
      timestamp: `2026-08-25 ${(10 + i % 12).toString().padStart(2, '0')}:${(i * 3 % 60).toString().padStart(2, '0')}:${(i * 7 % 60).toString().padStart(2, '0')}`,
      user: users[i % users.length],
      action: actions[i % actions.length],
      ipAddress: `192.168.1.${10 + (i % 40)}`,
      status: i % 11 === 0 ? 'WARNING' : 'SUCCESS',
      details: `Execution log details for event sequence #${i + 1042}`
    };
  });
};
