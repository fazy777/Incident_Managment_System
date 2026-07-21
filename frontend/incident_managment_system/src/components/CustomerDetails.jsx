import React, { useState } from 'react';
import { Mail, Phone, User, Edit3, MoreVertical, ChevronDown, Filter, RotateCw, ExternalLink } from 'lucide-react';

export default function CustomerDetails({ customer }) {
  const [noteText, setNoteText] = useState('');

  return (
    <div className="customer-details-panel">
      {/* Profile Header */}
      <div className="customer-profile-card">
        <div className="customer-avatar-large">
          <img src={customer.avatar} alt={customer.name} />
        </div>

        <div className="customer-info-header">
          <div className="name-row">
            <h3 className="customer-name">{customer.name}</h3>
            <button className="icon-btn-sm" title="Edit Customer">
              <Edit3 size={14} />
            </button>
            <button className="icon-btn-sm" title="Options">
              <MoreVertical size={14} />
            </button>
          </div>

          <div className="customer-contact-list">
            <div className="contact-item">
              <Mail size={14} /> <span>{customer.email}</span>
            </div>
            <div className="contact-item">
              <Phone size={14} /> <span>{customer.phone}</span>
            </div>
            <div className="contact-item">
              <User size={14} /> <span>{customer.name}</span>
            </div>
          </div>

          <div className="customer-badges">
            {customer.badges.map((badge, i) => (
              <span key={i} className="customer-badge">
                {badge}
              </span>
            ))}
          </div>

          <div className="add-note-box">
            <textarea
              placeholder="Add a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Chat Visitor Path / Timeline Activity */}
      <div className="visitor-path-section">
        <div className="section-title-row">
          <span className="section-title">Chat visitor path</span>
          <ChevronDown size={14} />
        </div>

        <div className="path-timeline-list">
          {customer.visitorPath.map((item, idx) => (
            <div key={idx} className="path-timeline-item">
              <div className="path-bullet"></div>
              <div className="path-details">
                <div className="path-event-title">{item.title}</div>
                <div className="path-meta">
                  {item.timestamp} • {item.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Interactions Accordion */}
      <div className="interactions-section">
        <div className="section-title-row">
          <span className="section-title">Interactions</span>
          <div className="title-actions">
            <Filter size={13} className="clickable-icon" />
            <RotateCw size={13} className="clickable-icon" />
            <ChevronDown size={13} />
          </div>
        </div>

        <div className="interactions-list">
          <div className="interaction-item active-interaction">
            <span className="interaction-badge new">N</span>
            <div className="interaction-info">
              <div className="interaction-title">Conversation with Riley</div>
              <div className="interaction-sub">Active • WhatsApp Channel</div>
            </div>
          </div>

          <div className="interaction-item">
            <span className="interaction-badge solved">S</span>
            <div className="interaction-info">
              <div className="interaction-title">Order Status Query #1182</div>
              <div className="interaction-sub">Solved • Jun 02, 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
