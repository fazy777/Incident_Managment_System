import React from 'react';
import { X, Search } from 'lucide-react';

export default function IncidentMetadata({ metadata, onUpdateMetadata }) {
  return (
    <div className="incident-metadata-panel">
      {/* Assignee */}
      <div className="form-group">
        <label className="form-label">Assignee</label>
        <div className="select-pill-wrapper">
          <span className="assignee-pill">
            Support/Alex Knapp <X size={12} className="remove-pill" />
          </span>
        </div>
      </div>

      {/* Followers */}
      <div className="form-group">
        <label className="form-label">Followers</label>
        <div className="input-with-icon">
          <Search size={14} className="input-icon" />
          <input
            type="text"
            placeholder="search name or contact info"
            className="form-control-input"
          />
        </div>
      </div>

      {/* Form */}
      <div className="form-group">
        <label className="form-label">Form</label>
        <select
          className="form-control-select"
          value={metadata.form}
          onChange={(e) => onUpdateMetadata('form', e.target.value)}
        >
          <option value="Regular Form">Regular Form</option>
          <option value="Escalation Form">Escalation Form</option>
          <option value="Hardware Issue">Hardware Issue</option>
        </select>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tags</label>
        <div className="tags-container">
          {metadata.tags.map((tag, idx) => (
            <span key={idx} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Order Status */}
      <div className="form-group">
        <label className="form-label">Order status</label>
        <select
          className="form-control-select"
          value={metadata.orderStatus}
          onChange={(e) => onUpdateMetadata('orderStatus', e.target.value)}
        >
          <option value="Shipped">Shipped</option>
          <option value="Processing">Processing</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Type & Priority */}
      <div className="form-row-2">
        <div className="form-group flex-1">
          <label className="form-label">Type</label>
          <select
            className="form-control-select"
            value={metadata.type}
            onChange={(e) => onUpdateMetadata('type', e.target.value)}
          >
            <option value="Problem">Problem</option>
            <option value="Incident">Incident</option>
            <option value="Question">Question</option>
            <option value="Task">Task</option>
          </select>
        </div>

        <div className="form-group flex-1">
          <label className="form-label">Priority</label>
          <select
            className="form-control-select"
            value={metadata.priority}
            onChange={(e) => onUpdateMetadata('priority', e.target.value)}
          >
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
}
