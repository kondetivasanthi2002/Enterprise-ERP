import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { UserCheck, Plus, FileText, DollarSign, Building } from 'lucide-react';

export const HCMModule = () => {
  const { employees, addEmployee, searchQuery, activeSubsidiary } = useERP();
  const [activeTab, setActiveTab] = useState('directory');
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [selectedPaystub, setSelectedPaystub] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Systems Engineer');
  const [salary, setSalary] = useState('');

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!name || !salary) return;
    addEmployee({
      name,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@apexerp.com`,
      department,
      role,
      salary: parseFloat(salary),
      location: 'HQ New York'
    });
    setName('');
    setEmail('');
    setSalary('');
    setIsAddEmpModalOpen(false);
  };

  const empColumns = [
    { header: 'Emp ID', accessor: 'id', render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{val}</span> },
    {
      header: 'Employee Name',
      accessor: 'name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
            {val.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Department', accessor: 'department', render: (val) => <span className="badge badge-neutral">{val}</span> },
    { header: 'Job Title / Role', accessor: 'role' },
    {
      header: 'Annual Salary',
      accessor: 'salary',
      render: (val) => <span className="mono">{activeSubsidiary.symbol}{val.toLocaleString()}</span>
    },
    {
      header: 'Monthly Pay',
      accessor: 'monthlyPayroll',
      render: (val) => <span className="mono" style={{ fontWeight: 700 }}>{activeSubsidiary.symbol}{parseFloat(val).toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <span className={`badge ${val === 'Active' ? 'badge-success' : 'badge-warning'}`}>{val}</span>
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (id, row) => (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setSelectedPaystub(row)}
        >
          <FileText size={13} /> Paystub Slip
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Module Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Human Capital & Payroll (HCM)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Workforce headcount directory, automated payroll calculations, direct paystubs, and department budgets.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddEmpModalOpen(true)}>
          <Plus size={16} /> Onboard Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`} onClick={() => setActiveTab('directory')}>
          Employee Headcount Directory ({employees.length})
        </button>
        <button className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>
          Payroll Summary & Disbursement
        </button>
      </div>

      {/* Tab 1: Directory */}
      {activeTab === 'directory' && (
        <div className="card">
          <DataTable
            columns={empColumns}
            data={employees}
            searchQuery={searchQuery}
            pageSize={8}
            exportFileName="Employee_Directory_Report"
          />
        </div>
      )}

      {/* Tab 2: Payroll Summary */}
      {activeTab === 'payroll' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 className="card-title">Monthly Payroll Disbursement Center</h3>
          
          <div className="grid-3">
            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Monthly Gross Payroll</div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.3rem 0', color: 'var(--accent-primary)' }}>
                {activeSubsidiary.symbol}{(employees.reduce((acc, c) => acc + c.salary, 0) / 12).toFixed(2).toLocaleString()}
              </div>
              <span className="badge badge-success">100% Funded</span>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tax & Benefit Deductions</div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.3rem 0', color: 'var(--color-info)' }}>
                {activeSubsidiary.symbol}{(employees.reduce((acc, c) => acc + c.salary, 0) * 0.22 / 12).toFixed(2).toLocaleString()}
              </div>
              <span className="badge badge-info">FICA & 401k Compliant</span>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Next Direct Deposit Cycle</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.3rem 0' }}>
                2026-08-31
              </div>
              <span className="badge badge-neutral">ACH Auto-Transfer</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Employee */}
      <Modal
        isOpen={isAddEmpModalOpen}
        onClose={() => setIsAddEmpModalOpen(false)}
        title="Onboard New Employee"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddEmpModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddEmployeeSubmit}>Onboard Employee</button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Employee Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jordan Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="jordan@apexerp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Annual Base Salary ({activeSubsidiary.currency})</label>
              <input
                type="number"
                className="form-input"
                placeholder="110000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Paystub Slip */}
      {selectedPaystub && (
        <Modal
          isOpen={!!selectedPaystub}
          onClose={() => setSelectedPaystub(null)}
          title={`Official Paystub - ${selectedPaystub.name}`}
          footer={
            <button className="btn btn-primary" onClick={() => setSelectedPaystub(null)}>Done</button>
          }
        >
          <div style={{ background: '#ffffff', color: '#0f172a', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>ApexERP Payroll Advice</h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Period Ending: 2026-08-31</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <div><strong>EMP ID:</strong> {selectedPaystub.id}</div>
                <div><strong>Dept:</strong> {selectedPaystub.department}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              <strong>Employee:</strong> {selectedPaystub.name}<br />
              <strong>Role Title:</strong> {selectedPaystub.role}
            </div>

            <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Earning / Deduction</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.4rem 0.5rem' }}>Gross Base Salary (Monthly)</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>${parseFloat(selectedPaystub.monthlyPayroll).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#ef4444' }}>Federal & State Tax Deductions (22%)</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', color: '#ef4444' }}>-${(selectedPaystub.monthlyPayroll * 0.22).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 800, borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem', color: '#16a34a' }}>
              Net Take-Home Pay: ${(selectedPaystub.monthlyPayroll * 0.78).toFixed(2)}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
