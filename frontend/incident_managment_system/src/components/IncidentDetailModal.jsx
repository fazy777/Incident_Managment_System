import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  ShieldAlert, 
  User, 
  Server, 
  Send, 
  Database,
  MessageSquare,
  CheckSquare
} from 'lucide-react';
import { formatRelativeTime } from '../services/incidentService';

export default function IncidentDetailModal({ 
  incident, 
  onClose, 
  onUpdateStatus, 
  onAddTimelineEvent,
  onOpenWhatsAppBroadcast 
}) {
  const [newEventText, setNewEventText] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Isolate affected node & dump memory logs', done: true },
    { id: 2, text: 'Notify On-Call SecOps Commander & Group', done: true },
    { id: 3, text: 'Apply immediate threat containment patch', done: false },
    { id: 4, text: 'Verify system recovery & run sanity test', done: false }
  ]);

  if (!incident) return null;

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventText.trim()) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    onAddTimelineEvent(incident.id, {
      id: Date.now(),
      type: 'user_note',
      content: newEventText,
      timestamp: formattedTime
    });

    setNewEventText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card incident-detail-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="inc-id-badge">{incident.id}</span>
            <span className="category-chip">{incident.category}</span>
            <span className={`severity-tag ${incident.severity.toLowerCase()}`}>
              {incident.severity} Priority
            </span>
          </div>

          <div className="modal-header-right">
            <button 
              className="btn-wa-header" 
              onClick={() => {
                onClose();
                if (onOpenWhatsAppBroadcast) onOpenWhatsAppBroadcast(incident);
              }}
              title="Broadcast this incident to WhatsApp Group"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Alert</span>
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="detail-title">{incident.title}</h2>

        {/* Metadata Grid */}
        <div className="detail-meta-grid">
          <div className="meta-item">
            <div className="meta-label">
              <Clock size={13} />
              <span>Timestamp Recorded</span>
            </div>
            <div className="meta-value highlight">
              {incident.displayTime || new Date(incident.timestamp).toLocaleString()}
              <span className="relative-tag">({formatRelativeTime(incident.timestamp)})</span>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-label">
              <Server size={13} />
              <span>System / Affected Node</span>
            </div>
            <div className="meta-value">{incident.systemComponent || 'Not specified'}</div>
          </div>

          <div className="meta-item">
            <div className="meta-label">
              <User size={13} />
              <span>Reporter & Email</span>
            </div>
            <div className="meta-value">
              {incident.reporterName} ({incident.reporterEmail || 'No email'})
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-label">
              <ShieldAlert size={13} />
              <span>Status</span>
            </div>
            <select
              className="status-dropdown-select text-md"
              value={incident.status}
              onChange={(e) => onUpdateStatus(incident.id, e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h4 className="detail-section-heading">Incident Description</h4>
          <div className="description-box">
            {incident.description}
          </div>
        </div>

        {/* SOP Response Playbook Checklist */}
        <div className="detail-section">
          <h4 className="detail-section-heading">
            <CheckSquare size={14} className="text-blue" />
            Standard Response Playbook & Checklist
          </h4>
          <div className="playbook-checklist">
            {checklist.map(item => (
              <label key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklist(item.id)}
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Audit Log / Timeline */}
        <div className="detail-section">
          <h4 className="detail-section-heading">Activity & Audit Timeline</h4>
          <div className="timeline-list">
            {(incident.timelineEvents || []).map((evt) => (
              <div key={evt.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content-wrapper">
                  <div className="timeline-text">{evt.content}</div>
                  <div className="timeline-time">{evt.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Note / Update input */}
          <form onSubmit={handleAddEvent} className="add-note-form">
            <input
              type="text"
              placeholder="Add investigator note or status update..."
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
            />
            <button type="submit" className="btn-send-note">
              <Send size={14} />
              <span>Add Log</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="db-sync-info">
            <Database size={13} />
            <span>Database connector state: LocalStorage synced</span>
          </div>
          <button className="btn-secondary" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

