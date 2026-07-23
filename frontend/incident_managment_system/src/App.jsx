import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import WhatsAppBroadcastView from './components/WhatsAppBroadcastView';
import SettingsView from './components/SettingsView';
import AddIncidentForm from './components/AddIncidentForm';
import IncidentDetailModal from './components/IncidentDetailModal';
import Toast from './components/Toast';
import { 
  getIncidents, 
  saveIncidents, 
  createIncidentObject 
} from './services/incidentService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [waBroadcastIncident, setWaBroadcastIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load initial incidents from storage or service default
  useEffect(() => {
    const loadedData = getIncidents();
    setIncidents(loadedData);
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
    
    setToastMessage(`Incident ${newInc.id} logged successfully with timestamp!`);
    setActiveTab('dashboard');
  };

  // Update Status handler
  const handleUpdateStatus = (incidentId, newStatus) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
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
      const updated = incidents.filter(i => i.id !== incidentId);
      updateIncidentsList(updated);
      setToastMessage(`Incident ${incidentId} deleted.`);
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident(null);
      }
    }
  };

  const handleOpenWhatsAppBroadcast = (incident = null) => {
    setWaBroadcastIncident(incident);
    setActiveTab('whatsapp-broadcast');
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
              onOpenWhatsAppBroadcast={handleOpenWhatsAppBroadcast}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              incidents={incidents}
              onToast={(msg) => setToastMessage(msg)}
            />
          )}

          {activeTab === 'whatsapp-broadcast' && (
            <WhatsAppBroadcastView
              incidents={incidents}
              initialIncident={waBroadcastIncident}
              onCopySuccess={(msg) => setToastMessage(msg)}
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
          onOpenWhatsAppBroadcast={handleOpenWhatsAppBroadcast}
        />
      )}
    </div>
  );
}

export default App;

