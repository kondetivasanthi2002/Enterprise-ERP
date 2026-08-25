import React, { useState } from 'react';
import { ShoppingCart, Users, FileCheck, DollarSign, Plus } from 'lucide-react';

export function SalesCRMKanbanView({ salesEngine, currentUser }) {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUST-1001');
  const [selectedSku, setSelectedSku] = useState('APX-SER-001');
  const [quantity, setQuantity] = useState(2);
  const [unitPrice, setUnitPrice] = useState(3500);
  const [errorMsg, setErrorMsg] = useState('');

  const customers = salesEngine ? salesEngine.getAllCustomers() : [];
  const invoices = salesEngine ? salesEngine.invoices : [];

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      salesEngine.createInvoice({
        customerId: selectedCustomerId,
        lineItems: [
          { sku: selectedSku, name: 'Apex ERP Server', quantity: Number(quantity), unitPrice: Number(unitPrice) }
        ],
        user: currentUser
      });
      setInvoiceModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart style={{ color: 'var(--accent-indigo)' }} /> Sales & Customer Relationship Management (CRM)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Customer directory, CRM deal pipeline, Quotation builder, and Sales Invoice processing.
          </p>
        </div>

        <button
          onClick={() => setInvoiceModalOpen(true)}
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
            gap: '8px'
          }}
        >
          <Plus size={18} /> Create Sales Invoice
        </button>
      </div>

      {/* Customer Directory */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Enterprise Customer Directory</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Customer ID</th>
              <th style={{ padding: '12px' }}>Company Name</th>
              <th style={{ padding: '12px' }}>Contact Person</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Credit Limit ($)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Current Balance ($)</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust.customerId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-indigo)' }}>{cust.customerId}</td>
                <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-bright)' }}>{cust.companyName}</td>
                <td style={{ padding: '12px', color: 'var(--text-main)' }}>{cust.contactName}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{cust.email}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>${cust.creditLimit.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: cust.currentBalance > 0 ? 'var(--status-warning-text)' : 'var(--status-success-text)' }}>
                  ${cust.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Sales Invoice */}
      {invoiceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-bright)' }}>Post Sales Invoice</h3>
            {errorMsg && <div style={{ color: 'var(--status-danger-text)', marginBottom: '12px', fontSize: '13px' }}>{errorMsg}</div>}
            <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Customer</label>
                <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
                  {customers.map(c => <option key={c.customerId} value={c.customerId}>{c.companyName} ({c.customerId})</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Product SKU</label>
                <select value={selectedSku} onChange={e => setSelectedSku(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
                  <option value="APX-SER-001">APX-SER-001 - Enterprise Server License</option>
                  <option value="APX-HW-500">APX-HW-500 - Industrial IoT Gateway</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Quantity</label>
                  <input type="number" min="1" required value={quantity} onChange={e => setQuantity(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Unit Price ($)</label>
                  <input type="number" min="0" required value={unitPrice} onChange={e => setUnitPrice(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setInvoiceModalOpen(false)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '10px 16px', borderRadius: 'var(--radius-sm)' }}>Cancel</button>
                <button type="submit" style={{ background: 'var(--gradient-primary)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}>Post Invoice & Issue Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
