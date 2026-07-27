import React, { useState } from 'react';
import { 
  UserCheck, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Filter, 
  Radio, 
  ArrowRightLeft, 
  Users,
  Send,
  CheckCircle2,
  BellRing
} from 'lucide-react';

const INITIAL_ROSTER = [
  {
    id: 'ENG-101',
    name: 'Sarah Jenkins',
    role: 'Primary On-Call Responder',
    team: 'Security Ops',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    email: 's.jenkins@secops.io',
    phone: '+1 (555) 234-8901',
    shift: '08:00 - 16:00 UTC',
    status: 'Active',
    level: 'Tier 1 Responder',
    slaTarget: '< 5 min response',
    activeIncidentsCount: 2
  },
  {
    id: 'ENG-102',
    name: 'David Chen',
    role: 'Secondary On-Call Support',
    team: 'DevOps / Infra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    email: 'd.chen@secops.io',
    phone: '+1 (555) 876-5432',
    shift: '08:00 - 16:00 UTC',
    status: 'Standby',
    level: 'Tier 2 Escalation',
    slaTarget: '< 15 min response',
    activeIncidentsCount: 0
  },
  {
    id: 'ENG-103',
    name: 'Elena Rostova',
    role: 'Incident Commander',
    team: 'Platform Reliability',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    email: 'e.rostova@secops.io',
    phone: '+1 (555) 345-6789',
    shift: '24/7 Escalation Lead',
    status: 'Active',
    level: 'Tier 3 Management',
    slaTarget: '< 30 min response',
    activeIncidentsCount: 1
  },
  {
    id: 'ENG-104',
    name: 'Marcus Vance',
    role: 'Database Reliability Engineer',
    team: 'Data Infra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    email: 'm.vance@secops.io',
    phone: '+1 (555) 987-6543',
    shift: '16:00 - 00:00 UTC',
    status: 'Off Duty',
    level: 'Tier 2 Specialist',
    slaTarget: '< 15 min response',
    activeIncidentsCount: 0
  },
  {
    id: 'ENG-105',
    name: 'Amara Oke',
    role: 'Network & Cloud Security Specialist',
    team: 'Security Ops',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
    email: 'a.oke@secops.io',
    phone: '+1 (555) 456-7890',
    shift: '00:00 - 08:00 UTC',
    status: 'Scheduled',
    level: 'Tier 1 Responder',
    slaTarget: '< 5 min response',
    activeIncidentsCount: 0
  }
];

export default function OnCallView({ onToast }) {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All');
  const [pagingModalEngineer, setPagingModalEngineer] = useState(null);
  const [pagingReason, setPagingReason] = useState('');
  const [swapModalEngineer, setSwapModalEngineer] = useState(null);

  // Filter roster engineers
  const filteredRoster = roster.filter((eng) => {
    const matchesSearch = eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          eng.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          eng.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeamFilter === 'All' || eng.team === selectedTeamFilter;
    return matchesSearch && matchesTeam;
  });

  const handleSendPage = (e) => {
    e.preventDefault();
    if (!pagingReason.trim()) return;
    onToast(`Urgent PagerDuty alert sent to ${pagingModalEngineer.name} for: "${pagingReason}"`);
    setPagingModalEngineer(null);
    setPagingReason('');
  };

  const handleSwapShift = (engId) => {
    setRoster(prev => prev.map(eng => {
      if (eng.id === engId) {
        const isPrimary = eng.role.includes('Primary');
        return {
          ...eng,
          role: isPrimary ? 'Secondary On-Call Support' : 'Primary On-Call Responder',
          status: 'Active'
        };
      }
      return eng;
    }));
    onToast(`Shift swapped successfully for engineer ${engId}!`);
    setSwapModalEngineer(null);
  };

  return (
    <div className="analytics-view-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck color="#0284c7" size={24} />
            On-Call Duty Roster & Escalation Matrix
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Real-time active duty shifts, incident commander paging, and engineer response SLAs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            padding: '8px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            border: '1px solid #a7f3d0'
          }}>
            <Radio size={14} className="pulse-icon" />
            Active Duty Shift: 24/7 Live
          </div>
        </div>
      </div>

      {/* Primary Responders Live Cards */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellRing size={16} color="#0284c7" />
          Active Incident Commanders & Responders (Current Shift)
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {roster.slice(0, 3).map((eng) => (
            <div key={eng.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <img 
                  src={eng.avatar} 
                  alt={eng.name} 
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{eng.name}</h4>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: eng.status === 'Active' ? '#ecfdf5' : '#fff7ed',
                      color: eng.status === 'Active' ? '#047857' : '#c2410c',
                      border: `1px solid ${eng.status === 'Active' ? '#a7f3d0' : '#fed7aa'}`
                    }}>
                      ● {eng.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#0284c7', marginTop: '2px' }}>{eng.role}</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{eng.team} • {eng.shift}</p>
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  SLA: <strong style={{ color: '#0f172a' }}>{eng.slaTarget}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setPagingModalEngineer(eng)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                    }}>
                    <PhoneCall size={13} />
                    Page Now
                  </button>

                  <button 
                    onClick={() => setSwapModalEngineer(eng)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                    <ArrowRightLeft size={13} />
                    Swap Shift
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roster Table Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search engineer, role, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="#64748b" />
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  color: '#334155'
                }}
              >
                <option value="All">All Teams</option>
                <option value="Security Ops">Security Ops</option>
                <option value="DevOps / Infra">DevOps / Infra</option>
                <option value="Platform Reliability">Platform Reliability</option>
                <option value="Data Infra">Data Infra</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Showing <strong>{filteredRoster.length}</strong> of {roster.length} On-Call Responders
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '600' }}>
                <th style={{ padding: '12px 14px' }}>Engineer</th>
                <th style={{ padding: '12px 14px' }}>Role & Team</th>
                <th style={{ padding: '12px 14px' }}>Shift Hours</th>
                <th style={{ padding: '12px 14px' }}>Escalation Tier</th>
                <th style={{ padding: '12px 14px' }}>SLA Target</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((eng) => (
                <tr key={eng.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={eng.avatar} 
                        alt={eng.name} 
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{eng.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{eng.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>{eng.role}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{eng.team}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} color="#64748b" />
                      {eng.shift}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontWeight: '600'
                    }}>
                      {eng.level}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#0284c7', fontWeight: '600' }}>
                    {eng.slaTarget}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: eng.status === 'Active' ? '#ecfdf5' : eng.status === 'Standby' ? '#eff6ff' : '#f8fafc',
                      color: eng.status === 'Active' ? '#047857' : eng.status === 'Standby' ? '#1d4ed8' : '#64748b',
                      border: `1px solid ${eng.status === 'Active' ? '#a7f3d0' : eng.status === 'Standby' ? '#bfdbfe' : '#e2e8f0'}`
                    }}>
                      {eng.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => setPagingModalEngineer(eng)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Ping Engineer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paging Modal */}
      {pagingModalEngineer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={18} color="#ef4444" />
              Dispatch Page: {pagingModalEngineer.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              This will trigger a high-priority PagerDuty / SMS push alert to {pagingModalEngineer.role} ({pagingModalEngineer.phone}).
            </p>

            <form onSubmit={handleSendPage}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Incident Description & Reason for Page *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Critical API high latency incident #INC-2045 requires immediate database review."
                  value={pagingReason}
                  onChange={(e) => setPagingReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPagingModalEngineer(null)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={14} />
                  Send Pager Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shift Swap Modal */}
      {swapModalEngineer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowRightLeft size={18} color="#0284c7" />
              Confirm Shift Swap
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
              Are you sure you want to promote <strong>{swapModalEngineer.name}</strong> to Primary On-Call Responder for this shift?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSwapModalEngineer(null)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSwapShift(swapModalEngineer.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirm Shift Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
