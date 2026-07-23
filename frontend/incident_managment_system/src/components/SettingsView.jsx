import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Bell, 
  Database, 
  ShieldCheck, 
  MessageSquare, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import { resetToInitialIncidents } from '../services/incidentService';

export default function SettingsView({ onResetData, onToast }) {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Knapp', role: 'SecOps Lead', email: 'aknapp@enterprise-sec.org', status: 'On-Call' },
    { id: 2, name: 'Marcus Vance', role: 'NetOps Specialist', email: 'mvance@enterprise-sec.org', status: 'Active' },
    { id: 3, name: 'Sarah Connor', role: 'DevOps Engineer', email: 'sconnor@enterprise-sec.org', status: 'Active' },
    { id: 4, name: 'Riley Green', role: 'SOC Analyst', email: 'rgreen@enterprise-sec.org', status: 'Off-Duty' }
  ]);

  const [newMember, setNewMember] = useState({ name: '', role: 'SOC Analyst', email: '' });
  const [webhookUrl, setWebhookUrl] = useState('https://api.whatsapp.com/v1/webhooks/secops-group-alerts');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [notifications, setNotifications] = useState({
    criticalSms: true,
    whatsappGroupBroadcast: true,
    emailDailyDigest: true,
    soundAlerts: false
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const created = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      status: 'Active'
    };

    setTeamMembers([...teamMembers, created]);
    setNewMember({ name: '', role: 'SOC Analyst', email: '' });
    if (onToast) onToast(`Team member ${created.name} added to SecOps roster!`);
  };

  const handleDeleteMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    if (onToast) onToast('Team member removed from roster.');
  };

  const handleSaveSettings = () => {
    if (onToast) onToast('System configuration & Webhook channels saved successfully!');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all incidents to factory default demo records?')) {
      const resetList = resetToInitialIncidents();
      if (onResetData) onResetData(resetList);
      if (onToast) onToast('System dataset reset to initial demo state.');
    }
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-left">
          <div className="settings-badge-icon">
            <Settings size={22} />
          </div>
          <div>
            <h2>SecOps System & Broadcast Settings</h2>
            <p>Configure team roster, WhatsApp & Slack webhooks, and incident database connectors.</p>
          </div>
        </div>

        <button className="btn-save-settings" onClick={handleSaveSettings}>
          <Save size={15} />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="settings-sections-grid">
        {/* Team Roster Management */}
        <div className="settings-card full-width">
          <h3 className="settings-card-title">
            <Users size={18} className="text-blue" />
            Incident Responders & On-Call Team Roster
          </h3>

          <div className="team-table-wrapper">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Responder Name</th>
                  <th>Role</th>
                  <th>Email Address</th>
                  <th>On-Call Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td><strong>{member.name}</strong></td>
                    <td><span className="role-tag">{member.role}</span></td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`status-pill ${member.status === 'On-Call' ? 'status-open' : 'status-resolved'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="action-btn-icon delete" onClick={() => handleDeleteMember(member.id)}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Member Form */}
          <form onSubmit={handleAddMember} className="add-member-form">
            <input
              type="text"
              placeholder="Full Name (e.g. David Miller)"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              required
            />
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            >
              <option value="SecOps Lead">SecOps Lead</option>
              <option value="SOC Analyst">SOC Analyst</option>
              <option value="NetOps Specialist">NetOps Specialist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Incident Commander">Incident Commander</option>
            </select>
            <button type="submit" className="btn-add-member">
              <Plus size={15} />
              <span>Add Member</span>
            </button>
          </form>
        </div>

        {/* Webhook & WhatsApp Integration */}
        <div className="settings-card">
          <h3 className="settings-card-title">
            <Smartphone size={18} className="text-green" />
            WhatsApp & Alert Webhook Endpoints
          </h3>

          <div className="setting-field">
            <label>WhatsApp Group API Webhook Endpoint URL:</label>
            <input
              type="text"
              className="text-input"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <span className="field-hint">Automated alerts will post directly to your configured WhatsApp emergency channel.</span>
          </div>

          <div className="setting-field mt-4">
            <label>Slack Alert Channel Webhook:</label>
            <input
              type="text"
              className="text-input"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
            />
          </div>
        </div>

        {/* Notification Switches */}
        <div className="settings-card">
          <h3 className="settings-card-title">
            <Bell size={18} className="text-amber" />
            Notification Rules & Alert Triggers
          </h3>

          <div className="toggle-list">
            <label className="toggle-item">
              <div>
                <strong>WhatsApp Group Auto-Broadcast</strong>
                <span>Post alerts to group when Critical incident is logged</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.whatsappGroupBroadcast}
                onChange={(e) => setNotifications({ ...notifications, whatsappGroupBroadcast: e.target.checked })}
              />
            </label>

            <label className="toggle-item">
              <div>
                <strong>Critical Priority Emergency SMS</strong>
                <span>Dispatch urgent SMS to On-Call Commander</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.criticalSms}
                onChange={(e) => setNotifications({ ...notifications, criticalSms: e.target.checked })}
              />
            </label>

            <label className="toggle-item">
              <div>
                <strong>Daily Executive Email Digest</strong>
                <span>Send 24-hr Incident Summary to management</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailDailyDigest}
                onChange={(e) => setNotifications({ ...notifications, emailDailyDigest: e.target.checked })}
              />
            </label>

            <label className="toggle-item">
              <div>
                <strong>Dashboard Audio Alert Sound</strong>
                <span>Play sound when a new incident arrives</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.soundAlerts}
                onChange={(e) => setNotifications({ ...notifications, soundAlerts: e.target.checked })}
              />
            </label>
          </div>
        </div>

        {/* Data & Database Controls */}
        <div className="settings-card full-width">
          <h3 className="settings-card-title">
            <Database size={18} className="text-blue" />
            Database & System Maintenance
          </h3>

          <div className="db-controls-flex">
            <div className="db-info-box">
              <ShieldCheck size={20} className="text-green" />
              <div>
                <strong>Storage Provider: LocalStorage (Offline / Cache Enabled)</strong>
                <p>Data is persistantly stored. Schema compatible with REST / GraphQL APIs (PostgreSQL, MongoDB).</p>
              </div>
            </div>

            <button className="btn-danger-outline" onClick={handleResetDemoData}>
              <RotateCcw size={15} />
              <span>Reset Demo Incidents Dataset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
