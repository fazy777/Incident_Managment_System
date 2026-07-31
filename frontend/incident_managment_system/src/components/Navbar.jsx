import React from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Bell, 
  Database,
  LayoutDashboard,
  BarChart3,
  UserCheck,
  FilePlus,
  Settings,
  History,
  LogOut,
  User
} from 'lucide-react';
import { getUserRole } from '../services/authService';

export default function Navbar({ activeTab, setActiveTab, incidentCount, currentUser, onLogout }) {
  const userRole = currentUser ? getUserRole(currentUser.email) : "SecOps Analyst";
  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "SecOps Agent";

  return (
    <header className="top-navbar">
      {/* Left: Branding & Tabs */}
      <div className="navbar-brand-section">
        <div className="app-title-group" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <span className="app-name">Incident Command Center</span>
          <span className="app-env-badge">SecOps v2.4</span>
        </div>

        <div className="nav-tab-pills">
          <button
            className={`nav-tab-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
            <span className="tab-count-badge">{incidentCount}</span>
          </button>

          <button
            className={`nav-tab-pill ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={14} />
            <span>Analytics</span>
          </button>

          <button
            className={`nav-tab-pill ${activeTab === 'on-call' ? 'active' : ''}`}
            onClick={() => setActiveTab('on-call')}
          >
            <UserCheck size={14} />
            <span>On-Call Roster</span>
          </button>

          <button
            className={`nav-tab-pill ${activeTab === 'audit-logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit-logs')}
          >
            <History size={14} />
            <span>Audit Logs</span>
          </button>

          <button
            className={`nav-tab-pill ${activeTab === 'add-incident' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-incident')}
          >
            <FilePlus size={14} />
            <span>+ Report Incident</span>
          </button>
        </div>
      </div>

      {/* Right: User Controls & Logout */}
      <div className="navbar-right">
        <div className="db-status-chip" title="System Authentication Active">
          <Database size={13} className="text-green" />
          <span>SecOps Auth</span>
        </div>

        <button className="btn-quick-add" onClick={() => setActiveTab('add-incident')}>
          <Plus size={14} />
          <span>New Incident</span>
        </button>

        <button className="nav-action-icon" title="System Settings" onClick={() => setActiveTab('settings')}>
          <Settings size={16} />
        </button>

        <button className="nav-action-icon" title="System Notifications">
          <Bell size={16} />
        </button>

        {/* User Card */}
        <div className="navbar-user-card" title={`Logged in as ${currentUser?.email}`}>
          <div className="user-avatar-wrapper">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.email || 'SecOps'}`}
              alt="Agent Avatar"
            />
            <span className="status-dot"></span>
          </div>
          <div className="user-info-text">
            <span className="user-display-name">{userDisplayName}</span>
            <span className="user-display-role">{userRole}</span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button className="btn-nav-logout" onClick={onLogout} title="Sign Out of Session">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
}



