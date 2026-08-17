import { ChevronRight, Clock, ShieldCheck } from 'lucide-react';

export default function SubHeader({ activeTab }) {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Incident Dashboard & Live Queue';
      case 'system-status': return 'Infrastructure Health & Microservices Monitor';
      case 'analytics': return 'SecOps Metrics & SLA Analytics';
      case 'on-call': return 'On-Call Duty Roster & Escalation Matrix';
      case 'audit-logs': return 'System Activity Audit Trail & Compliance Logs';
      case 'add-incident': return 'Log New Incident Form';
      case 'settings': return 'System Settings & Roster';
      default: return 'Dashboard';
    }
  };

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="subheader-bar">
      <div className="subheader-left">
        <span className="breadcrumb-link">SecOps Incident Portal</span>
        <ChevronRight size={13} className="text-gray" />
        <span className="breadcrumb-current">{getTabLabel()}</span>
      </div>

      <div className="subheader-right">
        <div className="system-time-badge">
          <Clock size={13} />
          <span>Current System Date: <strong>{todayDateStr}</strong></span>
        </div>
        <div className="system-status-indicator">
          <ShieldCheck size={13} className="text-green" />
          <span>Realtime Monitoring Active</span>
        </div>
      </div>
    </div>
  );
}
