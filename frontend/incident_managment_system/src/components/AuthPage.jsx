import { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  LogIn, 
  Server,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  KeyRound,
  Check,
  Shield
} from 'lucide-react';
import { registerUser, loginUser, isEmailRegistered, DEFAULT_PRESEEDED_USERS } from '../services/authService';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('SecOps Lead');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUnregisteredError, setIsUnregisteredError] = useState(false);

  // Check if current email is valid format and registered
  const isEmailFormatValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const emailIsRegistered = useMemo(() => {
    if (!isEmailFormatValid) return false;
    return isEmailRegistered(email.trim());
  }, [email, isEmailFormatValid]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return { label: '', color: '' };
      case 1: return { label: 'Weak', color: '#ef4444' };
      case 2: return { label: 'Fair', color: '#f59e0b' };
      case 3: return { label: 'Good', color: '#0284c7' };
      case 4: return { label: 'Strong & Secure', color: '#10b981' };
      default: return { label: '', color: '' };
    }
  };

  // Quick Demo Account Auto-Fill
  const handleQuickDemoFill = (demoUser) => {
    setMode('login');
    setEmail(demoUser.email);
    setPassword(demoUser.passwordHint || 'SecOps123!');
    setErrorMessage('');
    setSuccessMessage(`Loaded demo credentials for ${demoUser.displayName}. Ready to sign in!`);
    setIsUnregisteredError(false);
  };

  // Mode switcher
  const handleModeSwitch = (newMode, preserveEmail = false) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    setIsUnregisteredError(false);
    if (!preserveEmail) {
      setEmail('');
    }
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsUnregisteredError(false);

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your confirmation password.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setLoading(true);
      try {
        const { user } = await registerUser({
          email: email.trim(),
          password,
          displayName: displayName.trim() || email.trim().split('@')[0],
          role
        });

        // Auto login & switch
        const registeredEmail = user.email;
        const registeredPass = password;
        setMode('login');
        setEmail(registeredEmail);
        setPassword(registeredPass);
        setSuccessMessage(`Account "${registeredEmail}" registered successfully! You can now sign in.`);
      } catch (err) {
        console.error("Registration error:", err);
        setErrorMessage(err.message || 'Registration failed. Please verify your inputs.');
      } finally {
        setLoading(false);
      }
    } else {
      // LOGIN MODE
      if (!isEmailRegistered(email.trim())) {
        setIsUnregisteredError(true);
        setErrorMessage(`Email "${email.trim()}" is not registered in the SecOps system registry. Please register your account first.`);
        return;
      }

      setLoading(true);
      try {
        const { user } = await loginUser(email.trim(), password);
        setSuccessMessage(`Welcome back, ${user.displayName || user.email}! Initializing Incident Center...`);
        if (onAuthSuccess) {
          setTimeout(() => {
            onAuthSuccess(user);
          }, 300);
        }
      } catch (err) {
        console.error("Login error:", err);
        if (err.message && err.message.startsWith('ACCOUNT_NOT_REGISTERED')) {
          setIsUnregisteredError(true);
        } else {
          setIsUnregisteredError(false);
        }
        setErrorMessage(err.message.replace(/^[A-Z0-9_]+:\s*/, '') || 'Authentication failed. Please verify credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background ambient lighting */}
      <div className="auth-bg-gradient"></div>
      
      <div className="auth-card-wrapper fade-in">
        {/* Left Side: Brand & Live Architecture Showcase */}
        <div className="auth-brand-pane">
          <div className="auth-brand-content">
            <div className="auth-logo-badge">
              <ShieldAlert size={34} className="auth-logo-icon" />
            </div>

            <div className="auth-brand-badge-row">
              <span className="auth-sys-chip">
                <span className="live-dot pulse"></span> SecOps Command v2.4
              </span>
              <span className="auth-sec-level">SLA Level 1</span>
            </div>

            <h1 className="auth-brand-title">Incident Command Center</h1>
            <p className="auth-brand-subtitle">
              Enterprise Cyber Incident Response, Threat Triage & Infrastructure Observability Platform.
            </p>

            {/* Feature checklist */}
            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="feature-icon-circle emerald">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <div className="feature-title">End-to-End Audit & SLA Tracking</div>
                  <div className="feature-desc">Automatic timeline recording and SLA countdown timers</div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-circle blue">
                  <Server size={15} />
                </div>
                <div>
                  <div className="feature-title">Hybrid Spring Boot & Cloud Sync</div>
                  <div className="feature-desc">Real-time telemetry, exportable PDF/JSON reports</div>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-circle gold">
                  <Zap size={15} />
                </div>
                <div>
                  <div className="feature-title">Fast Triage Playbooks</div>
                  <div className="feature-desc">One-click incident resolution workflows and on-call routing</div>
                </div>
              </div>
            </div>

            {/* Quick Demo Fill Box */}
            <div className="auth-demo-credentials-card">
              <div className="demo-card-header">
                <KeyRound size={14} className="text-blue" />
                <span>Instant Demo Accounts (1-Click Fill)</span>
              </div>
              <div className="demo-accounts-grid">
                {DEFAULT_PRESEEDED_USERS.map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    className="demo-account-btn"
                    onClick={() => handleQuickDemoFill(demo)}
                    title={`Fill ${demo.email} (${demo.role})`}
                  >
                    <div className="demo-btn-left">
                      <div className="demo-role-tag">{demo.role}</div>
                      <div className="demo-email-text">{demo.email}</div>
                    </div>
                    <div className="demo-btn-action">
                      <span>Fill</span>
                      <ArrowRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* System Status Chip */}
            <div className="auth-firebase-info">
              <div className="firebase-status-dot pulse"></div>
              <span>SecOps Gateway: </span>
              <strong>Active & Operational</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Pane */}
        <div className="auth-form-pane">
          {/* Header & Tabs */}
          <div className="auth-header">
            <div className="auth-header-top">
              <h2 className="auth-form-title">
                {mode === 'login' ? 'Sign In to Workspace' : 'Create New Account'}
              </h2>
              <span className="auth-secure-tag">
                <Shield size={12} /> TLS 1.3
              </span>
            </div>
            <p className="auth-form-subtext">
              {mode === 'login' 
                ? 'Enter your registered SecOps credentials to access the command center.' 
                : 'Register a new authorized operator account to join active duty.'}
            </p>

            {/* Mode Switcher Pills */}
            <div className="auth-tab-pills">
              <button
                className={`auth-tab-pill ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('login')}
                type="button"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                className={`auth-tab-pill ${mode === 'register' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('register')}
                type="button"
              >
                <UserPlus size={15} />
                <span>Register Account</span>
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {successMessage && (
            <div className="auth-notice-box success fade-in">
              <CheckCircle2 size={18} className="notice-icon text-emerald" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className={`auth-notice-box error fade-in ${isUnregisteredError ? 'unregistered-highlight' : ''}`}>
              <AlertTriangle size={20} className="notice-icon text-red" />
              <div className="error-content">
                <span>{errorMessage}</span>
                {isUnregisteredError && (
                  <button 
                    type="button" 
                    className="btn-switch-register-inline"
                    onClick={() => handleModeSwitch('register', true)}
                  >
                    <span>Register "{email.trim()}" in 1 Click</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Display Name (Only in Register mode) */}
            {mode === 'register' && (
              <div className="form-group fade-in">
                <label className="form-label">Full Name / Agent Handle</label>
                <div className="input-input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Mercer"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address Input */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Email Address</label>
                {mode === 'login' && isEmailFormatValid && (
                  <span className={`registration-status-badge ${emailIsRegistered ? 'registered' : 'not-registered'}`}>
                    {emailIsRegistered ? '✓ Registered' : '✕ Unregistered'}
                  </span>
                )}
              </div>
              <div className="input-input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="agent@secops.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role Selection (Only in Register mode) */}
            {mode === 'register' && (
              <div className="form-group fade-in">
                <label className="form-label">SecOps Assignment Role</label>
                <div className="input-input-wrapper">
                  <Briefcase size={18} className="input-icon" />
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="SecOps Lead">SecOps Lead (Full Access)</option>
                    <option value="Incident Analyst">Incident Analyst (Triage & Response)</option>
                    <option value="SOC Tier 2 Specialist">SOC Tier 2 Specialist (Investigator)</option>
                    <option value="Security Engineer">Security Engineer (Infrastructure)</option>
                    <option value="System Administrator">System Administrator (Root)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Password</label>
                {mode === 'register' && password && (
                  <span className="strength-label" style={{ color: getStrengthLabel().color }}>
                    {getStrengthLabel().label}
                  </span>
                )}
              </div>
              <div className="input-input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength meter bar in register mode */}
              {mode === 'register' && password && (
                <div className="password-strength-bar-track">
                  <div 
                    className={`password-strength-bar-fill score-${passwordStrength}`} 
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Confirm Password (Only in Register mode) */}
            {mode === 'register' && (
              <div className="form-group fade-in">
                <div className="form-label-row">
                  <label className="form-label">Confirm Password</label>
                  {confirmPassword && (
                    <span className={`match-badge ${password === confirmPassword ? 'match' : 'mismatch'}`}>
                      {password === confirmPassword ? '✓ Passwords Match' : '✕ Passwords Differ'}
                    </span>
                  )}
                </div>
                <div className="input-input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              className={`btn-auth-submit ${mode === 'register' ? 'btn-register' : 'btn-login'}`}
              disabled={loading}
            >
              {loading ? (
                <div className="auth-spinner-row">
                  <div className="auth-spinner"></div>
                  <span>Authenticating...</span>
                </div>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to Command Center</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Footer Helper */}
          <div className="auth-card-footer">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button 
                  type="button" 
                  className="auth-link-btn"
                  onClick={() => handleModeSwitch('register')}
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have a registered account?{' '}
                <button 
                  type="button" 
                  className="auth-link-btn"
                  onClick={() => handleModeSwitch('login')}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
