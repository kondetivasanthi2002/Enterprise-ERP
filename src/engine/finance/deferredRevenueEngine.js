/**
 * ApexERP Enterprise Finance - SaaS Deferred Revenue Recognition Engine (ASC 606 / IFRS 15)
 * Manages multi-month subscription contracts, monthly revenue recognition schedules, and deferred liability waterfalls.
 */

export class DeferredRevenueEngine {
  constructor(ledgerEngine = null) {
    this.contractsMap = new Map();
    this.ledgerEngine = ledgerEngine;
  }

  registerContract({ contractId, customerName, totalContractValueUSD, contractTermMonths = 12, startDate }) {
    const id = String(contractId || `SaaS-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase()}`).trim();
    const totalVal = Math.max(0, Number(totalContractValueUSD || 0));
    const term = Math.max(1, parseInt(contractTermMonths || 12, 10));

    const monthlyRevenue = Number((totalVal / term).toFixed(2));
    const schedule = [];
    const start = new Date(startDate || new Date().toISOString().split('T')[0]);

    let remainingDeferred = totalVal;
    let totalRecognized = 0;

    for (let month = 1; month <= term; month++) {
      const rev = month === term ? Number((totalVal - totalRecognized).toFixed(2)) : monthlyRevenue;
      totalRecognized += rev;
      remainingDeferred = Number((totalVal - totalRecognized).toFixed(2));

      const periodDate = new Date(start.getFullYear(), start.getMonth() + (month - 1), 1).toISOString().split('T')[0];

      schedule.push({
        monthNumber: month,
        periodDate,
        monthlyRecognizedRevenue: rev,
        accumulatedRecognizedRevenue: Number(totalRecognized.toFixed(2)),
        remainingDeferredLiability: remainingDeferred,
        isRecognized: false
      });
    }

    const contract = {
      contractId: id,
      customerName: String(customerName).trim(),
      totalContractValueUSD: totalVal,
      contractTermMonths: term,
      monthlyRecognizedRevenueUSD: monthlyRevenue,
      recognizedRevenueUSD: 0,
      deferredLiabilityUSD: totalVal,
      schedule
    };

    this.contractsMap.set(id, contract);
    return contract;
  }

  recognizeMonthlyRevenue(contractId, monthNumber = 1, user = null) {
    const contract = this.contractsMap.get(String(contractId).trim().toUpperCase());
    if (!contract) throw new Error(`SaaS Contract '${contractId}' not found.`);

    const periodEntry = contract.schedule.find(s => s.monthNumber === monthNumber);
    if (!periodEntry) throw new Error(`Month ${monthNumber} not found in schedule for '${contractId}'.`);

    if (periodEntry.isRecognized) {
      throw new Error(`Month ${monthNumber} revenue for '${contractId}' has already been recognized.`);
    }

    periodEntry.isRecognized = true;
    contract.recognizedRevenueUSD = periodEntry.accumulatedRecognizedRevenue;
    contract.deferredLiabilityUSD = periodEntry.remainingDeferredLiability;

    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `ASC 606 Revenue Recognition - ${contract.customerName} (Month ${monthNumber})`,
        lineItems: [
          { accountCode: '21000', description: 'Deferred Revenue Liability', debit: periodEntry.monthlyRecognizedRevenue, credit: 0 },
          { accountCode: '40000', description: 'SaaS Subscription Recognized Revenue', debit: 0, credit: periodEntry.monthlyRecognizedRevenue }
        ]
      }, user);
    }

    return { contract, periodEntry };
  }

  exportRevenueWaterfallText(contractId) {
    const contract = this.contractsMap.get(String(contractId).trim().toUpperCase());
    if (!contract) return '';

    const lines = [
      '==================================================',
      'APEX ENTERPRISE FINANCE - ASC 606 REVENUE WATERFALL',
      `Contract ID: ${contract.contractId} | Customer: ${contract.customerName}`,
      `Contract Value: $${contract.totalContractValueUSD.toLocaleString()} USD | Term: ${contract.contractTermMonths} Months`,
      '==================================================',
      'MONTH | PERIOD DATE | RECOGNIZED REV | ACCUMULATED REV | DEFERRED LIABILITY | STATUS'
    ];

    contract.schedule.forEach(row => {
      const status = row.isRecognized ? '✅ [RECOGNIZED]' : '⏳ [DEFERRED]  ';
      lines.push(`M${row.monthNumber.toString().padStart(2, '0')}   | ${row.periodDate}  | $${row.monthlyRecognizedRevenue.toLocaleString().padStart(12, ' ')} | $${row.accumulatedRecognizedRevenue.toLocaleString().padStart(13, ' ')} | $${row.remainingDeferredLiability.toLocaleString().padStart(16, ' ')} | ${status}`);
    });

    lines.push('--------------------------------------------------');
    lines.push(`Current Deferred Revenue Liability Balance: $${contract.deferredLiabilityUSD.toLocaleString()} USD`);

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalDeferredRevenueEngine = new DeferredRevenueEngine();
