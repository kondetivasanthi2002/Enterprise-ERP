import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { SUBSIDIARIES } from '../../services/mockDataGenerator';
import { Search, Sun, Moon, Bell, Globe, User, Sparkles, AlertTriangle, Check, X, ExternalLink, LogOut } from 'lucide-react';

export const Header = () => {
  const {
    user,
    logout,
    theme,
    toggleTheme,
    activeSubsidiary,
    setActiveSubsidiary,
    searchQuery,
    setSearchQuery,
    toastNotification,
    activeModule,
    setActiveModule,
    showToast,
    toggleAIChat
  } = useERP();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Low Stock Alert (SKU-1002)',
      desc: '18 units remaining at WH-Beta (Frankfurt). Reorder threshold reached.',
      time: '10m ago',
      unread: true,
      type: 'warning',
      module: 'inventory'
    },
    {
      id: 2,
      title: 'PO Sign-Off Required (PO-2026-702)',
      desc: 'Purchase Order $64,000 for Metals & Alloys Co awaiting approval.',
      time: '35m ago',
      unread: true,
      type: 'info',
      module: 'procurement'
    },
    {
      id: 3,
      title: 'Invoice Payment Overdue',
      desc: 'INV-2026-104 ($95,000) for Vanguard Health is 3 days overdue.',
      time: '2h ago',
      unread: true,
      type: 'danger',
      module: 'finance'
    },
    {
      id: 4,
      title: 'Monthly Payroll Executed',
      desc: 'Automated payroll run executed successfully for 25 active employees.',
      time: '5h ago',
      unread: false,
      type: 'success',
      module: 'hcm'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      height: '68px',
      background: 'var(--bg-header)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
          {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#0ea5e9' }} />}
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={toggleAIChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: '#ffffff',
            border: 'none',
            padding: '0.45rem 0.9rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)'
          }}
          title="Open Apex AI Assistant Chat"
        >
          <Sparkles size={15} />
          <span>Apex AI</span>
        </button>

        {/* Interactive Notifications Popover */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            title="Notifications & System Alerts"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              position: 'relative',
              background: notificationsOpen ? 'var(--accent-primary-light)' : 'transparent',
              color: notificationsOpen ? 'var(--accent-primary)' : 'var(--text-main)',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-header)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Drawer */}
          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: '0',
              width: '360px',
              maxHeight: '480px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 32px rgba(14, 165, 233, 0.25)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideDown 0.2s ease-out'
            }}>
              {/* Header */}
              <div style={{
                padding: '0.85rem 1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-elevated)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>System Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>{unreadCount} New</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {notifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                      if (item.module) setActiveModule(item.module);
                      showToast(`Navigated to ${item.title}`);
                      setNotificationsOpen(false);
                    }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      background: item.unread ? 'rgba(14, 165, 233, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '0.75rem',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      {item.type === 'warning' && <AlertTriangle size={16} style={{ color: '#f59e0b' }} />}
                      {item.type === 'danger' && <AlertTriangle size={16} style={{ color: '#ef4444' }} />}
                      {item.type === 'info' && <Bell size={16} style={{ color: '#0ea5e9' }} />}
                      {item.type === 'success' && <Check size={16} style={{ color: '#10b981' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: item.unread ? 700 : 600, color: '#0c4a6e' }}>{item.title}</span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.time}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0, lineHeight: 1.35 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: user?.color || 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)'
          }}>
            {user?.avatar || 'AM'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.2, color: 'var(--text-main)' }}>
              {user?.name || 'Alex Mercer'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {user?.role || 'Chief Operating Officer'}
            </span>
          </div>
          <button
            onClick={logout}
            title="Sign Out of Session"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #bae6fd',
              background: '#f0f7ff',
              color: '#0284c7',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginLeft: '0.25rem',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
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
