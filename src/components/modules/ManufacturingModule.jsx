import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { Cpu, Plus, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';

export const ManufacturingModule = () => {
  const { mrpWorkOrders, addMRPWorkOrder, searchQuery, showToast } = useERP();
  const [activeTab, setActiveTab] = useState('orders');
  const [isWOModalOpen, setIsWOModalOpen] = useState(false);

  // Form state
  const [product, setProduct] = useState('');
  const [targetQty, setTargetQty] = useState('200');
  const [workCenter, setWorkCenter] = useState('Assembly Station #1');

  const handleScheduleWO = (e) => {
    e.preventDefault();
    if (!product.trim()) return;
    addMRPWorkOrder({
      product: product.trim(),
      targetQty: parseInt(targetQty, 10),
      workCenter: workCenter.trim()
    });
    setProduct('');
    setIsWOModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Work Order ID', 'Product', 'Workstation', 'Target Qty', 'Completed Qty', 'Yield %', 'Status', 'Start Date'];
    const rows = mrpWorkOrders.map(w => [w.id, w.product, w.workCenter, w.targetQty, w.completedQty, w.yieldPercentage, w.status, w.startDate]);
    exportToCSV('ApexERP_MRP_Work_Orders', headers, rows);
    showToast('Exported MRP Work Orders to CSV successfully!');
  };

  const woColumns = [
    { header: 'Work Order ID', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Manufactured Product', accessor: 'product' },
    { header: 'Workstation / Cell', accessor: 'workCenter' },
    {
      header: 'Target Qty',
      accessor: 'targetQty',
      render: (val) => <span className="mono">{val} units</span>
    },
    {
      header: 'Completed',
      accessor: 'completedQty',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
            <div style={{ width: `${(val / row.targetQty) * 100}%`, height: '100%', background: 'var(--accent-primary)' }} />
          </div>
          <span className="mono" style={{ fontSize: '0.75rem' }}>{val}/{row.targetQty}</span>
        </div>
      )
    },
    { header: 'Yield %', accessor: 'yieldPercentage', render: (val) => <span className="mono" style={{ fontWeight: 700, color: 'var(--color-success)' }}>{val}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => {
        let badgeClass = 'badge-neutral';
        if (val === 'In Production') badgeClass = 'badge-info';
        if (val === 'Completed') badgeClass = 'badge-success';
        if (val === 'Quality Inspection') badgeClass = 'badge-warning';
        return <span className={`badge ${badgeClass}`}>{val}</span>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Manufacturing & MRP Suite</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Production scheduling, Work Order dispatching, Bill of Materials (BOM), and QC Yield rates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsWOModalOpen(true)}>
            <Plus size={16} /> Schedule Work Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          Active Work Orders ({mrpWorkOrders.length})
        </button>
        <button className={`tab-btn ${activeTab === 'bom' ? 'active' : ''}`} onClick={() => setActiveTab('bom')}>
          Bill of Materials (BOM) Tree Explorer
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="card">
          <DataTable
            columns={woColumns}
            data={mrpWorkOrders}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="MRP_Work_Orders"
          />
        </div>
      )}

      {/* Tab 2: BOM Explorer */}
      {activeTab === 'bom' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="card-title">Multi-Level Component BOM: Autonomous Drone Chassis (v4)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderLeft: '4px solid var(--accent-primary)', borderRadius: 'var(--radius-sm)' }}>
              <strong>Level 0: Autonomous Drone Chassis Unit Assembly</strong> (Assembly SKU-900)
            </div>
            
            <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                ├─ <strong>Level 1: Carbon Fiber Quad-Arm Sub-Frame</strong> — Qty: 4 units (SKU-1002)
              </div>
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                ├─ <strong>Level 1: Brushless Motor Drive (850KV)</strong> — Qty: 4 units (SKU-1008)
              </div>
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                └─ <strong>Level 1: Telemetry Sensor Control Board</strong> — Qty: 1 unit (SKU-1014)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Work Order */}
      <Modal
        isOpen={isWOModalOpen}
        onClose={() => setIsWOModalOpen(false)}
        title="Schedule Manufacturing Work Order"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsWOModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleScheduleWO}>Dispatch Order</button>
          </>
        }
      >
        <form onSubmit={handleScheduleWO} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Manufactured End Product</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Solar Power Inverter Box"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Units to Produce</label>
              <input
                type="number"
                className="form-input"
                value={targetQty}
                onChange={(e) => setTargetQty(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Workstation Cell</label>
              <select className="form-input" value={workCenter} onChange={(e) => setWorkCenter(e.target.value)}>
                <option value="Assembly Station #1">Assembly Station #1</option>
                <option value="Assembly Station #2">Assembly Station #2</option>
                <option value="Robotic Solder Cell #3">Robotic Solder Cell #3</option>
                <option value="QC Testing Bench #4">QC Testing Bench #4</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
