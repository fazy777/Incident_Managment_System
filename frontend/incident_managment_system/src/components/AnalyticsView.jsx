import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Download, 
  FileText, 
  Activity, 
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { exportIncidentsCSV, exportIncidentsJSON } from '../services/incidentService';

export default function AnalyticsView({ incidents, onToast }) {
  const total = incidents.length;
  
  // Severity Counts
  const critical = incidents.filter(i => i.severity === 'Critical').length;
  const high = incidents.filter(i => i.severity === 'High').length;
  const medium = incidents.filter(i => i.severity === 'Medium').length;
  const low = incidents.filter(i => i.severity === 'Low').length;

  // Status Counts
  const open = incidents.filter(i => i.status === 'Open').length;
  const investigating = incidents.filter(i => i.status === 'Investigating').length;
  const inProgress = incidents.filter(i => i.status === 'In Progress').length;
  const resolved = incidents.filter(i => i.status === 'Resolved').length;

  // Category counts
  const categoryMap = incidents.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {});

  const handleExportCSV = () => {
    exportIncidentsCSV(incidents);
    if (onToast) onToast('Incident dataset exported to CSV file successfully!');
  };

  const handleExportJSON = () => {
    exportIncidentsJSON(incidents);
    if (onToast) onToast('Full system JSON backup downloaded!');
  };

  const getPercent = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="analytics-container">
      {/* Top Banner */}
      <div className="analytics-header">
        <div className="header-left">
          <div className="analytics-badge-icon">
            <BarChart3 size={22} />
          </div>
          <div>
            <h2>SecOps Incident Analytics & Response KPIs</h2>
            <p>Real-time SLA performance, mean time to resolve (MTTR), and category threat analysis.</p>
          </div>
        </div>

        <div className="analytics-actions">
          <button className="btn-export" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button className="btn-export secondary" onClick={handleExportJSON}>
            <FileText size={15} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* SLA Metric Cards */}
      <div className="kpi-metrics-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">MTTR (Mean Time to Resolve)</span>
            <Clock size={18} className="text-blue" />
          </div>
          <div className="kpi-value">34.2 <span className="kpi-unit">mins</span></div>
          <div className="kpi-footer green">
            <TrendingUp size={14} />
            <span>12% faster than target SLA</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">MTTD (Mean Time to Detect)</span>
            <Activity size={18} className="text-amber" />
          </div>
          <div className="kpi-value">5.8 <span className="kpi-unit">mins</span></div>
          <div className="kpi-footer green">
            <ShieldCheck size={14} />
            <span>Automated SIEM detection active</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">SLA Compliance Rate</span>
            <CheckCircle2 size={18} className="text-green" />
          </div>
          <div className="kpi-value">97.4<span className="kpi-unit">%</span></div>
          <div className="kpi-footer green">
            <span>High performance reliability</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Active Resolution Rate</span>
            <AlertTriangle size={18} className="text-red" />
          </div>
          <div className="kpi-value">{getPercent(resolved)}<span className="kpi-unit">%</span></div>
          <div className="kpi-footer muted">
            <span>{resolved} of {total} incidents resolved</span>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="charts-grid">
        {/* Severity Breakdown */}
        <div className="chart-card">
          <h3 className="chart-title">
            <PieChart size={16} className="text-blue" />
            Severity Distribution
          </h3>

          <div className="bar-list">
            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label text-critical">Critical</span>
                <span className="bar-count">{critical} ({getPercent(critical)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill critical" style={{ width: `${getPercent(critical)}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label text-high">High</span>
                <span className="bar-count">{high} ({getPercent(high)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill high" style={{ width: `${getPercent(high)}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label text-medium">Medium</span>
                <span className="bar-count">{medium} ({getPercent(medium)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill medium" style={{ width: `${getPercent(medium)}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label text-low">Low</span>
                <span className="bar-count">{low} ({getPercent(low)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill low" style={{ width: `${getPercent(low)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="chart-card">
          <h3 className="chart-title">
            <Activity size={16} className="text-amber" />
            Status Breakdown
          </h3>

          <div className="bar-list">
            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label">Open</span>
                <span className="bar-count">{open} ({getPercent(open)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill open" style={{ width: `${getPercent(open)}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label">Investigating</span>
                <span className="bar-count">{investigating} ({getPercent(investigating)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill investigating" style={{ width: `${getPercent(investigating)}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label">In Progress</span>
                <span className="bar-count">{inProgress} ({getPercent(inProgress)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill progress" style={{ width: `${getPercent(inProgress)}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label-row">
                <span className="bar-label">Resolved</span>
                <span className="bar-count">{resolved} ({getPercent(resolved)}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill resolved" style={{ width: `${getPercent(resolved)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="chart-card full-width">
          <h3 className="chart-title">
            <Database size={16} className="text-blue" />
            Incidents by Category Vector
          </h3>

          <div className="category-grid">
            {Object.keys(categoryMap).map((catKey) => {
              const cnt = categoryMap[catKey];
              const pct = getPercent(cnt);
              return (
                <div key={catKey} className="category-metric-box">
                  <span className="cat-name">{catKey}</span>
                  <span className="cat-val">{cnt} incident{cnt > 1 ? 's' : ''}</span>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
