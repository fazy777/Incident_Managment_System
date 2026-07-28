// Service layer for System Audit Trail & Activity Logging

const AUDIT_STORAGE_KEY = 'incident_management_system_audit_logs';

const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-1008',
    category: 'Security Breach',
    severity: 'Critical',
    action: 'SIEM Alert Triggered',
    performer: 'SIEM Automation Engine',
    details: 'Unauthorized root authentication attempt on Auth Server (192.168.1.45). Incident INC-8091 raised.',
    timestamp: '2026-07-28T09:15:00.000Z',
    displayTime: 'Jul 28, 2026 09:15 AM'
  },
  {
    id: 'LOG-1007',
    category: 'Status Update',
    severity: 'Medium',
    action: 'Status Escalation',
    performer: 'Alex Knapp (SecOps Lead)',
    details: 'Changed status of INC-8090 (DDoS Attack) from Open to Investigating.',
    timestamp: '2026-07-28T08:40:00.000Z',
    displayTime: 'Jul 28, 2026 08:40 AM'
  },
  {
    id: 'LOG-1006',
    category: 'System Alert',
    severity: 'Info',
    action: 'SSL Cert Renewal',
    performer: 'CertBot Auto-Service',
    details: 'Successfully renewed wildcard SSL certificate for pay.enterprise-sec.org. Next expiry in 89 days.',
    timestamp: '2026-07-28T07:10:00.000Z',
    displayTime: 'Jul 28, 2026 07:10 AM'
  },
  {
    id: 'LOG-1005',
    category: 'Roster Update',
    severity: 'Info',
    action: 'On-Call Shift Switch',
    performer: 'Sarah Connor',
    details: 'Assigned Marcus Vance as primary responder for NetOps rotation.',
    timestamp: '2026-07-27T18:30:00.000Z',
    displayTime: 'Jul 27, 2026 06:30 PM'
  },
  {
    id: 'LOG-1004',
    category: 'Configuration',
    severity: 'Low',
    action: 'Webhook Updated',
    performer: 'Admin Console',
    details: 'Slack alert notification endpoint updated for #secops-critical channel.',
    timestamp: '2026-07-27T14:20:00.000Z',
    displayTime: 'Jul 27, 2026 02:20 PM'
  }
];

export const getAuditLogs = () => {
  try {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching audit logs from storage:', error);
    return INITIAL_AUDIT_LOGS;
  }
};

export const saveAuditLogs = (logs) => {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving audit logs to storage:', error);
  }
};

export const addAuditLog = ({ category = 'System Alert', severity = 'Info', action, performer = 'SecOps Operator', details = '' }) => {
  const currentLogs = getAuditLogs();
  const now = new Date();
  
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const displayTime = `${formattedDate} ${formattedTime}`;
  const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLog = {
    id: logId,
    category,
    severity,
    action,
    performer,
    details,
    timestamp: now.toISOString(),
    displayTime
  };

  const updatedLogs = [newLog, ...currentLogs];
  saveAuditLogs(updatedLogs);
  return updatedLogs;
};

export const exportAuditLogsCSV = (logs) => {
  const headers = ['Log ID', 'Category', 'Severity', 'Action', 'Performer', 'Timestamp', 'Details'];
  const rows = logs.map(log => [
    `"${log.id}"`,
    `"${log.category || ''}"`,
    `"${log.severity || ''}"`,
    `"${(log.action || '').replace(/"/g, '""')}"`,
    `"${(log.performer || '').replace(/"/g, '""')}"`,
    `"${log.displayTime || log.timestamp || ''}"`,
    `"${(log.details || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `system_audit_trail_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const resetAuditLogs = () => {
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
  return INITIAL_AUDIT_LOGS;
};
