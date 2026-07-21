import React from 'react';
import { ShieldAlert, Ticket, Users, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'tickets', icon: Ticket, label: 'Incidents' },
    { id: 'users', icon: Users, label: 'Requesters' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
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
              <Icon size={18} />
              {isActive && <span className="active-pill-line"></span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
