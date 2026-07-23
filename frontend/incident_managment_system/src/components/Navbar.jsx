import React from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Bell, 
  Database,
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  FilePlus,
  Settings
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, incidentCount }) {
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
            className={`nav-tab-pill ${activeTab === 'whatsapp-broadcast' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp-broadcast')}
          >
            <MessageSquare size={14} />
            <span>WhatsApp Broadcast</span>
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

      {/* Right: DB readiness & User Controls */}
      <div className="navbar-right">
        <div className="db-status-chip" title="State stored in local storage, ready for SQL / NoSQL database binding">
          <Database size={13} className="text-green" />
          <span>DB Status: Ready</span>
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

        <div className="user-avatar-wrapper" title="SecOps Admin Analyst">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Agent Profile"
          />
          <span className="status-dot"></span>
        </div>
      </div>
    </header>
  );
}

