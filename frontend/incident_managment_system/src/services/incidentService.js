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
