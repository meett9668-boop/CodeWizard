import { isSameEmail } from '../utils/identity';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { EventItem, EventRegistration, NotificationItem, TicketData } from '../types';
import {
  LayoutDashboard, Calendar, BookmarkCheck, Bell, User, Award, Clock,
  MapPin, LogOut, RefreshCw, Ticket as TicketIcon, Download, Printer, ExternalLink,
  ChevronRight, Sparkles, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { Card, Badge, Button } from './ui';
import {
  manualDownloadTicket,
  printTicketPass,
  generateIcsCalendar,
  createGoogleCalendarUrl
} from '../utils/ticketGenerator';

interface ParticipantPortalProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  events: EventItem[];
  registrations: EventRegistration[];
  notifications: NotificationItem[];
  currentUserEmail?: string;
  onOpenRegisterModal: (event: EventItem) => void;
  onLogout: () => void;
  onResetData?: () => void;
}

export const ParticipantPortal: React.FC<ParticipantPortalProps> = ({
  currentTab,
  onNavigateTab,
  events,
  registrations,
  notifications,
  currentUserEmail = 'karthik.r@git.edu',
  onOpenRegisterModal,
  onLogout
}) => {
  const [selectedTicketModal, setSelectedTicketModal] = useState<EventRegistration | null>(null);

  const userProfile = {
    name: 'Karthik Raja',
    email: currentUserEmail,
    collegeId: 'GIT2023CSE042',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'Python', 'Machine Learning', 'Docker'],
    eventsAttended: registrations.filter(r => r.attendance === 'Attended').length + 8,
    certificatesEarned: 3
  };

  const [exploreSearch, setExploreSearch] = useState('');
  const [regsSearch, setRegsSearch] = useState('');

  // Filter registrations matching current participant email
  const myRegistrations = registrations.filter(
    (r) => isSameEmail(r.userEmail, currentUserEmail)
  );

  return (
    <div className="space-y-8">
      {/* Participant Navigation Header */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-10 h-10 rounded-xl object-cover border border-[var(--ink)]"
          />
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5 text-[var(--ink)]">
              Welcome, {userProfile.name}
              <Badge variant="indigo">Verified Participant</Badge>
            </h2>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">
              {userProfile.collegeId} • {userProfile.branch}
            </p>
          </div>
        </div>

        {/* Tab Links as Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {[
            { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'explore', label: 'Explore Events', icon: Calendar },
            { id: 'my-regs', label: 'My Registrations', icon: BookmarkCheck, count: myRegistrations.length },
            { id: 'my-tickets', label: 'My Tickets', icon: TicketIcon, count: myRegistrations.length },
            { id: 'my-participation', label: 'My Participation', icon: Award },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateTab(tab.id)}
              className={`filter-pill flex items-center gap-1.5 ${
                currentTab === tab.id ? 'active' : ''
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--coral)]/20 text-[var(--coral)] font-mono font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
        </Button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {currentTab === 'dash' && (
        <div className="space-y-8">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card tone="sky" className="p-5 space-y-1">
              <span className="text-[10px] font-mono text-[var(--ink)] uppercase font-semibold">
                Available Events
              </span>
              <div className="text-3xl font-extrabold font-mono text-[var(--ink)]">
                {events.filter(e => e.status === 'Registration Open' || e.status === 'Upcoming' || e.status === 'Published').length}
              </div>
            </Card>
            <Card tone="lavender" className="p-5 space-y-1">
              <span className="text-[10px] font-mono text-[var(--ink)] uppercase font-semibold">
                Registered Events
              </span>
              <div className="text-3xl font-extrabold font-mono text-[var(--ink)]">
                {myRegistrations.length}
              </div>
            </Card>
            <Card tone="yellow" className="p-5 space-y-1">
              <span className="text-[10px] font-mono text-[var(--ink)] uppercase font-semibold">
                Events Attended
              </span>
              <div className="text-3xl font-extrabold font-mono text-[var(--ink)]">
                {userProfile.eventsAttended}
              </div>
            </Card>
            <Card className="p-5 space-y-1 bg-white">
              <span className="text-[10px] font-mono text-[var(--ink)] uppercase font-semibold">
                Certificates
              </span>
              <div className="text-3xl font-extrabold font-mono text-[var(--coral)]">
                {userProfile.certificatesEarned}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Upcoming Featured Events */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--ink)]">
                <Calendar className="w-5 h-5 text-[var(--coral)]" /> Upcoming Events Recommended For You
              </h3>

              <div className="space-y-4">
                {events
                  .filter((e) => e.status === 'Registration Open' || e.status === 'Published' || e.status === 'Upcoming')
                  .slice(0, 3)
                  .map((ev, idx) => (
                    <div
                      key={ev.id}
                      className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={ev.poster}
                          alt={ev.title}
                          className="w-16 h-16 rounded-xl object-cover border border-[var(--border-subtle)]"
                        />
                        <div>
                          <Badge variant={idx % 2 === 0 ? 'amber' : 'indigo'} withDot>
                            {ev.category}
                          </Badge>
                          <h4 className="text-base font-bold text-[var(--ink)] mt-1">{ev.title}</h4>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                            {ev.date} • {ev.venue}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenRegisterModal(ev)}
                        className="whitespace-nowrap"
                      >
                        Register Now
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Participation History & Credentials */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--ink)]">
                <Award className="w-5 h-5 text-[var(--coral)]" /> Credentials
              </h3>

              <Card className="p-5 space-y-3">
                {[
                  { title: 'Cloud Native & K8s Bootcamp', date: 'Sept 2026', type: 'Certificate of Excellence' },
                  { title: 'Smart India Hackathon Qualifier', date: 'Dec 2025', type: 'Finalist Credential' },
                  { title: 'Full Stack Web Bootcamp', date: 'Aug 2025', type: 'Completion Certificate' }
                ].map((c, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--coral)] font-bold">
                      <span>{c.type}</span>
                      <span>{c.date}</span>
                    </div>
                    <div className="text-xs font-bold text-[var(--ink)]">{c.title}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPLORE EVENTS */}
      {currentTab === 'explore' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-[var(--ink)]">All Events for Students</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title or topic..."
                value={exploreSearch}
                onChange={(e) => setExploreSearch(e.target.value)}
                className="w-full pl-9 pr-3 search-input-pill"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(e => !exploreSearch.trim() || e.title.toLowerCase().includes(exploreSearch.toLowerCase()) || e.description.toLowerCase().includes(exploreSearch.toLowerCase()) || e.category.toLowerCase().includes(exploreSearch.toLowerCase())).map((e, idx) => (
              <Card
                key={e.id}
                tone={idx % 3 === 0 ? 'yellow' : idx % 3 === 1 ? 'lavender' : 'sky'}
                className="p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={e.poster}
                    alt={e.title}
                    className="w-full h-36 object-cover rounded-xl mb-3 border border-[var(--ink)]/20"
                  />
                  <Badge variant="indigo">{e.category}</Badge>
                  <h4 className="text-lg font-bold text-[var(--ink)] mt-2">{e.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">{e.description}</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenRegisterModal(e)}
                  className="w-full mt-3"
                >
                  Register Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY REGISTRATIONS */}
      {currentTab === 'my-regs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-[var(--ink)]">My Registered Passes</h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {myRegistrations.length} Active Records
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter your passes..."
                value={regsSearch}
                onChange={(e) => setRegsSearch(e.target.value)}
                className="w-full pl-9 pr-3 search-input-pill"
              />
            </div>
          </div>

          {myRegistrations.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <p className="text-sm text-[var(--text-muted)]">You have not registered for any events yet.</p>
              <Button variant="primary" size="sm" onClick={() => onNavigateTab('explore')}>
                Explore Events Now
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {myRegistrations.filter(r => !regsSearch.trim() || r.eventTitle.toLowerCase().includes(regsSearch.toLowerCase()) || r.ticketId.toLowerCase().includes(regsSearch.toLowerCase())).map((reg) => {
                const ev = events.find(e => e.id === reg.eventId);
                const ticketData: TicketData = {
                  ticketId: reg.ticketId,
                  registrationId: reg.id,
                  participantName: reg.userName,
                  participantEmail: reg.userEmail,
                  studentId: reg.studentId,
                  branch: reg.branch,
                  year: reg.year,
                  eventName: reg.eventTitle,
                  eventDate: ev?.date || '2026-10-15',
                  eventTime: ev?.time || '10:00 AM',
                  eventVenue: ev?.venue || 'Campus Auditorium',
                  registrationDate: reg.registrationDate,
                  status: reg.status,
                  generatedAt: reg.ticketGeneratedAt
                };

                return (
                  <Card key={reg.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={reg.status === 'Confirmed' ? 'emerald' : 'amber'} withDot>
                          {reg.status}
                        </Badge>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          Attendance: {reg.attendance}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--ink)]">{reg.eventTitle}</h4>
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        Date: {ev?.date || 'Upcoming'} • Venue: {ev?.venue || 'Campus'} • Pass Code: {reg.ticketId}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicketModal(reg)}
                        className="text-xs flex items-center gap-1"
                      >
                        <TicketIcon className="w-3.5 h-3.5" /> View Pass
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => manualDownloadTicket(ticketData)}
                        className="text-xs flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Pass
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY TICKETS (Dedicated Pass View) */}
      {currentTab === 'my-tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--ink)]">My Digital Event Passes</h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Official QR Entry Passes
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {myRegistrations.map((reg) => {
              const ev = events.find(e => e.id === reg.eventId);
              const ticketData: TicketData = {
                ticketId: reg.ticketId,
                registrationId: reg.id,
                participantName: reg.userName,
                participantEmail: reg.userEmail,
                studentId: reg.studentId,
                branch: reg.branch,
                year: reg.year,
                eventName: reg.eventTitle,
                eventDate: ev?.date || '2026-10-15',
                eventTime: ev?.time || '10:00 AM',
                eventVenue: ev?.venue || 'Campus Auditorium',
                registrationDate: reg.registrationDate,
                status: reg.status,
                generatedAt: reg.ticketGeneratedAt
              };

              return (
                <div key={reg.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-lg space-y-4">
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                        G
                      </div>
                      <span className="font-mono text-xs font-bold tracking-wider">PARTICIPATION PASS</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-indigo-700">
                      {reg.status}
                    </span>
                  </div>

                  <div className="px-5 space-y-3">
                    <h4 className="text-base font-bold text-[var(--ink)]">{reg.eventTitle}</h4>
                    <div className="text-xs text-[var(--text-muted)] font-mono space-y-1">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> <span>{ev?.date || '2026-10-15'} ({ev?.time || '10:00 AM'})</span></div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-pink-400" /> <span>{ev?.venue || 'Campus Auditorium'}</span></div>
                      <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-emerald-400" /> <span>{reg.userName} ({reg.studentId || 'ID-VERIFIED'})</span></div>
                      <div className="text-indigo-400 font-bold pt-1">Pass ID: {reg.ticketId}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
                    <button
                      onClick={() => manualDownloadTicket(ticketData)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Pass
                    </button>
                    <button
                      onClick={() => printTicketPass(ticketData)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-card)] flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                    <button
                      onClick={() => generateIcsCalendar(ticketData)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-card)] flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> .ICS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: MY PARTICIPATION */}
      {currentTab === 'my-participation' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[var(--ink)]">Participation & Attendance Records</h3>
          <Card className="p-6 space-y-4">
            <div className="text-xs font-mono text-[var(--text-muted)]">
              Verified Attendance Logs recorded at event gate check-in desks:
            </div>

            <div className="space-y-3">
              {myRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[var(--ink)]">{reg.eventTitle}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">Registered: {reg.registrationDate}</div>
                  </div>
                  <Badge variant={reg.attendance === 'Attended' ? 'emerald' : 'neutral'} withDot>
                    {reg.attendance === 'Attended' ? 'Attendance Recorded' : 'Gate Scan Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: NOTIFICATIONS */}
      {currentTab === 'notifications' && (
        <div className="space-y-4 max-w-3xl">
          <h3 className="text-xl font-bold text-[var(--ink)]">Notifications</h3>
          {notifications.map((n) => (
            <Card key={n.id} className="p-4 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-[var(--coral)]">{n.title}</span>
                <span className="text-[var(--text-muted)]">{n.timestamp}</span>
              </div>
              <p className="text-xs text-[var(--text-main)]">{n.message}</p>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 7: PROFILE */}
      {currentTab === 'profile' && (
        <Card className="p-8 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--ink)]"
            />
            <div>
              <h3 className="text-2xl font-bold text-[var(--ink)]">{userProfile.name}</h3>
              <p className="text-xs font-mono text-[var(--coral)]">{userProfile.email}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {userProfile.branch} • {userProfile.year}
              </p>
              <p className="text-xs text-[var(--text-muted)] font-mono">ID: {userProfile.collegeId}</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
            <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">
              Technical Skills & Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((s) => (
                <Badge key={s} variant="indigo">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Inspection Modal for Individual Ticket Pass */}
      {selectedTicketModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-md space-y-4 relative border-2 border-indigo-500/40">
            <button
              onClick={() => setSelectedTicketModal(null)}
              className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold">Participation Pass Details</h3>
              <p className="text-xs text-[var(--text-muted)]">{selectedTicketModal.eventTitle}</p>
            </div>
            <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-2 font-mono text-xs">
              <div>Attendee: <strong>{selectedTicketModal.userName}</strong></div>
              <div>Student ID: <strong>{selectedTicketModal.studentId || 'GIT-VERIFIED'}</strong></div>
              <div>Pass ID: <strong className="text-indigo-400">{selectedTicketModal.ticketId}</strong></div>
              <div>Status: <span className="text-emerald-400 font-bold">{selectedTicketModal.status}</span></div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  const ev = events.find(e => e.id === selectedTicketModal.eventId);
                  manualDownloadTicket({
                    ticketId: selectedTicketModal.ticketId,
                    registrationId: selectedTicketModal.id,
                    participantName: selectedTicketModal.userName,
                    participantEmail: selectedTicketModal.userEmail,
                    studentId: selectedTicketModal.studentId,
                    eventName: selectedTicketModal.eventTitle,
                    eventDate: ev?.date || '2026-10-15',
                    eventTime: ev?.time || '10:00 AM',
                    eventVenue: ev?.venue || 'Campus Auditorium',
                    registrationDate: selectedTicketModal.registrationDate,
                    status: selectedTicketModal.status,
                    generatedAt: selectedTicketModal.ticketGeneratedAt
                  });
                }}
                className="w-full text-xs"
              >
                <Download className="w-4 h-4 mr-1" /> Download Pass
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
