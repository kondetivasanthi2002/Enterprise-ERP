import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Zap,
  ArrowUpRight,
  Plus,
  FileText,
  Sparkles,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';

export const DashboardModule = () => {
  const {
    activeSubsidiary,
    invoices,
    inventorySKUs,
    employees,
    procurementPOs,
    projects,
    setActiveModule,
    showToast
  } = useERP();

  const symbol = activeSubsidiary?.symbol || '$';
  const [activeChartTab, setActiveChartTab] = useState('revenue');
  const [timeframe, setTimeframe] = useState('6M');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Dynamic Timeframe Data Mapping (1M, 3M, 6M, 1Y, ALL)
  const getTimeframeData = (tf) => {
    switch (tf) {
      case '1M':
        return {
          subtitle: `Past 30 Days Telemetry (Weekly Breakdown - ${activeSubsidiary.name})`,
          points: [
            { label: 'Week 1', displayVal: `${symbol}95,000`, x: 40, y: 125 },
            { label: 'Week 2', displayVal: `${symbol}118,500`, x: 175, y: 92 },
            { label: 'Week 3', displayVal: `${symbol}132,000`, x: 310, y: 65 },
            { label: 'Week 4', displayVal: `${symbol}155,000`, x: 450, y: 28 }
          ]
        };
      case '3M':
        return {
          subtitle: `Q3 Consolidated Telemetry (Jun - Aug 2026)`,
          points: [
            { label: 'Jun 2026', displayVal: `${symbol}380,000`, x: 50, y: 110 },
            { label: 'Jul 2026', displayVal: `${symbol}410,000`, x: 250, y: 75 },
            { label: 'Aug 2026', displayVal: `${symbol}485,000`, x: 450, y: 25 }
          ]
        };
      case '6M':
        return {
          subtitle: `6-Month Rolling Revenue Telemetry & Cash Flow`,
          points: [
            { label: 'Mar', displayVal: `${symbol}280,000`, x: 30, y: 130 },
            { label: 'Apr', displayVal: `${symbol}340,000`, x: 114, y: 95 },
            { label: 'May', displayVal: `${symbol}310,000`, x: 198, y: 110 },
            { label: 'Jun', displayVal: `${symbol}390,000`, x: 282, y: 65 },
            { label: 'Jul', displayVal: `${symbol}370,000`, x: 366, y: 78 },
            { label: 'Aug', displayVal: `${symbol}485,000`, x: 450, y: 25 }
          ]
        };
      case '1Y':
        return {
          subtitle: `12-Month Consolidated Fiscal Performance (2025 - 2026)`,
          points: [
            { label: 'Sep', displayVal: `${symbol}210,000`, x: 30, y: 140 },
            { label: 'Oct', displayVal: `${symbol}240,000`, x: 68, y: 128 },
            { label: 'Nov', displayVal: `${symbol}225,000`, x: 106, y: 134 },
            { label: 'Dec', displayVal: `${symbol}290,000`, x: 144, y: 108 },
            { label: 'Jan', displayVal: `${symbol}310,000`, x: 182, y: 100 },
            { label: 'Feb', displayVal: `${symbol}330,000`, x: 220, y: 92 },
            { label: 'Mar', displayVal: `${symbol}300,000`, x: 258, y: 104 },
            { label: 'Apr', displayVal: `${symbol}360,000`, x: 296, y: 80 },
            { label: 'May', displayVal: `${symbol}340,000`, x: 334, y: 88 },
            { label: 'Jun', displayVal: `${symbol}400,000`, x: 372, y: 62 },
            { label: 'Jul', displayVal: `${symbol}420,000`, x: 410, y: 54 },
            { label: 'Aug', displayVal: `${symbol}485,000`, x: 450, y: 25 }
          ]
        };
      case 'ALL':
        return {
          subtitle: `Multi-Year Historical Enterprise Growth (2022 - 2026)`,
          points: [
            { label: '2022', displayVal: `${symbol}1.8M`, x: 40, y: 135 },
            { label: '2023', displayVal: `${symbol}2.6M`, x: 142, y: 105 },
            { label: '2024', displayVal: `${symbol}3.5M`, x: 245, y: 75 },
            { label: '2025', displayVal: `${symbol}4.2M`, x: 348, y: 50 },
            { label: '2026 YTD', displayVal: `${symbol}4.85M`, x: 450, y: 25 }
          ]
        };
      default:
        return getTimeframeData('6M');
    }
  };

  const chartData = getTimeframeData(timeframe);
  const firstX = chartData.points[0].x;
  const lastX = chartData.points[chartData.points.length - 1].x;
  const polylinePoints = chartData.points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `${firstX},150 ` + polylinePoints + ` ${lastX},150`;

  // Calculate live metric totals
  const totalRev = invoices ? invoices.reduce((a, b) => a + (b.total || 0), 0) : 250000;
  const totalEmployees = employees ? employees.length : 85;
  const totalSKUs = inventorySKUs ? inventorySKUs.length : 450;
  const pendingPOs = procurementPOs ? procurementPOs.filter(p => (p.status || '').toLowerCase().includes('pending')).length : 2;
  const activeProjects = projects ? projects.length : 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Hero Corporate Welcome & Telemetry Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
        border: '1px solid #7dd3fc',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        boxShadow: '0 8px 32px rgba(14, 165, 233, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sky Blue Glow backdrop decoration */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className="badge" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                <Activity size={13} /> ● Enterprise Node Nominal
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                {activeSubsidiary.name}
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Executive Control Center
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#e0f2fe', marginTop: '0.2rem' }}>
              Real-time enterprise telemetry across Financials, Supply Chain, Workforce & Manufacturing vectors.
            </p>
          </div>

          {/* Quick Action Button Bar */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#ffffff', color: '#0284c7', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => setActiveModule('finance')}>
              <Plus size={15} /> + Post Invoice
            </button>
            <button className="btn" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.4)', fontWeight: '600' }} onClick={() => setActiveModule('inventory')}>
              <Package size={15} /> + Add Stock
            </button>
            <button className="btn" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.4)', fontWeight: '600' }} onClick={() => showToast('Generated Executive Brief summary', 'success')}>
              <FileText size={15} /> 📥 Export Brief
            </button>
          </div>
        </div>
      </div>

      {/* 2. 8-Grid Minimal Corporate KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        
        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #0ea5e9' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Gross Revenue (YTD)</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>{symbol}{(totalRev / 1000).toFixed(1)}k</div>
            <div className="kpi-change" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpRight size={14} /> +18.4% YoY Growth
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #0284c7' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Supply Chain SKUs</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>{totalSKUs} Items</div>
            <div className="kpi-change" style={{ color: '#0ea5e9' }}>4 Warehouses</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #38bdf8' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Active Headcount</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>{totalEmployees} Staff</div>
            <div className="kpi-change" style={{ color: '#0284c7' }}>Payroll Compliant</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #0369a1' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Plant Machine OEE</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>87.2%</div>
            <div className="kpi-change" style={{ color: '#0ea5e9' }}>World-Class Efficiency</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #10b981' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>CRM Pipeline Value</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>{symbol}1.24M</div>
            <div className="kpi-change" style={{ color: '#059669' }}>12 Active Deals</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #f59e0b' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Pending POs</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>{pendingPOs} Orders</div>
            <div className="kpi-change" style={{ color: '#d97706' }}>Awaiting CFO Sign-Off</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #0ea5e9' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Active Projects</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>{activeProjects} Milestones</div>
            <div className="kpi-change" style={{ color: '#0284c7' }}>On Schedule</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderLeft: '4px solid #10b981' }}>
          <div>
            <span className="kpi-label" style={{ color: 'var(--text-muted)' }}>Security Audit</span>
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>100%</div>
            <div className="kpi-change" style={{ color: '#059669' }}>Zero Alerts</div>
          </div>
        </div>

      </div>

      {/* 3. Telemetry SVG Chart with Timeframe Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chart View Card */}
        <div className="card" style={{ margin: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: 'var(--text-main)' }}>
                <Activity size={18} style={{ color: '#0ea5e9' }} />
                Enterprise Revenue Telemetry & Cash Flow
              </h3>
              <span className="card-subtitle" style={{ color: 'var(--text-muted)', transition: 'all 0.3s ease' }}>
                {chartData.subtitle}
              </span>
            </div>
            
            {/* Timeframe Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-input)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              {['1M', '3M', '6M', '1Y', 'ALL'].map(tf => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    showToast(`Updated chart view to ${tf} timeframe`, 'info');
                  }}
                  style={{
                    border: 'none', padding: '0.3rem 0.55rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer',
                    background: timeframe === tf ? '#0ea5e9' : 'transparent',
                    color: timeframe === tf ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Corporate Sky Blue Area Line SVG Chart */}
          <div style={{ position: 'relative', height: '210px', width: '100%', marginTop: '0.5rem' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="corporateChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {[30, 70, 110, 150].map((y, i) => (
                <line key={i} x1="30" y1={y} x2="480" y2={y} stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="4 4" />
              ))}

              {/* Area Fill */}
              <polygon fill="url(#corporateChartGrad)" points={polygonPoints} style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />

              {/* Line Polyline */}
              <polyline fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polylinePoints} style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />

              {/* Dynamic Points with Mouse Hover */}
              {chartData.points.map((pt, idx) => (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle cx={pt.x} cy={pt.y} r="6" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" style={{ transition: 'all 0.3s ease' }} />
                  <circle cx={pt.x} cy={pt.y} r="2.5" fill="#0284c7" />
                </g>
              ))}

              {/* Dynamic Month/Period Ticks */}
              {chartData.points.map((pt, idx) => (
                <text key={idx} x={pt.x} y="162" fill="#0369a1" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">
                  {pt.label}
                </text>
              ))}

              {/* Interactive Tooltip Badge on SVG */}
              {hoveredPoint && (
                <g transform={`translate(${Math.min(Math.max(hoveredPoint.x - 45, 10), 400)}, ${Math.max(hoveredPoint.y - 32, 5)})`}>
                  <rect width="90" height="24" rx="6" fill="#0284c7" />
                  <text x="45" y="16" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">
                    {hoveredPoint.displayVal}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Target Goals & SLA Tracking */}
        <div className="card" style={{ margin: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: 'var(--text-main)' }}>
                <Sparkles size={18} style={{ color: '#0ea5e9' }} />
                Strategic Targets & SLAs
              </h3>
              <span className="card-subtitle" style={{ color: 'var(--text-muted)' }}>Key Performance Indicators vs Fiscal Target Benchmarks</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '0.5rem 0' }}>
            
            {/* Goal 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span style={{ color: '#0c4a6e' }}>Fiscal Revenue Target ($5.0M)</span>
                <span style={{ color: '#0ea5e9' }}>97.0% ($4.85M)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '97%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Goal 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span style={{ color: '#0c4a6e' }}>Inventory Turnover Velocity (Target: 7.0x)</span>
                <span style={{ color: '#0284c7' }}>95.7% (6.7x)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Goal 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span style={{ color: '#0c4a6e' }}>On-Time Order Fulfillment SLA</span>
                <span style={{ color: '#10b981' }}>98.4% (Target: 99.0%)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px' }} />
              </div>
            </div>

          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audit Verified: Today at 12:00 UTC</span>
            <button className="btn btn-sm btn-secondary" onClick={() => setActiveModule('analytics')}>View Analytics →</button>
          </div>
        </div>

      </div>

      {/* 4. Real-Time Activity Feed & AI Risk Alert Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Real-time System Feed */}
        <div className="card" style={{ margin: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--text-main)' }}>
              <Clock size={18} style={{ color: '#0ea5e9' }} />
              Real-Time Audit Stream
            </h3>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>● Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={16} color="#0ea5e9" />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0c4a6e' }}>Journal Invoice Posted</div>
                  <div style={{ fontSize: '0.7rem', color: '#0369a1' }}>INV-2026-104 ($95,000) for Vanguard Health</div>
                </div>
              </div>
              <span className="mono" style={{ fontSize: '0.7rem', color: '#64748b' }}>2m ago</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Package size={16} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0c4a6e' }}>Inbound Stock Received</div>
                  <div style={{ fontSize: '0.7rem', color: '#0369a1' }}>50 units SKU-1001 added to WH-Alpha</div>
                </div>
              </div>
              <span className="mono" style={{ fontSize: '0.7rem', color: '#64748b' }}>14m ago</span>
            </div>

          </div>
        </div>

        {/* AI Intelligence Alert Box */}
        <div className="card" style={{ margin: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--text-main)' }}>
              <Sparkles size={18} style={{ color: '#0ea5e9' }} />
              Apex Intelligence System Insights
            </h3>
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>2 Action Items</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div style={{ padding: '0.85rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#d97706' }}>⚠️ Low Stock Warning (SKU-1002)</div>
                <div style={{ fontSize: '0.75rem', color: '#92400e' }}>18 units remaining at WH-Beta (Frankfurt).</div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setActiveModule('inventory')}>Restock</button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
