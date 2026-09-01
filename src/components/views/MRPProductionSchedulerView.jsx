import React, { useState } from 'react';
import { Cpu, Layers, CheckCircle2, Play } from 'lucide-react';

export function MRPProductionSchedulerView({ manufacturingEngine, currentUser }) {
  const [targetQty, setTargetQty] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const boms = manufacturingEngine ? Array.from(manufacturingEngine.bomsMap.values()) : [];
  const workOrders = manufacturingEngine ? manufacturingEngine.workOrders : [];

  const handleCreateWorkOrder = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const wo = manufacturingEngine.createWorkOrder({
        bomId: 'BOM-IOT-500',
        targetQuantity: Number(targetQty),
        user: currentUser
      });
      setSuccessMsg(`Released Work Order ${wo.workOrderId} for ${wo.targetQuantity} units of SKU ${wo.parentItemSku}. Total estimated production cost: $${wo.totalProductionCost.toLocaleString()}`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu style={{ color: 'var(--accent-amber)' }} /> Manufacturing & Material Requirements Planning (MRP)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Multi-level Bill of Materials (BOM) trees, Work Order routing, component stock reservations, and manufacturing runs.
        </p>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', color: 'var(--status-success-text)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          {successMsg}
        </div>
      )}

      {/* Release Work Order Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Release Production Work Order</h3>
        <form onSubmit={handleCreateWorkOrder} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Bill of Materials (BOM)</label>
            <select style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
              {boms.map(b => <option key={b.bomId} value={b.bomId}>{b.bomId} - {b.description} (Parent SKU: {b.parentItemSku})</option>)}
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Target Quantity</label>
            <input type="number" min="1" value={targetQty} onChange={e => setTargetQty(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
          </div>

          <button type="submit" style={{ background: 'var(--gradient-amber)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={16} /> Release Work Order
          </button>
        </form>
      </div>

      {/* Active Work Orders */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Active Work Orders</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Work Order ID</th>
              <th style={{ padding: '12px' }}>Parent Product</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Target Qty</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Est. Production Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map(wo => (
              <tr key={wo.workOrderId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-amber)' }}>{wo.workOrderId}</td>
                <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-bright)' }}>{wo.parentItemSku}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{wo.targetQuantity}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: '700', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    {wo.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: 'var(--accent-amber)' }}>${wo.totalProductionCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
