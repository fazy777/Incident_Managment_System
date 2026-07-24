import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Trash2, 
  Eye, 
  Database,
  RefreshCw,
  UserCheck,
  Download
} from 'lucide-react';
import { formatRelativeTime, exportIncidentsCSV } from '../services/incidentService';

export default function DashboardView({ 
  incidents, 
  onOpenAddModal, 
  onSelectIncident, 
  onDeleteIncident,
  onUpdateStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filtered incidents logic
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.systemComponent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    const matchesCategory = categoryFilter === 'All' || inc.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
  });

  // Calculate statistics
  const totalCount = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress' || i.status === 'Investigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span className="badge badge-critical"><span className="dot"></span> Critical</span>;
      case 'High':
        return <span className="badge badge-high"><span className="dot"></span> High</span>;
      case 'Medium':
        return <span className="badge badge-medium"><span className="dot"></span> Medium</span>;
      case 'Low':
        return <span className="badge badge-low"><span className="dot"></span> Low</span>;
      default:
        return <span className="badge badge-medium">{sev}</span>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Banner Notice */}
      <div className="db-notice-banner">
        <div className="banner-left">
          <Database size={16} className="text-blue" />
          <span><strong>Incident Log Ready:</strong> Real-time incident tracking and monitoring active.</span>
        </div>
        <div className="banner-actions">
          <button className="btn-secondary-sm" onClick={() => exportIncidentsCSV(incidents)}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="btn-add-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="stats-cards-grid">
        <div className="stat-card" onClick={() => { setStatusFilter('All'); setSeverityFilter('All'); }} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper blue">
            <Activity size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setSeverityFilter('Critical')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper red">
            <AlertCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{criticalCount}</span>
            <span className="stat-label">Critical & High Threats</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setStatusFilter('In Progress')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper amber">
            <RefreshCw size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">Active / In Progress</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setStatusFilter('Resolved')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{resolvedCount}</span>
            <span className="stat-label">Resolved Today</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="table-controls-bar">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, title, system component or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-select-wrapper">
            <Filter size={13} className="filter-icon" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Security Breach">Security Breach</option>
              <option value="Network Outage">Network Outage</option>
              <option value="Server Downtime">Server Downtime</option>
              <option value="Database">Database</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Software Bug">Software Bug</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Incident Table */}
      <div className="table-responsive-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>ID & Incident Title</th>
              <th>Category</th>
              <th>Severity</th>
              <th>
                <div className="th-with-icon">
                  <Clock size={13} />
                  <span>Timestamp</span>
                </div>
              </th>
              <th>Reporter / Assignee</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data-cell">
                  <ShieldAlert size={36} className="text-muted" />
                  <p>No incidents match your current search/filter criteria.</p>
                  <button className="btn-link" onClick={onOpenAddModal}>
                    Report a new incident
                  </button>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr 
                  key={inc.id} 
                  className="incident-row"
                  onClick={() => onSelectIncident(inc)}
                >
                  {/* ID & Title */}
                  <td className="cell-main">
                    <div className="inc-id-row">
                      <span className="inc-id-tag">{inc.id}</span>
                      {inc.systemComponent && (
                        <span className="system-tag">{inc.systemComponent}</span>
                      )}
                    </div>
                    <div className="inc-title">{inc.title}</div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-chip">{inc.category}</span>
                  </td>

                  {/* Severity */}
                  <td>
                    {getSeverityBadge(inc.severity)}
                  </td>

                  {/* Timestamp */}
                  <td className="cell-timestamp">
                    <div className="timestamp-exact">{inc.displayTime || new Date(inc.timestamp).toLocaleString()}</div>
                    <div className="timestamp-relative">{formatRelativeTime(inc.timestamp)}</div>
                  </td>

                  {/* Reporter & Assignee */}
                  <td>
                    <div className="people-cell">
                      <div className="reporter-name">By: {inc.reporterName || 'Unknown'}</div>
                      <div className="assignee-name">
                        <UserCheck size={11} className="text-blue" />
                        <span>{inc.assignee || 'Unassigned'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className="status-dropdown-select"
                      value={inc.status}
                      onChange={(e) => onUpdateStatus(inc.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="row-actions">
                      <button
                        className="action-btn-icon view"
                        title="View Full Details"
                        onClick={() => onSelectIncident(inc)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="action-btn-icon delete"
                        title="Delete Log"
                        onClick={() => onDeleteIncident(inc.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
