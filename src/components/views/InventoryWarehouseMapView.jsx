import React, { useState } from 'react';
import { Package, ArrowUpRight, ArrowDownLeft, AlertCircle, Warehouse, Search, Plus } from 'lucide-react';

export function InventoryWarehouseMapView({ inventoryEngine, currentUser }) {
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState('APX-SER-001');
  const [qty, setQty] = useState(10);
  const [cost, setCost] = useState(1200);
  const [errorMsg, setErrorMsg] = useState('');

  const items = inventoryEngine ? inventoryEngine.getAllItems() : [];
  const movements = inventoryEngine ? inventoryEngine.movementLedger : [];
  const lowStockItems = inventoryEngine ? inventoryEngine.getLowStockItems() : [];

  const handleReceiveStock = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      inventoryEngine.receiveStock({
        sku: selectedSku,
        quantity: Number(qty),
        unitCost: Number(cost),
        reference: 'Manual Restock Receipt',
        user: currentUser
      });
      setReceiveModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleIssueStock = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      inventoryEngine.issueStock({
        sku: selectedSku,
        quantity: Number(qty),
        reference: 'Manual Stock Dispatch',
        user: currentUser
      });
      setIssueModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package style={{ color: 'var(--accent-emerald)' }} /> Inventory & Supply Chain Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            FIFO stock ledger valuation, warehouse bin management, reorder alerts, and stock movements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setReceiveModalOpen(true)}
            style={{
              background: 'var(--gradient-emerald)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowDownLeft size={18} /> Receive Stock (Inbound)
          </button>

          <button
            onClick={() => setIssueModalOpen(true)}
            style={{
              background: 'var(--gradient-purple)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowUpRight size={18} /> Issue Stock (Outbound)
          </button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle style={{ color: 'var(--status-warning-text)' }} />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--status-warning-text)' }}>Low Stock Reorder Alert</div>
            <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
              {lowStockItems.length} item(s) are below reorder levels: {lowStockItems.map(i => `${i.name} (SKU: ${i.sku}) - Qty: ${i.totalQuantityOnHand}`).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Item Master Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Item Master Catalog</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>SKU</th>
              <th style={{ padding: '12px' }}>Item Name</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Cost Price ($)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Selling Price ($)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>On Hand Qty</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Inventory Value ($)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.sku} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-emerald)' }}>{item.sku}</td>
                <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-bright)' }}>{item.name}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.category}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>${item.costPrice.toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>${item.sellingPrice.toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: item.totalQuantityOnHand <= item.reorderLevel ? 'var(--accent-amber)' : 'var(--text-bright)' }}>
                  {item.totalQuantityOnHand}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  ${(item.inventoryValue || (item.totalQuantityOnHand * item.costPrice)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Stock Inbound Receive */}
      {receiveModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-bright)' }}>Receive Stock (Inbound FIFO Batch)</h3>
            {errorMsg && <div style={{ color: 'var(--status-danger-text)', marginBottom: '12px', fontSize: '13px' }}>{errorMsg}</div>}
            <form onSubmit={handleReceiveStock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Select SKU</label>
                <select value={selectedSku} onChange={e => setSelectedSku(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
                  {items.map(i => <option key={i.sku} value={i.sku}>{i.sku} - {i.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Quantity Received</label>
                <input type="number" min="1" required value={qty} onChange={e => setQty(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Unit Purchase Cost ($)</label>
                <input type="number" min="0" step="0.01" required value={cost} onChange={e => setCost(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setReceiveModalOpen(false)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '10px 16px', borderRadius: 'var(--radius-sm)' }}>Cancel</button>
                <button type="submit" style={{ background: 'var(--gradient-emerald)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}>Confirm Stock Receive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
