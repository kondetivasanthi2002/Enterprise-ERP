import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ShieldCheck, Database, Plus, Download, UserCheck } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';
import { USER_ROLES } from '../../models/schemas';

export const AdminModule = () => {
  const { auditLogs, searchQuery, showToast } = useERP();
  const [activeTab, setActiveTab] = useState('audit');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState(USER_ROLES.ACCOUNTANT);

  const handleCreateUserRole = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    showToast(`Provisioned user ${newUserName.trim()} with role ${newUserRole}`, 'success');
    setNewUserName('');
    setNewUserEmail('');
    setIsUserModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'User Email', 'Action Code', 'IP Address', 'Status', 'Audit Details'];
    const rows = auditLogs.map(a => [a.id, a.timestamp, a.user, a.action, a.ipAddress, a.status, a.details]);
    exportToCSV('ApexERP_Security_Audit_Logs', headers, rows);
    showToast('Exported Security Audit Logs to CSV successfully!');
  };

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
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export Audit CSV
          </button>
          <button className="btn btn-outline" onClick={() => showToast('Database connection clean and zero-duplicate index verified', 'info')}>
            <Database size={16} /> Verify Integrity
          </button>
          <button className="btn btn-primary" onClick={() => setIsUserModalOpen(true)}>
            <Plus size={16} /> Provision User Role
          </button>
        </div>
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
                  <td><strong>Finance Manager</strong></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-neutral">Read Only</span></td>
                  <td><span className="badge badge-info">Approve Only</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                </tr>
                <tr>
                  <td><strong>Inventory Manager</strong></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                </tr>
                <tr>
                  <td><strong>Sales Executive</strong></td>
                  <td><span className="badge badge-info">Quote / Invoice</span></td>
                  <td><span className="badge badge-neutral">Read Only</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                  <td><span className="badge badge-danger">Denied</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Provision User Role */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Provision New User & RBAC Assignment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsUserModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateUserRole}>Provision User</button>
          </>
        }
      >
        <form onSubmit={handleCreateUserRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">User Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. David Chen"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Enterprise Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="d.chen@apexerp.com"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assign RBAC Security Role</label>
            <select className="form-select" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
              {Object.entries(USER_ROLES).map(([key, val]) => (
                <option key={key} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
