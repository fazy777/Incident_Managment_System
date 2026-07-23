import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Copy, 
  ExternalLink, 
  Check, 
  Send, 
  ShieldAlert, 
  FileText, 
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { generateWhatsAppMessage } from '../services/incidentService';

export default function WhatsAppBroadcastView({ incidents, initialIncident = null, onCopySuccess }) {
  const [templateType, setTemplateType] = useState(initialIncident ? 'single' : 'shift_handover');
  const [selectedIncidentId, setSelectedIncidentId] = useState(initialIncident ? initialIncident.id : (incidents[0]?.id || ''));
  const [customNotes, setCustomNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Find target incident
  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  useEffect(() => {
    let generated = '';
    if (templateType === 'single') {
      generated = generateWhatsAppMessage('single', currentIncident);
    } else if (templateType === 'shift_handover') {
      generated = generateWhatsAppMessage('shift_handover', incidents);
    } else if (templateType === 'critical_alert') {
      generated = generateWhatsAppMessage('critical_alert', incidents);
    }

    if (customNotes.trim()) {
      generated += `\n\n📌 *Additional Investigator Note:* \n${customNotes}`;
    }

    setMessageText(generated);
  }, [templateType, selectedIncidentId, incidents, currentIncident, customNotes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    if (onCopySuccess) onCopySuccess('WhatsApp alert copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encodedText = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="whatsapp-broadcast-container">
      <div className="broadcast-header">
        <div className="header-left">
          <div className="whatsapp-badge-icon">
            <MessageSquare size={22} />
          </div>
          <div>
            <h2>WhatsApp Group Broadcast Hub</h2>
            <p>Generate formatted emergency broadcasts and daily briefing messages for team WhatsApp groups.</p>
          </div>
        </div>
      </div>

      <div className="broadcast-grid">
        {/* Left Column: Form Controls */}
        <div className="broadcast-controls-card">
          <h3 className="card-subtitle">
            <Zap size={16} className="text-amber" />
            1. Select Broadcast Format
          </h3>

          <div className="template-selector-group">
            <button
              className={`template-btn ${templateType === 'shift_handover' ? 'active' : ''}`}
              onClick={() => setTemplateType('shift_handover')}
            >
              <Users size={16} />
              <div>
                <strong>Shift Handover & Daily Briefing</strong>
                <span>Overall status, total counts & active issues</span>
              </div>
            </button>

            <button
              className={`template-btn ${templateType === 'single' ? 'active' : ''}`}
              onClick={() => setTemplateType('single')}
            >
              <FileText size={16} />
              <div>
                <strong>Single Incident Alert</strong>
                <span>Detailed update for a specific ticket</span>
              </div>
            </button>

            <button
              className={`template-btn ${templateType === 'critical_alert' ? 'active' : ''}`}
              onClick={() => setTemplateType('critical_alert')}
            >
              <ShieldAlert size={16} />
              <div>
                <strong>Critical Threats Only</strong>
                <span>Urgent alert for Critical & High severity items</span>
              </div>
            </button>
          </div>

          {templateType === 'single' && (
            <div className="form-group-field mt-4">
              <label>Select Target Incident:</label>
              <select
                className="select-control"
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    [{inc.id}] {inc.severity} - {inc.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group-field mt-4">
            <label>Add Optional Custom Broadcast Note:</label>
            <textarea
              className="textarea-control"
              rows={3}
              placeholder="e.g., Lead Engineer Marcus is currently running diagnostics on primary router."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
            />
          </div>

          <div className="broadcast-quick-actions">
            <button className="btn-copy-wa" onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Message'}</span>
            </button>

            <button className="btn-open-wa" onClick={handleOpenWhatsApp}>
              <ExternalLink size={16} />
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Right Column: WhatsApp Preview */}
        <div className="whatsapp-preview-card">
          <div className="wa-phone-header">
            <div className="wa-avatar">
              <ShieldAlert size={18} color="#fff" />
            </div>
            <div className="wa-chat-info">
              <span className="wa-chat-name">SecOps Incident Response Team</span>
              <span className="wa-chat-status">Group • {incidents.length} active tickets</span>
            </div>
          </div>

          <div className="wa-chat-body">
            <div className="wa-message-bubble">
              <pre className="wa-message-text">{messageText}</pre>
              <span className="wa-timestamp">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <Check size={12} className="wa-check" />
              </span>
            </div>
          </div>

          <div className="wa-preview-footer">
            <Sparkles size={14} className="text-amber" />
            <span>Ready to forward directly to your WhatsApp Emergency Group</span>
          </div>
        </div>
      </div>
    </div>
  );
}
