import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, ChevronDown, ShieldCheck, Zap } from 'lucide-react';

export default function FooterBar({ onStatusChange, ticketStatus, onEndChat }) {
  const [selectedChannel, setSelectedChannel] = useState('SecOps Signal');

  return (
    <footer className="bottom-footer-bar">
      <div className="footer-left">
        <div className="channel-picker">
          <ShieldAlert size={15} color="#0284c7" />
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="footer-channel-select"
          >
            <option value="SecOps Signal">SecOps Signal</option>
            <option value="Encrypted Email">Encrypted Email</option>
            <option value="Internal Note">Internal Forensics Note</option>
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        <button className="footer-macro-btn">
          <Zap size={14} /> Run Playbook
        </button>
      </div>

      <div className="footer-center">
        <span className="live-status">
          <ShieldCheck size={16} color="#10b981" /> SOC Defense Active • Real-time Threat Monitor
        </span>
      </div>

      <div className="footer-right">
        <button className="end-chat-btn" onClick={onEndChat}>
          Isolate Host
        </button>

        <div className="submit-action-group">
          <button className="submit-btn" onClick={() => onStatusChange('Mitigated')}>
            <CheckCircle size={14} /> Submit as {ticketStatus || 'Active'}
          </button>
          <button className="submit-dropdown-btn" title="More containment options">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
