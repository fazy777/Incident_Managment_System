import React from 'react';
import { Search, MessageCircle, PhoneCall, Bell, Plus, X } from 'lucide-react';

export default function Navbar({ activeTicketId, setActiveTicketId, tickets, onAddTicket }) {
  return (
    <header className="top-navbar">
      {/* Left: Active Tabs */}
      <div className="navbar-tabs flex-1">
        {tickets.map((t) => (
          <div
            key={t.id}
            className={`tab-pill ${activeTicketId === t.id ? 'active' : ''}`}
            onClick={() => setActiveTicketId(t.id)}
          >
            <MessageCircle size={14} className="whatsapp-icon" />
            <div className="tab-text-group">
              <span className="tab-title">{t.customerName}</span>
            </div>
            <button
              className="tab-close-icon"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button className="add-tab-btn" onClick={onAddTicket} title="Add tab">
          <Plus size={14} /> <span>New</span>
        </button>
      </div>

      {/* Right: Search & User Controls */}
      <div className="navbar-right">
        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input type="text" placeholder="Search ticket or user..." />
        </div>

        <button className="nav-action-icon" title="Call">
          <PhoneCall size={16} />
        </button>

        <button className="nav-action-icon" title="Notifications">
          <Bell size={16} />
        </button>

        <div className="user-avatar-wrapper">
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
