import React from 'react';
import { Search, MessageSquare, Phone, Grid, X, Plus } from 'lucide-react';

export default function Navbar({ activeTicketId, setActiveTicketId, tickets, onAddTicket }) {
  return (
    <header className="top-navbar">
      {/* Ticket Tabs */}
      <div className="tabs-container">
        {tickets.map((t) => (
          <div
            key={t.id}
            className={`tab-item ${activeTicketId === t.id ? 'active' : ''}`}
            onClick={() => setActiveTicketId(t.id)}
          >
            <div className="tab-channel-icon">
              <MessageSquare size={14} className="whatsapp-icon" />
            </div>
            <div className="tab-info">
              <div className="tab-title">{t.customerName}</div>
              <div className="tab-subtitle">{t.lastMessage}</div>
            </div>
            <button
              className="tab-close-btn"
              onClick={(e) => {
                e.stopPropagation();
              }}
              title="Close tab"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <button className="tab-add-btn" onClick={onAddTicket} title="Open new incident tab">
          <Plus size={16} /> <span>Add</span>
        </button>
      </div>

      {/* Header Actions */}
      <div className="header-right-actions">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search incidents, tickets, users..." />
        </div>

        <div className="action-pill chats-pill">
          <span className="chats-label">Chats</span>
          <span className="chats-count">0</span>
        </div>

        <button className="header-icon-btn" title="Start Call">
          <Phone size={18} />
        </button>

        <button className="header-icon-btn" title="App Switcher">
          <Grid size={18} />
        </button>

        <div className="user-profile-avatar" title="Alex Knapp (Agent)">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Alex Knapp"
          />
          <span className="online-badge"></span>
        </div>
      </div>
    </header>
  );
}
