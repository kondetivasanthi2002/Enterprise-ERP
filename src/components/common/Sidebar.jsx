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
  Activity,
  Sparkles
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
  const { activeModule, setActiveModule, toggleAIChat, isAIChatOpen } = useERP();

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
        padding: '1.35rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Real Corporate Apex Delta Crest Logo in Sky Blue */}
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          border: '1px solid rgba(14, 165, 233, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)',
          flexShrink: 0
        }}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3L3 27H10.5L16 16.5L21.5 27H29L16 3Z" fill="url(#apexGradPrimary)"/>
            <path d="M16 10L10.5 21H21.5L16 10Z" fill="#ffffff"/>
            <path d="M16 14L13 20H19L16 14Z" fill="url(#apexGradAccent)"/>
            <defs>
              <linearGradient id="apexGradPrimary" x1="16" y1="3" x2="16" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff"/>
                <stop offset="1" stopColor="#e0f2fe"/>
              </linearGradient>
              <linearGradient id="apexGradAccent" x1="16" y1="14" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9"/>
                <stop offset="1" stopColor="#0284c7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#0c4a6e' }}>APEX</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#0ea5e9' }}>ERP</span>
          </div>
          <span style={{ fontSize: '0.6rem', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginTop: '2px' }}>
            SYSTEMS CORPORATION
          </span>
        </div>
      </div>

      {/* Navigation Modules */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Core Operations
        </div>

        {MODULES_INFO.slice(0, 5).map(mod => {
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
                background: isActive ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
                color: isActive ? '#0284c7' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? '3px solid #0ea5e9' : '3px solid transparent'
              }}
            >
              <IconComp size={18} style={{ color: isActive ? '#0ea5e9' : 'var(--text-muted)' }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mod.name}
              </span>
            </button>
          );
        })}

        <div style={{ padding: '0.8rem 0.75rem 0.4rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Supply & Intelligence
        </div>

        {MODULES_INFO.slice(5).map(mod => {
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
                background: isActive ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
                color: isActive ? '#0284c7' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? '3px solid #0ea5e9' : '3px solid transparent'
              }}
            >
              <IconComp size={18} style={{ color: isActive ? '#0ea5e9' : 'var(--text-muted)' }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mod.name}
              </span>
            </button>
          );
        })}

        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {/* AI Copilot Sidebar Item */}
          <button
            onClick={toggleAIChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              background: isAIChatOpen ? 'rgba(14, 165, 233, 0.15)' : 'var(--bg-elevated)',
              color: '#0c4a6e',
              fontWeight: '600',
              fontSize: '0.825rem',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Sparkles size={16} style={{ color: '#0ea5e9' }} />
            <span style={{ flex: 1 }}>Apex Intelligence</span>
            <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(14, 165, 233, 0.15)', color: '#0284c7', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
              Copilot
            </span>
          </button>
        </div>
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
