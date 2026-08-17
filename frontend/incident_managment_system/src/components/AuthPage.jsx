import { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { registerUser, loginUser, isEmailRegistered } from '../services/authService';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('SecOps Lead');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUnregisteredError, setIsUnregisteredError] = useState(false);

  const emailCheck = isEmailRegistered(email);

  // Clear messages when switching tabs
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    setIsUnregisteredError(false);
    setEmail('');
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
        setErrorMessage('Passwords do not match. Please verify your password entry.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setLoading(true);
      try {
        const { user } = await registerUser({
          email,
          password,
          displayName: displayName.trim() || email.split('@')[0],
          role
        });

        // Immediately switch to login screen
        const registeredEmail = user.email;
        const registeredPass = password;
        setMode('login');
        setEmail(registeredEmail);
        setPassword(registeredPass);
        setSuccessMessage(`Account "${registeredEmail}" registered successfully! You can now log in below.`);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
      } finally {
        setLoading(false);
      }
    } else {
      // LOGIN MODE
      // Explicit check if user is registered
      if (!isEmailRegistered(email)) {
        setIsUnregisteredError(true);
        setErrorMessage('ACCOUNT NOT REGISTERED: This email address is not registered in the system. You cannot log in until you complete registration first!');
        return;
      }

      setLoading(true);
      try {
        const { user } = await loginUser(email, password);
        setSuccessMessage(`Welcome back, ${user.displayName || user.email}!`);
        if (onAuthSuccess) {
          onAuthSuccess(user);
        }
      } catch (err) {
        console.error(err);
        if (err.message && err.message.startsWith('ACCOUNT_NOT_REGISTERED')) {
          setIsUnregisteredError(true);
        } else {
          setIsUnregisteredError(false);
        }
        setErrorMessage(err.message.replace(/^[A-Z0-9_]+:\s*/, '') || 'Failed to authenticate user.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background ambient lighting */}
      <div className="auth-bg-gradient"></div>
      
      <div className="auth-card-wrapper">
        {/* Left Side: Brand Showcase */}
        <div className="auth-brand-pane">
          <div className="auth-brand-content">
            <div className="auth-logo-badge">
              <ShieldAlert size={36} className="auth-logo-icon" />
            </div>
            <h1 className="auth-brand-title">Incident Command Center</h1>
            <p className="auth-brand-subtitle">
              Enterprise Cyber Incident Management & Threat Intelligence Platform
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <ShieldCheck size={18} className="text-emerald" />
                <span>Encrypted Authentication & Session Security</span>
              </div>
              <div className="auth-feature-item">
                <Server size={18} className="text-blue" />
                <span>Strict Registration Check (Unregistered Access Blocked)</span>
              </div>
              <div className="auth-feature-item">
                <Sparkles size={18} className="text-gold" />
                <span>Real-time Incident Monitoring & Audit Logging</span>
              </div>
            </div>

            {/* System Status Chip */}
            <div className="auth-firebase-info">
              <div className="firebase-status-dot pulse"></div>
              <span>Authentication Gateway: </span>
              <strong>Active & Operational</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Pane */}
        <div className="auth-form-pane">
          {/* Header & Tabs */}
          <div className="auth-header">
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Sign In to Workspace' : 'Create New Account'}
            </h2>
            <p className="auth-form-subtext">
              {mode === 'login' 
                ? 'Only registered users can access the SecOps Incident Command System.' 
                : 'Register your account to gain SecOps system access.'}
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

          {/* Registration Requirement Notice Banner */}
          {mode === 'login' && (
            <div className="auth-notice-box info">
              <Info size={16} />
              <span>
                <strong>Access Rule:</strong> Users cannot log in until they are registered in the system registry.
              </span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="auth-notice-box success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className={`auth-notice-box error ${isUnregisteredError ? 'unregistered-highlight' : ''}`}>
              <AlertTriangle size={18} className="error-icon" />
              <div className="error-content">
                <span>{errorMessage}</span>
                {isUnregisteredError && (
                  <button 
                    type="button" 
                    className="btn-switch-register-inline"
                    onClick={() => handleModeSwitch('register')}
                  >
                    Click Here to Register Now <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Display Name (Only in Register mode) */}
            {mode === 'register' && (
              <div className="form-group">
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
              <label className="form-label">
                <span>Email Address</span>
                {mode === 'login' && email && (
                  <span className={`registration-status-badge ${emailCheck ? 'registered' : 'not-registered'}`}>
                    {emailCheck ? '✓ Registered' : '✕ Not Registered'}
                  </span>
                )}
              </label>
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
              <div className="form-group">
                <label className="form-label">SecOps Assignment Role</label>
                <div className="input-input-wrapper">
                  <Briefcase size={18} className="input-icon" />
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="SecOps Lead">SecOps Lead</option>
                    <option value="Incident Analyst">Incident Analyst</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="SOC Tier 2 Specialist">SOC Tier 2 Specialist</option>
                    <option value="Security Engineer">Security Engineer</option>
                  </select>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">Password</label>
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
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Only in Register mode) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
                <div className="auth-spinner"></div>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to Command Center</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <UserPlus size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
