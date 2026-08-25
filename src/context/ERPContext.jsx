import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SUBSIDIARIES,
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

const ERPContext = createContext();

export const ERPProvider = ({ children }) => {
  // Global App Settings
  const [theme, setTheme] = useState('dark');
  const [activeSubsidiary, setActiveSubsidiary] = useState(SUBSIDIARIES[0]);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastNotification, setToastNotification] = useState(null);

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

  // Initialize Mock Data
  useEffect(() => {
    setFinancialHistory(generateFinancialHistory());
    setChartOfAccounts(generateChartOfAccounts());
    setInvoices(generateInvoices());
    setInventorySKUs(generateInventorySKUs());
    setCrmLeads(generateCRMLeads());
    setEmployees(generateEmployees());
    setProcurementPOs(generateProcurementPOs());
    setMrpWorkOrders(generateMRPWorkOrders());
    setProjects(generateProjects());
    setAuditLogs(generateAuditLogs());
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
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Helper Actions (CRUD & Domain Actions)
  const addInvoice = (newInv) => {
    const invWithId = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      currency: activeSubsidiary.currency,
      ...newInv
    };
    setInvoices([invWithId, ...invoices]);
    showToast(`Invoice ${invWithId.id} created successfully for ${invWithId.client}`);
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    showToast(`Invoice ${id} status updated to ${newStatus}`);
  };

  const updateInventoryStock = (id, newQty) => {
    setInventorySKUs(inventorySKUs.map(item => {
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

  const updateCRMStage = (id, newStage) => {
    setCrmLeads(crmLeads.map(lead => {
      if (lead.id === id) {
        const prob = newStage === 'Closed Won' ? 100 : newStage === 'Closed Lost' ? 0 : lead.probability;
        return { ...lead, stage: newStage, probability: prob };
      }
      return lead;
    }));
    showToast(`Lead ${id} moved to stage '${newStage}'`);
  };

  const addEmployee = (newEmp) => {
    const empRecord = {
      id: `EMP-${Math.floor(500 + Math.random() * 500)}`,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      monthlyPayroll: (newEmp.salary / 12).toFixed(2),
      ...newEmp
    };
    setEmployees([empRecord, ...employees]);
    showToast(`Employee ${empRecord.name} onboarded successfully`);
  };

  const approvePurchaseOrder = (id) => {
    setProcurementPOs(procurementPOs.map(po => po.id === id ? { ...po, status: 'Approved' } : po));
    showToast(`Purchase Order ${id} Approved by Finance Controller`);
  };

  return (
    <ERPContext.Provider value={{
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

      // Enterprise Data
      financialHistory,
      chartOfAccounts,
      invoices,
      addInvoice,
      updateInvoiceStatus,
      inventorySKUs,
      updateInventoryStock,
      crmLeads,
      updateCRMStage,
      employees,
      addEmployee,
      procurementPOs,
      approvePurchaseOrder,
      mrpWorkOrders,
      projects,
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
