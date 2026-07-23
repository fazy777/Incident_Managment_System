import React from 'react';
import { LayoutDashboard, BarChart3, MessageSquare, PlusCircle, ShieldAlert, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Incident Dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics & KPIs' },
    { id: 'whatsapp-broadcast', icon: MessageSquare, label: 'WhatsApp Broadcast Hub' },
    { id: 'add-incident', icon: PlusCircle, label: 'Report Incident' },
    { id: 'settings', icon: Settings, label: 'System Settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" title="SecOps Incident System" onClick={() => setActiveTab('dashboard')}>
        <div className="logo-icon">
          <ShieldAlert size={20} color="#ffffff" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <Icon size={19} />
              {isActive && <span className="active-pill-line"></span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

