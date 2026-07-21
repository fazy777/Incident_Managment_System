import React from 'react';
import { Home, Ticket, Users, BarChart3, Settings, Layers } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'tickets', icon: Ticket, label: 'Incidents & Tickets' },
    { id: 'users', icon: Users, label: 'Customers' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <Layers size={22} color="#ffffff" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span className="tooltip">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator" title="System Status: Operational"></div>
      </div>
    </aside>
  );
}
