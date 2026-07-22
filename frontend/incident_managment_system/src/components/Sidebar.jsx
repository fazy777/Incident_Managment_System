import React from 'react';
import { LayoutDashboard, PlusCircle, ShieldAlert, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Incident Dashboard' },
    { id: 'add-incident', icon: PlusCircle, label: 'Report Incident' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" title="SecOps Incident System">
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
