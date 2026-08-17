import { useState, useMemo } from 'react';
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
  Download,
  FileJson,
  Printer,
  XCircle,
  Copy,
  Check,
  ArrowUpDown,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Flame,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import { formatRelativeTime, exportIncidentsCSV, exportIncidentsJSON, exportIncidentsPDF } from '../services/incidentService';

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
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'severity' | 'title'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [activeStatCard, setActiveStatCard] = useState('all'); // 'all' | 'critical' | 'in-progress' | 'resolved'
  const [selectedIds, setSelectedIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Quick Copy Incident ID
  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Stat card click toggle
  const handleStatCardClick = (type) => {
    if (activeStatCard === type) {
      // Toggle off
      setActiveStatCard('all');
      setStatusFilter('All');
      setSeverityFilter('All');
    } else {
      setActiveStatCard(type);
      if (type === 'all') {
        setStatusFilter('All');
        setSeverityFilter('All');
        setCategoryFilter('All');
      } else if (type === 'critical') {
        setSeverityFilter('Critical');
        setStatusFilter('All');
      } else if (type === 'in-progress') {
        setStatusFilter('In Progress');
        setSeverityFilter('All');
      } else if (type === 'resolved') {
        setStatusFilter('Resolved');
        setSeverityFilter('All');
      }
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSeverityFilter('All');
    setCategoryFilter('All');
    setActiveStatCard('all');
    setSelectedIds([]);
  };

  // Check if any filter is active
  const isFiltered = searchTerm !== '' || statusFilter !== 'All' || severityFilter !== 'All' || categoryFilter !== 'All' || activeStatCard !== 'all';

  // SLA Hours calculation helper
  const getSlaHours = (severity) => {
    switch (severity) {
      case 'Critical': return 0.5; // 30 mins
      case 'High': return 2;       // 2 hours
      case 'Medium': return 8;     // 8 hours
      case 'Low': return 24;       // 24 hours
      default: return 4;
    }
  };

  const getSlaBadge = (inc) => {
    if (inc.status === 'Resolved') {
      return <span className="sla-pill resolved"><CheckCircle2 size={11} /> SLA Met</span>;
    }
    const createdDate = inc.timestamp ? new Date(inc.timestamp) : new Date(0);
    const slaHours = getSlaHours(inc.severity);
    const deadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
    const now = new Date();
    const diffMinutes = Math.round((deadline - now) / (1000 * 60));

    if (diffMinutes < 0) {
      return <span className="sla-pill breached"><AlertCircle size={11} /> SLA Breached</span>;
    }
    if (diffMinutes <= 30) {
      return <span className="sla-pill warning"><Clock size={11} /> {diffMinutes}m left</span>;
    }
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return <span className="sla-pill safe"><Clock size={11} /> {hours > 0 ? `${hours}h ` : ''}{mins}m left</span>;
  };

  // Filter and Sort Incidents
  const filteredAndSortedIncidents = useMemo(() => {
    let result = incidents.filter((inc) => {
      const matchesSearch = 
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inc.reporterName && inc.reporterName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inc.systemComponent && inc.systemComponent.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inc.assignee && inc.assignee.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
      const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
      const matchesCategory = categoryFilter === 'All' || inc.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.timestamp || 0) - new Date(b.timestamp || 0);
      }
      if (sortBy === 'severity') {
        const priorityMap = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityMap[b.severity] || 0) - (priorityMap[a.severity] || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [incidents, searchTerm, statusFilter, severityFilter, categoryFilter, sortBy]);

  // Statistics calculation
  const totalCount = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress' || i.status === 'Investigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedIncidents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedIncidents.map(i => i.id));
    }
  };

  const handleToggleSelectOne = (e, id) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = (status) => {
    selectedIds.forEach(id => {
      onUpdateStatus(id, status);
    });
    setSelectedIds([]);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected incident(s)?`)) {
      selectedIds.forEach(id => {
        onDeleteIncident(id);
      });
      setSelectedIds([]);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span className="badge badge-critical"><span className="dot pulse-red"></span> Critical</span>;
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
    <div className="dashboard-container fade-in">
      {/* Top Banner Notice */}
      <div className="db-notice-banner">
        <div className="banner-left">
          <div className="banner-icon-badge">
            <Database size={16} />
          </div>
          <div className="banner-text-block">
            <span className="banner-main-title">SecOps Live Command Queue</span>
            <span className="banner-sub-text">
              Real-time cyber incident monitoring, automated SLA tracking, and instant export reporting.
            </span>
          </div>
        </div>

        <div className="banner-actions">
          <div className="export-btn-group">
            <button 
              className="btn-secondary-sm" 
              onClick={() => exportIncidentsPDF(filteredAndSortedIncidents.length > 0 ? filteredAndSortedIncidents : incidents)} 
              title="Export Executive Printable PDF Report"
            >
              <Printer size={14} />
              <span>PDF Report</span>
            </button>
            <button 
              className="btn-secondary-sm" 
              onClick={() => exportIncidentsCSV(filteredAndSortedIncidents.length > 0 ? filteredAndSortedIncidents : incidents)} 
              title="Export incidents to CSV spreadsheet"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>
            <button 
              className="btn-secondary-sm" 
              onClick={() => exportIncidentsJSON(filteredAndSortedIncidents.length > 0 ? filteredAndSortedIncidents : incidents)} 
              title="Export incidents to JSON backup file"
            >
              <FileJson size={14} />
              <span>JSON</span>
            </button>
          </div>

          <button className="btn-add-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="stats-cards-grid">
        {/* Total Incidents */}
        <div 
          className={`stat-card ${activeStatCard === 'all' ? 'active-stat' : ''}`}
          onClick={() => handleStatCardClick('all')}
          title="Click to view all incidents"
        >
          <div className="stat-icon-wrapper blue">
            <Activity size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value-row">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-pill-trend neutral">All Logs</span>
            </div>
            <span className="stat-label">Total Incidents</span>
          </div>
          {activeStatCard === 'all' && isFiltered && (
            <div className="stat-active-indicator" title="Filter active"></div>
          )}
        </div>

        {/* Critical & High Threats */}
        <div 
          className={`stat-card ${activeStatCard === 'critical' || severityFilter === 'Critical' ? 'active-stat' : ''}`}
          onClick={() => handleStatCardClick('critical')}
          title="Click to filter Critical & High threats"
        >
          <div className="stat-icon-wrapper red">
            <Flame size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value-row">
              <span className="stat-value">{criticalCount}</span>
              <span className="stat-pill-trend critical">High Priority</span>
            </div>
            <span className="stat-label">Critical & High Threats</span>
          </div>
          {(activeStatCard === 'critical' || severityFilter === 'Critical') && (
            <div className="stat-active-indicator" title="Filter active"></div>
          )}
        </div>

        {/* In Progress / Active Triage */}
        <div 
          className={`stat-card ${activeStatCard === 'in-progress' || statusFilter === 'In Progress' ? 'active-stat' : ''}`}
          onClick={() => handleStatCardClick('in-progress')}
          title="Click to filter active triage incidents"
        >
          <div className="stat-icon-wrapper amber">
            <RefreshCw size={20} className="spin-slow" />
          </div>
          <div className="stat-info">
            <div className="stat-value-row">
              <span className="stat-value">{inProgressCount}</span>
              <span className="stat-pill-trend in-progress">In Triage</span>
            </div>
            <span className="stat-label">Active / In Progress</span>
          </div>
          {(activeStatCard === 'in-progress' || statusFilter === 'In Progress') && (
            <div className="stat-active-indicator" title="Filter active"></div>
          )}
        </div>

        {/* Resolved Today */}
        <div 
          className={`stat-card ${activeStatCard === 'resolved' || statusFilter === 'Resolved' ? 'active-stat' : ''}`}
          onClick={() => handleStatCardClick('resolved')}
          title="Click to filter resolved incidents"
        >
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value-row">
              <span className="stat-value">{resolvedCount}</span>
              <span className="stat-pill-trend resolved">99.4% SLA</span>
            </div>
            <span className="stat-label">Resolved & Closed</span>
          </div>
          {(activeStatCard === 'resolved' || statusFilter === 'Resolved') && (
            <div className="stat-active-indicator" title="Filter active"></div>
          )}
        </div>
      </div>

      {/* Control Bar: Filters, Search, Sort & View Mode */}
      <div className="table-controls-bar">
        {/* Search Input with 1-Click Clear */}
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, title, system component, assignee, reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              type="button" 
              className="search-clear-btn" 
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="filter-group">
          {/* Status Filter */}
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

          {/* Severity Filter */}
          <div className="filter-select-wrapper">
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="All">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
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

          {/* Sort Selector */}
          <div className="filter-select-wrapper sort-wrapper">
            <ArrowUpDown size={13} className="filter-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="severity">Sort: Highest Severity</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle (Table / Card Grid) */}
          <div className="view-mode-toggle">
            <button 
              type="button" 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={15} />
            </button>
            <button 
              type="button" 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button 
              className="btn-clear-filters"
              onClick={handleResetFilters}
              title="Reset all search and filter criteria"
            >
              <XCircle size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Category Filter Pills */}
      <div className="quick-category-pills">
        <span className="quick-filter-label">Quick Filters:</span>
        {['All', 'Critical', 'Open', 'Security Breach', 'Database', 'Network Outage'].map((tag) => {
          let isSelected = false;
          if (tag === 'All' && !isFiltered) isSelected = true;
          if (tag === 'Critical' && severityFilter === 'Critical') isSelected = true;
          if (tag === 'Open' && statusFilter === 'Open') isSelected = true;
          if (tag === 'Security Breach' && categoryFilter === 'Security Breach') isSelected = true;
          if (tag === 'Database' && categoryFilter === 'Database') isSelected = true;
          if (tag === 'Network Outage' && categoryFilter === 'Network Outage') isSelected = true;

          return (
            <button
              key={tag}
              type="button"
              className={`quick-pill ${isSelected ? 'active' : ''}`}
              onClick={() => {
                if (tag === 'All') handleResetFilters();
                else if (tag === 'Critical') { setSeverityFilter('Critical'); setStatusFilter('All'); }
                else if (tag === 'Open') { setStatusFilter('Open'); setSeverityFilter('All'); }
                else { setCategoryFilter(tag); }
              }}
            >
              {tag}
            </button>
          );
        })}

        <div className="filter-count-badge">
          Showing <strong>{filteredAndSortedIncidents.length}</strong> of <strong>{incidents.length}</strong> incidents
        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions-floating-bar fade-in">
          <div className="bulk-bar-left">
            <CheckSquare size={16} className="text-blue" />
            <span><strong>{selectedIds.length}</strong> incident(s) selected</span>
          </div>
          <div className="bulk-bar-actions">
            <button 
              className="btn-bulk-action"
              onClick={() => handleBulkStatusUpdate('In Progress')}
            >
              <RefreshCw size={13} />
              <span>Mark In Progress</span>
            </button>
            <button 
              className="btn-bulk-action success"
              onClick={() => handleBulkStatusUpdate('Resolved')}
            >
              <CheckCircle2 size={13} />
              <span>Mark Resolved</span>
            </button>
            <button 
              className="btn-bulk-action danger"
              onClick={handleBulkDelete}
            >
              <Trash2 size={13} />
              <span>Delete Selected</span>
            </button>
            <button 
              className="btn-bulk-cancel"
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE: TABLE */}
      {viewMode === 'table' ? (
        <div className="table-responsive-wrapper">
          <table className="incident-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filteredAndSortedIncidents.length > 0 && selectedIds.length === filteredAndSortedIncidents.length}
                    onChange={handleSelectAll}
                    title="Select all"
                    className="row-checkbox"
                  />
                </th>
                <th>ID & Incident Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>SLA & Deadline</th>
                <th>
                  <div className="th-with-icon">
                    <Clock size={13} />
                    <span>Reported</span>
                  </div>
                </th>
                <th>Reporter / Assignee</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-data-cell">
                    <div className="no-data-content">
                      <ShieldAlert size={42} className="no-data-icon" />
                      <h3>No Incidents Found</h3>
                      <p>No incident records matched your active filter or search query.</p>
                      <div className="no-data-buttons">
                        <button className="btn-secondary-sm" onClick={handleResetFilters}>
                          Clear Filters
                        </button>
                        <button className="btn-add-primary" onClick={onOpenAddModal}>
                          <Plus size={14} />
                          <span>Report New Incident</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedIncidents.map((inc) => {
                  const isSelected = selectedIds.includes(inc.id);
                  const isCopied = copiedId === inc.id;

                  return (
                    <tr 
                      key={inc.id} 
                      className={`incident-row ${isSelected ? 'row-selected' : ''}`}
                      onClick={() => onSelectIncident(inc)}
                    >
                      {/* Checkbox */}
                      <td onClick={(e) => handleToggleSelectOne(e, inc.id)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectOne(e, inc.id)}
                          className="row-checkbox"
                        />
                      </td>

                      {/* ID & Title */}
                      <td className="cell-main">
                        <div className="inc-id-row">
                          <button 
                            type="button" 
                            className="inc-id-tag-btn"
                            onClick={(e) => handleCopyId(e, inc.id)}
                            title="Click to copy ID"
                          >
                            <span>{inc.id}</span>
                            {isCopied ? <Check size={11} className="text-emerald" /> : <Copy size={11} />}
                          </button>
                          {isCopied && <span className="copied-micro-badge">Copied!</span>}
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

                      {/* SLA Status */}
                      <td>
                        {getSlaBadge(inc)}
                      </td>

                      {/* Timestamp */}
                      <td className="cell-timestamp">
                        <div className="timestamp-exact">{inc.displayTime || new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="timestamp-relative">{formatRelativeTime(inc.timestamp)}</div>
                      </td>

                      {/* Reporter & Assignee */}
                      <td>
                        <div className="people-cell">
                          <div className="reporter-name">By: {inc.reporterName || 'SecOps Agent'}</div>
                          <div className="assignee-name">
                            <UserCheck size={12} className="text-blue" />
                            <span>{inc.assignee || 'Unassigned'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown with Dynamic Color */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className={`status-select-badge-wrapper status-${(inc.status || 'Open').toLowerCase().replace(/\s+/g, '-')}`}>
                          <select
                            className="status-dropdown-select"
                            value={inc.status}
                            onChange={(e) => onUpdateStatus(inc.id, e.target.value)}
                          >
                            <option value="Open">● Open</option>
                            <option value="Investigating">● Investigating</option>
                            <option value="In Progress">● In Progress</option>
                            <option value="Resolved">● Resolved</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button
                            className="action-btn-icon view"
                            title="View Full Incident Details & Playbook"
                            onClick={() => onSelectIncident(inc)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="action-btn-icon delete"
                            title="Delete Incident Record"
                            onClick={() => onDeleteIncident(inc.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW MODE: CARDS GRID */
        <div className="incident-cards-grid fade-in">
          {filteredAndSortedIncidents.length === 0 ? (
            <div className="no-data-cell" style={{ gridColumn: '1 / -1' }}>
              <div className="no-data-content">
                <ShieldAlert size={42} className="no-data-icon" />
                <h3>No Incidents Found</h3>
                <p>No incident records matched your active filter or search query.</p>
                <button className="btn-secondary-sm" onClick={handleResetFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredAndSortedIncidents.map((inc) => (
              <div 
                key={inc.id}
                className="incident-feed-card"
                onClick={() => onSelectIncident(inc)}
              >
                <div className="card-top-row">
                  <div className="card-id-group">
                    <span className="inc-id-tag">{inc.id}</span>
                    <span className="category-chip">{inc.category}</span>
                  </div>
                  {getSeverityBadge(inc.severity)}
                </div>

                <h4 className="card-incident-title">{inc.title}</h4>
                <p className="card-incident-desc">
                  {inc.description ? (inc.description.length > 110 ? inc.description.substring(0, 110) + '...' : inc.description) : 'No description logged.'}
                </p>

                <div className="card-meta-row">
                  <div className="card-meta-item">
                    <Clock size={12} />
                    <span>{formatRelativeTime(inc.timestamp)}</span>
                  </div>
                  <div className="card-meta-item">
                    <UserCheck size={12} className="text-blue" />
                    <span>{inc.assignee || 'Unassigned'}</span>
                  </div>
                </div>

                <div className="card-footer-row" onClick={(e) => e.stopPropagation()}>
                  {getSlaBadge(inc)}
                  <div className="card-actions-right">
                    <select
                      className={`status-dropdown-select status-${(inc.status || 'Open').toLowerCase().replace(/\s+/g, '-')}`}
                      value={inc.status}
                      onChange={(e) => onUpdateStatus(inc.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button 
                      className="action-btn-icon view"
                      onClick={() => onSelectIncident(inc)}
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
