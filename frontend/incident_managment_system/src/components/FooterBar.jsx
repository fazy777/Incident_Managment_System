import React, { useState } from 'react';
import { MessageSquare, CheckCircle, ChevronDown, Send, ShieldCheck, Zap } from 'lucide-react';

export default function FooterBar({ onStatusChange, ticketStatus, onEndChat }) {
  const [selectedChannel, setSelectedChannel] = useState('WhatsApp');

  return (
    <footer className="bottom-footer-bar">
      <div className="footer-left">
        <div className="channel-picker">
          <MessageSquare size={16} className="whatsapp-green-icon" />
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="footer-channel-select"
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Internal Note">Internal Note</option>
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        <button className="footer-macro-btn">
          <Zap size={14} /> Apply Macro
        </button>
      </div>

      <div className="footer-center">
        <span className="live-status">
          <ShieldCheck size={16} color="#10b981" /> System Operational • Auto-Sync Active
        </span>
      </div>

      <div className="footer-right">
        <button className="end-chat-btn" onClick={onEndChat}>
          End chat
        </button>

        <div className="submit-action-group">
          <button className="submit-btn" onClick={() => onStatusChange('Solved')}>
            <CheckCircle size={15} /> Submit as {ticketStatus || 'Open'}
          </button>
          <button className="submit-dropdown-btn" title="More status options">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
