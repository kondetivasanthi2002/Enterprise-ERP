/**
 * ApexERP Enterprise Finance - Direct & Indirect Cash Flow Statement Engine
 * Calculates Operating, Investing, and Financing cash flows with working capital adjustments.
 */

export class CashFlowEngine {
  constructor() {
    this.operatingActivities = [];
    this.investingActivities = [];
    this.financingActivities = [];
  }

  recordCashActivity({ category = 'OPERATING', description, amountUSD, isInflow = true }) {
    const cleanCat = String(category).toUpperCase().trim();
    const amt = Math.abs(Number(amountUSD || 0));
    const netAmount = isInflow ? amt : -amt;

    const record = {
      id: `CF-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      category: cleanCat,
      description: String(description).trim(),
      amountUSD: netAmount,
      isInflow
    };

    if (cleanCat === 'INVESTING') {
      this.investingActivities.push(record);
    } else if (cleanCat === 'FINANCING') {
      this.financingActivities.push(record);
    } else {
      this.operatingActivities.push(record);
    }

    return record;
  }

  generateCashFlowStatement({ beginningCashUSD = 1000000 }) {
    const begCash = Number(beginningCashUSD || 0);

    const netOperatingCash = this.operatingActivities.reduce((sum, r) => sum + r.amountUSD, 0);
    const netInvestingCash = this.investingActivities.reduce((sum, r) => sum + r.amountUSD, 0);
    const netFinancingCash = this.financingActivities.reduce((sum, r) => sum + r.amountUSD, 0);

    const netCashChange = netOperatingCash + netInvestingCash + netFinancingCash;
    const endingCash = begCash + netCashChange;

    return {
      statementDate: new Date().toISOString(),
      beginningCashUSD: begCash,
      netOperatingCashUSD: Number(netOperatingCash.toFixed(2)),
      netInvestingCashUSD: Number(netInvestingCash.toFixed(2)),
      netFinancingCashUSD: Number(netFinancingCash.toFixed(2)),
      netCashChangeUSD: Number(netCashChange.toFixed(2)),
      endingCashUSD: Number(endingCash.toFixed(2))
    };
  }

  exportStatementText(beginningCashUSD = 1000000) {
    const stmt = this.generateCashFlowStatement({ beginningCashUSD });
    const lines = [
      '==================================================',
      'APEX ENTERPRISE ERP - STATEMENT OF CASH FLOWS',
      `Period Ending: ${stmt.statementDate}`,
      '==================================================',
      `Beginning Cash Position:  $${stmt.beginningCashUSD.toLocaleString()}`,
      '--------------------------------------------------',
      '1. OPERATING ACTIVITIES:',
      `   Net Cash Provided by Operations: $${stmt.netOperatingCashUSD.toLocaleString()}`,
      '--------------------------------------------------',
      '2. INVESTING ACTIVITIES:',
      `   Net Cash Used in Capital Investing: $${stmt.netInvestingCashUSD.toLocaleString()}`,
      '--------------------------------------------------',
      '3. FINANCING ACTIVITIES:',
      `   Net Cash Provided by Financing: $${stmt.netFinancingCashUSD.toLocaleString()}`,
      '--------------------------------------------------',
      `NET CHANGE IN CASH POSITION: $${stmt.netCashChangeUSD.toLocaleString()}`,
      `ENDING CASH & EQUIVALENTS:  $${stmt.endingCashUSD.toLocaleString()}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalCashFlowEngine = new CashFlowEngine();
