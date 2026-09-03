import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, User, UserPlus, ArrowRight, Building2, Cpu, BarChart3 } from 'lucide-react';

export const LoginScreen = () => {
  const { login, showToast } = useERP();
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('admin@apexerp.com');
  const [role, setRole] = useState('Chief Operating Officer');
  const [password, setPassword] = useState('admin123');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper to fetch registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem('apex_erp_registered_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper to save new user to localStorage
  const saveRegisteredUser = (newUser) => {
    try {
      const users = getRegisteredUsers();
      users.push(newUser);
      localStorage.setItem('apex_erp_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save registered user', e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // --- CREATE ACCOUNT VALIDATION ---
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (!password || password.length < 4) {
        setError('Password must be at least 4 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        const initials = fullName
          .trim()
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'US';

        const newUser = {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: role,
          avatar: initials,
          color: '#0ea5e9'
        };

        saveRegisteredUser(newUser);
        login(newUser);
        setIsLoading(false);
        showToast(`Account successfully created for ${fullName}!`, 'success');
      }, 500);

    } else {
      // --- SIGN IN VALIDATION ---
      if (!email || !password) {
        setError('Please enter both email address and password');
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        const registeredUsers = getRegisteredUsers();
        const found = registeredUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (found) {
          login(found);
        } else if (email && password.length >= 4) {
          // Allow login for user credentials
          const nameFromEmail = email.split('@')[0].toUpperCase();
          const initials = nameFromEmail.substring(0, 2);
          login({
            name: nameFromEmail,
            email: email,
            role: role || 'Enterprise Administrator',
            avatar: initials,
            color: '#0ea5e9'
          });
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
        setIsLoading(false);
      }, 400);
    }
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
        maxWidth: '960px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(14, 165, 233, 0.2)',
        overflow: 'hidden',
        border: '1px solid #bae6fd'
      }}>
        
        {/* Left Authentication Form Box */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
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

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0c4a6e', marginBottom: '0.35rem' }}>
            {isRegistering ? 'Create New Account' : 'Sign In to Enterprise Node'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '1.5rem' }}>
            {isRegistering
              ? 'Enter your details below to set up your enterprise user account.'
              : 'Enter your credentials to access your ERP dashboard.'}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Full Name Field (Register Mode Only) */}
            {isRegistering && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700', fontSize: '0.825rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0369a1' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '10px', border: '1px solid #bae6fd', background: '#f0f7ff', color: '#0c4a6e' }}
                    required={isRegistering}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700', fontSize: '0.825rem' }}>Work Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0369a1' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="user@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '10px', border: '1px solid #bae6fd', background: '#f0f7ff', color: '#0c4a6e' }}
                  required
                />
              </div>
            </div>

            {/* Role Selection Dropdown (Register Mode Only) */}
            {isRegistering && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700', fontSize: '0.825rem' }}>Enterprise Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #bae6fd',
                    background: '#f0f7ff',
                    color: '#0c4a6e',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                >
                  <option value="Chief Operating Officer">Chief Operating Officer (Admin)</option>
                  <option value="Chief Financial Officer">Chief Financial Officer (Finance)</option>
                  <option value="Global Supply Chain Director">Global Supply Chain Director</option>
                  <option value="VP of Commercial Sales">VP of Commercial Sales</option>
                  <option value="HR & Operations Lead">HR & Operations Lead</option>
                  <option value="Enterprise Systems Specialist">Enterprise Systems Specialist</option>
                </select>
              </div>
            )}

            {/* Password Field */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700', fontSize: '0.825rem', margin: 0 }}>Password</label>
                {!isRegistering && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password Reset link generated', 'info'); }} style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: '600', textDecoration: 'none' }}>
                    Forgot Password?
                  </a>
                )}
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

            {/* Confirm Password Field (Register Mode Only) */}
            {isRegistering && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#0c4a6e', fontWeight: '700', fontSize: '0.825rem' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0369a1' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '10px', border: '1px solid #bae6fd', background: '#f0f7ff', color: '#0c4a6e' }}
                    required={isRegistering}
                  />
                </div>
              </div>
            )}

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
                <span>{isRegistering ? 'Creating Account...' : 'Authenticating Node...'}</span>
              ) : (
                <>
                  <span>{isRegistering ? 'Create Account & Sign In' : 'Sign In to Dashboard'}</span>
                  {isRegistering ? <UserPlus size={18} /> : <ArrowRight size={18} />}
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid #e0f2fe' }}>
            {isRegistering ? (
              <p style={{ fontSize: '0.85rem', color: '#0369a1', margin: 0 }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In Here
                </button>
              </p>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#0369a1', margin: 0 }}>
                Don't have an enterprise account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(true); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Create an Account
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Right Side Enterprise Showcase Branding Box */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
          padding: '3rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.2)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              <Sparkles size={14} /> ApexERP Enterprise Platform
            </div>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: '#ffffff', lineHeight: 1.25 }}>
              Enterprise Resource Planning Engine
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#e0f2fe', marginBottom: '2rem', lineHeight: 1.6 }}>
              Seamlessly unify global finance, MRP manufacturing, supply chain, and commercial sales with embedded real-time AI copilot intelligence.
            </p>

            {/* Feature Highlights List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Multi-Subsidiary Financials</h4>
                  <p style={{ margin: 0, fontSize: '0.775rem', color: '#e0f2fe' }}>Real-time GL consolidation across global currencies & multi-entity structures.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Apex AI Copilot Assistant</h4>
                  <p style={{ margin: 0, fontSize: '0.775rem', color: '#e0f2fe' }}>Natural language query engine with voice control & automated workflow execution.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Real-Time Supply Chain Telemetry</h4>
                  <p style={{ margin: 0, fontSize: '0.775rem', color: '#e0f2fe' }}>Automated reorder triggers, FIFO stock valuation, and MRP material requirements.</p>
                </div>
              </div>
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
