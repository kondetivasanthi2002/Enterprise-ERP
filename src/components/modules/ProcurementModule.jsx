import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ShoppingCart, CheckCircle, Plus, Download, ShieldAlert } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';
import { RBACEngine, PERMISSIONS } from '../../engine/core/auth';

export const ProcurementModule = () => {
  const { user, procurementPOs, addProcurementPO, approvePurchaseOrder, searchQuery, activeSubsidiary, showToast } = useERP();
  const rbac = new RBACEngine(user);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  // Form State
  const [vendor, setVendor] = useState('');
  const [itemsCount, setItemsCount] = useState('5');
  const [totalAmount, setTotalAmount] = useState('25000');

  const handleCreatePO = (e) => {
    e.preventDefault();
    if (!vendor.trim()) return;
    addProcurementPO({
      vendor: vendor.trim(),
      itemsCount: parseInt(itemsCount, 10),
      totalAmount: parseFloat(totalAmount)
    });
    setVendor('');
    setIsPOModalOpen(false);
  };

  const handleApprovePO = (id) => {
    if (!rbac.hasPermission(PERMISSIONS.PROCUREMENT_APPROVE_PO) && !rbac.hasPermission(PERMISSIONS.FINANCE_VIEW)) {
      showToast(`[RBAC GUARD] Access Denied: Role '${user.role}' lacks permission to approve POs`, 'danger');
      return;
    }
    approvePurchaseOrder(id);
  };

  const handleExportCSV = () => {
    const headers = ['PO ID', 'Vendor', 'Items Count', 'Total Amount', 'Status', 'Order Date', 'Expected Delivery'];
    const rows = procurementPOs.map(p => [p.id, p.vendor, p.itemsCount, p.totalAmount, p.status, p.orderDate, p.expectedDelivery]);
    exportToCSV('ApexERP_Procurement_POs', headers, rows);
    showToast('Exported Purchase Orders to CSV successfully!');
  };

  const poColumns = [
    { header: 'PO Number', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Vendor Name', accessor: 'vendor' },
    { header: 'Item Count', accessor: 'itemsCount', render: (val) => <span className="mono">{val} SKUs</span> },
    {
      header: 'Total Order Value',
      accessor: 'totalAmount',
      render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    { header: 'Order Date', accessor: 'orderDate' },
    { header: 'Est. Delivery', accessor: 'expectedDelivery' },
    {
      header: 'Fulfillment Status',
      accessor: 'status',
      render: (val) => {
        let badgeClass = 'badge-neutral';
        if (val === 'Approved') badgeClass = 'badge-info';
        if (val === 'In Transit') badgeClass = 'badge-warning';
        if (val === 'Received') badgeClass = 'badge-success';
        return <span className={`badge ${badgeClass}`}>{val}</span>;
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (id, row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {row.status === 'Pending Approval' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleApprovePO(id)}
            >
              <CheckCircle size={13} style={{ color: 'var(--color-success)' }} /> Approve PO
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Procurement & Vendor Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Vendor Scorecards, Requisition RFQs, 3-way GRN matching, and Purchase Order approvals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsPOModalOpen(true)}>
            <Plus size={16} /> Issue Purchase Order
          </button>
        </div>
      </div>

      {/* PO Data Table */}
      <div className="card">
        <DataTable
          columns={poColumns}
          data={procurementPOs}
          searchQuery={searchQuery}
          pageSize={8}
          exportFileName="Procurement_PO_List"
        />
      </div>

      {/* Modal: Create PO */}
      <Modal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        title="Issue New Vendor Purchase Order"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsPOModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreatePO}>Submit PO</button>
          </>
        }
      >
        <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Supplier / Vendor Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Silicon Microfabrication Foundry"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Total SKUs Ordered</label>
              <input
                type="number"
                className="form-input"
                value={itemsCount}
                onChange={(e) => setItemsCount(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total PO Amount ({activeSubsidiary.currency})</label>
              <input
                type="number"
                className="form-input"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
