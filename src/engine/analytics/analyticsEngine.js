/**
 * ApexERP Enterprise Analytics - Business Intelligence & Reporting Exporter Engine
 */

export class AnalyticsEngine {
  constructor(ledgerEngine, inventoryEngine, salesEngine, procurementEngine, payrollEngine) {
    this.ledgerEngine = ledgerEngine;
    this.inventoryEngine = inventoryEngine;
    this.salesEngine = salesEngine;
    this.procurementEngine = procurementEngine;
    this.payrollEngine = payrollEngine;
  }

  /**
   * Executive Key Performance Indicators (KPIs) Summary
   */
  getExecutiveKPISummary() {
    const pnl = this.ledgerEngine ? this.ledgerEngine.getAllAccounts().reduce((acc, account) => {
      if (account.type === 'REVENUE') acc.revenue += account.balance;
      if (account.type === 'EXPENSE') acc.expenses += account.balance;
      return acc;
    }, { revenue: 0, expenses: 0 }) : { revenue: 0, expenses: 0 };

    const netProfit = pnl.revenue - pnl.expenses;

    const inventoryItems = this.inventoryEngine ? this.inventoryEngine.getAllItems() : [];
    const totalStockValue = inventoryItems.reduce((sum, item) => sum + (item.inventoryValue || 0), 0);
    const lowStockCount = inventoryItems.filter(item => item.totalQuantityOnHand <= item.reorderLevel).length;

    const customers = this.salesEngine ? this.salesEngine.getAllCustomers() : [];
    const totalAccountsReceivable = customers.reduce((sum, c) => sum + (c.currentBalance || 0), 0);

    const vendors = this.procurementEngine ? this.procurementEngine.getAllVendors() : [];
    const totalAccountsPayable = vendors.reduce((sum, v) => sum + (v.outstandingBalance || 0), 0);

    const employees = this.payrollEngine ? this.payrollEngine.getAllEmployees() : [];
    const monthlyPayrollLiability = employees.reduce((sum, e) => sum + (e.baseSalaryMonthly || 0), 0);

    return {
      revenue: Number(pnl.revenue.toFixed(2)),
      expenses: Number(pnl.expenses.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      profitMarginPercentage: pnl.revenue > 0 ? Number(((netProfit / pnl.revenue) * 100).toFixed(2)) : 0,
      totalStockValue: Number(totalStockValue.toFixed(2)),
      lowStockCount,
      totalAccountsReceivable: Number(totalAccountsReceivable.toFixed(2)),
      totalAccountsPayable: Number(totalAccountsPayable.toFixed(2)),
      monthlyPayrollLiability: Number(monthlyPayrollLiability.toFixed(2)),
      headcount: employees.length
    };
  }

  /**
   * Export Data Records to CSV Format
   */
  exportToCSV(dataArray, filename = 'apex_erp_export.csv') {
    if (!dataArray || dataArray.length === 0) return '';

    const headers = Object.keys(dataArray[0]);
    const csvRows = [headers.join(',')];

    dataArray.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }
}
