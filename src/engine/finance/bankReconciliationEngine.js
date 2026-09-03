/**
 * ApexERP Enterprise Finance - Automated Bank Statement Reconciliation Engine
 * Matches bank statement clearing records against internal general ledger cash entries.
 * Detects outstanding checks, deposits in transit, and bank fees.
 */

export class BankReconciliationEngine {
  constructor() {
    this.bankStatementsMap = new Map();
  }

  createReconciliationPeriod({ accountCode = '10100', periodName = '2026-08', bankStatementEndingBalanceUSD, ledgerEndingBalanceUSD }) {
    const periodId = `BANK-${accountCode}-${periodName}`.trim().toUpperCase();
    const bankBal = Number(bankStatementEndingBalanceUSD || 0);
    const ledgerBal = Number(ledgerEndingBalanceUSD || 0);

    const period = {
      periodId,
      accountCode: String(accountCode).trim(),
      periodName: String(periodName).trim(),
      bankStatementEndingBalanceUSD: bankBal,
      ledgerEndingBalanceUSD: ledgerBal,
      depositsInTransitUSD: 0,
      outstandingChecksUSD: 0,
      unrecordedBankFeesUSD: 0,
      matchedEntries: [],
      unmatchedBankRecords: [],
      unmatchedLedgerRecords: []
    };

    this.bankStatementsMap.set(periodId, period);
    return period;
  }

  addReconciliationRecord(periodId, { recordId, source = 'BANK', date, description, amountUSD, isCleared = false }) {
    const period = this.bankStatementsMap.get(String(periodId).trim().toUpperCase());
    if (!period) throw new Error(`Reconciliation period '${periodId}' not found.`);

    const rec = {
      recordId: String(recordId).trim(),
      source: String(source).toUpperCase().trim(),
      date: String(date || new Date().toISOString().split('T')[0]).trim(),
      description: String(description).trim(),
      amountUSD: Number(amountUSD || 0),
      isCleared: Boolean(isCleared)
    };

    if (rec.source === 'BANK') {
      period.unmatchedBankRecords.push(rec);
    } else {
      period.unmatchedLedgerRecords.push(rec);
    }

    return rec;
  }

  performAutomatedMatching(periodId) {
    const period = this.bankStatementsMap.get(String(periodId).trim().toUpperCase());
    if (!period) throw new Error(`Reconciliation period '${periodId}' not found.`);

    const remainingBank = [];
    let depositsInTransit = 0;
    let outstandingChecks = 0;

    period.unmatchedBankRecords.forEach(bRec => {
      const matchIndex = period.unmatchedLedgerRecords.findIndex(lRec => lRec.amountUSD === bRec.amountUSD && !lRec.isCleared);
      if (matchIndex !== -1) {
        const lMatch = period.unmatchedLedgerRecords[matchIndex];
        lMatch.isCleared = true;
        bRec.isCleared = true;
        period.matchedEntries.push({ bankRecord: bRec, ledgerRecord: lMatch });
        period.unmatchedLedgerRecords.splice(matchIndex, 1);
      } else {
        remainingBank.push(bRec);
      }
    });

    period.unmatchedBankRecords = remainingBank;

    period.unmatchedLedgerRecords.forEach(lRec => {
      if (lRec.amountUSD > 0) {
        depositsInTransit += lRec.amountUSD;
      } else {
        outstandingChecks += Math.abs(lRec.amountUSD);
      }
    });

    period.depositsInTransitUSD = Number(depositsInTransit.toFixed(2));
    period.outstandingChecksUSD = Number(outstandingChecks.toFixed(2));

    const adjustedBankBalanceUSD = Number((period.bankStatementEndingBalanceUSD + period.depositsInTransitUSD - period.outstandingChecksUSD).toFixed(2));
    const isReconciled = Math.abs(adjustedBankBalanceUSD - period.ledgerEndingBalanceUSD) < 0.01;

    return {
      periodId: period.periodId,
      bankStatementEndingBalanceUSD: period.bankStatementEndingBalanceUSD,
      depositsInTransitUSD: period.depositsInTransitUSD,
      outstandingChecksUSD: period.outstandingChecksUSD,
      adjustedBankBalanceUSD,
      ledgerEndingBalanceUSD: period.ledgerEndingBalanceUSD,
      isReconciled,
      discrepancyUSD: Number((adjustedBankBalanceUSD - period.ledgerEndingBalanceUSD).toFixed(2))
    };
  }

  exportBankReconciliationText(periodId) {
    const recon = this.performAutomatedMatching(periodId);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE FINANCE - BANK RECONCILIATION SLIP',
      `Period ID: ${recon.periodId}`,
      '==================================================',
      `Bank Statement Ending Balance: $${recon.bankStatementEndingBalanceUSD.toLocaleString()}`,
      `  (+) Deposits in Transit:     $${recon.depositsInTransitUSD.toLocaleString()}`,
      `  (-) Outstanding Checks:      $${recon.outstandingChecksUSD.toLocaleString()}`,
      '--------------------------------------------------',
      `Adjusted Bank Ending Balance:  $${recon.adjustedBankBalanceUSD.toLocaleString()}`,
      `General Ledger Ending Balance: $${recon.ledgerEndingBalanceUSD.toLocaleString()}`,
      '--------------------------------------------------',
      `Reconciliation Status: ${recon.isReconciled ? '✅ BALANCED RECONCILED' : '🚨 DISCREPANCY DETECTED'}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalBankReconciliationEngine = new BankReconciliationEngine();
