/**
 * ApexERP Enterprise Finance - Double-Entry General Ledger Engine
 */

import { ACCOUNT_TYPES, JOURNAL_STATUS } from '../../models/schemas.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class GeneralLedgerEngine {
  constructor(initialAccounts = [], initialJournals = []) {
    this.accountsMap = new Map();
    this.journals = [];

    initialAccounts.forEach(acc => this.accountsMap.set(acc.accountCode, { ...acc }));
    initialJournals.forEach(jnl => this.journals.push({ ...jnl }));
  }

  getAccount(accountCode) {
    const acc = this.accountsMap.get(accountCode);
    if (!acc) throw new Error(`Account code '${accountCode}' not found in Chart of Accounts.`);
    return acc;
  }

  getAllAccounts() {
    return Array.from(this.accountsMap.values());
  }

  /**
   * Validate double-entry accounting rule: Total Debits MUST equal Total Credits
   */
  validateJournalEntry(entry) {
    if (!entry.lineItems || entry.lineItems.length < 2) {
      throw new Error('A valid journal entry must contain at least 2 line items.');
    }

    let totalDebit = 0;
    let totalCredit = 0;

    entry.lineItems.forEach((line, idx) => {
      if (!line.accountCode) {
        throw new Error(`Line item #${idx + 1} is missing an accountCode.`);
      }
      if (!this.accountsMap.has(line.accountCode)) {
        throw new Error(`Line item #${idx + 1} references non-existent account '${line.accountCode}'.`);
      }

      const debit = Number(line.debit || 0);
      const credit = Number(line.credit || 0);

      if (debit < 0 || credit < 0) {
        throw new Error(`Line item #${idx + 1} cannot have negative debit or credit values.`);
      }
      if (debit > 0 && credit > 0) {
        throw new Error(`Line item #${idx + 1} cannot have both debit and credit greater than zero.`);
      }

      totalDebit += debit;
      totalCredit += credit;
    });

    const diff = Math.abs(totalDebit - totalCredit);
    const isBalanced = diff < 0.0001; // floating point threshold

    if (!isBalanced) {
      throw new Error(`Journal entry is unbalanced! Total Debits: ${totalDebit.toFixed(2)}, Total Credits: ${totalCredit.toFixed(2)}. Difference: ${diff.toFixed(2)}.`);
    }

    return {
      isValid: true,
      totalDebit: Number(totalDebit.toFixed(2)),
      totalCredit: Number(totalCredit.toFixed(2))
    };
  }

  /**
   * Post a journal entry to the General Ledger and update Account Balances
   */
  postJournalEntry(entry, user) {
    const validation = this.validateJournalEntry(entry);

    const journalRecord = {
      ...entry,
      journalNumber: entry.journalNumber || `JNL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      postingDate: entry.postingDate || new Date().toISOString(),
      status: JOURNAL_STATUS.POSTED,
      totalDebit: validation.totalDebit,
      totalCredit: validation.totalCredit,
      isBalanced: true,
      postedAt: new Date().toISOString(),
      postedBy: user ? user.name : 'System Accountant'
    };

    // Apply Debits and Credits to Chart of Accounts
    entry.lineItems.forEach(line => {
      const acc = this.accountsMap.get(line.accountCode);
      const debit = Number(line.debit || 0);
      const credit = Number(line.credit || 0);

      // ASSET & EXPENSE accounts increase with DEBIT (+), decrease with CREDIT (-)
      // LIABILITY, EQUITY & REVENUE accounts increase with CREDIT (+), decrease with DEBIT (-)
      if (acc.type === ACCOUNT_TYPES.ASSET || acc.type === ACCOUNT_TYPES.EXPENSE) {
        acc.balance = Number((acc.balance + debit - credit).toFixed(2));
      } else {
        acc.balance = Number((acc.balance + credit - debit).toFixed(2));
      }
    });

    this.journals.unshift(journalRecord);

    GlobalAuditLogger.logEvent({
      user,
      action: 'POST_JOURNAL_ENTRY',
      entity: 'JournalEntry',
      entityId: journalRecord.journalNumber,
      newState: journalRecord
    });

    GlobalEventBus.publish('FINANCE_JOURNAL_POSTED', journalRecord);

    return journalRecord;
  }

  /**
   * Generate Trial Balance
   */
  generateTrialBalance() {
    let totalDebits = 0;
    let totalCredits = 0;

    const rows = Array.from(this.accountsMap.values()).map(acc => {
      let debitBalance = 0;
      let creditBalance = 0;

      if (acc.type === ACCOUNT_TYPES.ASSET || acc.type === ACCOUNT_TYPES.EXPENSE) {
        if (acc.balance >= 0) debitBalance = acc.balance;
        else creditBalance = Math.abs(acc.balance);
      } else {
        if (acc.balance >= 0) creditBalance = acc.balance;
        else debitBalance = Math.abs(acc.balance);
      }

      totalDebits += debitBalance;
      totalCredits += creditBalance;

      return {
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        type: acc.type,
        subType: acc.subType,
        debitBalance: Number(debitBalance.toFixed(2)),
        creditBalance: Number(creditBalance.toFixed(2))
      };
    });

    const finalTotalDebits = Number(totalDebits.toFixed(2));
    const finalTotalCredits = Number(totalCredits.toFixed(2));

    return {
      rows,
      totalDebits: finalTotalDebits,
      totalCredits: finalTotalCredits,
      isBalanced: Math.abs(finalTotalDebits - finalTotalCredits) < 0.01
    };
  }
}
