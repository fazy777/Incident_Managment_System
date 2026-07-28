import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import OnCallView from './components/OnCallView';
import ActivityLogView from './components/ActivityLogView';
import SettingsView from './components/SettingsView';
import AddIncidentForm from './components/AddIncidentForm';
import IncidentDetailModal from './components/IncidentDetailModal';
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
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load initial incidents and audit logs from storage
  useEffect(() => {
    const loadedData = getIncidents();
    setIncidents(loadedData);

    const loadedLogs = getAuditLogs();
    setAuditLogs(loadedLogs);
  }, []);

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
      performer: newInc.reporterName || 'SecOps Operator',
      details: `New incident "${newInc.title}" registered for component ${newInc.systemComponent}.`
    });
    setAuditLogs(updatedLogs);

    setToastMessage(`Incident ${newInc.id} logged successfully with timestamp!`);
    setActiveTab('dashboard');
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
      performer: 'SecOps Analyst',
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
        performer: 'SecOps Lead',
        details: `Incident record ${incidentId} ("${targetInc ? targetInc.title : ''}") was permanently removed from active queue.`
      });
      setAuditLogs(updatedLogs);

      setToastMessage(`Incident ${incidentId} deleted.`);
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident(null);
      }
    }
  };

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
        />

        {/* Sub Header Breadcrumbs & Date */}
        <SubHeader activeTab={activeTab} />

        {/* Dynamic View Content */}
        <main className="content-area">
          {activeTab === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              onOpenAddModal={() => setActiveTab('add-incident')}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onDeleteIncident={handleDeleteIncident}
              onUpdateStatus={handleUpdateStatus}
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
              onAddIncident={handleAddIncident}
              onCancel={() => setActiveTab('dashboard')}
              onClose={() => setActiveTab('dashboard')}
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
