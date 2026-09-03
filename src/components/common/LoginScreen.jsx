import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

export const DEMO_ACCOUNTS = [
  {
    name: 'Alex Mercer',
    email: 'admin@apexerp.com',
    password: 'admin123',
    role: 'Chief Operating Officer (Admin)',
    avatar: 'AM',
    color: '#0ea5e9'
  },
  {
    name: 'Sarah Jenkins',
    email: 'finance@apexerp.com',
    password: 'finance123',
    role: 'Chief Financial Officer (Finance)',
    avatar: 'SJ',
    color: '#0284c7'
  },
  {
    name: 'Marcus Vance',
    email: 'supply@apexerp.com',
    password: 'supply123',
    role: 'Global Supply Chain Director',
    avatar: 'MV',
    color: '#38bdf8'
  },
  {
    name: 'Elena Rostova',
    email: 'sales@apexerp.com',
    password: 'sales123',
    role: 'VP of Commercial Sales',
    avatar: 'ER',
    color: '#10b981'
  }
];

export const LoginScreen = () => {
  const { login, showToast } = useERP();
  const [email, setEmail] = useState('admin@apexerp.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (match) {
        login(match);
        setIsLoading(false);
      } else if (email && password.length >= 4) {
        // Allow custom login credentials for flexibility
        login({
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: 'Enterprise Administrator',
          avatar: email.substring(0, 2).toUpperCase(),
          color: '#0ea5e9'
        });
        setIsLoading(false);
      } else {
        setError('Invalid credentials. Use demo account credentials shown below.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      login(account);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(14, 165, 233, 0.2)',
        overflow: 'hidden',
        border: '1px solid #bae6fd'
      }}>
        
        {/* Left Form Box */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)'
            }}>
              <ShieldCheck size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', lineHeight: 1.1 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0c4a6e' }}>APEX</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0ea5e9' }}>ERP</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                ENTERPRISE SYSTEM PLATFORM
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0c4a6e', marginBottom: '0.35rem' }}>
            Sign In to Enterprise Node
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '1.75rem' }}>
            Enter your credentials or select a quick demo profile below.
          </p>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '0.825rem',
              fontWeight: '600',
              marginBottom: '1.25rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Email Field */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700' }}>Email Address / Username</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0369a1' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@apexerp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '10px', border: '1px solid #bae6fd', background: '#f0f7ff', color: '#0c4a6e' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700', margin: 0 }}>Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Demo Password Reset link generated', 'info'); }} style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: '600', textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0369a1' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', width: '100%', borderRadius: '10px', border: '1px solid #bae6fd', background: '#f0f7ff', color: '#0c4a6e' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#0369a1', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              {isLoading ? (
                <span>Authenticating Node...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Side Demo Credentials Box */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
          padding: '3rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.2)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              <Sparkles size={14} /> Quick Demo Access Profiles
            </div>
            
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>
              Select a Demo Role to Sign In Instantly:
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#e0f2fe', marginBottom: '1.5rem' }}>
              Click any profile card below to auto-authenticate with predefined enterprise roles & permissions.
            </p>

            {/* Demo Credentials Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickLogin(acc)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: acc.color,
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {acc.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0c4a6e' }}>{acc.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#0369a1', fontWeight: '600' }}>{acc.role}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {acc.email} | Pass: <span style={{ color: '#0ea5e9', fontWeight: '700' }}>{acc.password}</span>
                      </div>
                    </div>
                  </div>
                  <UserCheck size={18} style={{ color: '#0ea5e9' }} />
                </div>
              ))}
            </div>

          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e0f2fe' }}>
            <span>🔒 256-Bit SSL Enterprise Encrypted</span>
            <span>v1.0.0 Online</span>
          </div>

        </div>

      </div>
    </div>
  );
};
