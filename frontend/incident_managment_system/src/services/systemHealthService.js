// System Infrastructure & Service Health Service

const HEALTH_STORAGE_KEY = 'secops_system_health_v1';

const defaultServices = [
  {
    id: 'SVC-101',
    name: 'Auth & OAuth2 Gateway',
    category: 'Authentication',
    status: 'Operational',
    region: 'US-East (N. Virginia)',
    latencyMs: 24.5,
    cpuUsage: 34,
    memoryUsage: 52,
    uptimePercent: 99.99,
    lastPing: new Date().toLocaleTimeString()
  },
  {
    id: 'SVC-102',
    name: 'Core PostgreSQL Database Cluster',
    category: 'Database',
    status: 'Degraded Performance',
    region: 'US-East (N. Virginia)',
    latencyMs: 185.0,
    cpuUsage: 88,
    memoryUsage: 79,
    uptimePercent: 99.85,
    lastPing: new Date().toLocaleTimeString()
  },
  {
    id: 'SVC-103',
    name: 'Kafka Real-Time Event Bus',
    category: 'Messaging Queue',
    status: 'Operational',
    region: 'US-West (Oregon)',
    latencyMs: 12.1,
    cpuUsage: 28,
    memoryUsage: 41,
    uptimePercent: 100.0,
    lastPing: new Date().toLocaleTimeString()
  },
  {
    id: 'SVC-104',
    name: 'Payment Gateway Integration',
    category: 'Integrations',
    status: 'Operational',
    region: 'EU-Central (Frankfurt)',
    latencyMs: 45.2,
    cpuUsage: 19,
    memoryUsage: 38,
    uptimePercent: 99.95,
    lastPing: new Date().toLocaleTimeString()
  },
  {
    id: 'SVC-105',
    name: 'S3 Asset Storage & Vault',
    category: 'Storage',
    status: 'Operational',
    region: 'US-East (N. Virginia)',
    latencyMs: 18.3,
    cpuUsage: 14,
    memoryUsage: 29,
    uptimePercent: 99.99,
    lastPing: new Date().toLocaleTimeString()
  },
  {
    id: 'SVC-106',
    name: 'Elasticsearch Log Indexer Node',
    category: 'Logging',
    status: 'Partial Outage',
    region: 'AP-South (Mumbai)',
    latencyMs: 420.0,
    cpuUsage: 94,
    memoryUsage: 91,
    uptimePercent: 98.50,
    lastPing: new Date().toLocaleTimeString()
  }
];

export const getSystemHealthServices = () => {
  const saved = localStorage.getItem(HEALTH_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(defaultServices));
    return defaultServices;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return defaultServices;
  }
};

export const saveSystemHealthServices = (services) => {
  localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(services));
};

export const updateServiceStatus = (serviceId, newStatus) => {
  const services = getSystemHealthServices();
  const updated = services.map(svc => {
    if (svc.id === serviceId) {
      return {
        ...svc,
        status: newStatus,
        lastPing: new Date().toLocaleTimeString()
      };
    }
    return svc;
  });
  saveSystemHealthServices(updated);
  return updated;
};

export const pingAllServices = () => {
  const services = getSystemHealthServices();
  const updated = services.map(svc => ({
    ...svc,
    latencyMs: Math.max(10, Math.round(svc.latencyMs + (Math.random() * 20 - 10))),
    cpuUsage: Math.min(99, Math.max(10, Math.round(svc.cpuUsage + (Math.random() * 10 - 5)))),
    lastPing: new Date().toLocaleTimeString()
  }));
  saveSystemHealthServices(updated);
  return updated;
};
