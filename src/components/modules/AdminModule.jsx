import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { ShieldCheck, Database, Lock, Key, RefreshCw } from 'lucide-react';

export const AdminModule = () => {
  const { auditLogs, searchQuery, showToast } = useERP();
  const [activeTab, setActiveTab] = useState('audit');

  const auditColumns = [
    { header: 'Event ID', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Timestamp (UTC)', accessor: 'timestamp', render: (val) => <span className="mono">{val}</span> },
    { header: 'User Email', accessor: 'user' },
    { header: 'Action Code', accessor: 'action', render: (val) => <span className="badge badge-neutral">{val}</span> },
    { header: 'IP Address', accessor: 'ipAddress', render: (val) => <span className="mono">{val}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <span className={`badge ${val === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>{val}</span>
    },
    { header: 'Audit Details', accessor: 'details' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Admin, RBAC & Audit Trail</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            System security log trace, role-based access control (RBAC), and database snapshot manager.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => showToast('Database configuration verified clean', 'info')}>
          <Database size={16} /> Verify Integrity
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
          Security Audit Logs ({auditLogs.length})
        </button>
        <button className={`tab-btn ${activeTab === 'rbac' ? 'active' : ''}`} onClick={() => setActiveTab('rbac')}>
          RBAC Role & Permission Matrix
        </button>
      </div>

      {/* Tab 1: Audit */}
      {activeTab === 'audit' && (
        <div className="card">
          <DataTable
            columns={auditColumns}
            data={auditLogs}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="Security_Audit_Logs"
          />
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="card-title">Enterprise Security Role Matrix</h3>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Finance & AR</th>
                  <th>Supply Chain</th>
                  <th>HCM Payroll</th>
                  <th>System Admin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Super Administrator</strong></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                </tr>
                <tr>
                  <td><strong>Finance Controller</strong></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-neutral">Read Only</span></td>
                  <td><span className="badge badge-info">Approve Only</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                </tr>
                <tr>
                  <td><strong>Warehouse Operations Mgr</strong></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
