import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { BarChart3, Download, Sparkles, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExporter';

export const AnalyticsModule = () => {
  const { financialHistory, inventorySKUs, crmLeads, employees, activeSubsidiary, showToast } = useERP();
  const [metricSelect, setMetricSelect] = useState('revenue');
  const [chartType, setChartType] = useState('bar');

  const totalInventoryValuation = inventorySKUs.reduce((acc, c) => acc + parseFloat(c.totalValue), 0);
  const totalPipelineValuation = crmLeads.reduce((acc, c) => acc + c.value, 0);

  const handleExportFullBI = () => {
    const payload = {
      subsidiary: activeSubsidiary,
      timestamp: new Date().toISOString(),
      financialHistory,
      inventoryValuation: totalInventoryValuation,
      crmPipelineValuation: totalPipelineValuation,
      headcount: employees.length
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BI_Analytics_Dump_${activeSubsidiary.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Exported full BI telemetry dataset as JSON');
  };

  const handleExportCSV = () => {
    const headers = ['Month', 'Gross Revenue USD', 'Operating Expenses USD', 'Net Profit USD', 'Profit Margin %'];
    const rows = financialHistory.map(f => [f.month, f.revenue, f.expenses, f.netProfit, f.margin]);
    exportToCSV('ApexERP_BI_Financial_Telemetry', headers, rows);
    showToast('Exported BI Analytics Telemetry to CSV successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Business Intelligence & Analytics</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Custom query builder, multi-dimensional charting engine, and BI dataset exporter.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handleExportFullBI}>
            <Download size={16} /> Export BI Dataset (.json)
          </button>
        </div>
      </div>

      {/* Query Builder Control Bar */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Metric Dimension</label>
            <select className="form-select" value={metricSelect} onChange={(e) => setMetricSelect(e.target.value)}>
              <option value="revenue">Gross Revenue Telemetry</option>
              <option value="expenses">Operating Expense Telemetry</option>
              <option value="profit">Net Operating Profit</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Chart Visualization</label>
            <select className="form-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">Monthly Bar Chart</option>
              <option value="line">Trend Line Chart</option>
            </select>
          </div>
        </div>

        <div className="badge badge-info" style={{ padding: '0.5rem 1rem' }}>
          <Sparkles size={14} /> Live Query Connected
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
            Consolidated BI Telemetry Engine
          </h3>
        </div>

        <div style={{ width: '100%', height: '260px' }}>
          <svg viewBox="0 0 600 220" style={{ width: '100%', height: '100%' }}>
            {/* Grid */}
            {[40, 80, 120, 160, 200].map((y, idx) => (
              <line key={idx} x1="40" y1={y} x2="580" y2={y} stroke="var(--border-color)" strokeDasharray="3 3" />
            ))}

            {chartType === 'bar' ? (
              financialHistory.map((item, idx) => {
                const val = metricSelect === 'revenue' ? item.revenue : metricSelect === 'expenses' ? item.expenses : item.netProfit;
                const h = (val / 3000000) * 160;
                const x = 55 + idx * 45;

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={200 - h}
                      width="24"
                      height={h}
                      fill={metricSelect === 'expenses' ? 'var(--color-danger)' : 'var(--accent-primary)'}
                      rx="4"
                    />
                    <text x={x + 12} y="215" fill="var(--text-subtle)" fontSize="10" textAnchor="middle">
                      {item.month}
                    </text>
                  </g>
                );
              })
            ) : (
              /* Line Chart */
              <polyline
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="3"
                points={financialHistory.map((item, idx) => {
                  const val = metricSelect === 'revenue' ? item.revenue : metricSelect === 'expenses' ? item.expenses : item.netProfit;
                  const y = 200 - (val / 3000000) * 160;
                  const x = 55 + idx * 45 + 12;
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
