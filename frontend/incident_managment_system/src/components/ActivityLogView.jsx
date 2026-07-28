import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldAlert, 
  Clock, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Activity,
  X,
  History
} from 'lucide-react';
import { exportAuditLogsCSV, addAuditLog } from '../services/auditLogService';

export default function ActivityLogView({ auditLogs, onUpdateAuditLogs, onToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Audit Log Form State
  const [newLog, setNewLog] = useState({
    action: '',
    category: 'Security Breach',
    severity: 'Medium',
    performer: 'SecOps Analyst',
    details: ''
  });

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  // Stats calculation
  const totalLogs = auditLogs.length;
  const criticalLogs = auditLogs.filter(l => l.severity === 'Critical' || l.severity === 'High').length;
  const securityLogs = auditLogs.filter(l => l.category === 'Security Breach').length;
  const systemAlerts = auditLogs.filter(l => l.category === 'System Alert' || l.category === 'Status Update').length;

  const handleCreateLog = (e) => {
    e.preventDefault();
    if (!newLog.action) return;

    const updated = addAuditLog(newLog);
    if (onUpdateAuditLogs) onUpdateAuditLogs(updated);
    if (onToast) onToast(`Audit log "${newLog.action}" recorded successfully!`);

    setNewLog({
      action: '',
      category: 'Security Breach',
      severity: 'Medium',
      performer: 'SecOps Analyst',
      details: ''
    });
    setShowAddModal(false);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span className="badge badge-critical"><span className="dot"></span> Critical</span>;
      case 'High':
        return <span className="badge badge-high"><span className="dot"></span> High</span>;
      case 'Medium':
        return <span className="badge badge-medium"><span className="dot"></span> Medium</span>;
      case 'Low':
      case 'Info':
        return <span className="badge badge-low"><span className="dot"></span> {sev}</span>;
      default:
        return <span className="badge badge-medium">{sev}</span>;
    }
  };

  return (
    <div className="activity-logs-container">
      {/* Header Banner */}
      <div className="audit-header-banner">
        <div className="banner-left">
          <div className="audit-icon-wrapper">
            <History size={22} className="text-blue" />
          </div>
          <div>
            <h2>System Activity Audit Trail & Log Viewer</h2>
            <p>Complete historical activity records, security compliance events, and system state transitions.</p>
          </div>
        </div>

        <div className="banner-right-actions">
          <button className="btn-secondary-sm" onClick={() => exportAuditLogsCSV(auditLogs)}>
            <Download size={14} />
            <span>Export CSV Trail</span>
          </button>
          <button className="btn-add-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={15} />
            <span>Log Compliance Note</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FileText size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalLogs}</span>
            <span className="stat-label">Total Audit Events</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <ShieldAlert size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{criticalLogs}</span>
            <span className="stat-label">Critical & High Events</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <AlertCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{securityLogs}</span>
            <span className="stat-label">Security Incident Logs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{systemAlerts}</span>
            <span className="stat-label">State & Status Alerts</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-controls-bar">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search by action, performer, log ID, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-select-wrapper">
            <Filter size={13} className="filter-icon" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Event Types</option>
              <option value="Security Breach">Security Breach</option>
              <option value="Status Update">Status Update</option>
              <option value="System Alert">System Alert</option>
              <option value="Roster Update">Roster Update</option>
              <option value="Configuration">Configuration</option>
              <option value="Compliance Note">Compliance Note</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Info">Info / Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-responsive-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>Log ID & Action</th>
              <th>Category</th>
              <th>Severity</th>
              <th>
                <div className="th-with-icon">
                  <Clock size={13} />
                  <span>Timestamp</span>
                </div>
              </th>
              <th>Performer / Engine</th>
              <th>Activity Summary Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data-cell">
                  <FileText size={36} className="text-muted" />
                  <p>No audit trail logs match your search or filter criteria.</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="incident-row">
                  {/* ID & Action */}
                  <td className="cell-main">
                    <div className="inc-id-row">
                      <span className="inc-id-tag">{log.id}</span>
                    </div>
                    <div className="inc-title">{log.action}</div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-chip">{log.category}</span>
                  </td>

                  {/* Severity */}
                  <td>
                    {getSeverityBadge(log.severity)}
                  </td>

                  {/* Timestamp */}
                  <td className="cell-timestamp">
                    <div className="timestamp-exact">{log.displayTime || new Date(log.timestamp).toLocaleString()}</div>
                  </td>

                  {/* Performer */}
                  <td>
                    <div className="people-cell">
                      <div className="reporter-name">
                        <UserCheck size={11} className="text-blue" />
                        <strong style={{ marginLeft: 4 }}>{log.performer}</strong>
                      </div>
                    </div>
                  </td>

                  {/* Details */}
                  <td>
                    <div className="audit-detail-text">{log.details}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for manual compliance note logging */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content modal-md">
            <div className="modal-header">
              <div className="modal-title-group">
                <History size={18} className="text-blue" />
                <h3>Log Manual Compliance Audit Event</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="modal-body-form">
              <div className="form-group">
                <label>Action / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Manual Security Firewall Inspection Completed"
                  value={newLog.action}
                  onChange={(e) => setNewLog({ ...newLog, action: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Category</label>
                  <select
                    value={newLog.category}
                    onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                  >
                    <option value="Security Breach">Security Breach</option>
                    <option value="Status Update">Status Update</option>
                    <option value="System Alert">System Alert</option>
                    <option value="Roster Update">Roster Update</option>
                    <option value="Configuration">Configuration</option>
                    <option value="Compliance Note">Compliance Note</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>Severity Level</label>
                  <select
                    value={newLog.severity}
                    onChange={(e) => setNewLog({ ...newLog, severity: e.target.value })}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Info">Info</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Performer / Operator Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Knapp (SecOps Lead)"
                  value={newLog.performer}
                  onChange={(e) => setNewLog({ ...newLog, performer: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Audit Details / Verification Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter details of compliance check, audit outcome, or manual override notes..."
                  value={newLog.details}
                  onChange={(e) => setNewLog({ ...newLog, details: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-add-primary">
                  <CheckCircle2 size={15} />
                  <span>Save Audit Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
