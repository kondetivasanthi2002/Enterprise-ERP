import React from 'react';
import { useERP } from '../../context/ERPContext';
import { MODULES_INFO } from '../../services/mockDataGenerator';
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
  UserCheck,
  ShoppingCart,
  Cpu,
  Briefcase,
  BarChart3,
  ShieldCheck,
  Layers,
  Activity
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
  UserCheck,
  ShoppingCart,
  Cpu,
  Briefcase,
  BarChart3,
  ShieldCheck
};

export const Sidebar = () => {
  const { activeModule, setActiveModule } = useERP();

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      zIndex: 110
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.4rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justify-content: 'center',
          boxShadow: 'var(--glow-primary)',
          color: '#fff'
        }}>
          <Layers size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ApexERP
          </h1>
          <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Enterprise Suite
          </span>
        </div>
      </div>

      {/* Navigation Modules */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Platform Modules
        </div>

        {MODULES_INFO.map(mod => {
          const IconComp = ICON_MAP[mod.icon] || LayoutDashboard;
          const isActive = activeModule === mod.id;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'var(--accent-primary-light)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
              }}
            >
              <IconComp size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mod.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* System Live Monitor Widget */}
      <div style={{
        padding: '1rem',
        margin: '0.75rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)' }}>
            <Activity size={14} style={{ color: 'var(--color-success)' }} /> System Node
          </span>
          <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
            ONLINE
          </span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          <div>Cluster Uptime: <strong>99.998%</strong></div>
          <div>Avg Latency: <strong>14ms</strong></div>
        </div>
      </div>
    </aside>
  );
};
