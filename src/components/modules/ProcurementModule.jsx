import React from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { ShoppingCart, CheckCircle, Truck, AlertCircle } from 'lucide-react';

export const ProcurementModule = () => {
  const { procurementPOs, approvePurchaseOrder, searchQuery, activeSubsidiary } = useERP();

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
              onClick={() => approvePurchaseOrder(id)}
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
    </div>
  );
};
