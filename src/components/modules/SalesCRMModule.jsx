import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Users, DollarSign, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const SalesCRMModule = () => {
  const { crmLeads, updateCRMStage, searchQuery, activeSubsidiary } = useERP();
  const [viewMode, setViewMode] = useState('kanban');

  const STAGES = ['New Lead', 'Qualification', 'Proposal Sent', 'Contract Negotiation', 'Closed Won', 'Closed Lost'];

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
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
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

      {/* View Mode: Kanban Swimlanes */}
      {viewMode === 'kanban' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
          overflowX: 'auto'
        }}>
          {STAGES.map(stage => {
            const stageLeads = crmLeads.filter(l => l.stage === stage);
            const totalStageValue = stageLeads.reduce((acc, c) => acc + c.value, 0);

            return (
              <div
                key={stage}
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
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{stage}</h4>
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
                        {stage !== 'Closed Won' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, fontSize: '0.68rem', padding: '0.2rem' }}
                            onClick={() => updateCRMStage(lead.id, 'Closed Won')}
                          >
                            <CheckCircle2 size={11} style={{ color: 'var(--color-success)' }} /> Won
                          </button>
                        )}
                        {stage !== 'Closed Lost' && stage !== 'Closed Won' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem' }}
                            onClick={() => {
                              const currIdx = STAGES.indexOf(stage);
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
    </div>
  );
};
