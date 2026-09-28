import React from 'react';
import { EventItem, EventRegistration, NotificationItem } from '../types';
import { LayoutDashboard, Calendar, BookmarkCheck, Bell, User, Award, Clock, MapPin, LogOut } from 'lucide-react';
import { Card, Badge, Button } from './ui';

interface ParticipantPortalProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  events: EventItem[];
  registrations: EventRegistration[];
  notifications: NotificationItem[];
  onOpenRegisterModal: (event: EventItem) => void;
  onLogout: () => void;
}

export const ParticipantPortal: React.FC<ParticipantPortalProps> = ({
  currentTab,
  onNavigateTab,
  events,
  registrations,
  notifications,
  onOpenRegisterModal,
  onLogout
}) => {
  const userProfile = {
    name: 'Karthik Raja',
    email: 'karthik.r@git.edu',
    collegeId: 'GIT2023CSE042',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'Python', 'Machine Learning', 'Docker'],
    eventsAttended: 8,
    certificatesEarned: 3
  };

  const myRegistrations = registrations.filter((r) => r.userName === userProfile.name || true);

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
              <Badge variant="indigo">Student</Badge>
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
            { id: 'my-regs', label: 'My Registrations', icon: BookmarkCheck },
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

      {/* TAB CONTENT 1: DASHBOARD */}
      {currentTab === 'dash' && (
        <div className="space-y-8">
          {/* Summary KPI Cards with pastel tones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card tone="sky" className="p-5 space-y-1">
              <span className="text-[10px] font-mono text-[var(--ink)] uppercase font-semibold">
                Upcoming Events
              </span>
              <div className="text-3xl font-extrabold font-mono text-[var(--ink)]">3</div>
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
                  .filter((e) => e.status === 'Upcoming' || e.status === 'Published')
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

            {/* Participation History & Certificates */}
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

      {/* TAB CONTENT 2: EXPLORE EVENTS */}
      {currentTab === 'explore' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[var(--ink)]">All Events for Students</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e, idx) => (
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

      {/* TAB CONTENT 3: MY REGISTRATIONS */}
      {currentTab === 'my-regs' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[var(--ink)]">My Registered Passes</h3>
          <div className="space-y-4">
            {myRegistrations.map((reg) => (
              <Card key={reg.id} className="p-5 flex items-center justify-between">
                <div>
                  <Badge variant="emerald" withDot>
                    {reg.status}
                  </Badge>
                  <h4 className="text-base font-bold text-[var(--ink)] mt-1.5">{reg.eventTitle}</h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Registered on: {reg.registrationDate} • Ticket ID: {reg.ticketId}
                  </p>
                </div>
                <Badge variant="indigo">Verified Seat</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: NOTIFICATIONS */}
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

      {/* TAB CONTENT 5: PROFILE */}
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
              {userProfile.skills.map((sk, idx) => (
                <Badge key={idx} variant="amber">
                  {sk}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
