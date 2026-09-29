import React, { useState, useEffect } from 'react';
import { GlobalNavbar } from './components/GlobalNavbar';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { CommitteePage } from './components/CommitteePage';
import { EventsPage } from './components/EventsPage';
import { EventDetailPage } from './components/EventDetailPage';
import { ProjectsPage, FacultyPage, AchievementsPage, HistoryPage, AnnouncementsPage } from './components/PublicSubPages';
import { ParticipantPortal } from './components/ParticipantPortal';
import { CommitteeCommandCenter } from './components/CommitteeCommandCenter';
import { LoginModal, EventRegisterModal, PromotionModal, ReAuthModal } from './components/Modals';
import { RegistrationSuccessModal } from './components/RegistrationSuccessModal';
import { canAccessCommandCenter, canAccessCommandTab, canFacultyApprove } from './utils/permissions';
import { authenticateUser } from './data/authDirectory';
import { normalizeEmail, isSameEmail } from './utils/identity';
import { isRegistrationOpen } from './utils/eventStatus';
import { downloadTicketClientSide } from './utils/ticketGenerator';
import { Button } from './components/ui';
import {
  Home, Calendar, Layers, BookOpen, Users, Megaphone,
  GraduationCap, ShieldCheck, LogOut, LogIn, Search, Bell, Menu, X
} from 'lucide-react';

import {
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_PROJECTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ANNOUNCEMENTS,
  FACULTY_MEMBERS,
  HISTORY_MILESTONES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REGISTRATIONS,
  INITIAL_PROMOTIONS_HISTORY,
  INITIAL_TASKS,
  INITIAL_HANDOVER_RECORDS,
  INITIAL_ACTIVITIES
} from './data/syntheticData';

import {
  Member, EventItem, ProjectItem, AchievementItem, AnnouncementItem,
  EventRegistration, PromotionHistory, Role, CommitteeTask, CommitteeHandoverRecord,
  ActivityItem, TicketData, PromotionRequest, UserSession
} from './types';

// Central localStorage persistence helper (Phase 17)
function useLocalState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(`gitclub_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`gitclub_${key}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [key, state]);

  return [state, setState];
}

export function App() {
  // Theme State (Dark by default)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Navigation State
  // Hash-based Deep Linking & Browser History Navigation (BUG-MED-01)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#[\/]?/, '').trim();
    return hash || 'home';
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Participant Portal Sub-Tab State
  const [participantTab, setParticipantTab] = useState<string>('dash');

  // Committee Command Center Sub-Tab State
  const [commandTab, setCommandTab] = useState<string>('dashboard');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);
  const [completedTicket, setCompletedTicket] = useState<TicketData | null>(null);
  const [reAuthAction, setReAuthAction] = useState<{ actionName: string; desc: string; onVerified: () => void } | null>(null);
  const [promotionRequests, setPromotionRequests] = useLocalState<PromotionRequest[]>('promotion_requests', [
    {
      id: 'pr-1',
      memberId: 'm-6',
      memberName: 'Sneha Patil',
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currentRole: 'Committee Member',
      targetRole: 'Committee Head',
      reason: 'Outstanding performance leading the GIT Hack 2.0 web infrastructure.',
      effectiveDate: '2026-11-01',
      proposedBy: 'Ananya Verma',
      proposedById: 'usr-ananyaverma',
      status: 'Pending Committee Review',
      createdAt: '2026-09-28',
      updatedAt: '2026-09-28'
    }
  ]);

  // Synchronized Datasets with localStorage persistence (Phase 17)
  const [members, setMembers] = useLocalState<Member[]>('members', INITIAL_MEMBERS);
  const [events, setEvents] = useLocalState<EventItem[]>('events', INITIAL_EVENTS);
  const [projects, setProjects] = useLocalState<ProjectItem[]>('projects', INITIAL_PROJECTS);
  const [achievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [announcements, setAnnouncements] = useLocalState<AnnouncementItem[]>('announcements', INITIAL_ANNOUNCEMENTS);
  const [registrations, setRegistrations] = useLocalState<EventRegistration[]>('registrations', INITIAL_REGISTRATIONS);
  const [notifications, setNotifications] = useLocalState('notifications', INITIAL_NOTIFICATIONS);
  const [promotionHistory, setPromotionHistory] = useLocalState<PromotionHistory[]>('promotions_history', INITIAL_PROMOTIONS_HISTORY);
  const [tasks, setTasks] = useLocalState<CommitteeTask[]>('tasks', INITIAL_TASKS);
  const [handoverRecords, setHandoverRecords] = useLocalState<CommitteeHandoverRecord[]>('handover', INITIAL_HANDOVER_RECORDS);
  const [activities, setActivities] = useLocalState<ActivityItem[]>('activities', INITIAL_ACTIVITIES);

  // Modals State
  const [loginModalPortal, setLoginModalPortal] = useState<'participant' | 'committee' | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [promotingMember, setPromotingMember] = useState<Member | null>(null);

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to original defaults? This will clear custom registrations, created events, and nominations.')) {
      const keysToClear = ['members', 'events', 'projects', 'announcements', 'registrations', 'notifications', 'promotions_history', 'tasks', 'handover', 'activities', 'promotion_requests'];
      keysToClear.forEach(k => localStorage.removeItem(`gitclub_${k}`));
      window.location.reload();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gitclub_auth_email');
    sessionStorage.removeItem('gitclub_auth_portal');
    sessionStorage.removeItem('gitclub_session_token');
    setCurrentUser(null);
    setCurrentView('home');
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Theme Toggle Handler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // View Navigation Handler
  // Browser History & Popstate synchronization
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#[\/]?/, '').trim() || 'home';
      // Route protection check on popstate
      if (hash === 'admin-dashboard') {
        const savedEmail = sessionStorage.getItem('gitclub_auth_email');
        const savedPortal = sessionStorage.getItem('gitclub_auth_portal') as any;
        const verified = savedEmail ? authenticateUser(savedEmail, savedPortal) : null;
        if (!verified || !canAccessCommandCenter(verified.role)) {
          setCurrentView(verified ? 'participant-dashboard' : 'home');
          window.location.hash = verified ? '#participant-dashboard' : '#home';
          return;
        }
      }
      setCurrentView(hash);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (view: string, detailId?: string) => {
    setMobileNavOpen(false);
    setCurrentView(view);
    if (detailId) setSelectedEventId(detailId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login Success Handler
  const handleLoginSuccess = (portal: 'participant' | 'committee') => {
    if (portal === 'committee') {
      setCurrentUser({
        id: 'usr-ananyaverma',
        name: 'Ananya Verma',
        email: 'ananya.v@git.edu',
        role: 'Club Head / Admin',
        portal: 'committee'
      });
      setCurrentView('admin-dashboard');
      setCommandTab('dashboard');
    } else {
      setCurrentUser({
        id: 'usr-karthik',
        name: 'Karthik Raja',
        email: 'karthik.r@git.edu',
        role: 'Participant',
        portal: 'participant',
        studentId: 'GIT2023CSE042',
        branch: 'Computer Science & Engineering',
        year: '3rd Year'
      });
      setCurrentView('participant-dashboard');
    }
  };

  // Member Promotion Execution Handler (Phase 4)
  const handleConfirmPromotion = (targetMember: Member, reason: string) => {
    const nextRole = targetMember.promotionRecommendation?.nextRole || 'Committee Head';
    
    // 1. Update Member Record
    setMembers((prev) =>
      prev.map((m) =>
        m.id === targetMember.id
          ? {
              ...m,
              role: nextRole,
              readyForPromotion: false,
              promotionRecommendation: undefined
            }
          : m
      )
    );

    // 2. Append to History Timeline
    const newHistory: PromotionHistory = {
      id: `ph-${Date.now()}`,
      memberId: targetMember.id,
      memberName: targetMember.name,
      memberAvatar: targetMember.avatar,
      fromRole: targetMember.role,
      toRole: nextRole,
      reason: reason,
      date: new Date().toISOString().split('T')[0],
      promotedBy: currentUser?.name || 'Ananya Verma'
    };
    setPromotionHistory((prev) => [newHistory, ...prev]);

    // 3. Activity and Notification
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        action: 'Member Promoted',
        details: `${targetMember.name} promoted from ${targetMember.role} to ${nextRole}`,
        timestamp: 'Just now',
        user: currentUser?.name || 'Ananya Verma',
        category: 'promotion'
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'Promotion Formalized',
        message: `${targetMember.name} has been elevated to ${nextRole}. Governance records updated.`,
        timestamp: 'Just now',
        read: false,
        type: 'promotion'
      },
      ...prev
    ]);
  };

  // Critical Registration Flow with Automatic Ticket Download (Phase 7 & Phase 8)
  const handleConfirmRegistration = (participantData: { name: string; email: string; branch: string; year: string }) => {
    if (!registeringEvent) return;

    // Check duplicate registration
    const alreadyRegistered = registrations.some(
      r => r.eventId === registeringEvent.id && isSameEmail(r.userEmail, participantData.email)
    );
    if (alreadyRegistered) {
      alert('You are already registered for this event!');
      return;
    }

    // Check capacity
    const isFull = registeringEvent.registeredCount >= registeringEvent.capacity;
    const regStatus = isFull ? 'Waitlisted' : 'Confirmed';

    // 1. Update event count
    if (!isFull) {
      setEvents((prev) =>
        prev.map((e) => (e.id === registeringEvent.id ? { ...e, registeredCount: e.registeredCount + 1 } : e))
      );
    }

    // 2. Generate unique Ticket ID
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `GC-GIT-2026-${randomSeq}`;
    const regId = `reg-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const newReg: EventRegistration = {
      id: regId,
      eventId: registeringEvent.id,
      eventTitle: registeringEvent.title,
      userName: participantData.name,
      userEmail: participantData.email,
      branch: participantData.branch,
      year: participantData.year,
      registrationDate: today,
      status: regStatus,
      attendance: 'Pending',
      ticketId: ticketId,
      ticketStatus: 'Generated',
      ticketGeneratedAt: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    setRegistrations((prev) => [newReg, ...prev]);

    // 3. Automatic Participant Ticket Download (Phase 8 Requirement)
    const ticketPayload: TicketData = {
      ticketId: ticketId,
      registrationId: regId,
      participantName: participantData.name,
      participantEmail: participantData.email,
      eventName: registeringEvent.title,
      eventDate: registeringEvent.date,
      eventTime: registeringEvent.time,
      eventVenue: registeringEvent.venue,
      registrationDate: today,
      status: regStatus,
      generatedAt: new Date().toISOString()
    };
    downloadTicketClientSide(ticketPayload);

    // 4. Record Activity and Trigger Notification for Command Center
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        action: 'New Registration Received',
        details: `${participantData.name} registered for ${registeringEvent.title}`,
        timestamp: 'Just now',
        user: participantData.name,
        category: 'registration'
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Event Registration',
        message: `${participantData.name} has reserved a pass for ${registeringEvent.title}. Ticket ${ticketId} issued.`,
        timestamp: 'Just now',
        read: false,
        type: 'registration'
      },
      ...prev
    ]);
    // 5. Present Registration Success Modal with celebration
    setCompletedTicket(ticketPayload);
    setRegisteringEvent(null);
  };


  // Promotion Workflow Step 1: Submit Proposal
  const handleProposalSubmit = (proposal: {
    member: Member;
    targetRole: Member['role'];
    reason: string;
    effectiveDate: string;
  }) => {
    if (!currentUser) return;
    const newReq: PromotionRequest = {
      id: `pr-${Date.now()}`,
      memberId: proposal.member.id,
      memberName: proposal.member.name,
      memberAvatar: proposal.member.avatar,
      currentRole: proposal.member.role,
      targetRole: proposal.targetRole,
      reason: proposal.reason,
      effectiveDate: proposal.effectiveDate,
      proposedBy: currentUser.name,
      proposedById: currentUser.id,
      status: 'Pending Committee Review',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPromotionRequests((prev) => [newReq, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        action: 'Promotion Nominated',
        details: `${proposal.member.name} nominated for ${proposal.targetRole} by ${currentUser.name}`,
        timestamp: 'Just now',
        user: currentUser.name,
        category: 'promotion'
      },
      ...prev
    ]);
  };

  // Promotion Workflow Step 2: Committee Endorsement
  const handleCommitteeEndorsePromotion = (reqId: string, remarks?: string) => {
    setPromotionRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'Pending Faculty Approval',
              committeeReviewer: currentUser?.name || 'Executive Committee',
              committeeRemarks: remarks || 'Endorsed by Committee',
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : r
      )
    );
  };

  // Promotion Workflow Step 3: Faculty Final Sign-Off
  const handleFacultyApprovePromotion = (reqId: string, remarks?: string) => {
    const req = promotionRequests.find((r) => r.id === reqId);
    if (!req) return;

    // Trigger re-authentication for sensitive institutional elevation
    setReAuthAction({
      actionName: 'Faculty Promotion Sign-Off',
      desc: `Grant official elevation of ${req.memberName} to ${req.targetRole}`,
      onVerified: () => {
        // 1. Update Member Record officially
        setMembers((prev) =>
          prev.map((m) =>
            m.id === req.memberId
              ? {
                  ...m,
                  role: req.targetRole,
                  readyForPromotion: false,
                  promotionRecommendation: undefined
                }
              : m
          )
        );

        // 2. Mark request approved
        setPromotionRequests((prev) =>
          prev.map((r) =>
            r.id === reqId
              ? {
                  ...r,
                  status: 'Approved',
                  facultyReviewer: currentUser?.name || 'Dr. Suresh V. Patil',
                  facultyRemarks: remarks || 'Faculty clearance granted.',
                  updatedAt: new Date().toISOString().split('T')[0]
                }
              : r
          )
        );

        // 3. Record in audit history
        const newHist: PromotionHistory = {
          id: `ph-${Date.now()}`,
          memberId: req.memberId,
          memberName: req.memberName,
          memberAvatar: req.memberAvatar,
          fromRole: req.currentRole,
          toRole: req.targetRole,
          reason: req.reason,
          date: new Date().toISOString().split('T')[0],
          promotedBy: req.proposedBy,
          approvedByFaculty: currentUser?.name || 'Dr. Suresh V. Patil'
        };
        setPromotionHistory((prev) => [newHist, ...prev]);
      }
    });
  };

  // Promotion Workflow: Reject Request
  const handleRejectPromotion = (reqId: string, remarks?: string) => {
    setPromotionRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'Rejected',
              facultyRemarks: remarks || 'Declined',
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : r
      )
    );
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="app-frame min-h-screen text-[var(--text-main)] font-sans">
      <div className="app-shell">
        {/* Left Charcoal Icon-only Sidebar (64px) */}
        {mobileNavOpen && <div className="mobile-nav-backdrop md:hidden" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />}
        <aside className={`app-sidebar ${mobileNavOpen ? "mobile-open" : "mobile-closed"} md:translate-x-0`} aria-label="Main Navigation">
          <button
            onClick={() => handleNavigate('home')}
            className="sidebar-item"
            title="GIT Club Home"
            aria-label="Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--coral)] text-white flex items-center justify-center font-bold text-sm">
              G
            </div>
          </button>

          <button
            onClick={() => handleNavigate('home')}
            className={`sidebar-item ${currentView === 'home' ? 'active' : ''}`}
            title="Home"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('events')}
            className={`sidebar-item ${currentView === 'events' || currentView === 'event-detail' ? 'active' : ''}`}
            title="Courses & Events"
            aria-label="Events"
          >
            <Calendar className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('projects')}
            className={`sidebar-item ${currentView === 'projects' ? 'active' : ''}`}
            title="Projects"
            aria-label="Projects"
          >
            <Layers className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('about')}
            className={`sidebar-item ${currentView === 'about' ? 'active' : ''}`}
            title="About & FAQ"
            aria-label="About"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('committee')}
            className={`sidebar-item ${currentView === 'committee' || currentView === 'faculty' ? 'active' : ''}`}
            title="Committee & Faculty"
            aria-label="Committee"
          >
            <Users className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('announcements')}
            className={`sidebar-item ${currentView === 'announcements' ? 'active' : ''}`}
            title="Announcements"
            aria-label="Announcements"
          >
            <Megaphone className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('participant-dashboard')}
            className={`sidebar-item ${currentView === 'participant-dashboard' ? 'active' : ''}`}
            title="Participant Portal"
            aria-label="Participant Portal"
          >
            <GraduationCap className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavigate('admin-dashboard')}
            className={`sidebar-item ${currentView === 'admin-dashboard' ? 'active' : ''}`}
            title="Command Center"
            aria-label="Command Center"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          <div className="sidebar-spacer" />

          {/* Logout / Login pinned to bottom */}
          {currentUser ? (
            <button
              onClick={() => { handleLogout(); }}
              className="sidebar-item"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setLoginModalPortal('participant')}
              className="sidebar-item"
              title="Sign In"
              aria-label="Sign In"
            >
              <LogIn className="w-5 h-5" />
            </button>
          )}
        </aside>

        {/* Right Content Area */}
        <div className="app-main flex flex-col min-w-0 flex-1">
          {accessDeniedMessage && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{accessDeniedMessage}</span>
              </div>
              <button
                onClick={() => setAccessDeniedMessage(null)}
                className="text-rose-400 hover:text-white font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
          )}
          {/* Top Bar matching reference */}
          <header className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[var(--border-subtle)]">
            {/* Left: "Welcome to" muted + brand name in coral */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <span className="text-[var(--text-muted)] text-xs sm:text-sm font-medium">Welcome to</span>
              <span className="text-[var(--coral)] font-bold text-sm sm:text-base font-mono">GIT Club</span>
            </div>

            {/* Center: Search pill with coral search button */}
            <div className="search-pill flex-1 max-w-md hidden sm:flex">
              <input
                type="text"
                placeholder="Search events, courses, tracks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'events') handleNavigate('events');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentView !== 'events') handleNavigate('events');
                }}
                className="w-full text-xs text-[var(--ink)] placeholder:text-[var(--text-muted)] outline-none bg-transparent"
              />
              <button
                onClick={() => { if (currentView !== 'events') handleNavigate('events'); }}
                className="search-btn"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Right: Circular outlined bell button + Avatar + Name + Handle */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleNavigate('announcements')}
                className="w-9 h-9 rounded-full border border-[var(--ink)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--bg-card-hover)] relative transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[var(--coral)] absolute top-2 right-2" />
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-subtle)]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt={currentUser.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[var(--ink)]"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-[var(--ink)] leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">
                      @{currentUser.name.toLowerCase().replace(/\s+/g, '')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLoginModalPortal('participant')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setLoginModalPortal('committee')}
                  >
                    Command Center
                  </Button>
                </div>
              )}
            </div>
          </header>

          {/* Main Body Router */}
          <div className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            featuredEvent={events[0]}
            projects={projects}
            achievements={achievements}
            announcements={announcements}
            onOpenRegisterModal={(e) => setRegisteringEvent(e)}
          />
        )}

        {currentView === 'about' && <AboutPage />}
        
        {currentView === 'committee' && <CommitteePage members={members} />}
        
        {currentView === 'faculty' && <FacultyPage faculty={FACULTY_MEMBERS} />}
        
        {currentView === 'events' && (
          <EventsPage
            events={events}
            onNavigate={handleNavigate}
            onOpenRegisterModal={(e) => setRegisteringEvent(e)}
          />
        )}

        {currentView === 'event-detail' && (
          <EventDetailPage
            event={selectedEvent}
            onNavigate={handleNavigate}
            onOpenRegisterModal={(e) => setRegisteringEvent(e)}
          />
        )}

        {currentView === 'projects' && <ProjectsPage projects={projects} />}

        {currentView === 'achievements' && <AchievementsPage achievements={achievements} />}

        {currentView === 'history' && <HistoryPage history={HISTORY_MILESTONES} />}

        {currentView === 'announcements' && <AnnouncementsPage announcements={announcements} />}

        {currentView === 'contact' && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
            <h1 className="text-4xl font-bold">Contact GIT Club</h1>
            <p className="text-sm text-[var(--text-muted)]">Reach out for collaborations, sponsorships, or general inquiries.</p>
            <div className="glass-card p-8 border border-[var(--border-subtle)] space-y-4 max-w-md mx-auto text-xs text-left">
              <div><strong>Email:</strong> gitclub@git.edu</div>
              <div><strong>Location:</strong> Innovation Hub, Academic Block A, GIT Campus</div>
              <div><strong>GitHub:</strong> github.com/gitclub</div>
            </div>
          </div>
        )}

        {/* Authenticated Participant Portal */}
        {currentView === 'participant-dashboard' && (
          <ParticipantPortal
            currentTab={participantTab}
            onNavigateTab={(tab) => setParticipantTab(tab)}
            events={events}
            registrations={registrations}
            notifications={notifications}
            onOpenRegisterModal={(e) => setRegisteringEvent(e)}
            onLogout={() => { handleLogout(); }}
            onResetData={handleResetData}
          />
        )}

        {/* Authenticated Committee Command Center (Phase 1 to Phase 20) */}
        {currentView === 'admin-dashboard' && (
          <CommitteeCommandCenter
            currentTab={commandTab}
            onNavigateTab={(tab) => setCommandTab(tab)}
            currentUserRole={currentUser?.role || 'Club Head / Admin'}
            currentUserName={currentUser?.name || 'Committee Officer'}
            currentUserAvatar={currentUser?.avatar}
            promotionRequests={promotionRequests}
            onApprovePromotionRequest={handleCommitteeEndorsePromotion}
            onFacultyApprovePromotion={handleFacultyApprovePromotion}
            onRejectPromotionRequest={handleRejectPromotion}
            onTriggerReAuth={(name, desc, onVerified) => setReAuthAction({ actionName: name, desc, onVerified })}
            theme={theme}
            onToggleTheme={toggleTheme}
            members={members}
            onAddMember={(m) => {
              setMembers((prev) => [m, ...prev]);
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Member Added',
                  details: `${m.name} added to ${m.team} wing as ${m.role}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Admin',
                  category: 'member'
                },
                ...prev
              ]);
            }}
            events={events}
            onCreateEvent={(ev) => {
              setEvents((prev) => [ev, ...prev]);
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Event Submitted',
                  details: `"${ev.title}" submitted for Faculty Approval`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'event'
                },
                ...prev
              ]);
              setNotifications((prev) => [
                {
                  id: `n-${Date.now()}`,
                  title: 'Faculty Approval Requested',
                  message: `New event "${ev.title}" has been submitted for faculty review.`,
                  timestamp: 'Just now',
                  read: false,
                  type: 'approval'
                },
                ...prev
              ]);
            }}
            onUpdateEvent={(updatedEv) => {
              setEvents((prev) => prev.map((e) => (e.id === updatedEv.id ? updatedEv : e)));
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Event Status Changed',
                  details: `"${updatedEv.title}" updated to ${updatedEv.status} (${updatedEv.facultyApprovalStatus})`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'event'
                },
                ...prev
              ]);
            }}
            projects={projects}
            onCreateProject={(p) => {
              setProjects((prev) => [p, ...prev]);
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Project Created',
                  details: `New project "${p.title}" initialized under ${p.lead}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'project'
                },
                ...prev
              ]);
            }}
            onUpdateProject={(p) => {
              setProjects((prev) => prev.map((item) => (item.id === p.id ? p : item)));
            }}
            announcements={announcements}
            onCreateAnnouncement={(ann) => {
              setAnnouncements((prev) => [ann, ...prev]);
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Announcement Published',
                  details: `"${ann.title}" published for ${ann.targetAudience}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'announcement'
                },
                ...prev
              ]);
            }}
            registrations={registrations}
            onUpdateRegistrationAttendance={(regId, attStatus) => {
              setRegistrations((prev) =>
                prev.map((r) => (r.id === regId ? { ...r, attendance: attStatus } : r))
              );
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Attendance Updated',
                  details: `Registration ${regId} marked as ${attStatus}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'attendance'
                },
                ...prev
              ]);
            }}
            notifications={notifications}
            onMarkNotificationRead={(id) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              );
            }}
            promotionHistory={promotionHistory}
            onPromoteMember={(m) => setPromotingMember(m)}
            tasks={tasks}
            onUpdateTaskStatus={(taskId, status) => {
              setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, status: status } : t))
              );
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Task Status Updated',
                  details: `Task updated to ${status}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'task'
                },
                ...prev
              ]);
            }}
            onCreateTask={(tsk) => {
              setTasks((prev) => [tsk, ...prev]);
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Task Delegated',
                  details: `"${tsk.title}" assigned to ${tsk.assignee}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'task'
                },
                ...prev
              ]);
            }}
            handoverRecords={handoverRecords}
            onCreateHandoverRecord={(rec) => {
              setHandoverRecords((prev) => [rec, ...prev]);
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  action: 'Handover Sealed',
                  details: `Term ${rec.year} sealed by ${rec.signedOffBy}`,
                  timestamp: 'Just now',
                  user: currentUser?.name || 'Committee',
                  category: 'member'
                },
                ...prev
              ]);
            }}
            activities={activities}
            onLogout={() => {
              handleLogout();
            }}
          />
        )}
      </div>

          {/* Footer (Hidden inside Command Center) */}
          {currentView !== 'admin-dashboard' && (
            <footer className="border-t border-[var(--border-subtle)] py-8 mt-12 text-xs text-[var(--text-muted)]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-mono font-bold text-[var(--ink)]">
                  <span>GIT CLUB</span> • <span>BUILD • COLLABORATE • INNOVATE</span>
                </div>
                <div>Code Wizards Hackathon Project • Designed & Built with Modern Web Technologies</div>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleNavigate('home')} className="hover:text-[var(--coral)]">Home</button>
                  <button onClick={() => handleNavigate('events')} className="hover:text-[var(--coral)]">Events</button>
                  <button onClick={() => setLoginModalPortal('committee')} className="text-[var(--coral)] hover:underline font-semibold">Command Center</button>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Global Modals */}
      {loginModalPortal && (
        <LoginModal
          portal={loginModalPortal}
          onClose={() => setLoginModalPortal(null)}
          onLoginSuccess={(user: UserSession) => {
            setCurrentUser(user);
            sessionStorage.setItem('gitclub_auth_email', user.email);
            sessionStorage.setItem('gitclub_auth_portal', user.portal);
            sessionStorage.setItem('gitclub_session_token', 'sess-' + Date.now());
            if (user.portal === 'participant') {
              setCurrentView('participant-dashboard');
              setParticipantTab('dash');
            } else {
              setCurrentView('admin-dashboard');
              setCommandTab('dashboard');
            }
            window.location.hash = user.portal === 'participant' ? 'participant-dashboard' : 'admin-dashboard';
            setLoginModalPortal(null);
          }}
        />
      )}

      {registeringEvent && (
        <EventRegisterModal
          event={registeringEvent}
          currentUser={currentUser}
          onClose={() => setRegisteringEvent(null)}
          onRequireLogin={() => setLoginModalPortal('participant')}
          onConfirm={handleConfirmRegistration}
        />
      )}
      {completedTicket && (
        <RegistrationSuccessModal
          ticket={completedTicket}
          onClose={() => setCompletedTicket(null)}
          onViewInPortal={() => {
            setCurrentView('participant-dashboard');
            setParticipantTab('my-tickets');
          }}
        />
      )}
      {promotingMember && currentUser && (
        <PromotionModal
          member={promotingMember}
          currentUser={currentUser}
          onClose={() => setPromotingMember(null)}
          onSubmitProposal={handleProposalSubmit}
        />
      )}
      {reAuthAction && currentUser && (
        <ReAuthModal
          currentUser={currentUser}
          actionName={reAuthAction.actionName}
          actionDescription={reAuthAction.desc}
          onClose={() => setReAuthAction(null)}
          onVerified={() => {
            const cb = reAuthAction.onVerified;
            setReAuthAction(null);
            cb();
          }}
        />
      )}
    </div>
  );
}

export default App;
