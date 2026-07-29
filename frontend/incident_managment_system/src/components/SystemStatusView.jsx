import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Zap, 
  Cpu, 
  HardDrive, 
  Radio, 
  PlusCircle, 
  Filter 
} from 'lucide-react';
import { 
  getSystemHealthServices, 
  saveSystemHealthServices, 
  updateServiceStatus, 
  pingAllServices 
} from '../services/systemHealthService';

export default function SystemStatusView({ onReportOutage, onToast }) {
  const [services, setServices] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setServices(getSystemHealthServices());
  }, []);

  const handleRefreshPing = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = pingAllServices();
      setServices(updated);
      setIsRefreshing(false);
      onToast && onToast('Telemetry ping executed across all infrastructure nodes.');
    }, 600);
  };

  const handleStatusToggle = (svcId, currentStatus) => {
    const nextStatusMap = {
      'Operational': 'Degraded Performance',
      'Degraded Performance': 'Partial Outage',
      'Partial Outage': 'Major Outage',
      'Major Outage': 'Operational'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Operational';
    const updated = updateServiceStatus(svcId, nextStatus);
    setServices(updated);
    onToast && onToast(`Status for service ${svcId} changed to ${nextStatus}.`);
  };

  const handleDraftIncident = (svc) => {
    if (onReportOutage) {
      onReportOutage({
        title: `Outage Detected: ${svc.name}`,
        category: svc.category === 'Database' ? 'Database' : 'Infrastructure',
        systemComponent: svc.name,
        severity: svc.status === 'Major Outage' ? 'Critical' : 'High',
        description: `Automated detection reported ${svc.status} on component ${svc.name} (${svc.region}) with latency ${svc.latencyMs}ms and CPU ${svc.cpuUsage}%.`
      });
    }
  };

  const totalCount = services.length;
  const operationalCount = services.filter(s => s.status === 'Operational').length;
  const degradedCount = services.filter(s => s.status === 'Degraded Performance').length;
  const outageCount = services.filter(s => s.status.includes('Outage')).length;
  const systemHealthScore = totalCount > 0 ? Math.round((operationalCount / totalCount) * 100) : 100;

  const categories = ['ALL', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(svc => {
    const matchesStatus = filterStatus === 'ALL' || svc.status.toUpperCase().includes(filterStatus.toUpperCase());
    const matchesCategory = filterCategory === 'ALL' || svc.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Operational':
        return <span className="health-badge bg-green"><CheckCircle2 size={14} /> Operational</span>;
      case 'Degraded Performance':
        return <span className="health-badge bg-yellow"><AlertTriangle size={14} /> Degraded</span>;
      case 'Partial Outage':
        return <span className="health-badge bg-orange"><AlertTriangle size={14} /> Partial Outage</span>;
      case 'Major Outage':
        return <span className="health-badge bg-red"><XCircle size={14} /> Major Outage</span>;
      default:
        return <span className="health-badge bg-gray">{status}</span>;
    }
  };

  return (
    <div className="analytics-view-container fade-in">
      {/* Header Controls */}
      <div className="view-header-flex">
        <div>
          <h2 className="view-title">
            <Activity className="text-primary-glow" size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            Infrastructure & Microservice Health Monitor
          </h2>
          <p className="view-subtitle">Real-time status metrics, telemetry, and service node health controls</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleRefreshPing}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
            {isRefreshing ? 'Pinging Nodes...' : 'Ping Telemetry'}
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrap bg-blue-glow">
            <Server size={22} color="#38bdf8" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Nodes</span>
            <div className="kpi-value">{totalCount}</div>
            <span className="kpi-subtext">Monitored infrastructure</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrap bg-green-glow">
            <CheckCircle2 size={22} color="#4ade80" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">System Health Score</span>
            <div className="kpi-value" style={{ color: systemHealthScore > 80 ? '#4ade80' : '#f59e0b' }}>
              {systemHealthScore}%
            </div>
            <span className="kpi-subtext">{operationalCount} / {totalCount} Fully Operational</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrap bg-yellow-glow">
            <AlertTriangle size={22} color="#f59e0b" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Degraded Nodes</span>
            <div className="kpi-value">{degradedCount}</div>
            <span className="kpi-subtext">Latency alerts active</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrap bg-red-glow">
            <XCircle size={22} color="#f87171" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Outage Incident Count</span>
            <div className="kpi-value" style={{ color: outageCount > 0 ? '#f87171' : '#94a3b8' }}>
              {outageCount}
            </div>
            <span className="kpi-subtext">Requires immediate triage</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel filter-toolbar" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
          <Filter size={16} /> Filters:
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '6px' }}>Status:</label>
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Degraded">Degraded</option>
            <option value="Outage">Outage</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '6px' }}>Category:</label>
          <select 
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Infrastructure Grid */}
      <div className="services-grid">
        {filteredServices.map((svc) => (
          <div key={svc.id} className="service-card glass-panel">
            <div className="service-card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="service-id">{svc.id}</span>
                  <span className="service-category">{svc.category}</span>
                </div>
                <h3 className="service-name">{svc.name}</h3>
                <span className="service-region"><Radio size={12} style={{ display: 'inline', marginRight: '4px' }} /> {svc.region}</span>
              </div>
              <div>
                {getStatusBadge(svc.status)}
              </div>
            </div>

            {/* Service Telemetry Stats */}
            <div className="service-telemetry-grid">
              <div className="telemetry-item">
                <span className="telemetry-label"><Zap size={13} /> Latency</span>
                <span className="telemetry-value" style={{ color: svc.latencyMs > 150 ? '#f87171' : '#38bdf8' }}>
                  {svc.latencyMs} ms
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label"><Cpu size={13} /> CPU Load</span>
                <span className="telemetry-value" style={{ color: svc.cpuUsage > 80 ? '#f87171' : '#cbd5e1' }}>
                  {svc.cpuUsage}%
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label"><HardDrive size={13} /> Memory</span>
                <span className="telemetry-value">{svc.memoryUsage}%</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label"><Activity size={13} /> Uptime</span>
                <span className="telemetry-value" style={{ color: '#4ade80' }}>{svc.uptimePercent}%</span>
              </div>
            </div>

            {/* Load bar */}
            <div className="cpu-bar-wrap">
              <div className="cpu-bar-label">
                <span>CPU Load Metric</span>
                <span>{svc.cpuUsage}%</span>
              </div>
              <div className="cpu-bar-bg">
                <div 
                  className={`cpu-bar-fill ${svc.cpuUsage > 80 ? 'fill-red' : svc.cpuUsage > 60 ? 'fill-yellow' : 'fill-blue'}`}
                  style={{ width: `${svc.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="service-card-footer">
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => handleStatusToggle(svc.id, svc.status)}
                title="Toggle Service Operational State"
              >
                Change State
              </button>
              {svc.status !== 'Operational' && (
                <button 
                  className="btn btn-sm btn-primary-gradient"
                  onClick={() => handleDraftIncident(svc)}
                >
                  <PlusCircle size={14} /> Report Incident
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
