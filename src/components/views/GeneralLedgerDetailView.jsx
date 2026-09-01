import React, { useState } from 'react';
import { BookOpen, FileText, CheckCircle2, AlertTriangle, Plus, DollarSign, PieChart, Layers } from 'lucide-react';

export function GeneralLedgerDetailView({ ledgerEngine, reportGenerator, currentUser }) {
  const [activeTab, setActiveTab] = useState('chartOfAccounts'); // 'chartOfAccounts' | 'journals' | 'trialBalance' | 'financialStatements'
  const [newJournalModalOpen, setNewJournalModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [debitAccount, setDebitAccount] = useState('10000');
  const [creditAccount, setCreditAccount] = useState('40000');
  const [amount, setAmount] = useState(1000);
  const [errorMsg, setErrorMsg] = useState('');

  const accounts = ledgerEngine ? ledgerEngine.getAllAccounts() : [];
  const trialBalance = ledgerEngine ? ledgerEngine.generateTrialBalance() : { rows: [], totalDebits: 0, totalCredits: 0, isBalanced: true };
  const pnl = reportGenerator ? reportGenerator.generateProfitAndLoss() : { totalRevenue: 0, totalCOGS: 0, grossProfit: 0, totalOperatingExpenses: 0, netIncome: 0 };
  const balanceSheet = reportGenerator ? reportGenerator.generateBalanceSheet() : { totalAssets: 0, totalLiabilities: 0, totalEquityTotal: 0, isEquationBalanced: true };

  const handlePostJournal = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      ledgerEngine.postJournalEntry({
        description,
        lineItems: [
          { accountCode: debitAccount, debit: Number(amount), credit: 0 },
          { accountCode: creditAccount, debit: 0, credit: Number(amount) }
        ]
      }, currentUser);

      setNewJournalModalOpen(false);
      setDescription('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Module Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen style={{ color: 'var(--accent-blue)' }} /> Financial Management & General Ledger
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Double-entry bookkeeping engine, chart of accounts, trial balance, and automated GAAP financial statements.
          </p>
        </div>

        <button
          onClick={() => setNewJournalModalOpen(true)}
          style={{
            background: 'var(--gradient-primary)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Plus size={18} /> Post Journal Entry
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Total Assets (Balance Sheet)</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-emerald)', marginTop: '8px' }}>
            ${balanceSheet.totalAssets.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: balanceSheet.isEquationBalanced ? 'var(--status-success-text)' : 'var(--status-danger-text)', marginTop: '6px' }}>
            {balanceSheet.isEquationBalanced ? '✓ Assets = Liabilities + Equity' : '⚠ Equation Unbalanced'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Current Period Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)', marginTop: '8px' }}>
            ${pnl.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Operating & Subscription Revenue</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Net Profit / Income</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: pnl.netIncome >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)', marginTop: '8px' }}>
            ${pnl.netIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>After COGS & Operating Expenses</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Trial Balance Integrity</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: trialBalance.isBalanced ? 'var(--accent-indigo)' : 'var(--accent-rose)', marginTop: '8px' }}>
            {trialBalance.isBalanced ? 'BALANCED' : 'UNBALANCED'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Debits: ${trialBalance.totalDebits.toLocaleString()}</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
        {[
          { id: 'chartOfAccounts', label: 'Chart of Accounts', icon: Layers },
          { id: 'journals', label: 'Posted Journal Entries', icon: FileText },
          { id: 'trialBalance', label: 'Trial Balance', icon: CheckCircle2 },
          { id: 'financialStatements', label: 'Financial Statements (P&L / BS)', icon: PieChart }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'var(--bg-card-hover)' : 'transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Chart of Accounts */}
      {activeTab === 'chartOfAccounts' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Chart of Accounts Directory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Code</th>
                  <th style={{ padding: '12px' }}>Account Name</th>
                  <th style={{ padding: '12px' }}>Type</th>
                  <th style={{ padding: '12px' }}>Sub-Type</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.accountCode} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-blue)' }}>{acc.accountCode}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-bright)' }}>{acc.accountName}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: acc.type === 'ASSET' ? 'rgba(59, 130, 246, 0.15)' : acc.type === 'REVENUE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                        color: acc.type === 'ASSET' ? '#60a5fa' : acc.type === 'REVENUE' ? '#34d399' : '#a78bfa'
                      }}>
                        {acc.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{acc.subType}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: 'var(--text-bright)' }}>
                      ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Journal Entries */}
      {activeTab === 'journals' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>General Ledger Journal History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ledgerEngine.journals.map(jnl => (
              <div key={jnl.journalNumber} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{jnl.journalNumber}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '12px', fontSize: '13px' }}>{new Date(jnl.postingDate).toLocaleDateString()}</span>
                  </div>
                  <span style={{ background: 'var(--status-success-bg)', color: 'var(--status-success-text)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
                    {jnl.status}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-bright)', marginBottom: '12px' }}>{jnl.description}</div>

                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)' }}>
                      <th style={{ textAlign: 'left', padding: '6px' }}>Account</th>
                      <th style={{ textAlign: 'right', padding: '6px' }}>Debit ($)</th>
                      <th style={{ textAlign: 'right', padding: '6px' }}>Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jnl.lineItems.map((line, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '6px', color: 'var(--text-main)' }}>{line.accountCode} - {line.description || 'Posting line'}</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: line.debit > 0 ? '700' : '400' }}>{line.debit > 0 ? line.debit.toFixed(2) : '-'}</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: line.credit > 0 ? '700' : '400' }}>{line.credit > 0 ? line.credit.toFixed(2) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Trial Balance */}
      {activeTab === 'trialBalance' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Trial Balance Schedule</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Code</th>
                <th style={{ padding: '12px' }}>Account Title</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Debit Balance ($)</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Credit Balance ($)</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance.rows.map(row => (
                <tr key={row.accountCode} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{row.accountCode}</td>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{row.accountName}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: row.debitBalance > 0 ? 'var(--text-bright)' : 'var(--text-subtle)' }}>
                    {row.debitBalance > 0 ? row.debitBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: row.creditBalance > 0 ? 'var(--text-bright)' : 'var(--text-subtle)' }}>
                    {row.creditBalance > 0 ? row.creditBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border-glass-bright)', fontWeight: '700', fontSize: '15px' }}>
                <td colSpan={2} style={{ padding: '16px', textAlign: 'right' }}>TOTAL TRIAL BALANCE:</td>
                <td style={{ padding: '16px', textAlign: 'right', color: 'var(--accent-blue)' }}>${trialBalance.totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '16px', textAlign: 'right', color: 'var(--accent-blue)' }}>${trialBalance.totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New Journal */}
      {newJournalModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-bright)' }}>Post Double-Entry Journal Entry</h3>
            {errorMsg && (
              <div style={{ background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', color: 'var(--status-danger-text)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px' }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handlePostJournal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Journal Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Software Service Invoice Payment"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Debit Account (+Asset/+Expense)</label>
                  <select
                    value={debitAccount}
                    onChange={e => setDebitAccount(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  >
                    {accounts.map(a => <option key={a.accountCode} value={a.accountCode}>{a.accountCode} - {a.accountName}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Credit Account (+Revenue/+Liab)</label>
                  <select
                    value={creditAccount}
                    onChange={e => setCreditAccount(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  >
                    {accounts.map(a => <option key={a.accountCode} value={a.accountCode}>{a.accountCode} - {a.accountName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Transaction Amount ($ USD)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setNewJournalModalOpen(false)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: 'var(--gradient-primary)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer' }}>Post Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
