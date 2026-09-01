import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { Package, AlertTriangle, Edit3, Barcode, Warehouse } from 'lucide-react';

export const InventoryModule = () => {
  const { inventorySKUs, updateInventoryStock, searchQuery, activeSubsidiary } = useERP();
  const [activeTab, setActiveTab] = useState('catalog');
  const [editingItem, setEditingItem] = useState(null);
  const [newQty, setNewQty] = useState('');
  const [barcodeItem, setBarcodeItem] = useState(null);

  const handleStockUpdate = (e) => {
    e.preventDefault();
    if (!editingItem || newQty === '') return;
    updateInventoryStock(editingItem.id, newQty);
    setEditingItem(null);
    setNewQty('');
  };

  const lowStockItems = inventorySKUs.filter(item => item.qtyOnHand < item.reorderLevel);

  const skuColumns = [
    { header: 'SKU ID', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Component Name', accessor: 'name' },
    { header: 'Category', accessor: 'category', render: (val) => <span className="badge badge-neutral">{val}</span> },
    { header: 'Warehouse', accessor: 'warehouse' },
    {
      header: 'Qty On Hand',
      accessor: 'qtyOnHand',
      render: (val, row) => (
        <span className="mono" style={{ fontWeight: 700, color: val < row.reorderLevel ? 'var(--color-danger)' : 'var(--text-main)' }}>
          {val.toLocaleString()} units
        </span>
      )
    },
    { header: 'Reorder Level', accessor: 'reorderLevel', render: (val) => <span className="mono">{val} units</span> },
    {
      header: 'Unit Cost',
      accessor: 'unitCost',
      render: (val) => <span className="mono">{activeSubsidiary.symbol}{val.toFixed(2)}</span>
    },
    {
      header: 'Stock Status',
      accessor: 'status',
      render: (val) => {
        const isWarning = val.includes('Warning');
        return <span className={`badge ${isWarning ? 'badge-warning' : 'badge-success'}`}>{val}</span>;
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (id, row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setEditingItem(row);
              setNewQty(row.qtyOnHand.toString());
            }}
          >
            <Edit3 size={13} /> Adjust Stock
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setBarcodeItem(row)}
          >
            <Barcode size={13} /> Barcode
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Module Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Supply Chain & Inventory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Multi-warehouse SKU tracking, batch serial levels, and reorder point automation.
          </p>
        </div>
        <div className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <AlertTriangle size={15} /> {lowStockItems.length} SKUs At Risk
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
          Master Stock Catalog ({inventorySKUs.length})
        </button>
        <button className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
          Low Stock Alerts Center ({lowStockItems.length})
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="card">
          <DataTable
            columns={skuColumns}
            data={inventorySKUs}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="Inventory_SKU_Catalog"
          />
        </div>
      )}

      {/* Tab 2: Low Stock Alerts */}
      {activeTab === 'alerts' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 className="card-title" style={{ color: 'var(--color-warning)' }}>
            <AlertTriangle size={18} /> SKUs Below Reorder Threshold
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            The following inventory components require immediate purchase orders to avoid manufacturing bottleneck.
          </p>
          <DataTable
            columns={skuColumns}
            data={lowStockItems}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="Low_Stock_Alerts"
          />
        </div>
      )}

      {/* Modal: Adjust Stock */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title={`Adjust Inventory Level - ${editingItem.id}`}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditingItem(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleStockUpdate}>Save Quantity</button>
            </>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <div><strong>Component:</strong> {editingItem.name}</div>
              <div><strong>Warehouse:</strong> {editingItem.warehouse}</div>
              <div><strong>Current Count:</strong> {editingItem.qtyOnHand} units</div>
            </div>

            <div className="form-group">
              <label className="form-label">New Actual Physical Count</label>
              <input
                type="number"
                className="form-input"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                min="0"
                required
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Barcode Display */}
      {barcodeItem && (
        <Modal
          isOpen={!!barcodeItem}
          onClose={() => setBarcodeItem(null)}
          title={`SKU Barcode - ${barcodeItem.id}`}
          footer={
            <button className="btn btn-primary" onClick={() => setBarcodeItem(null)}>Close</button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1.5rem 0' }}>
            <div style={{ background: '#fff', padding: '1.5rem 2.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #cbd5e1' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '2.4rem', letterSpacing: '4px', color: '#0f172a' }}>
                |||| | ||||| ||| ||||
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#334155', marginTop: '0.5rem' }}>
                {barcodeItem.barcode}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Item Name: <strong>{barcodeItem.name}</strong><br />
              Location: <strong>{barcodeItem.warehouse}</strong>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
