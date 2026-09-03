import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { Briefcase, Plus, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';

export const ProjectsModule = () => {
  const { projects, addProject, searchQuery, activeSubsidiary, showToast } = useERP();
  const [activeTab, setActiveTab] = useState('gantt');
  const [isPrjModalOpen, setIsPrjModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [budget, setBudget] = useState('500000');
  const [manager, setManager] = useState('Sarah Jenkins');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      client: client.trim() || 'Internal Infrastructure',
      budget: parseFloat(budget || 500000),
      manager: manager.trim()
    });
    setName('');
    setClient('');
    setIsPrjModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Project Code', 'Project Name', 'Client', 'Manager', 'Budget', 'Actual Cost', 'Completion %', 'Status'];
    const rows = projects.map(p => [p.id, p.name, p.client, p.manager, p.budget, p.actualCost, p.completion, p.status]);
    exportToCSV('ApexERP_Project_Portfolio_Report', headers, rows);
    showToast('Exported Project Portfolio to CSV successfully!');
  };

  const prjColumns = [
    { header: 'Project Code', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Project Name', accessor: 'name' },
    { header: 'Client Account', accessor: 'client' },
    { header: 'Project Manager', accessor: 'manager' },
    {
      header: 'Budgeted Cost',
      accessor: 'budget',
      render: (val) => <span className="mono">{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    {
      header: 'Actual Cost To Date',
      accessor: 'actualCost',
      render: (val, row) => (
        <span className="mono" style={{ fontWeight: 700, color: val > row.budget ? 'var(--color-danger)' : 'var(--color-success)' }}>
          {activeSubsidiary.symbol}{val.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Completion %',
      accessor: 'completion',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
            <div style={{ width: `${val}%`, height: '100%', background: 'var(--accent-primary)' }} />
          </div>
          <span className="mono" style={{ fontSize: '0.75rem' }}>{val}%</span>
        </div>
      )
    },
    {
      header: 'Health Status',
      accessor: 'status',
      render: (val) => {
        let badgeClass = 'badge-success';
        if (val === 'At Risk') badgeClass = 'badge-danger';
        if (val === 'Ahead of Schedule') badgeClass = 'badge-info';
        return <span className={`badge ${badgeClass}`}>{val}</span>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Projects & Gantt Timeline</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enterprise project portfolio management, resource scheduling, cost variance, and Gantt milestone tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsPrjModalOpen(true)}>
            <Plus size={16} /> Initialize Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'gantt' ? 'active' : ''}`} onClick={() => setActiveTab('gantt')}>
          Gantt Chart Timeline View
        </button>
        <button className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')}>
          Project Portfolio List
        </button>
      </div>

      {/* Tab 1: Gantt Chart */}
      {activeTab === 'gantt' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="card-title">Interactive Gantt Timeline Schedule (FY 2026)</h3>

          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Timeline Header Months */}
              <div style={{ display: 'grid', gridTemplateColumns: '240px repeat(6, 1fr)', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                <div>PROJECT NAME</div>
                <div>MAY</div>
                <div>JUN</div>
                <div>JUL</div>
                <div>AUG</div>
                <div>SEP</div>
                <div>OCT</div>
              </div>

              {/* Gantt Rows */}
              {projects.map(prj => (
                <div
                  key={prj.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-card-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{prj.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mgr: {prj.manager}</div>
                  </div>

                  <div style={{ position: 'relative', height: '24px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      left: prj.id === 'PRJ-101' ? '0%' : prj.id === 'PRJ-102' ? '15%' : '35%',
                      width: `${prj.completion}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}>
                      {prj.completion}% Done
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Table */}
      {activeTab === 'table' && (
        <div className="card">
          <DataTable
            columns={prjColumns}
            data={projects}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="Project_Portfolio_Report"
          />
        </div>
      )}

      {/* Modal: Initialize Project */}
      <Modal
        isOpen={isPrjModalOpen}
        onClose={() => setIsPrjModalOpen(false)}
        title="Initialize New Enterprise Project"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsPrjModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateProject}>Create Project</button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Autonomous Robotic Logistics Setup"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Client Account</label>
              <input
                type="text"
                className="form-input"
                placeholder="Starlight Logistics"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Approved Budget ({activeSubsidiary.currency})</label>
              <input
                type="number"
                className="form-input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Assigned Project Manager</label>
            <input
              type="text"
              className="form-input"
              placeholder="Sarah Jenkins"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
