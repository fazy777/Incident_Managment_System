import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  User, 
  Mail, 
  Server, 
  CheckCircle2, 
  X, 
  Send,
  Database,
  Info
} from 'lucide-react';

export default function AddIncidentForm({ onAddIncident, onClose, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Security Breach',
    severity: 'High',
    status: 'Open',
    reporterName: '',
    reporterEmail: '',
    assignee: 'SecOps / Alex Knapp',
    systemComponent: '',
    description: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Incident Title is required!');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Please provide a brief description of the incident.');
      return;
    }

    onAddIncident(formData);
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'Critical': return 'sev-critical';
      case 'High': return 'sev-high';
      case 'Medium': return 'sev-medium';
      case 'Low': return 'sev-low';
      default: return 'sev-medium';
    }
  };

  return (
    <div className="add-incident-container">
      {/* Header */}
      <div className="form-header">
        <div className="form-header-title">
          <div className="header-icon-box">
            <ShieldAlert size={22} className="text-accent" />
          </div>
          <div>
            <h2>Log New Cyber Incident</h2>
            <p className="subtitle">Submit incident report to the active monitoring queue</p>
          </div>
        </div>

        <div className="form-header-right">
          <div className="db-badge">
            <Database size={13} />
            <span>Ready for DB sync</span>
          </div>
          {onClose && (
            <button type="button" className="close-btn" onClick={onClose} title="Close form">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="form-alert-error">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="incident-form-grid">
        {/* Main Incident Details */}
        <div className="form-section main-details-section">
          <h3 className="section-title">Incident Details</h3>

          <div className="input-group">
            <label htmlFor="title">Incident Title / Summary *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Unauthorized SSL Certificate Extraction on Auth Server"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-row-2">
            <div className="input-group flex-1">
              <label htmlFor="category">Category / Type</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Security Breach">🔒 Security Breach</option>
                <option value="Network Outage">🌐 Network Outage</option>
                <option value="Server Downtime">🖥️ Server Downtime</option>
                <option value="Database">🗄️ Database Latency / Failure</option>
                <option value="Infrastructure">⚡ Infrastructure</option>
                <option value="Software Bug">🐛 Application / Software Bug</option>
              </select>
            </div>

            <div className="input-group flex-1">
              <label htmlFor="systemComponent">Affected System / Node</label>
              <div className="input-with-icon-wrapper">
                <Server size={14} className="input-icon-inside" />
                <input
                  type="text"
                  id="systemComponent"
                  name="systemComponent"
                  placeholder="e.g. IP 192.168.1.45 / US-East Router"
                  value={formData.systemComponent}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Severity Picker */}
          <div className="input-group">
            <label>Severity Level</label>
            <div className="severity-selector">
              {['Critical', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  type="button"
                  key={sev}
                  className={`severity-btn ${sev.toLowerCase()} ${formData.severity === sev ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, severity: sev }))}
                >
                  <span className="dot"></span>
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="description">Incident Description / Impact Details *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Provide full description of suspicious activity, logs, affected users, or system behavior..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sidebar: Reporter & Meta info */}
        <div className="form-section meta-details-section">
          <h3 className="section-title">Reporter & Assignment</h3>

          <div className="input-group">
            <label htmlFor="reporterName">Reporter Name</label>
            <div className="input-with-icon-wrapper">
              <User size={14} className="input-icon-inside" />
              <input
                type="text"
                id="reporterName"
                name="reporterName"
                placeholder="e.g. Sarah Jenkins (SOC Level 1)"
                value={formData.reporterName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="reporterEmail">Reporter Email</label>
            <div className="input-with-icon-wrapper">
              <Mail size={14} className="input-icon-inside" />
              <input
                type="email"
                id="reporterEmail"
                name="reporterEmail"
                placeholder="sjenkins@enterprise-sec.org"
                value={formData.reporterEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="assignee">Assigned Responder / Team</label>
            <select
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
            >
              <option value="SecOps / Alex Knapp">SecOps / Alex Knapp</option>
              <option value="NetOps / Marcus Vance">NetOps / Marcus Vance</option>
              <option value="DevOps / Sarah Connor">DevOps / Sarah Connor</option>
              <option value="Unassigned">Unassigned (Queue)</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="status">Initial Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Open (New Alert)</option>
              <option value="Investigating">Investigating</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Timestamp Info Box */}
          <div className="timestamp-preview-card">
            <div className="card-row">
              <Clock size={14} className="text-blue" />
              <span className="timestamp-title">Creation Timestamp</span>
            </div>
            <div className="timestamp-value">{currentTimeString}</div>
            <p className="timestamp-note">
              <Info size={11} inline /> Timestamp will be permanently attached to this incident log.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="form-footer-actions">
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            <Send size={15} />
            <span>Create & Log Incident</span>
          </button>
        </div>
      </form>
    </div>
  );
}
