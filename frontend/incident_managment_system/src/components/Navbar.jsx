import React, { useState } from 'react';
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
  User,
  CheckCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { getUserRole } from '../services/authService';

export default function Navbar({ activeTab, setActiveTab, incidentCount, currentUser, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'CRITICAL: Unauthorized Admin Access',
      desc: 'SIEM Anomaly Alert #SOC-882 on Auth Server',
      time: '10 mins ago',
      type: 'critical',
      unread: true
    },
    {
      id: 2,
      title: 'SLA Warning: INC-8090',
      desc: 'DDoS Attack on Perimeter Gateway nearing 2h SLA threshold',
      time: '25 mins ago',
      type: 'warning',
      unread: true
    },
    {
      id: 3,
      title: 'On-Call Shift Started',
      desc: 'Alex Knapp is now primary responder for SecOps Tier 1',
      time: '1 hour ago',
      type: 'info',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

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

        {/* Notifications Button & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className={`nav-action-icon ${showNotifications ? 'active' : ''}`} 
            title="System Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444'
              }}></span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '320px',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 1000,
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#f8fafc' }}>Notifications Center</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead} 
                    style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCheck size={12} /> Mark read
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: n.unread ? '#1e293b' : '#0f172a',
                    borderLeft: `3px solid ${n.type === 'critical' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#3b82f6'}`
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: n.type === 'critical' ? '#f87171' : n.type === 'warning' ? '#fbbf24' : '#60a5fa' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{n.desc}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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




