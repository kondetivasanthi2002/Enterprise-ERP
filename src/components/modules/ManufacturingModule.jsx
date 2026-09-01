import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Cpu, Layers, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

export const ManufacturingModule = () => {
  const { mrpWorkOrders, searchQuery } = useERP();
  const [activeTab, setActiveTab] = useState('orders');

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
    </div>
  );
};
