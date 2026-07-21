import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import FooterBar from './components/FooterBar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [activeTicketId, setActiveTicketId] = useState(1234);

  const [tickets, setTickets] = useState([
    {
      id: 1234,
      ticketId: '1234',
      customerName: 'Riley Green (CISO)',
      lastMessage: 'Unauthorized Admin Access Attempt Detected',
      channel: 'SecOps Signal',
      status: 'Containing Threat',
      customer: {
        name: 'Riley Green',
        email: 'rgreen@enterprise-sec.org',
        phone: '+1 (415) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        badges: ['CISO', 'SecOps Tier-1', 'Admin'],
        visitorPath: [
          { title: 'SIEM Anomaly Alert #SOC-882', timestamp: 'Less than a minute ago', source: 'SOC Monitor' },
          { title: 'Firewall Rule Triggered', timestamp: 'Jun 10, 2026 9:02 AM', source: 'Firewall Log' }
        ]
      },
      metadata: {
        assignee: 'SecOps/Alex Knapp',
        form: 'Cyber Incident Form',
        tags: ['cyber-security', 'unauthorized-access', 'critical-node'],
        orderStatus: 'Containing Threat',
        type: 'Security Breach',
        priority: 'Critical'
      },
      timelineEvents: [
        {
          id: 1,
          type: 'system_event',
          eventKind: 'alert',
          content: 'SIEM Alert #SOC-882: Anomaly detected on Authentication Server (IP: 192.168.1.45)',
          timestamp: 'Jun 10, 2026 09:00 AM'
        },
        {
          id: 2,
          type: 'system_event',
          eventKind: 'assign',
          content: 'Incident assigned to SecOps/Alex Knapp • Severity set to Critical (Tier 1)',
          timestamp: 'Jun 10, 2026 09:01 AM'
        },
        {
          id: 3,
          type: 'message',
          author: 'Riley Green (CISO)',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
          channel: 'SecOps Signal',
          timestamp: 'less than a minute ago',
          content: 'We noticed unusual traffic spikes on port 443 and memory dump alerts. Could you confirm if host containment protocols are triggered?',
          isAgent: false
        }
      ]
    },
    {
      id: 1235,
      ticketId: '1235',
      customerName: 'Janae Cole (NetOps)',
      lastMessage: 'DDoS Attack on Gateway Router',
      channel: 'SecOps Signal',
      status: 'Investigating',
      customer: {
        name: 'Janae Cole',
        email: 'jcole@enterprise-sec.org',
        phone: '+1 (415) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        badges: ['Network Engineer'],
        visitorPath: [
          { title: 'Gateway Router Packet Flood', timestamp: '10 minutes ago', source: 'Router Log' }
        ]
      },
      metadata: {
        assignee: 'SecOps/Alex Knapp',
        form: 'DDoS & Network Outage',
        tags: ['ddos', 'network-outage'],
        orderStatus: 'Investigating SIEM Logs',
        type: 'Network Outage',
        priority: 'High'
      },
      timelineEvents: [
        {
          id: 1,
          type: 'message',
          author: 'Janae Cole',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
          channel: 'SecOps Signal',
          timestamp: '5 minutes ago',
          content: 'High SYN flood volume detected on perimeter gateway router. Scrubbing center route activated.',
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
      customerName: 'SecOps Reporter',
      lastMessage: 'New cyber incident reported...',
      channel: 'SecOps Signal',
      status: 'New Alert',
      customer: {
        name: 'SecOps Reporter',
        email: 'analyst@enterprise-sec.org',
        phone: '+1 (555) 000-0000',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        badges: ['Analyst'],
        visitorPath: [{ title: 'SIEM Incident Created', timestamp: 'Just now', source: 'SOC' }]
      },
      metadata: {
        assignee: 'SecOps/Alex Knapp',
        form: 'Cyber Incident Form',
        tags: ['new-threat'],
        orderStatus: 'Investigating SIEM Logs',
        type: 'Security Breach',
        priority: 'High'
      },
      timelineEvents: [
        {
          id: 1,
          type: 'system_event',
          eventKind: 'alert',
          content: 'New cyber incident ticket initiated.',
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
                content: `Cyber Incident status updated to ${newStatus}`,
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
    handleStatusChange('Host Isolated & Mitigated');
  };

  return (
    <div className="app-container">
      {/* Sleek Sidebar Navigation */}
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

        {/* Cyber Incident Interface Grid */}
        <main className="workspace-grid">

          {/* Right Panel: Reporter Details & SOC Audit Path */}
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
