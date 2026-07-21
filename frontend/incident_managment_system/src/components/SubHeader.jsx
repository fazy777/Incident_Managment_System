import React from 'react';
import { ChevronRight, Plus, User, Layers } from 'lucide-react';

export default function SubHeader({ ticket }) {
  return (
    <div className="subheader-bar">
      <div className="subheader-left">
        <span className="breadcrumb-link">Organization</span>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="breadcrumb-link">{ticket.customerName}</span>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="ticket-status-tag">New</span>
        <span className="ticket-number">Ticket #{ticket.ticketId}</span>
      </div>

      <div className="subheader-right">
        <button className="side-conv-btn">
          <Plus size={13} /> Side conversation
        </button>
        <button className="view-toggle-btn active">
          <User size={14} /> Requester Details
        </button>
      </div>
    </div>
  );
}
