import React, { useState } from 'react';
import { Filter, Clock, MoreVertical, Send, MessageSquare, ShieldAlert, CheckCircle2, UserCheck, Paperclip } from 'lucide-react';

export default function IncidentTimeline({ ticket, timelineEvents, onAddTimelineEvent }) {
  const [newNote, setNewNote] = useState('');
  const [channel, setChannel] = useState('WhatsApp');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    onAddTimelineEvent({
      id: Date.now(),
      type: 'message',
      author: 'Support Agent (Alex Knapp)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      channel: channel,
      timestamp: 'Just now',
      content: newNote,
      isAgent: true
    });

    setNewNote('');
  };

  return (
    <div className="incident-timeline-panel">
      {/* Panel Top Bar */}
      <div className="timeline-header">
        <div className="timeline-title-area">
          <h2 className="timeline-title">Conversation with {ticket.customerName}</h2>
          <span className="channel-tag">via {ticket.channel || 'WhatsApp'}</span>
          <span className="status-badge-active">
            <span className="dot"></span> Active
          </span>
        </div>

        <div className="timeline-actions">
          <button className="icon-action-btn" title="Filter Timeline">
            <Filter size={16} />
          </button>
          <button className="icon-action-btn" title="Activity History">
            <Clock size={16} />
          </button>
          <button className="icon-action-btn" title="More Actions">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Timeline Stream Feed */}
      <div className="timeline-stream">
        {timelineEvents.map((event) => {
          if (event.type === 'system_event') {
            return (
              <div key={event.id} className="timeline-system-event">
                <div className="system-event-icon">
                  {event.eventKind === 'assign' && <UserCheck size={14} />}
                  {event.eventKind === 'status' && <CheckCircle2 size={14} />}
                  {event.eventKind === 'alert' && <ShieldAlert size={14} />}
                </div>
                <div className="system-event-text">{event.content}</div>
                <div className="system-event-time">{event.timestamp}</div>
              </div>
            );
          }

          return (
            <div
              key={event.id}
              className={`timeline-message-card ${event.isAgent ? 'agent-card' : 'customer-card'}`}
            >
              <div className="message-avatar">
                <img src={event.avatar} alt={event.author} />
              </div>
              <div className="message-content-wrapper">
                <div className="message-header-row">
                  <span className="message-author">{event.author}</span>
                  {event.channel && (
                    <span className="message-via">via {event.channel}</span>
                  )}
                  <span className="message-time">{event.timestamp}</span>
                </div>
                <div className="message-body">{event.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply / Note Editor Input Box */}
      <div className="timeline-editor">
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-toolbar">
            <select
              className="channel-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="WhatsApp">💬 WhatsApp</option>
              <option value="Internal Note">🔒 Internal Note</option>
              <option value="Email">✉️ Public Email</option>
            </select>
            <span className="editor-hint">Replying to {ticket.customerName}</span>
          </div>

          <textarea
            className="editor-textarea"
            placeholder={`Type response via ${channel} or add internal note...`}
            rows={3}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          ></textarea>

          <div className="editor-footer-controls">
            <button type="button" className="attach-btn" title="Attach file">
              <Paperclip size={16} /> Attach File
            </button>
            <button type="submit" className="send-btn">
              <Send size={15} /> Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
