import React, { useState } from 'react';
import { Users, DollarSign, Calendar, Play, CheckCircle } from 'lucide-react';

export function PayrollConsoleView({ payrollEngine, currentUser }) {
  const [successMsg, setSuccessMsg] = useState('');
  const employees = payrollEngine ? payrollEngine.getAllEmployees() : [];
  const payrollRuns = payrollEngine ? payrollEngine.payrollRuns : [];

  const handleRunPayroll = () => {
    setSuccessMsg('');
    const run = payrollEngine.executeMonthlyPayrollRun({ periodName: '2026-08', user: currentUser });
    setSuccessMsg(`Successfully executed Monthly Payroll Run ${run.runId} for ${run.employeeCount} active employees. Total Net Payout: $${run.totalNetPay.toLocaleString()}`);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users style={{ color: 'var(--accent-purple)' }} /> Human Capital Management & Payroll Processing
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Employee roster, department allocations, tax withholding brackets, and automated monthly payroll.
          </p>
        </div>

        <button
          onClick={handleRunPayroll}
          style={{
            background: 'var(--gradient-purple)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Play size={18} /> Execute Monthly Payroll Run
        </button>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', color: 'var(--status-success-text)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <div>{successMsg}</div>
        </div>
      )}

      {/* Employee Roster */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Employee Roster & Monthly Salary Bands</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Employee ID</th>
              <th style={{ padding: '12px' }}>Full Name</th>
              <th style={{ padding: '12px' }}>Department</th>
              <th style={{ padding: '12px' }}>Designation</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Base Salary ($)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Allowances ($)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Est. Net Pay ($)</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const payslip = payrollEngine.computeEmployeePayslip({ employeeId: emp.employeeId });
              return (
                <tr key={emp.employeeId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-purple)' }}>{emp.employeeId}</td>
                  <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-bright)' }}>{emp.firstName} {emp.lastName}</td>
                  <td style={{ padding: '12px', color: 'var(--text-main)' }}>{emp.department}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{emp.designation}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${emp.baseSalaryMonthly.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${(emp.allowancesMonthly || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: 'var(--status-success-text)' }}>
                    ${payslip.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
