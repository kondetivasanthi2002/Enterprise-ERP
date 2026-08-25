import React from 'react';
import { useERP } from '../../context/ERPContext';
import { SUBSIDIARIES } from '../../services/mockDataGenerator';
import { Search, Sun, Moon, Bell, Globe, User, Sparkles } from 'lucide-react';

export const Header = () => {
  const {
    theme,
    toggleTheme,
    activeSubsidiary,
    setActiveSubsidiary,
    searchQuery,
    setSearchQuery,
    toastNotification,
    activeModule
  } = useERP();

  return (
    <header style={{
      height: '68px',
      background: 'var(--bg-header)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      align-items: 'center',
      justify-content: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Search & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, maxWidth: '480px' }}>
        <div style={{
          position: 'relative',
          width: '100%'
        }}>
          <Search size={17} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search records, SKUs, invoices, leads or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '2.4rem',
              width: '100%',
              borderRadius: '20px',
              fontSize: '0.825rem'
            }}
          />
        </div>
      </div>

      {/* Right Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Subsidiary Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Globe size={16} style={{ color: 'var(--accent-primary)' }} />
          <select
            value={activeSubsidiary.id}
            onChange={(e) => {
              const sub = SUBSIDIARIES.find(s => s.id === e.target.value);
              if (sub) setActiveSubsidiary(sub);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {SUBSIDIARIES.map(sub => (
              <option key={sub.id} value={sub.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                {sub.name} ({sub.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" title="Notifications">
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              background: 'var(--color-danger)',
              borderRadius: '50%'
            }} />
          </button>
        </div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justify-content: 'center',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.85rem'
          }}>
            EX
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.2 }}>Alex Mercer</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Chief Operating Officer</span>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--bg-card)',
          border: `1px solid ${toastNotification.type === 'danger' ? 'var(--color-danger)' : 'var(--accent-primary)'}`,
          boxShadow: 'var(--shadow-lg)',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 9999,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{toastNotification.message}</span>
        </div>
      )}
    </header>
  );
};
