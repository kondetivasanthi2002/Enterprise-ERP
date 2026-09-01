import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  DollarSign,
  TrendingUp,
  Package,
  UserCheck,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText
} from 'lucide-react';

export const DashboardModule = () => {
  const {
    activeSubsidiary,
    financialHistory,
    invoices,
    inventorySKUs,
    employees,
    setActiveModule,
    showToast
  } = useERP();

  const symbol = activeSubsidiary.symbol;

  // Calculate high-level KPIs
  const totalRevenue = financialHistory.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpenses = financialHistory.reduce((acc, curr) => acc + curr.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const lowStockCount = inventorySKUs.filter(sku => sku.qtyOnHand < sku.reorderLevel).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify Kies: 'space-between',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            Executive Overview — {activeSubsidiary.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time consolidated telemetry across financial, operational, supply chain, and workforce vectors.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveModule('finance')}>
            <Plus size={14} /> Quick Invoice
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('analytics')}>
            <FileText size={14} /> Executive Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card success">
          <div>
            <span className="kpi-label">Gross Revenue (YTD)</span>
            <div className="kpi-value">{symbol}{(totalRevenue / 1000000).toFixed(2)}M</div>
            <div className="kpi-change" style={{ color: 'var(--color-success)' }}>
              <ArrowUpRight size={14} /> +14.8% vs last fiscal quarter
            </div>
          </div>
          <div className="kpi-icon-wrapper">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-label">Net Operating Profit</span>
            <div className="kpi-value">{symbol}{(netProfit / 1000000).toFixed(2)}M</div>
            <div className="kpi-change" style={{ color: 'var(--color-success)' }}>
              <ArrowUpRight size={14} /> Net Margin: 32.4%
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="kpi-card warning">
          <div>
            <span className="kpi-label">Managed Inventory SKUs</span>
            <div className="kpi-value">{inventorySKUs.length} Items</div>
            <div className="kpi-change" style={{ color: 'var(--color-warning)' }}>
              <AlertTriangle size={14} /> {lowStockCount} items at reorder threshold
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-label">Active Headcount</span>
            <div className="kpi-value">{employees.length} Staff</div>
            <div className="kpi-change" style={{ color: 'var(--text-muted)' }}>
              100% Payroll Run Compliant
            </div>
          </div>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <UserCheck size={24} />
          </div>
        </div>
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid-2">
        {/* SVG Financial Performance Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
                12-Month Financial Telemetry
              </h3>
              <span className="card-subtitle">Revenue vs Expenses vs Net Profit ({activeSubsidiary.currency})</span>
            </div>
          </div>

          <div style={{ width: '100%', height: '240px', position: 'relative' }}>
            <svg viewBox="0 0 600 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Background Grid Lines */}
              {[40, 80, 120, 160, 200].map((y, idx) => (
                <line key={idx} x1="40" y1={y} x2="580" y2={y} stroke="var(--border-color)" strokeDasharray="3 3" />
              ))}

              {/* Monthly Bars */}
              {financialHistory.map((item, idx) => {
                const x = 55 + idx * 45;
                const revHeight = (item.revenue / 3000000) * 160;
                const expHeight = (item.expenses / 3000000) * 160;

                return (
                  <g key={idx}>
                    {/* Revenue Bar */}
                    <rect
                      x={x}
                      y={200 - revHeight}
                      width="12"
                      height={revHeight}
                      fill="var(--accent-primary)"
                      rx="3"
                    />
                    {/* Expense Bar */}
                    <rect
                      x={x + 15}
                      y={200 - expHeight}
                      width="12"
                      height={expHeight}
                      fill="rgba(239, 68, 68, 0.7)"
                      rx="3"
                    />
                    {/* Month Label */}
                    <text x={x + 13} y="215" fill="var(--text-subtle)" fontSize="10" textAnchor="middle">
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '2px' }} /> Gross Revenue
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', background: 'rgba(239, 68, 68, 0.7)', borderRadius: '2px' }} /> Total Expenses
            </span>
          </div>
        </div>

        {/* AI Insights & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Banner */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.08))', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ padding: '0.5rem', background: 'var(--accent-purple)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
                <Zap size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>
                  AI Operations Intelligence
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Warehouse WH-Beta stock levels are projected to reach reorder point in 6 days. Automated RFQ recommendation generated.
                </p>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.65rem' }} onClick={() => {
                  showToast('Auto RFQ dispatch simulation initialized');
                  setActiveModule('procurement');
                }}>
                  Review Procurement Action
                </button>
              </div>
            </div>
          </div>

          {/* Quick Module Navigation Grid */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
              Quick Module Actions
            </h3>
            <div className="grid-3">
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('finance')}>
                Invoices & AR
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('inventory')}>
                Stock Catalog
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('sales')}>
                CRM Deals
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('hcm')}>
                Payroll Runs
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('mrp')}>
                MRP Orders
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('projects')}>
                Gantt Timeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
