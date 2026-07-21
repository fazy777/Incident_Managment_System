import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import IncidentMetadata from './components/IncidentMetadata';
import IncidentTimeline from './components/IncidentTimeline';
import CustomerDetails from './components/CustomerDetails';
import FooterBar from './components/FooterBar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [activeTicketId, setActiveTicketId] = useState(1234);

  const [tickets, setTickets] = useState([
    {
      id: 1234,
      ticketId: '1234',
      customerName: 'Riley Green',
      lastMessage: 'Hello, can you help me?',
      channel: 'WhatsApp',
      status: 'Open',
      customer: {
        name: 'Riley Green',
        email: 'rgreen@work.com',
        phone: '+1 (415) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        badges: ['premium', 'priority shopping'],
        visitorPath: [
          { title: 'Tracking the status of your order', timestamp: 'Less than a minute ago', source: 'Chat widget' },
          { title: 'Contact us', timestamp: 'Jun 10, 2026 9:02 AM', source: 'Chat widget' }
        ]
      },
      metadata: {
        assignee: 'Support/Alex Knapp',
        form: 'Regular Form',
        tags: ['vip', 'order', 'delivery'],
        orderStatus: 'Shipped',
        type: 'Problem',
        priority: 'Normal'
      },
      timelineEvents: [
        {
          id: 1,
          type: 'system_event',
          eventKind: 'alert',
          content: 'Incident Ticket #1234 created via WhatsApp Integration',
          timestamp: 'Jun 10, 2026 09:00 AM'
        },
        {
          id: 2,
          type: 'system_event',
          eventKind: 'assign',
          content: 'Ticket assigned to Support/Alex Knapp • Priority set to Normal',
          timestamp: 'Jun 10, 2026 09:01 AM'
        },
        {
          id: 3,
          type: 'message',
          author: 'Riley Green',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
          channel: 'WhatsApp',
          timestamp: 'less than a minute ago',
          content: 'Great. Could you send me an email receipt for my records?',
          isAgent: false
        }
      ]
    },
    {
      id: 1235,
      ticketId: '1235',
      customerName: 'Janae Cole',
      lastMessage: 'Hello, I ordered a pair o...',
      channel: 'WhatsApp',
      status: 'Pending',
      customer: {
        name: 'Janae Cole',
        email: 'jcole@work.com',
        phone: '+1 (415) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        badges: ['standard'],
        visitorPath: [
          { title: 'Viewed Product Catalogue', timestamp: '10 minutes ago', source: 'Web Portal' }
        ]
      },
      metadata: {
        assignee: 'Support/Alex Knapp',
        form: 'Regular Form',
        tags: ['order', 'refund'],
        orderStatus: 'Processing',
        type: 'Question',
        priority: 'Low'
      },
      timelineEvents: [
        {
          id: 1,
          type: 'message',
          author: 'Janae Cole',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
          channel: 'WhatsApp',
          timestamp: '5 minutes ago',
          content: 'Hello, I ordered a pair of shoes last week and need an update.',
          isAgent: false
        }
      ]
    }
  ]);

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const handleAddTimelineEvent = (newEvent) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === activeTicket.id) {
          return {
            ...t,
            timelineEvents: [...t.timelineEvents, newEvent]
          };
        }
        return t;
      })
    );
  };

  const handleUpdateMetadata = (field, value) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === activeTicket.id) {
          return {
            ...t,
            metadata: {
              ...t.metadata,
              [field]: value
            }
          };
        }
        return t;
      })
    );
  };

  const handleAddTicket = () => {
    const newId = Date.now();
    const newTicket = {
      id: newId,
      ticketId: `${newId}`.slice(-4),
      customerName: 'New Requester',
      lastMessage: 'New ticket opened...',
      channel: 'WhatsApp',
      status: 'New',
      customer: {
        name: 'New Requester',
        email: 'user@example.com',
        phone: '+1 (555) 000-0000',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        badges: ['new-user'],
        visitorPath: [{ title: 'Opened Chat Widget', timestamp: 'Just now', source: 'Chat' }]
      },
      metadata: {
        assignee: 'Support/Alex Knapp',
        form: 'Regular Form',
        tags: ['new'],
        orderStatus: 'Pending',
        type: 'Problem',
        priority: 'Normal'
      },
      timelineEvents: [
        {
          id: 1,
          type: 'system_event',
          eventKind: 'alert',
          content: 'New incident ticket initiated.',
          timestamp: 'Just now'
        }
      ]
    };
    setTickets([...tickets, newTicket]);
    setActiveTicketId(newId);
  };

  const handleStatusChange = (newStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === activeTicket.id) {
          return {
            ...t,
            status: newStatus,
            timelineEvents: [
              ...t.timelineEvents,
              {
                id: Date.now(),
                type: 'system_event',
                eventKind: 'status',
                content: `Ticket status updated to ${newStatus}`,
                timestamp: 'Just now'
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleEndChat = () => {
    handleStatusChange('Solved');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="main-layout">
        {/* Top Header Navbar */}
        <Navbar
          activeTicketId={activeTicketId}
          setActiveTicketId={setActiveTicketId}
          tickets={tickets}
          onAddTicket={handleAddTicket}
        />

        {/* Sub Header Breadcrumb */}
        <SubHeader ticket={activeTicket} />

        {/* Workspace Grid Area */}
        <main className="workspace-grid">
          {/* Left Panel: Ticket Metadata */}
          <IncidentMetadata
            metadata={activeTicket.metadata}
            onUpdateMetadata={handleUpdateMetadata}
          />

          {/* Middle Panel: Incident Timeline */}
          <IncidentTimeline
            ticket={activeTicket}
            timelineEvents={activeTicket.timelineEvents}
            onAddTimelineEvent={handleAddTimelineEvent}
          />

          {/* Right Panel: Customer Info & Visitor Path */}
          <CustomerDetails customer={activeTicket.customer} />
        </main>

        {/* Bottom Persistent Action Footer Bar */}
        <FooterBar
          ticketStatus={activeTicket.status}
          onStatusChange={handleStatusChange}
          onEndChat={handleEndChat}
        />
      </div>
    </div>
  );
}

export default App;
