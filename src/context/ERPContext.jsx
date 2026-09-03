import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SUBSIDIARIES,
  MAX_BATCH_SIZE,
  generateUUID,
  generateFinancialHistory,
  generateChartOfAccounts,
  generateInvoices,
  generateInventorySKUs,
  generateCRMLeads,
  generateEmployees,
  generateProcurementPOs,
  generateMRPWorkOrders,
  generateProjects,
  generateAuditLogs
} from '../services/mockDataGenerator';
import { GlobalAuditEngine } from '../engine/core/auditEngine';
import { GlobalRBACEngine } from '../engine/core/rbacEngine';
import { GlobalTaxCalculator } from '../engine/finance/globalTaxEngine';

const ERPContext = createContext();

export const ERPProvider = ({ children }) => {
  // Global App Settings
  const [theme, setTheme] = useState('light');
  const [activeSubsidiary, setActiveSubsidiary] = useState(SUBSIDIARIES[0]);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastNotification, setToastNotification] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);

  // Authentication State
  const [user, setUser] = useState({
    id: 'usr_admin',
    name: 'Alex Mercer',
    email: 'admin@apexerp.com',
    role: 'SUPER_ADMIN',
    avatar: 'AM'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${(userData.name || '').trim()}! Logged in as ${userData.role}`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of enterprise node session', 'info');
  };

  useEffect(() => {
    document.body.className = 'light-theme';
  }, []);

  const toggleAIChat = (openState) => {
    setIsAIChatOpen(prev => typeof openState === 'boolean' ? openState : !prev);
  };

  // ERP Domain Data States
  const [financialHistory, setFinancialHistory] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [inventorySKUs, setInventorySKUs] = useState([]);
  const [crmLeads, setCrmLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [procurementPOs, setProcurementPOs] = useState([]);
  const [mrpWorkOrders, setMrpWorkOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Initialize Mock Data with MAX_BATCH_SIZE safety caps
  useEffect(() => {
    setFinancialHistory(generateFinancialHistory(12));
    setChartOfAccounts(generateChartOfAccounts());
    setInvoices(generateInvoices(30));
    setInventorySKUs(generateInventorySKUs(28));
    setCrmLeads(generateCRMLeads(24));
    setEmployees(generateEmployees(25));
    setProcurementPOs(generateProcurementPOs(20));
    setMrpWorkOrders(generateMRPWorkOrders(16));
    setProjects(generateProjects(4));
    setAuditLogs(generateAuditLogs(25));
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = `${newTheme}-theme`;
    showToast(`Switched theme to ${newTheme.toUpperCase()} mode`, 'info');
  };

  // Toast Notification Trigger
  const showToast = (message, type = 'success') => {
    setToastNotification({ message: String(message || '').trim(), type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Hardened Actions with Deduplication & Cryptographic UUID Integrity
  const addInvoice = (newInv) => {
    const uuid = generateUUID();
    const taxCalc = GlobalTaxCalculator.calculateTaxForOrder({ amount: Number(newInv.amount || 0), jurisdictionCode: 'US_NY' });
    const invWithId = {
      id: `INV-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      currency: activeSubsidiary.currency,
      client: (newInv.client || 'New Enterprise Client').trim(),
      amount: taxCalc.taxableAmount,
      tax: taxCalc.taxAmount,
      total: taxCalc.totalAmount,
      ...newInv
    };

    setInvoices(prev => {
      if (prev.some(inv => inv.id === invWithId.id || inv.uuid === invWithId.uuid)) return prev;
      return [invWithId, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    GlobalAuditEngine.recordEvent({ user, action: 'INVOICE_CREATED', entity: 'Invoice', entityId: invWithId.id, newState: invWithId });
    showToast(`Invoice ${invWithId.id} created successfully for ${invWithId.client}`);
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus.trim() } : inv));
    GlobalAuditEngine.recordEvent({ user, action: 'INVOICE_STATUS_UPDATED', entity: 'Invoice', entityId: id, newState: { newStatus } });
    showToast(`Invoice ${id} status updated to ${newStatus}`);
  };

  const addInventorySKU = (newSKU) => {
    const uuid = generateUUID();
    const qty = Math.max(0, parseInt(newSKU.qtyOnHand || 0, 10));
    const cost = parseFloat(newSKU.unitCost || 0);
    const reorder = parseInt(newSKU.reorderLevel || 100, 10);
    const skuRecord = {
      id: `SKU-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      name: String(newSKU.name || 'New Item Component').trim(),
      category: String(newSKU.category || 'Hardware Components').trim(),
      warehouse: String(newSKU.warehouse || 'WH-India (Bengaluru)').trim(),
      qtyOnHand: qty,
      reorderLevel: reorder,
      unitCost: cost,
      totalValue: (qty * cost).toFixed(2),
      status: qty < reorder ? 'Low Stock Warning' : 'Optimal Stock',
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    setInventorySKUs(prev => {
      if (prev.some(sku => sku.id === skuRecord.id || sku.uuid === skuRecord.uuid)) return prev;
      return [skuRecord, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    GlobalAuditEngine.recordEvent({ user, action: 'SKU_ADDED', entity: 'InventorySKU', entityId: skuRecord.id, newState: skuRecord });
    showToast(`SKU ${skuRecord.name} added to catalog successfully`);
  };

  const updateInventoryStock = (id, newQty) => {
    setInventorySKUs(prev => prev.map(item => {
      if (item.id === id) {
        const qtyOnHand = Math.max(0, parseInt(newQty, 10));
        const isLowStock = qtyOnHand < item.reorderLevel;
        return {
          ...item,
          qtyOnHand,
          totalValue: (qtyOnHand * item.unitCost).toFixed(2),
          status: isLowStock ? 'Low Stock Warning' : 'Optimal Stock'
        };
      }
      return item;
    }));
    showToast(`Stock level for ${id} updated`, 'info');
  };

  const addCRMLead = (newLead) => {
    const uuid = generateUUID();
    const leadRecord = {
      id: `LEAD-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      company: String(newLead.company || 'New Lead Corp').trim(),
      contactName: String(newLead.contactName || 'Primary Contact').trim(),
      email: String(newLead.email || 'contact@lead.com').trim(),
      value: Number(newLead.value || 50000),
      stage: String(newLead.stage || 'Qualification').trim(),
      probability: Number(newLead.probability || 30),
      owner: String(newLead.owner || user.name).trim(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    setCrmLeads(prev => {
      if (prev.some(lead => lead.id === leadRecord.id || lead.uuid === leadRecord.uuid)) return prev;
      return [leadRecord, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    showToast(`CRM Deal created for ${leadRecord.company}`);
  };

  const updateCRMStage = (id, newStage) => {
    setCrmLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        const prob = newStage === 'Closed Won' ? 100 : newStage === 'Closed Lost' ? 0 : lead.probability;
        return { ...lead, stage: newStage, probability: prob };
      }
      return lead;
    }));
    showToast(`Lead ${id} moved to stage '${newStage}'`);
  };

  const addEmployee = (newEmp) => {
    const uuid = generateUUID();
    const salary = Number(newEmp.salary || 85000);
    const empRecord = {
      id: `EMP-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      name: String(newEmp.name || 'New Employee').trim(),
      email: String(newEmp.email || 'new.emp@apexerp.com').trim(),
      department: String(newEmp.department || 'Engineering').trim(),
      role: String(newEmp.role || 'Software Engineer').trim(),
      salary,
      monthlyPayroll: (salary / 12).toFixed(2),
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      location: 'HQ New York'
    };

    setEmployees(prev => {
      if (prev.some(e => e.id === empRecord.id || e.uuid === empRecord.uuid)) return prev;
      return [empRecord, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    showToast(`Employee ${empRecord.name} onboarded successfully`);
  };

  const addProcurementPO = (newPO) => {
    const uuid = generateUUID();
    const poRecord = {
      id: `PO-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      vendor: String(newPO.vendor || 'Primary Supplier').trim(),
      itemsCount: Number(newPO.itemsCount || 1),
      totalAmount: Number(newPO.totalAmount || 10000),
      status: 'Pending Approval',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    setProcurementPOs(prev => {
      if (prev.some(po => po.id === poRecord.id || po.uuid === poRecord.uuid)) return prev;
      return [poRecord, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    showToast(`Purchase Order ${poRecord.id} created for ${poRecord.vendor}`);
  };

  const approvePurchaseOrder = (id) => {
    setProcurementPOs(prev => prev.map(po => po.id === id ? { ...po, status: 'Approved' } : po));
    showToast(`Purchase Order ${id} Approved by Finance Controller`);
  };

  const addMRPWorkOrder = (newWO) => {
    const uuid = generateUUID();
    const target = Number(newWO.targetQty || 100);
    const woRecord = {
      id: `WO-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      product: String(newWO.product || 'Standard Assembly').trim(),
      targetQty: target,
      completedQty: 0,
      workCenter: String(newWO.workCenter || 'Assembly Station #1').trim(),
      status: 'Queued',
      startDate: new Date().toISOString().split('T')[0],
      yieldPercentage: '100%'
    };

    setMrpWorkOrders(prev => {
      if (prev.some(wo => wo.id === woRecord.id || wo.uuid === woRecord.uuid)) return prev;
      return [woRecord, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    showToast(`MRP Work Order ${woRecord.id} scheduled successfully`);
  };

  const addProject = (newPrj) => {
    const uuid = generateUUID();
    const budget = Number(newPrj.budget || 500000);
    const prjRecord = {
      id: `PRJ-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      name: String(newPrj.name || 'New Enterprise Project').trim(),
      client: String(newPrj.client || 'Enterprise Client').trim(),
      budget,
      actualCost: 0,
      completion: 0,
      status: 'On Track',
      manager: String(newPrj.manager || user.name).trim(),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
    };

    setProjects(prev => {
      if (prev.some(p => p.id === prjRecord.id || p.uuid === prjRecord.uuid)) return prev;
      return [prjRecord, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    showToast(`Project ${prjRecord.name} initialized`);
  };

  const addJournalEntry = (accountCode, amount, type = 'debit') => {
    if (!GlobalRBACEngine.hasPermission(user, 'FINANCE_POST_JOURNAL')) {
      showToast(`Access Denied: User role ${user.role} lacks permission to post journal entries`, 'warning');
      return;
    }

    const uuid = generateUUID();
    const numericAmt = Number(amount || 0);

    setChartOfAccounts(prev => prev.map(acc => {
      if (acc.code === accountCode) {
        const delta = type === 'debit' ? numericAmt : -numericAmt;
        return { ...acc, balance: Math.max(0, acc.balance + delta) };
      }
      return acc;
    }));

    const auditEntry = {
      id: `AUD-${uuid.substring(0, 8).toUpperCase()}`,
      uuid,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user.email,
      action: 'JOURNAL_ENTRY_POSTED',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
      details: `Posted $${numericAmt} ${type} to account ${accountCode}`.trim()
    };

    setAuditLogs(prev => {
      if (prev.some(a => a.id === auditEntry.id || a.uuid === auditEntry.uuid)) return prev;
      return [auditEntry, ...prev].slice(0, MAX_BATCH_SIZE);
    });

    showToast(`Posted $${numericAmt} entry to account ${accountCode}`);
  };

  return (
    <ERPContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      theme,
      toggleTheme,
      activeSubsidiary,
      setActiveSubsidiary,
      activeModule,
      setActiveModule,
      searchQuery,
      setSearchQuery,
      toastNotification,
      showToast,
      isAIChatOpen,
      setIsAIChatOpen,
      toggleAIChat,

      // Enterprise Data & Hardened Actions
      financialHistory,
      chartOfAccounts,
      invoices,
      addInvoice,
      updateInvoiceStatus,
      inventorySKUs,
      addInventorySKU,
      updateInventoryStock,
      crmLeads,
      addCRMLead,
      updateCRMStage,
      employees,
      addEmployee,
      procurementPOs,
      addProcurementPO,
      approvePurchaseOrder,
      mrpWorkOrders,
      addMRPWorkOrder,
      projects,
      addProject,
      addJournalEntry,
      auditLogs
    }}>
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
