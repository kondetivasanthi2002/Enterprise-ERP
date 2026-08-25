import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { Plus, CheckCircle, FileText, DollarSign, PieChart, CreditCard } from 'lucide-react';

export const FinanceModule = () => {
  const {
    invoices,
    addInvoice,
    updateInvoiceStatus,
    chartOfAccounts,
    activeSubsidiary,
    searchQuery
  } = useERP();

  const [activeTab, setActiveTab] = useState('invoices');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState(null);

  // New Invoice Form State
  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newClient || !newAmount) return;
    addInvoice({
      client: newClient,
      amount: parseFloat(newAmount),
      tax: parseFloat((newAmount * 0.08).toFixed(2)),
      total: parseFloat((newAmount * 1.08).toFixed(2)),
      dueDate: newDueDate || '2026-09-30'
    });
    setNewClient('');
    setNewAmount('');
    setIsInvoiceModalOpen(false);
  };

  // Invoice Columns
  const invoiceColumns = [
    { header: 'Invoice ID', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Client / Customer', accessor: 'client' },
    { header: 'Issue Date', accessor: 'date' },
    { header: 'Due Date', accessor: 'dueDate' },
    {
      header: 'Subtotal',
      accessor: 'amount',
      render: (val) => <span className="mono">{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    {
      header: 'Total Incl. Tax',
      accessor: 'total',
      render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => {
        let badgeClass = 'badge-neutral';
        if (val === 'Paid') badgeClass = 'badge-success';
        if (val === 'Pending') badgeClass = 'badge-warning';
        if (val === 'Overdue') badgeClass = 'badge-danger';
        return <span className={`badge ${badgeClass}`}>{val}</span>;
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (id, row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {row.status !== 'Paid' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => updateInvoiceStatus(id, 'Paid')}
              title="Mark as Paid"
            >
              <CheckCircle size={13} style={{ color: 'var(--color-success)' }} /> Pay
            </button>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setSelectedInvoicePreview(row)}
          >
            <FileText size={13} /> PDF
          </button>
        </div>
      )
    }
  ];

  // Chart of Accounts Columns
  const coaColumns = [
    { header: 'Account Code', accessor: 'code', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Account Description', accessor: 'name' },
    {
      header: 'Type',
      accessor: 'type',
      render: (val) => <span className="badge badge-info">{val}</span>
    },
    {
      header: 'Balance',
      accessor: 'balance',
      render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <span className="badge badge-success">{val}</span>
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Finance & Accounts Suite</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            General Ledger, Accounts Receivable, Invoicing engine & Profitability reports.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsInvoiceModalOpen(true)}>
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Module Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
          Invoices & Accounts Receivable
        </button>
        <button className={`tab-btn ${activeTab === 'coa' ? 'active' : ''}`} onClick={() => setActiveTab('coa')}>
          Chart of Accounts (GL)
        </button>
        <button className={`tab-btn ${activeTab === 'pnl' ? 'active' : ''}`} onClick={() => setActiveTab('pnl')}>
          Profit & Loss (P&L) Statement
        </button>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="card">
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="Invoices_AR_Report"
          />
        </div>
      )}

      {/* Tab 2: Chart of Accounts */}
      {activeTab === 'coa' && (
        <div className="card">
          <DataTable
            columns={coaColumns}
            data={chartOfAccounts}
            searchQuery={searchQuery}
            pageSize={10}
            exportFileName="Chart_Of_Accounts"
          />
        </div>
      )}

      {/* Tab 3: Profit & Loss Statement */}
      {activeTab === 'pnl' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="card-title">Income Statement (YTD Consolidated)</h3>
          
          <div className="grid-2">
            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-success)', marginBottom: '0.75rem' }}>Operating Revenues</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Enterprise SaaS Platform Subscription</span>
                <span className="mono">{activeSubsidiary.symbol}14,500,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Hardware & Gateway Device Sales</span>
                <span className="mono">{activeSubsidiary.symbol}6,200,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontWeight: 800, marginTop: '0.5rem' }}>
                <span>Total Revenue</span>
                <span className="mono" style={{ color: 'var(--color-success)' }}>{activeSubsidiary.symbol}20,700,000</span>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-danger)', marginBottom: '0.75rem' }}>Operating Expenses</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Cost of Goods Sold (COGS)</span>
                <span className="mono">{activeSubsidiary.symbol}7,400,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>R&D Engineering Payroll</span>
                <span className="mono">{activeSubsidiary.symbol}2,800,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Sales & Marketing Expenses</span>
                <span className="mono">{activeSubsidiary.symbol}1,950,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontWeight: 800, marginTop: '0.5rem' }}>
                <span>Total Operating Expenses</span>
                <span className="mono" style={{ color: 'var(--color-danger)' }}>{activeSubsidiary.symbol}12,150,000</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Consolidated Net Operating Profit</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Before Corporate Income Tax Deductions</p>
            </div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {activeSubsidiary.symbol}8,550,000
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Invoice */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Issue New AR Invoice"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateInvoice}>Generate Invoice</button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Client / Customer Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Nexus Global Corp"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subtotal Amount ({activeSubsidiary.currency})</label>
              <input
                type="number"
                className="form-input"
                placeholder="45000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Due Date</label>
              <input
                type="date"
                className="form-input"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: PDF Invoice Preview */}
      {selectedInvoicePreview && (
        <Modal
          isOpen={!!selectedInvoicePreview}
          onClose={() => setSelectedInvoicePreview(null)}
          title={`Invoice Preview - ${selectedInvoicePreview.id}`}
          footer={
            <button className="btn btn-primary" onClick={() => setSelectedInvoicePreview(null)}>Close Preview</button>
          }
        >
          <div style={{ background: '#ffffff', color: '#0f172a', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6366f1' }}>ApexERP Enterprise</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Tax ID: US-99482910-X</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>INVOICE #{selectedInvoicePreview.id}</h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {selectedInvoicePreview.date}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              <strong>Billed To:</strong> {selectedInvoicePreview.client}<br />
              <strong>Due Date:</strong> {selectedInvoicePreview.dueDate}
            </div>

            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem' }}>Enterprise SaaS Licenses & Support</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>${selectedInvoicePreview.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem' }}>Standard State Tax (8%)</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>${selectedInvoicePreview.tax.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 800, borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem' }}>
              Total Due: ${selectedInvoicePreview.total.toLocaleString()}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
