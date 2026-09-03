/**
 * ApexERP Enterprise Finance - Multi-Subsidiary Financial Statement Consolidation Engine
 * Consolidates global subsidiary balances into Group HQ USD reporting currency.
 * Performs intercompany transaction eliminations and FX translation adjustments.
 */

import { CurrencyEngine } from './currencyEngine.js';

export class FinancialConsolidationEngine {
  constructor() {
    this.currencyEngine = new CurrencyEngine();
    this.subsidiaryBalancesMap = new Map();
    this.intercompanyEliminations = [];
  }

  /**
   * Register subsidiary financial balances in local currency
   */
  registerSubsidiaryBalances(subsidiaryId, currencyCode, accountBalances = []) {
    const cleanSubId = String(subsidiaryId).trim();
    const cleanCurr = String(currencyCode).trim().toUpperCase();

    this.subsidiaryBalancesMap.set(cleanSubId, {
      subsidiaryId: cleanSubId,
      currencyCode: cleanCurr,
      accounts: accountBalances.map(acc => ({
        code: String(acc.code).trim(),
        name: String(acc.name).trim(),
        type: String(acc.type).trim(),
        localBalance: Number(acc.balance || 0),
        isIntercompany: Boolean(acc.isIntercompany)
      }))
    });
  }

  /**
   * Add intercompany elimination rule
   */
  addIntercompanyElimination(fromSubId, toSubId, accountCode, amountLocal) {
    this.intercompanyEliminations.push({
      id: `ELIM-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 8)}`,
      fromSubId: String(fromSubId).trim(),
      toSubId: String(toSubId).trim(),
      accountCode: String(accountCode).trim(),
      amountLocal: Number(amountLocal || 0)
    });
  }

  /**
   * Consolidate global balances into USD reporting currency
   */
  consolidateGroupFinancials() {
    const consolidatedAccounts = new Map();
    let totalEliminatedUSD = 0;
    let totalTranslationAdjustmentUSD = 0;

    this.subsidiaryBalancesMap.forEach((subData, subId) => {
      subData.accounts.forEach(acc => {
        const usdBalance = this.currencyEngine.convertAmount(acc.localBalance, subData.currencyCode, 'USD');

        if (!consolidatedAccounts.has(acc.code)) {
          consolidatedAccounts.set(acc.code, {
            code: acc.code,
            name: acc.name,
            type: acc.type,
            grossUSD: 0,
            eliminationsUSD: 0,
            netConsolidatedUSD: 0
          });
        }

        const consolidatedEntry = consolidatedAccounts.get(acc.code);
        consolidatedEntry.grossUSD += usdBalance;
      });
    });

    // Apply intercompany eliminations
    this.intercompanyEliminations.forEach(elim => {
      const subData = this.subsidiaryBalancesMap.get(elim.fromSubId);
      const currency = subData ? subData.currencyCode : 'USD';
      const elimUSD = this.currencyEngine.convertAmount(elim.amountLocal, currency, 'USD');

      if (consolidatedAccounts.has(elim.accountCode)) {
        const acc = consolidatedAccounts.get(elim.accountCode);
        acc.eliminationsUSD += elimUSD;
        totalEliminatedUSD += elimUSD;
      }
    });

    // Compute net consolidated balances
    const finalReport = [];
    consolidatedAccounts.forEach(acc => {
      acc.netConsolidatedUSD = Number((acc.grossUSD - acc.eliminationsUSD).toFixed(2));
      finalReport.push(acc);
    });

    return {
      consolidationDate: new Date().toISOString(),
      reportingCurrency: 'USD',
      totalSubsidiariesConsolidated: this.subsidiaryBalancesMap.size,
      totalEliminatedUSD: Number(totalEliminatedUSD.toFixed(2)),
      accounts: finalReport
    };
  }

  /**
   * Export consolidated financial report with zero empty whitespace padding
   */
  exportConsolidatedStatementText() {
    const result = this.consolidateGroupFinancials();
    const lines = [
      '==================================================',
      'APEX ENTERPRISE ERP - GROUP FINANCIAL CONSOLIDATION',
      `Date: ${result.consolidationDate} | Currency: ${result.reportingCurrency}`,
      `Subsidiaries Consolidated: ${result.totalSubsidiariesConsolidated}`,
      '==================================================',
      'CONSOLIDATED CHART OF ACCOUNTS SUMMARY:'
    ];

    result.accounts.forEach(acc => {
      lines.push(`Code: ${acc.code} | ${acc.name} (${acc.type})`);
      lines.push(`  Gross: $${acc.grossUSD.toLocaleString()} | Eliminations: $${acc.eliminationsUSD.toLocaleString()} | Net: $${acc.netConsolidatedUSD.toLocaleString()}`);
      lines.push('--------------------------------------------------');
    });

    lines.push(`TOTAL INTERCOMPANY ELIMINATIONS: $${result.totalEliminatedUSD.toLocaleString()} USD`);

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalConsolidationEngine = new FinancialConsolidationEngine();
