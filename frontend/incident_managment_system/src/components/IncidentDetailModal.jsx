import { useState } from 'react';
import { 
  X, 
  Clock, 
  ShieldAlert, 
  User, 
  Server, 
  Send, 
  CheckSquare,
  Database
} from 'lucide-react';
import { formatRelativeTime } from '../services/incidentService';

// Categorized Playbook Templates
const getPlaybookForCategory = (cat) => {
  switch (cat) {
    case 'Security Breach':
      return [
        { id: 1, text: 'Isolate compromised host & revoke token secrets', done: true },
        { id: 2, text: 'Notify On-Call CISO & Security Incident Response Team', done: true },
        { id: 3, text: 'Audit recent access logs for IP pattern anomalies', done: false },
        { id: 4, text: 'Deploy hardened credentials and run exploit patch', done: false }
      ];
    case 'Database':
      return [
        { id: 1, text: 'Analyze active connection pool locks & long queries', done: true },
        { id: 2, text: 'Failover traffic to standby Read Replica', done: false },
        { id: 3, text: 'Flush cache buffers and run DB index optimization', done: false },
        { id: 4, text: 'Verify data replication integrity', done: false }
      ];
    case 'Infrastructure':
    case 'API Gateway':
      return [
        { id: 1, text: 'Check CPU/Memory utilization across Kubernetes cluster', done: true },
        { id: 2, text: 'Scale pod replicas +20% to absorb traffic spike', done: false },
        { id: 3, text: 'Purge edge CDN cache & re-route gateway DNS', done: false },
        { id: 4, text: 'Run synthetic API ping test', done: false }
      ];
    default:
      return [
        { id: 1, text: 'Verify severity impact & notify service owner', done: true },
        { id: 2, text: 'Capture diagnostic heap dumps & system logs', done: true },
        { id: 3, text: 'Apply hotfix patch or rollback to previous build', done: false },
        { id: 4, text: 'Conduct post-incident verification check', done: false }
      ];
  }
};

export default function IncidentDetailModal({ 
  incident, 
  onClose, 
  onUpdateStatus, 
  onAddTimelineEvent
}) {
  const [newEventText, setNewEventText] = useState('');
  const [checklist, setChecklist] = useState(() => 
    incident ? getPlaybookForCategory(incident.category) : []
  );

  if (!incident) return null;

  // SLA Calculation
  const getSlaHours = (severity) => {
    switch (severity) {
      case 'Critical': return 0.5; // 30 mins
      case 'High': return 2;       // 2 hours
      case 'Medium': return 8;     // 8 hours
      case 'Low': return 24;       // 24 hours
      default: return 4;
    }
  };

  const calculateSlaStatus = () => {
    const createdDate = incident.timestamp ? new Date(incident.timestamp) : new Date(0);
    const slaHours = getSlaHours(incident.severity);
    const deadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
    const now = new Date();

    const diffMinutes = Math.round((deadline - now) / (1000 * 60));

    if (incident.status === 'Resolved') {
      return { label: 'SLA MET', class: 'bg-green', diffText: 'Resolved within SLA' };
    }
    if (diffMinutes < 0) {
      return { label: 'SLA BREACHED', class: 'bg-red', diffText: `${Math.abs(diffMinutes)}m overdue` };
    }
    if (diffMinutes <= 30) {
      return { label: 'SLA WARNING', class: 'bg-yellow', diffText: `${diffMinutes}m remaining` };
    }
    return { label: 'SLA SAFE', class: 'bg-blue', diffText: `${Math.round(diffMinutes / 60)}h ${diffMinutes % 60}m remaining` };
  };

  const slaInfo = calculateSlaStatus();

  const toggleChecklist = (id) => {
    const updated = checklist.map(item => {
      if (item.id === id) {
        const nextState = !item.done;
        // Automatically add timeline note if step checked
        if (nextState) {
          const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          onAddTimelineEvent(incident.id, {
            id: Date.now(),
            type: 'playbook_step',
            content: `Playbook Step Executed: "${item.text}"`,
            timestamp: formattedTime
          });
        }
        return { ...item, done: nextState };
      }
      return item;
    });
    setChecklist(updated);
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
            <span className={`sla-badge ${slaInfo.class}`}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {slaInfo.label} ({slaInfo.diffText})
            </span>
          </div>

          <div className="modal-header-right">
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
          <h4 className="detail-section-heading" style={{ justifyContent: 'space-between' }}>
            <span>
              <CheckSquare size={14} className="text-blue" style={{ marginRight: '6px', display: 'inline' }} />
              SOP Incident Playbook ({incident.category})
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>
              Check step to record execution in audit trail
            </span>
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
