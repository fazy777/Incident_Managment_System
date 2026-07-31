import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import DashboardView from './components/DashboardView';
import SystemStatusView from './components/SystemStatusView';
import AnalyticsView from './components/AnalyticsView';
import OnCallView from './components/OnCallView';
import ActivityLogView from './components/ActivityLogView';
import SettingsView from './components/SettingsView';
import AddIncidentForm from './components/AddIncidentForm';
import IncidentDetailModal from './components/IncidentDetailModal';
import AuthPage from './components/AuthPage';
import Toast from './components/Toast';
import { 
  getIncidents, 
  saveIncidents, 
  createIncidentObject 
} from './services/incidentService';
import {
  getAuditLogs,
  addAuditLog
} from './services/auditLogService';
import { 
  subscribeToAuthChanges, 
  logoutUser 
} from './services/authService';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [draftIncidentData, setDraftIncidentData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Subscribe to Authentication state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load initial incidents and audit logs from storage
  useEffect(() => {
    const loadedData = getIncidents();
    setIncidents(loadedData);

    const loadedLogs = getAuditLogs();
    setAuditLogs(loadedLogs);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      setToastMessage('Signed out of Firebase session.');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Save incidents whenever list changes
  const updateIncidentsList = (newList) => {
    setIncidents(newList);
    saveIncidents(newList);
  };

  // Add Incident handler
  const handleAddIncident = (formData) => {
    const newInc = createIncidentObject(formData);
    const updated = [newInc, ...incidents];
    updateIncidentsList(updated);
    
    // Automatically log audit entry
    const updatedLogs = addAuditLog({
      category: newInc.category || 'Security Breach',
      severity: newInc.severity || 'High',
      action: `Incident Logged: ${newInc.id}`,
      performer: currentUser?.displayName || newInc.reporterName || 'SecOps Operator',
      details: `New incident "${newInc.title}" registered for component ${newInc.systemComponent}.`
    });
    setAuditLogs(updatedLogs);

    setToastMessage(`Incident ${newInc.id} logged successfully with timestamp!`);
    setDraftIncidentData(null);
    setActiveTab('dashboard');
  };

  // Trigger Report Outage from System Status view
  const handleReportOutage = (outageData) => {
    setDraftIncidentData(outageData);
    setActiveTab('add-incident');
  };

  // Update Status handler
  const handleUpdateStatus = (incidentId, newStatus) => {
    let updatedIncTitle = '';
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        updatedIncTitle = inc.title;
        const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        const updatedEvents = [
          ...(inc.timelineEvents || []),
          {
            id: Date.now(),
            type: 'status_change',
            content: `Status updated to "${newStatus}"`,
            timestamp: formattedTime
          }
        ];
        return {
          ...inc,
          status: newStatus,
          timelineEvents: updatedEvents
        };
      }
      return inc;
    });

    updateIncidentsList(updated);

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(updated.find(i => i.id === incidentId));
    }

    // Automatically log audit entry
    const updatedLogs = addAuditLog({
      category: 'Status Update',
      severity: newStatus === 'Resolved' ? 'Info' : 'Medium',
      action: `Status Change: ${incidentId}`,
      performer: currentUser?.displayName || 'SecOps Analyst',
      details: `Incident ${incidentId} (${updatedIncTitle}) status escalated/updated to "${newStatus}".`
    });
    setAuditLogs(updatedLogs);

    setToastMessage(`Status for ${incidentId} updated to ${newStatus}`);
  };

  // Add timeline note
  const handleAddTimelineEvent = (incidentId, newEvent) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          timelineEvents: [...(inc.timelineEvents || []), newEvent]
        };
      }
      return inc;
    });

    updateIncidentsList(updated);
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(updated.find(i => i.id === incidentId));
    }
  };

  // Delete Incident handler
  const handleDeleteIncident = (incidentId) => {
    if (window.confirm(`Are you sure you want to delete incident record ${incidentId}?`)) {
      const targetInc = incidents.find(i => i.id === incidentId);
      const updated = incidents.filter(i => i.id !== incidentId);
      updateIncidentsList(updated);

      // Log audit trail
      const updatedLogs = addAuditLog({
        category: 'Configuration',
        severity: 'High',
        action: `Incident Deleted: ${incidentId}`,
        performer: currentUser?.displayName || 'SecOps Lead',
        details: `Incident record ${incidentId} ("${targetInc ? targetInc.title : ''}") was permanently removed from active queue.`
      });
      setAuditLogs(updatedLogs);

      setToastMessage(`Incident ${incidentId} deleted.`);
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident(null);
      }
    }
  };

  // If Firebase Auth session is loading, show loading screen
  if (authLoading) {
    return (
      <div className="auth-page-container">
        <div className="auth-spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  // If not logged in into Firebase Auth, render Login & Registration Page
  if (!currentUser) {
    return (
      <AuthPage 
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setToastMessage(`Authenticated as ${user.displayName || user.email}`);
        }} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace */}
      <div className="main-layout">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          incidentCount={incidents.length}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Sub Header Breadcrumbs & Date */}
        <SubHeader activeTab={activeTab} />

        {/* Dynamic View Content */}
        <main className="content-area">
          {activeTab === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              onOpenAddModal={() => {
                setDraftIncidentData(null);
                setActiveTab('add-incident');
              }}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onDeleteIncident={handleDeleteIncident}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'system-status' && (
            <SystemStatusView
              onReportOutage={handleReportOutage}
              onToast={(msg) => setToastMessage(msg)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              incidents={incidents}
              onToast={(msg) => setToastMessage(msg)}
            />
          )}

          {activeTab === 'on-call' && (
            <OnCallView 
              onToast={(msg) => setToastMessage(msg)}
            />
          )}

          {activeTab === 'audit-logs' && (
            <ActivityLogView
              auditLogs={auditLogs}
              onUpdateAuditLogs={(newLogs) => setAuditLogs(newLogs)}
              onToast={(msg) => setToastMessage(msg)}
            />
          )}

          {activeTab === 'add-incident' && (
            <AddIncidentForm
              initialData={draftIncidentData}
              onAddIncident={handleAddIncident}
              onCancel={() => {
                setDraftIncidentData(null);
                setActiveTab('dashboard');
              }}
              onClose={() => {
                setDraftIncidentData(null);
                setActiveTab('dashboard');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              onResetData={(newList) => updateIncidentsList(newList)}
              onToast={(msg) => setToastMessage(msg)}
            />
          )}
        </main>
      </div>

      {/* Detail Modal View */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddTimelineEvent={handleAddTimelineEvent}
        />
      )}
    </div>
  );
}

export default App;
