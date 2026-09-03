import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { Users, DollarSign, ArrowRight, CheckCircle2, Plus, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';

export const SalesCRMModule = () => {
  const { crmLeads, addCRMLead, updateCRMStage, searchQuery, activeSubsidiary, showToast } = useERP();
  const [viewMode, setViewMode] = useState('kanban');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('100000');
  const [stage, setStage] = useState('Qualification');

  const STAGES = ['New Lead', 'Qualification', 'Proposal Sent', 'Contract Negotiation', 'Closed Won', 'Closed Lost'];

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!company.trim()) return;
    addCRMLead({
      company: company.trim(),
      contactName: contactName.trim() || 'Primary Contact',
      email: email.trim() || `contact@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      value: parseFloat(value || 50000),
      stage
    });
    setCompany('');
    setContactName('');
    setEmail('');
    setIsLeadModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Lead ID', 'Company', 'Contact', 'Email', 'Value', 'Stage', 'Probability', 'Owner'];
    const rows = crmLeads.map(l => [l.id, l.company, l.contactName, l.email, l.value, l.stage, l.probability, l.owner]);
    exportToCSV('ApexERP_Sales_Pipeline_Report', headers, rows);
    showToast('Exported CRM Pipeline to CSV successfully!');
  };

  // Table Columns
  const leadColumns = [
    { header: 'Lead ID', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    { header: 'Company Name', accessor: 'company' },
    { header: 'Primary Contact', accessor: 'contactName' },
    { header: 'Email Address', accessor: 'email' },
    {
      header: 'Deal Value',
      accessor: 'value',
      render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    {
      header: 'Pipeline Stage',
      accessor: 'stage',
      render: (val) => <span className="badge badge-info">{val}</span>
    },
    {
      header: 'Win Probability',
      accessor: 'probability',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
            <div style={{ width: `${val}%`, height: '100%', background: val > 60 ? 'var(--color-success)' : 'var(--accent-primary)' }} />
          </div>
          <span className="mono" style={{ fontSize: '0.75rem' }}>{val}%</span>
        </div>
      )
    },
    { header: 'Account Owner', accessor: 'owner' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Sales & CRM Pipeline</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Opportunity pipeline, deal stage progression, win probabilities, and enterprise customer relationships.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsLeadModalOpen(true)}>
            <Plus size={16} /> Log New Deal
          </button>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('kanban')}
            >
              Kanban Board
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: Kanban Swimlanes */}
      {viewMode === 'kanban' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
          overflowX: 'auto'
        }}>
          {STAGES.map(stageItem => {
            const stageLeads = crmLeads.filter(l => l.stage === stageItem);
            const totalStageValue = stageLeads.reduce((acc, c) => acc + c.value, 0);

            return (
              <div
                key={stageItem}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  minHeight: '400px'
                }}
              >
                {/* Column Header */}
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{stageItem}</h4>
                    <span className="badge badge-neutral">{stageLeads.length}</span>
                  </div>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem', fontWeight: 600 }}>
                    {activeSubsidiary.symbol}{totalStageValue.toLocaleString()}
                  </div>
                </div>

                {/* Deal Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        transition: 'transform var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        <span className="mono">{lead.id}</span>
                        <span>{lead.owner}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{lead.company}</div>
                      <div className="mono" style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                        {activeSubsidiary.symbol}{lead.value.toLocaleString()}
                      </div>

                      {/* Advance Stage Buttons */}
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)' }}>
                        {stageItem !== 'Closed Won' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, fontSize: '0.68rem', padding: '0.2rem' }}
                            onClick={() => updateCRMStage(lead.id, 'Closed Won')}
                          >
                            <CheckCircle2 size={11} style={{ color: 'var(--color-success)' }} /> Won
                          </button>
                        )}
                        {stageItem !== 'Closed Lost' && stageItem !== 'Closed Won' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem' }}
                            onClick={() => {
                              const currIdx = STAGES.indexOf(stageItem);
                              if (currIdx < STAGES.length - 2) {
                                updateCRMStage(lead.id, STAGES[currIdx + 1]);
                              }
                            }}
                          >
                            Next <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="card">
          <DataTable
            columns={leadColumns}
            data={crmLeads}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="CRM_Pipeline_Leads"
          />
        </div>
      )}

      {/* Modal: Log New Deal */}
      <Modal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        title="Log New CRM Opportunity Deal"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsLeadModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateLead}>Save Deal</button>
          </>
        }
      >
        <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Client Company Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. BioGenX Labs Division"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Primary Contact</label>
              <input
                type="text"
                className="form-input"
                placeholder="Eleanor Vance"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="contact@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Est. Deal Value ({activeSubsidiary.currency})</label>
              <input
                type="number"
                className="form-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Stage</label>
              <select className="form-input" value={stage} onChange={(e) => setStage(e.target.value)}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
