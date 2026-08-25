/**
 * ApexERP Enterprise Finance - Financial Statement Report Builders
 * Generates Balance Sheet, Profit & Loss Statement, and Cash Flow
 */

import { ACCOUNT_TYPES, ACCOUNT_SUBTYPES } from '../../models/schemas.js';

export class FinancialReportGenerator {
  constructor(ledgerEngine) {
    this.ledgerEngine = ledgerEngine;
  }

  /**
   * Profit & Loss Statement (Income Statement)
   * Net Income = Total Operating & Non-Operating Revenue - Total COGS & Operating Expenses
   */
  generateProfitAndLoss() {
    const accounts = this.ledgerEngine.getAllAccounts();

    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalOperatingExpenses = 0;

    const revenueAccounts = [];
    const cogsAccounts = [];
    const expenseAccounts = [];

    accounts.forEach(acc => {
      if (acc.type === ACCOUNT_TYPES.REVENUE) {
        totalRevenue += acc.balance;
        revenueAccounts.push(acc);
      } else if (acc.type === ACCOUNT_TYPES.EXPENSE) {
        if (acc.subType === ACCOUNT_SUBTYPES.COST_OF_GOODS_SOLD) {
          totalCOGS += acc.balance;
          cogsAccounts.push(acc);
        } else {
          totalOperatingExpenses += acc.balance;
          expenseAccounts.push(acc);
        }
      }
    });

    const grossProfit = totalRevenue - totalCOGS;
    const netIncome = grossProfit - totalOperatingExpenses;

    return {
      revenueAccounts,
      cogsAccounts,
      expenseAccounts,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalCOGS: Number(totalCOGS.toFixed(2)),
      grossProfit: Number(grossProfit.toFixed(2)),
      totalOperatingExpenses: Number(totalOperatingExpenses.toFixed(2)),
      netIncome: Number(netIncome.toFixed(2))
    };
  }

  /**
   * Balance Sheet
   * Fundamental Accounting Equation: Assets = Liabilities + Equity
   */
  generateBalanceSheet() {
    const accounts = this.ledgerEngine.getAllAccounts();
    const pnl = this.generateProfitAndLoss();

    let totalCurrentAssets = 0;
    let totalFixedAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    const currentAssetsList = [];
    const fixedAssetsList = [];
    const liabilitiesList = [];
    const equityList = [];

    accounts.forEach(acc => {
      if (acc.type === ACCOUNT_TYPES.ASSET) {
        if (acc.subType === ACCOUNT_SUBTYPES.FIXED_ASSET) {
          totalFixedAssets += acc.balance;
          fixedAssetsList.push(acc);
        } else {
          totalCurrentAssets += acc.balance;
          currentAssetsList.push(acc);
        }
      } else if (acc.type === ACCOUNT_TYPES.LIABILITY) {
        totalLiabilities += acc.balance;
        liabilitiesList.push(acc);
      } else if (acc.type === ACCOUNT_TYPES.EQUITY) {
        totalEquity += acc.balance;
        equityList.push(acc);
      }
    });

    const totalAssets = totalCurrentAssets + totalFixedAssets;
    // Retained earnings include current net income
    const totalEquityWithRetainedEarnings = totalEquity + pnl.netIncome;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquityWithRetainedEarnings;

    const isEquationBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

    return {
      currentAssets: currentAssetsList,
      fixedAssets: fixedAssetsList,
      liabilities: liabilitiesList,
      equity: equityList,
      totalCurrentAssets: Number(totalCurrentAssets.toFixed(2)),
      totalFixedAssets: Number(totalFixedAssets.toFixed(2)),
      totalAssets: Number(totalAssets.toFixed(2)),
      totalLiabilities: Number(totalLiabilities.toFixed(2)),
      totalEquityBase: Number(totalEquity.toFixed(2)),
      currentPeriodNetIncome: Number(pnl.netIncome.toFixed(2)),
      totalEquityTotal: Number(totalEquityWithRetainedEarnings.toFixed(2)),
      totalLiabilitiesAndEquity: Number(totalLiabilitiesAndEquity.toFixed(2)),
      isEquationBalanced
    };
  }
}
