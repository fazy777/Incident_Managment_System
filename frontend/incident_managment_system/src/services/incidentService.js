// Service layer for Incident Management System
// Designed for easy migration to REST API / GraphQL / Database (PostgreSQL, MongoDB, Supabase) in the future.

const STORAGE_KEY = 'incident_management_system_incidents';

const INITIAL_INCIDENTS = [
  {
    id: 'INC-8091',
    title: 'Unauthorized Admin Access Attempt Detected',
    category: 'Security Breach',
    severity: 'Critical',
    status: 'In Progress',
    reporterName: 'Riley Green',
    reporterEmail: 'rgreen@enterprise-sec.org',
    assignee: 'SecOps / Alex Knapp',
    systemComponent: 'Auth Server (IP: 192.168.1.45)',
    description: 'SIEM Anomaly Alert #SOC-882 detected unusual memory dump alerts and high SYN traffic on admin login port.',
    timestamp: '2026-07-22T10:15:00.000Z',
    displayTime: 'Jul 22, 2026 10:15 AM',
    timelineEvents: [
      {
        id: 1,
        type: 'alert',
        content: 'SIEM Alert #SOC-882 triggered: 14 failed root auth attempts',
        timestamp: 'Jul 22, 2026 10:15 AM'
      },
      {
        id: 2,
        type: 'assign',
        content: 'Assigned to SecOps / Alex Knapp with Critical Severity',
        timestamp: 'Jul 22, 2026 10:17 AM'
      }
    ]
  },
  {
    id: 'INC-8090',
    title: 'DDoS Attack on Perimeter Gateway Router',
    category: 'Network Outage',
    severity: 'High',
    status: 'Investigating',
    reporterName: 'Janae Cole',
    reporterEmail: 'jcole@enterprise-sec.org',
    assignee: 'NetOps / Marcus Vance',
    systemComponent: 'US-East Gateway Router #02',
    description: 'Packet flood over 40 Gbps detected on primary border gateway. Traffic scrubbing activated automatically.',
    timestamp: '2026-07-22T09:40:00.000Z',
    displayTime: 'Jul 22, 2026 09:40 AM',
    timelineEvents: [
      {
        id: 1,
        type: 'alert',
        content: 'Scrubbing center route activated for US-East region',
        timestamp: 'Jul 22, 2026 09:40 AM'
      }
    ]
  },
  {
    id: 'INC-8089',
    title: 'PostgreSQL Primary Cluster High Memory Pressure',
    category: 'Database',
    severity: 'Medium',
    status: 'Open',
    reporterName: 'David Chen',
    reporterEmail: 'dchen@enterprise-sec.org',
    assignee: 'DevOps / Sarah Connor',
    systemComponent: 'Prod DB Cluster-01',
    description: 'RAM usage exceeded 92% threshold due to unindexed query lock in analytics pipeline.',
    timestamp: '2026-07-22T08:20:00.000Z',
    displayTime: 'Jul 22, 2026 08:20 AM',
    timelineEvents: [
      {
        id: 1,
        type: 'system',
        content: 'Auto-scaling query read replica requested',
        timestamp: 'Jul 22, 2026 08:20 AM'
      }
    ]
  },
  {
    id: 'INC-8088',
    title: 'SSL Certificate Expiration Warning - Payment Gateway',
    category: 'Infrastructure',
    severity: 'Low',
    status: 'Resolved',
    reporterName: 'Automated CertBot',
    reporterEmail: 'sysadmin@enterprise-sec.org',
    assignee: 'SecOps / Alex Knapp',
    systemComponent: 'pay.enterprise-sec.org',
    description: 'Wildcard SSL certificate renewal was completed successfully. Next expiry in 89 days.',
    timestamp: '2026-07-22T06:00:00.000Z',
    displayTime: 'Jul 22, 2026 06:00 AM',
    timelineEvents: [
      {
        id: 1,
        type: 'resolved',
        content: 'Certificate renewed via Let\'s Encrypt ACME v2',
        timestamp: 'Jul 22, 2026 06:05 AM'
      }
    ]
  }
];

export const getIncidents = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching incidents from storage:', error);
    return INITIAL_INCIDENTS;
  }
};

export const saveIncidents = (incidents) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (error) {
    console.error('Error saving incidents to storage:', error);
  }
};

export const createIncidentObject = (formData) => {
  const now = new Date();
  
  // Format readable timestamp: e.g. "Jul 22, 2026 10:32 AM"
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

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const incId = `INC-${randomNum}`;

  return {
    id: incId,
    title: formData.title || 'Untitled Security Incident',
    category: formData.category || 'Security Breach',
    severity: formData.severity || 'High',
    status: formData.status || 'Open',
    reporterName: formData.reporterName || 'SecOps Analyst',
    reporterEmail: formData.reporterEmail || 'analyst@enterprise-sec.org',
    assignee: formData.assignee || 'Unassigned',
    systemComponent: formData.systemComponent || 'General System',
    description: formData.description || 'No detailed description provided.',
    timestamp: now.toISOString(),
    displayTime: displayTime,
    timelineEvents: [
      {
        id: Date.now(),
        type: 'alert',
        content: `Incident ${incId} created and recorded in system queue.`,
        timestamp: displayTime
      }
    ]
  };
};

export const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Just now';
  const incidentDate = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - incidentDate) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// WhatsApp Message Format Generator
export const generateWhatsAppMessage = (type, data) => {
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  if (type === 'single' && data) {
    const inc = data;
    const sevEmoji = inc.severity === 'Critical' ? '🚨' : inc.severity === 'High' ? '⚠️' : inc.severity === 'Medium' ? '🟡' : '🟢';
    return `${sevEmoji} *INCIDENT RESPONSE ALERT: ${inc.id}* ${sevEmoji}\n\n` +
      `📌 *Title:* ${inc.title}\n` +
      `⚡ *Severity:* ${inc.severity.toUpperCase()}\n` +
      `🔄 *Status:* ${inc.status}\n` +
      `🏷️ *Category:* ${inc.category}\n` +
      `💻 *Affected System:* ${inc.systemComponent || 'N/A'}\n` +
      `👤 *Assigned To:* ${inc.assignee || 'Unassigned'}\n` +
      `🕒 *Reported:* ${inc.displayTime || inc.timestamp}\n\n` +
      `📝 *Details:* ${inc.description}\n\n` +
      `--- \n` +
      `*SecOps Incident Command Center* • ${timeNow}`;
  }

  if (type === 'shift_handover') {
    const incidents = Array.isArray(data) ? data : [];
    const total = incidents.length;
    const critical = incidents.filter(i => i.severity === 'Critical' || i.severity === 'High');
    const openActive = incidents.filter(i => i.status !== 'Resolved');
    const resolved = incidents.filter(i => i.status === 'Resolved');

    let activeListStr = openActive.length > 0 
      ? openActive.map((inc, index) => `${index + 1}. [${inc.id}] *${inc.title}* (${inc.severity}) - *${inc.status}* | Assigned: ${inc.assignee}`).join('\n')
      : '• No active critical issues.';

    return `📢 *SECOPS SHIFT HANDOVER & INCIDENT BRIEFING* 📢\n` +
      `📅 *Date:* ${timeNow}\n\n` +
      `📊 *SYSTEM SUMMARY:* \n` +
      `• Total Logged Incidents: ${total}\n` +
      `• Active Investigations: ${openActive.length}\n` +
      `• Critical/High Priority: ${critical.length}\n` +
      `• Resolved Today: ${resolved.length}\n\n` +
      `🔥 *ACTIVE INCIDENTS:* \n${activeListStr}\n\n` +
      `👉 *Action Required:* Shift leads please review active tickets and verify mitigation steps.\n` +
      `--- \n` +
      `*SecOps Incident Response System*`;
  }

  if (type === 'critical_alert') {
    const incidents = Array.isArray(data) ? data : [];
    const criticals = incidents.filter(i => (i.severity === 'Critical' || i.severity === 'High') && i.status !== 'Resolved');

    let list = criticals.map(i => `🚨 *${i.id}*: ${i.title}\n  ↳ System: ${i.systemComponent} | Assignee: ${i.assignee}`).join('\n\n');

    return `🚨 *CRITICAL THREAT ALERT TO ALL HANDS* 🚨\n\n` +
      `The following high-priority incident(s) require immediate containment:\n\n` +
      `${list || 'No active critical incidents.'}\n\n` +
      `⚠️ *Instructed Action:* Please check SecOps Command Center immediately.\n` +
      `--- \n` +
      `*Emergency Broadcast Channel* • ${timeNow}`;
  }

  return '';
};

// CSV Export Utility
export const exportIncidentsCSV = (incidents) => {
  const headers = ['ID', 'Title', 'Category', 'Severity', 'Status', 'Reporter', 'Assignee', 'System Component', 'Timestamp', 'Description'];
  const rows = incidents.map(inc => [
    `"${inc.id}"`,
    `"${(inc.title || '').replace(/"/g, '""')}"`,
    `"${inc.category || ''}"`,
    `"${inc.severity || ''}"`,
    `"${inc.status || ''}"`,
    `"${(inc.reporterName || '').replace(/"/g, '""')}"`,
    `"${(inc.assignee || '').replace(/"/g, '""')}"`,
    `"${(inc.systemComponent || '').replace(/"/g, '""')}"`,
    `"${inc.displayTime || inc.timestamp || ''}"`,
    `"${(inc.description || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `incident_report_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// JSON Backup Utility
export const exportIncidentsJSON = (incidents) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `incident_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const resetToInitialIncidents = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENTS));
  return INITIAL_INCIDENTS;
};

