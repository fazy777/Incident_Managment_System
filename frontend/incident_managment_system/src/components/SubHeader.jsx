import React from 'react';
import { ChevronRight, Plus, User, AppWindow } from 'lucide-react';

export default function SubHeader({ ticket }) {
  return (
    <div className="subheader-bar">
      <div className="subheader-left">
        <span className="breadcrumb-item link">Organization (Create)</span>
        <ChevronRight size={14} className="separator" />
        <span className="breadcrumb-item link">{ticket.customerName}</span>
        <ChevronRight size={14} className="separator" />
        <span className="badge-new">New</span>
        <span className="ticket-id">Ticket #{ticket.ticketId}</span>
        <ChevronRight size={14} className="separator" />
        <button className="side-conv-btn">
          Side conversations <Plus size={14} />
        </button>
      </div>

      <div className="subheader-right">
        <button className="toggle-btn active">
          <User size={15} /> <span>User</span>
        </button>
        <button className="toggle-btn">
          <AppWindow size={15} /> <span>Apps</span>
        </button>
      </div>
    </div>
  );
}
