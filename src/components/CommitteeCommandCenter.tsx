import React, { useState } from 'react';
import {
  Member, EventItem, ProjectItem, AnnouncementItem, EventRegistration,
  NotificationItem, Role, PromotionHistory, CommitteeTask, CommitteeHandoverRecord,
  ActivityItem, FacultyApprovalStatus, MemberStatus, TeamType
} from '../types';
import {
  LayoutDashboard, Users, TrendingUp, Calendar, Code, Megaphone,
  BarChart3, Bell, Settings, Search, Plus, Shield, CheckCircle2,
  AlertTriangle, Filter, Edit, Trash2, Crown, ChevronRight, Check,
  Clock, FileCheck, ArrowRight, UserCheck, Ticket, Download, QrCode,
  X, Sparkles, BookOpen, AlertCircle, Eye, RefreshCw, Sun, Moon, LogOut,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { LeadershipPromotions } from './LeadershipPromotions';
import { canAccessCommandCenter, canAccessCommandTab, canCreateEvent, canPublishEvent, canFacultyApprove, canCommitteeReviewEvent, canManageProjects, canManageMembers, canCreateAnnouncement, canAssignTasks, canSignHandover, isFaculty } from '../utils/permissions';
import { manualDownloadTicket, printTicketPass } from '../utils/ticketGenerator';
import { PromotionRequest, UserSession } from '../types';

interface CommandCenterProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  currentUserRole: Role;
  currentUserName?: string;
  currentUserAvatar?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  members: Member[];
  onAddMember: (member: Member) => void;
  events: EventItem[];
  onCreateEvent: (event: EventItem) => void;
  onUpdateEvent: (event: EventItem) => void;
  projects: ProjectItem[];
  onCreateProject: (project: ProjectItem) => void;
  onUpdateProject: (project: ProjectItem) => void;
  announcements: AnnouncementItem[];
  onCreateAnnouncement: (announcement: AnnouncementItem) => void;
  registrations: EventRegistration[];
  onUpdateRegistrationAttendance: (regId: string, attendance: 'Attended' | 'Absent' | 'Pending') => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  promotionHistory: PromotionHistory[];
  promotionRequests: PromotionRequest[];
  onPromoteMember: (member: Member) => void;
  onApprovePromotionRequest: (reqId: string, remarks?: string) => void;
  onFacultyApprovePromotion: (reqId: string, remarks?: string) => void;
  onRejectPromotionRequest: (reqId: string, remarks?: string) => void;
  onTriggerReAuth?: (actionName: string, desc: string, onVerified: () => void) => void;
  tasks: CommitteeTask[];
  onUpdateTaskStatus: (taskId: string, status: CommitteeTask['status']) => void;
  onCreateTask: (task: CommitteeTask) => void;
  handoverRecords: CommitteeHandoverRecord[];
  onCreateHandoverRecord: (record: CommitteeHandoverRecord) => void;
  activities: ActivityItem[];
  onLogout: () => void;
  onResetData?: () => void;
}

export const CommitteeCommandCenter: React.FC<CommandCenterProps> = ({
  currentTab,
  onNavigateTab,
  currentUserRole,
  currentUserName = 'Committee Member',
  currentUserAvatar,
  theme,
  onToggleTheme,
  members,
  onAddMember,
  events,
  onCreateEvent,
  onUpdateEvent,
  projects,
  onCreateProject,
  onUpdateProject,
  announcements,
  onCreateAnnouncement,
  registrations,
  onUpdateRegistrationAttendance,
  notifications,
  onMarkNotificationRead,
  promotionHistory,
  promotionRequests,
  onPromoteMember,
  onApprovePromotionRequest,
  onFacultyApprovePromotion,
  onRejectPromotionRequest,
  onTriggerReAuth,
  tasks,
  onUpdateTaskStatus,
  onCreateTask,
  handoverRecords,
  onCreateHandoverRecord,
  activities,
  onLogout,
  onResetData
}) => {
  // Mobile drawer toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global search query
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals inside Command Center
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<Member | null>(null);
  const [viewingTicketModal, setViewingTicketModal] = useState<EventRegistration | null>(null);

  // Filter states
  const [memberRoleFilter, setMemberRoleFilter] = useState('All');
  const [memberTeamFilter, setMemberTeamFilter] = useState('All');
  const [memberStatusFilter, setMemberStatusFilter] = useState('All');
  const [eventStatusFilter, setEventStatusFilter] = useState('All');
  const [regEventFilter, setRegEventFilter] = useState('All');
  const [regStatusFilter, setRegStatusFilter] = useState('All');
  const [attendanceEventFilter, setAttendanceEventFilter] = useState(events[0]?.id || 'e-1');

  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberBranch, setNewMemberBranch] = useState('CSE');
  const [newMemberYear, setNewMemberYear] = useState<Member['year']>('2nd Year');
  const [newMemberTeam, setNewMemberTeam] = useState<TeamType>('Technical');
  const [newMemberRole, setNewMemberRole] = useState<Member['role']>('Member');
  const [newMemberSkills, setNewMemberSkills] = useState('React, Python');

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<EventItem['category']>('Workshop');
  const [newEventDate, setNewEventDate] = useState('2026-11-05');
  const [newEventTime, setNewEventTime] = useState('10:00 AM - 01:00 PM');
  const [newEventVenue, setNewEventVenue] = useState('Seminar Hall A');
  const [newEventSpeaker, setNewEventSpeaker] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('GIT Technical Wing');
  const [newEventCapacity, setNewEventCapacity] = useState('100');
  const [newEventDeadline, setNewEventDeadline] = useState('2026-11-04');
  const [newEventDescription, setNewEventDescription] = useState('');

  // New Project Form State
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectLead, setNewProjectLead] = useState('Rohan Deshmukh');
  const [newProjectTech, setNewProjectTech] = useState('React, TypeScript, Go');
  const [newProjectDeadline, setNewProjectDeadline] = useState('2026-12-15');

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Sneha Patil');
  const [newTaskRelated, setNewTaskRelated] = useState('HACKVERSE 2026');
  const [newTaskPriority, setNewTaskPriority] = useState<CommitteeTask['priority']>('High');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-10-10');

  // New Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnDesc, setNewAnnDesc] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<AnnouncementItem['category']>('General');
  const [newAnnAudience, setNewAnnAudience] = useState<AnnouncementItem['targetAudience']>('Everyone');

  // Handover Record Form State
  const [handoverNotes, setHandoverNotes] = useState('');
  const [handoverTasks, setHandoverTasks] = useState('');

  // ----------------------------------------------------
  // Role-Based Permissions Logic (Phase 16)
  // ----------------------------------------------------
  const isAdmin = currentUserRole === 'Admin / Club Head';
  const isStudentRep = currentUserRole === 'Student Representative';
  const isCommitteeHead = currentUserRole === 'Committee Head';
  const isEventLead = currentUserRole === 'Event Lead';
  const isProjectLead = currentUserRole === 'Project Lead';
  const isCommitteeMember = currentUserRole === 'Committee Member';

  const canApproveFaculty = isAdmin || isStudentRep;
  const canPublishEvent = isAdmin || isStudentRep || isCommitteeHead || isEventLead;
  const canPromote = isAdmin || isStudentRep;
  const canManageProjects = isAdmin || isStudentRep || isCommitteeHead || isProjectLead;
  const canManageEvents = isAdmin || isStudentRep || isCommitteeHead || isEventLead;
  const canManageMembers = isAdmin || isStudentRep || isCommitteeHead;
  const canAnnounce = isAdmin || isStudentRep || isCommitteeHead;
  const canSignHandover = isAdmin || isStudentRep;

  // Navigation Items (Exact Phase 1 Specification)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'promotions', label: 'Leadership & Promotions', icon: Crown, badge: promotionRequests?.filter(r => r.status !== 'Approved').length || undefined },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'approvals', label: 'Approvals', icon: FileCheck, badge: events.filter(e => e.facultyApprovalStatus === 'Pending').length || undefined },
    { id: 'registrations', label: 'Registrations', icon: Ticket, badge: registrations.length || undefined },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'tasks', label: 'Tasks', icon: Clock },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || undefined },
    { id: 'handover', label: 'Handover', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ].filter(item => canAccessCommandTab(item.id, currentUserRole));

  // Dynamic alerts for "Needs Attention" (Phase 2 & Phase 14)
  const attentionItems: { title: string; desc: string; type: 'warning' | 'urgent' | 'info'; actionTab: string }[] = [];
  
  const almostFullEvent = events.find(e => e.registeredCount / e.capacity >= 0.9 && e.status === 'Registration Open');
  if (almostFullEvent) {
    attentionItems.push({
      title: `${almostFullEvent.title} is at ${Math.round((almostFullEvent.registeredCount / almostFullEvent.capacity) * 100)}% capacity`,
      desc: `${almostFullEvent.registeredCount} / ${almostFullEvent.capacity} seats filled. Consider booking additional overflow seats.`,
      type: 'urgent',
      actionTab: 'events'
    });
  }

  const pendingApprovalEvent = events.find(e => e.facultyApprovalStatus === 'Pending');
  if (pendingApprovalEvent) {
    attentionItems.push({
      title: `Faculty Approval Pending: ${pendingApprovalEvent.title}`,
      desc: 'Syllabus and venue clearance await faculty coordinator sign-off.',
      type: 'warning',
      actionTab: 'approvals'
    });
  }

  const promoReady = members.find(m => m.readyForPromotion);
  if (promoReady) {
    attentionItems.push({
      title: `Promotion Candidate: ${promoReady.name}`,
      desc: `Eligible for elevation to ${promoReady.promotionRecommendation?.nextRole}.`,
      type: 'info',
      actionTab: 'promotions'
    });
  }

  const overdueTask = tasks.find(t => t.status === 'Overdue' || (t.status !== 'Done' && new Date(t.deadline) < new Date('2026-10-01')));
  if (overdueTask) {
    attentionItems.push({
      title: `Task Requires Attention: ${overdueTask.title}`,
      desc: `Assigned to ${overdueTask.assignee} (Priority: ${overdueTask.priority}).`,
      type: 'warning',
      actionTab: 'tasks'
    });
  }

  // Attendance metrics calculation
  const totalAttended = registrations.filter(r => r.attendance === 'Attended').length;
  const attendanceRateCalc = registrations.length > 0 
    ? Math.round((totalAttended / registrations.length) * 100) 
    : 78;

  // Chart datasets
  const participationData = [
    { month: 'Jun', registrations: 190, attended: 165 },
    { month: 'Jul', registrations: 240, attended: 215 },
    { month: 'Aug', registrations: 320, attended: 285 },
    { month: 'Sep', registrations: 410, attended: 370 },
    { month: 'Oct', registrations: 505, attended: 460 },
  ];

  const projectStatusData = [
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#10b981' },
    { name: 'Development', value: projects.filter(p => p.status === 'Development').length, color: '#6366f1' },
    { name: 'Planning', value: projects.filter(p => p.status === 'Planning').length, color: '#f59e0b' }
  ];

  const teamDistribution = [
    { name: 'Technical', count: members.filter(m => m.team === 'Technical').length },
    { name: 'Events', count: members.filter(m => m.team === 'Events').length },
    { name: 'Design & Media', count: members.filter(m => m.team === 'Design & Media').length },
    { name: 'Operations', count: members.filter(m => m.team === 'Operations').length },
    { name: 'PR & Logistics', count: members.filter(m => m.team === 'Public Relations' || m.team === 'Logistics').length },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col md:flex-row text-[var(--text-main)] font-sans">
      
      {/* ---------------------------------------------------- */}
      {/* 1. PERSISTENT SIDEBAR (Desktop) & DRAWER (Mobile)   */}
      {/* ---------------------------------------------------- */}
      <aside className={`
        fixed md:sticky top-0 z-40 h-screen w-64 glass-panel border-r border-[var(--border-subtle)] p-4 flex flex-col justify-between shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-5 overflow-y-auto pr-1">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-black tracking-wider uppercase font-mono">GIT COMMAND</h2>
                <span className="text-[10px] font-mono text-purple-400 font-semibold">CLUB OS v3.0</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-[var(--text-subtle)] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AUTHORIZED ROLE (Strictly Read-Only Display - No Switching or Selection) */}
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)]">
              <span>AUTHORIZED ROLE</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
              </span>
            </div>
            <div className="text-xs font-bold text-indigo-300 font-mono flex items-center gap-1.5 py-0.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{currentUserRole}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout in Footer */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUserAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt="Avatar"
              className="w-8 h-8 rounded-lg object-cover border border-purple-500/40 shrink-0"
            />
            <div className="truncate">
              <h4 className="text-xs font-bold truncate">{currentUserName}</h4>
              <span className="text-[10px] text-[var(--text-subtle)] font-mono block truncate">{currentUserRole}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN APPLICATION WORKSPACE                        */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Operational Bar */}
        <header className="sticky top-0 z-30 h-16 glass-panel border-b border-[var(--border-subtle)] px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
            >
              <Shield className="w-4 h-4" />
            </button>
            
            {/* Global Search Bar */}
            <div className="relative hidden sm:block w-72">
              <Search className="w-3.5 h-3.5 text-[var(--text-subtle)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events, members, tasks..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full !pl-8 !pr-3 search-input-pill"
              />
            </div>
          </div>

          {/* Quick Actions & Header Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={() => onNavigateTab('notifications')}
              className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-[var(--bg-primary)]"></span>
              )}
            </button>

            {canManageEvents && (
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Create Event</span>
              </button>
            )}

            {canManageMembers && (
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Add Member</span>
              </button>
            )}
          </div>
        </header>

        {/* Workspace Body Container */}
        <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto">

          {/* ==================================================== */}
          {/* TAB 1: COMMAND CENTER DASHBOARD (Phase 2)           */}
          {/* ==================================================== */}
          {currentTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Header Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black">
                    Good morning, <span className="gradient-text">{currentUserName}</span>
                  </h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Here's what needs your attention today across the GIT Club Operating System.
                  </p>
                </div>
                
                {/* 4 Quick Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Event
                  </button>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="px-3 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" /> Add Member
                  </button>
                  <button
                    onClick={() => setShowCreateProjectModal(true)}
                    className="px-3 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Code className="w-3.5 h-3.5" /> Add Project
                  </button>
                  <button
                    onClick={() => setShowCreateAnnouncementModal(true)}
                    className="px-3 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" /> Publish Announcement
                  </button>
                </div>
              </div>

              {/* 6 Top Operational Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Active Members', val: members.filter(m => m.status === 'Active').length, sub: '+2 this month', icon: Users, color: 'text-indigo-400' },
                  { label: 'Upcoming Events', val: events.filter(e => e.status === 'Registration Open' || e.status === 'Approved').length, sub: '2 this week', icon: Calendar, color: 'text-purple-400' },
                  { label: 'Active Projects', val: projects.filter(p => p.status === 'Development' || p.status === 'Planning').length, sub: '88% avg progress', icon: Code, color: 'text-cyan-400' },
                  { label: 'Total Registrations', val: registrations.length + 385, sub: '96% fill rate', icon: Ticket, color: 'text-emerald-400' },
                  { label: 'Attendance Rate', val: `${attendanceRateCalc}%`, sub: `${totalAttended} checked in`, icon: CheckCircle2, color: 'text-amber-400' },
                  { label: 'Pending Actions', val: attentionItems.length, sub: 'Immediate review', icon: AlertTriangle, color: 'text-rose-400' },
                ].map((kpi, i) => (
                  <div key={i} className="glass-card p-4 border border-[var(--border-subtle)] space-y-1.5">
                    <div className="flex items-center justify-between text-[var(--text-subtle)]">
                      <span className="text-[10px] font-mono uppercase font-bold">{kpi.label}</span>
                      <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                    </div>
                    <div className="text-2xl font-black font-mono">{kpi.val}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* NEEDS ATTENTION SECTION (Critical Phase 2 Feature) */}
              <div className="glass-card p-6 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[var(--bg-card)] to-transparent space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>NEEDS ATTENTION ({attentionItems.length} Real-Time Action Items)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-subtle)]">Calculated from synthetic platform data</span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {attentionItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigateTab(item.actionTab)}
                      className="p-3.5 bg-[var(--bg-surface)] hover:border-amber-500/50 rounded-xl border border-[var(--border-subtle)] space-y-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase ${
                          item.type === 'urgent' ? 'text-rose-400' : item.type === 'warning' ? 'text-amber-400' : 'text-purple-400'
                        }`}>
                          {item.type}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                      </div>
                      <h4 className="font-bold text-[var(--text-main)] line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPCOMING EVENTS (Next 3–4 Events) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" /> Upcoming Scheduled Events
                  </h3>
                  <button onClick={() => onNavigateTab('events')} className="text-xs text-indigo-400 hover:underline">
                    View All ({events.length}) →
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {events.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="glass-card p-4 border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
                            {ev.category}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            ev.facultyApprovalStatus === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {ev.facultyApprovalStatus}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold line-clamp-1">{ev.title}</h4>
                        <div className="text-[11px] text-[var(--text-muted)] space-y-0.5 font-mono">
                          <div>📅 {ev.date} • {ev.time}</div>
                          <div>📍 {ev.venue}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                        <span className="font-mono text-[var(--text-subtle)] text-[11px]">
                          {ev.registeredCount}/{ev.capacity} Seats
                        </span>
                        <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-bold">
                          {ev.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ANALYTICS PREVIEW & RECENT ACTIVITY */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Analytics Previews */}
                <div className="lg:col-span-7 glass-card p-6 border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Registration & Turnout Trend</h3>
                    <span className="text-[10px] font-mono text-[var(--text-subtle)]">Past 5 Months</span>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={participationData}>
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderColor: '#6366f1', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="registrations" stroke="#6366f1" fillOpacity={0.2} fill="#6366f1" name="Registrations" />
                        <Area type="monotone" dataKey="attended" stroke="#10b981" fillOpacity={0.2} fill="#10b981" name="Attended" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Meaningful Recent Activity */}
                <div className="lg:col-span-5 glass-card p-6 border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Recent Operating Log</h3>
                    <span className="text-[10px] font-mono text-indigo-400">Live Sync</span>
                  </div>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {activities.slice(0, 5).map((act) => (
                      <div key={act.id} className="p-2.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-indigo-400 font-mono">{act.action}</span>
                          <span className="text-[var(--text-subtle)] font-mono">{act.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{act.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: MEMBERS DIRECTORY & PROFILE (Phase 3)        */}
          {/* ==================================================== */}
          {currentTab === 'members' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Member Directory ({members.length})</h2>
                  <p className="text-xs text-[var(--text-muted)]">Searchable committee & student member operations database.</p>
                </div>
                {canManageMembers && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Member
                  </button>
                )}
              </div>

              {/* Filters Bar */}
              <div className="glass-panel p-4 rounded-xl border border-[var(--border-subtle)] flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                  <span className="text-[11px] font-mono text-[var(--text-subtle)]">Filters:</span>
                </div>

                <select
                  value={memberRoleFilter}
                  onChange={(e) => setMemberRoleFilter(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="All">All Roles</option>
                  <option value="Club Head">Club Head</option>
                  <option value="Student Representative">Student Representative</option>
                  <option value="Committee Head">Committee Head</option>
                  <option value="Committee Member">Committee Member</option>
                  <option value="Member">Member</option>
                </select>

                <select
                  value={memberTeamFilter}
                  onChange={(e) => setMemberTeamFilter(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="All">All Teams</option>
                  <option value="Technical">Technical</option>
                  <option value="Events">Events</option>
                  <option value="Design & Media">Design & Media</option>
                  <option value="Operations">Operations</option>
                  <option value="Public Relations">Public Relations</option>
                </select>

                <select
                  value={memberStatusFilter}
                  onChange={(e) => setMemberStatusFilter(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Applicant">Applicant</option>
                  <option value="Committee">Committee</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Members Table */}
              <div className="glass-card border border-[var(--border-subtle)] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-[var(--text-subtle)] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-4">Year & Branch</th>
                      <th className="py-3 px-4">Attendance</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {members
                      .filter(m => !globalSearch.trim() || m.name.toLowerCase().includes(globalSearch.toLowerCase()) || m.email.toLowerCase().includes(globalSearch.toLowerCase()) || m.role.toLowerCase().includes(globalSearch.toLowerCase()) || m.team.toLowerCase().includes(globalSearch.toLowerCase()))
                      .filter(m => memberRoleFilter === 'All' || m.role === memberRoleFilter)
                      .filter(m => memberTeamFilter === 'All' || m.team === memberTeamFilter)
                      .filter(m => memberStatusFilter === 'All' || m.status === memberStatusFilter)
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <span className="font-bold text-[var(--text-main)] block">{m.name}</span>
                              <span className="text-[10px] font-mono text-[var(--text-subtle)]">{m.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-indigo-400">{m.role}</td>
                          <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{m.team}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{m.branch} • {m.year}</td>
                          <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{m.attendanceRate || 92}%</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-mono font-bold">
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedMemberProfile(m)}
                              className="px-2.5 py-1 bg-[var(--bg-card)] hover:bg-indigo-600 hover:text-white border border-[var(--border-subtle)] rounded text-[11px] font-semibold transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: LEADERSHIP & PROMOTIONS (Phase 4)            */}
          {/* ==================================================== */}
          {currentTab === 'promotions' && (
            <LeadershipPromotions
              members={members}
              promotionHistory={promotionHistory}
              promotionRequests={promotionRequests || []}
              currentUser={{
                id: 'curr-user',
                name: currentUserName || 'Committee Officer',
                email: 'officer@git.edu',
                role: currentUserRole,
                portal: 'committee'
              }}
              onPromoteMember={onPromoteMember}
              onApprovePromotionRequest={onApprovePromotionRequest}
              onFacultyApprovePromotion={onFacultyApprovePromotion}
              onRejectPromotionRequest={onRejectPromotionRequest}
            />
          )}

          {/* ==================================================== */}
          {/* TAB 4: EVENT MANAGEMENT (Phase 5)                   */}
          {/* ==================================================== */}
          {currentTab === 'events' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Event Lifecycle Directory</h2>
                  <p className="text-xs text-[var(--text-muted)]">Manage lifecycle from Draft → Faculty Approval → Registration → Ongoing → Archive.</p>
                </div>
                {canManageEvents && (
                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Create Event
                  </button>
                )}
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap gap-2 text-xs">
                {['All', 'Draft', 'Faculty Review', 'Approved', 'Registration Open', 'Completed', 'Archived'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEventStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      eventStatusFilter === tab
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Event Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                  .filter(e => !globalSearch.trim() || e.title.toLowerCase().includes(globalSearch.toLowerCase()) || e.description.toLowerCase().includes(globalSearch.toLowerCase()) || e.category.toLowerCase().includes(globalSearch.toLowerCase()))
                  .filter(e => eventStatusFilter === 'All' || e.status === eventStatusFilter)
                  .map((ev) => (
                    <div key={ev.id} className="glass-card border border-[var(--border-subtle)] overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="relative h-40">
                          <img src={ev.poster} alt={ev.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-indigo-300 font-bold">
                              {ev.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10px] font-mono font-bold ${
                              ev.facultyApprovalStatus === 'Approved' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-black'
                            }`}>
                              Faculty: {ev.facultyApprovalStatus}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="text-base font-bold line-clamp-1">{ev.title}</h3>
                          <div className="text-xs text-[var(--text-muted)] space-y-1 font-mono">
                            <div>📅 {ev.date} • {ev.time}</div>
                            <div>📍 {ev.venue}</div>
                            <div>🎙️ {ev.speaker}</div>
                          </div>

                          <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-[var(--text-subtle)]">Registrations</span>
                              <span className="font-bold">{ev.registeredCount} / {ev.capacity}</span>
                            </div>
                            <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (ev.registeredCount / ev.capacity) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                        <span className="font-mono text-purple-400 font-bold text-[11px]">{ev.status}</span>
                        {canPublishEvent && ev.status === 'Approved' && (
                          <button
                            onClick={() => onUpdateEvent({ ...ev, status: 'Registration Open' })}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                          >
                            Open Registration
                          </button>
                        )}
                        {ev.status === 'Registration Open' && (
                          <button
                            onClick={() => onUpdateEvent({ ...ev, status: 'Completed' })}
                            className="px-2.5 py-1 bg-[var(--bg-card)] hover:bg-purple-600 hover:text-white rounded text-[11px] font-semibold border border-[var(--border-subtle)]"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: FACULTY APPROVALS (Phase 6)                  */}
          {/* ==================================================== */}
          {currentTab === 'approvals' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold">Faculty Governance Approvals</h2>
                <p className="text-xs text-[var(--text-muted)]">Official institutional workflow for event clearances and lab reservations.</p>
              </div>

              <div className="space-y-4">
                {events.map((ev) => (
                  <div key={ev.id} className="glass-card p-6 border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">{ev.category}</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          ev.facultyApprovalStatus === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          Status: {ev.facultyApprovalStatus}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">{ev.title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{ev.description}</p>
                      
                      <div className="pt-2 text-[11px] font-mono text-[var(--text-subtle)] space-y-0.5">
                        <div>Submitted By: {ev.organizer}</div>
                        <div>Date & Venue: {ev.date} at {ev.venue}</div>
                        {ev.facultyRemarks && <div className="text-indigo-300">Remarks: "{ev.facultyRemarks}"</div>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {ev.facultyApprovalStatus === 'Pending' ? (
                        <>
                          <button
                            onClick={() => onUpdateEvent({
                              ...ev,
                              facultyApprovalStatus: 'Approved',
                              status: 'Approved',
                              facultyReviewer: 'Dr. Suresh V. Patil',
                              facultyReviewDate: '2026-09-28',
                              facultyRemarks: 'Approved for official scheduling.'
                            })}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4" /> Approve Event
                          </button>
                          <button
                            onClick={() => onUpdateEvent({
                              ...ev,
                              facultyApprovalStatus: 'Changes Requested',
                              facultyRemarks: 'Please submit safety and room equipment checklist.'
                            })}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl"
                          >
                            Request Changes
                          </button>
                        </>
                      ) : (
                        <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Signed by {ev.facultyReviewer || 'Faculty Mentor'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: REGISTRATION MANAGEMENT (Phase 7 & Phase 8)  */}
          {/* ==================================================== */}
          {currentTab === 'registrations' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold">Registration & Ticket Operations</h2>
                <p className="text-xs text-[var(--text-muted)]">Live registration intake synchronized with student portal registrations.</p>
              </div>

              {/* Registration KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Total Registrations</span>
                  <div className="text-2xl font-black font-mono text-indigo-400">{registrations.length + 385}</div>
                </div>
                <div className="glass-card p-4 border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Confirmed Passes</span>
                  <div className="text-2xl font-black font-mono text-emerald-400">{registrations.filter(r => r.status === 'Confirmed').length + 380}</div>
                </div>
                <div className="glass-card p-4 border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Waitlisted</span>
                  <div className="text-2xl font-black font-mono text-amber-400">{registrations.filter(r => r.status === 'Waitlisted').length + 5}</div>
                </div>
                <div className="glass-card p-4 border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Attended</span>
                  <div className="text-2xl font-black font-mono text-purple-400">{registrations.filter(r => r.attendance === 'Attended').length + 1}</div>
                </div>
              </div>

              {/* Registrations Table */}
              <div className="glass-card border border-[var(--border-subtle)] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-[var(--text-subtle)] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Participant</th>
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">Ticket Identifier</th>
                      <th className="py-3 px-4">Registration Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Attendance</th>
                      <th className="py-3 px-4 text-right">Ticket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold block text-[var(--text-main)]">{reg.userName}</span>
                          <span className="text-[10px] font-mono text-[var(--text-subtle)]">{reg.userEmail} ({reg.branch})</span>
                        </td>
                        <td className="py-3 px-4 text-indigo-400 font-semibold">{reg.eventTitle}</td>
                        <td className="py-3 px-4 font-mono text-[var(--text-subtle)]">{reg.ticketId}</td>
                        <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{reg.registrationDate}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            reg.attendance === 'Attended'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {reg.attendance}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setViewingTicketModal(reg)}
                            className="px-2.5 py-1 bg-[var(--bg-card)] hover:bg-indigo-600 hover:text-white border border-[var(--border-subtle)] rounded text-[11px] font-mono transition-colors"
                          >
                            View Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: ATTENDANCE MANAGEMENT (Phase 9)              */}
          {/* ==================================================== */}
          {currentTab === 'attendance' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Event Attendance Check-In Desk</h2>
                  <p className="text-xs text-[var(--text-muted)]">Check in registered participants, scan passes, and track turnout stats.</p>
                </div>

                <select
                  value={attendanceEventFilter}
                  onChange={(e) => setAttendanceEventFilter(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold text-indigo-400"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              {/* Attendance Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="glass-card p-4 border border-indigo-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Total Registered</span>
                  <div className="text-3xl font-black font-mono text-indigo-400">
                    {registrations.filter(r => r.eventId === attendanceEventFilter).length}
                  </div>
                </div>
                <div className="glass-card p-4 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Checked In</span>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {registrations.filter(r => r.eventId === attendanceEventFilter && r.attendance === 'Attended').length}
                  </div>
                </div>
                <div className="glass-card p-4 border border-rose-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Absent / Pending</span>
                  <div className="text-3xl font-black font-mono text-rose-400">
                    {registrations.filter(r => r.eventId === attendanceEventFilter && r.attendance !== 'Attended').length}
                  </div>
                </div>
              </div>

              {/* Attendance Roster */}
              <div className="glass-card border border-[var(--border-subtle)] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-[var(--text-subtle)] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Attendee</th>
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Branch/Year</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Check-in Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {registrations
                      .filter(r => r.eventId === attendanceEventFilter)
                      .map((reg) => (
                        <tr key={reg.id} className="hover:bg-[var(--bg-surface)]">
                          <td className="py-3 px-4 font-bold">{reg.userName} ({reg.userEmail})</td>
                          <td className="py-3 px-4 font-mono text-indigo-400">{reg.ticketId}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{reg.branch} • {reg.year}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              reg.attendance === 'Attended'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {reg.attendance}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {reg.attendance === 'Attended' ? (
                              <button
                                onClick={() => onUpdateRegistrationAttendance(reg.id, 'Pending')}
                                className="px-3 py-1 bg-[var(--bg-card)] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] font-semibold transition-colors"
                              >
                                Undo Check-in
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateRegistrationAttendance(reg.id, 'Attended')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow flex items-center gap-1 ml-auto"
                              >
                                <Check className="w-3.5 h-3.5" /> Mark Check-in
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: PROJECT MANAGEMENT (Phase 10)                */}
          {/* ==================================================== */}
          {currentTab === 'projects' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Technical Project Portfolio</h2>
                  <p className="text-xs text-[var(--text-muted)]">Track lifecycle from Proposal → Planning → Development → Testing → Showcase.</p>
                </div>
                {canManageProjects && (
                  <button
                    onClick={() => setShowCreateProjectModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div key={p.id} className="glass-card p-6 border border-[var(--border-subtle)] space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10">
                          {p.status}
                        </span>
                        <span className="text-[var(--text-subtle)]">Deadline: {p.deadline}</span>
                      </div>

                      <h3 className="text-lg font-bold">{p.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2">{p.description}</p>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-[var(--text-subtle)]">Sprint Progress</span>
                          <span className="font-bold text-emerald-400">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="pt-2 text-xs space-y-1">
                        <div className="text-[11px] font-mono text-[var(--text-subtle)]">Lead: <strong className="text-[var(--text-main)]">{p.lead}</strong></div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.technologies.map((t, idx) => (
                            <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                      <div className="text-[11px] font-mono text-[var(--text-subtle)]">{p.team.length} contributors</div>
                      {canManageProjects && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdateProject({ ...p, progress: Math.min(100, p.progress + 10) })}
                            className="px-2.5 py-1 bg-[var(--bg-card)] hover:bg-indigo-600 hover:text-white rounded text-[11px] font-semibold border border-[var(--border-subtle)]"
                          >
                            +10% Progress
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 9: TASKS & RESPONSIBILITY (Phase 11)             */}
          {/* ==================================================== */}
          {currentTab === 'tasks' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Committee Task Operations</h2>
                  <p className="text-xs text-[var(--text-muted)]">Operational delegation tied directly to scheduled events and technical projects.</p>
                </div>
                <button
                  onClick={() => setShowCreateTaskModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> Assign New Task
                </button>
              </div>

              {/* Task Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks
                .filter(t => !globalSearch.trim() || t.title.toLowerCase().includes(globalSearch.toLowerCase()) || t.assignee.toLowerCase().includes(globalSearch.toLowerCase()) || t.relatedName.toLowerCase().includes(globalSearch.toLowerCase()))
                .map((tsk) => (
                  <div key={tsk.id} className="glass-card p-5 border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          tsk.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          tsk.priority === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {tsk.priority} Priority
                        </span>
                        <span className="text-[var(--text-subtle)]">Due: {tsk.deadline}</span>
                      </div>

                      <h4 className="text-sm font-bold text-[var(--text-main)]">{tsk.title}</h4>
                      <p className="text-[11px] font-mono text-indigo-400">🔗 {tsk.relatedType}: {tsk.relatedName}</p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Assignee: {tsk.assignee}</span>
                      <select
                        value={tsk.status}
                        onChange={(e) => onUpdateTaskStatus(tsk.id, e.target.value as CommitteeTask['status'])}
                        className="text-[11px] font-bold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 10: ANNOUNCEMENTS MANAGEMENT (Phase 12)         */}
          {/* ==================================================== */}
          {currentTab === 'announcements' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Campus Announcement Center</h2>
                  <p className="text-xs text-[var(--text-muted)]">Target communications to Everyone, Members, or Registered Participants.</p>
                </div>
                {canAnnounce && (
                  <button
                    onClick={() => setShowCreateAnnouncementModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Publish Announcement
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a.id} className="glass-card p-6 border border-[var(--border-subtle)] space-y-2">
                    <div className="flex justify-between text-xs font-mono text-[var(--text-subtle)]">
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400 font-bold px-2 py-0.5 rounded bg-pink-500/10">{a.category}</span>
                        <span>Audience: <strong>{a.targetAudience}</strong></span>
                      </div>
                      <span>{a.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--text-main)]">{a.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{a.shortDescription}</p>
                    <div className="pt-2 text-[10px] font-mono text-[var(--text-subtle)]">Published by: {a.author} ({a.authorRole})</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 11: OPERATIONAL ANALYTICS (Phase 13)            */}
          {/* ==================================================== */}
          {currentTab === 'analytics' && (
            <div className="space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold">Operational Club Analytics</h2>
                <p className="text-xs text-[var(--text-muted)]">Real synthetic operational metrics answering crucial club management questions.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* 1. Registrations vs Attended */}
                <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-4">
                  <h3 className="text-sm font-bold">"How many registered participants actually attended?"</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={participationData}>
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderRadius: '12px' }} />
                        <Bar dataKey="registrations" fill="#6366f1" radius={[4, 4, 0, 0]} name="Registrations" />
                        <Bar dataKey="attended" fill="#10b981" radius={[4, 4, 0, 0]} name="Attended" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Team Distribution */}
                <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-4">
                  <h3 className="text-sm font-bold">"Which teams have the most active members?"</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamDistribution} layout="vertical">
                        <XAxis type="number" stroke="#6b7280" fontSize={11} />
                        <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={10} width={80} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderRadius: '12px' }} />
                        <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} name="Member Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Project Status Distribution */}
                <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-4">
                  <h3 className="text-sm font-bold">"How are our projects progressing across wings?"</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0d111a', borderRadius: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Club Growth Metric Summary */}
                <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-4 flex flex-col justify-between">
                  <h3 className="text-sm font-bold">"Key Operational Turnout Ratios"</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] flex justify-between items-center">
                      <div>
                        <div className="text-xs text-[var(--text-muted)]">Average Event Attendance Rate</div>
                        <div className="text-xl font-bold font-mono text-emerald-400">89.4% Turnout</div>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-400/40" />
                    </div>
                    <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] flex justify-between items-center">
                      <div>
                        <div className="text-xs text-[var(--text-muted)]">Total Hackathon Capacity Fill</div>
                        <div className="text-xl font-bold font-mono text-indigo-400">96.2% Booked</div>
                      </div>
                      <Ticket className="w-8 h-8 text-indigo-400/40" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 12: NOTIFICATIONS (Phase 14)                     */}
          {/* ==================================================== */}
          {currentTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Connected Notification Log</h2>
                  <p className="text-xs text-[var(--text-muted)]">Generated directly from system state changes, approvals, and registrations.</p>
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      n.read
                        ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-75'
                        : 'glass-card border-indigo-500/40 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start text-xs font-mono mb-1">
                      <span className={`font-bold ${n.read ? 'text-[var(--text-muted)]' : 'text-indigo-400'}`}>
                        {n.title}
                      </span>
                      <span className="text-[var(--text-subtle)] text-[10px]">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{n.message}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 13: COMMITTEE HANDOVER & MEMORY (Phase 15)       */}
          {/* ==================================================== */}
          {currentTab === 'handover' && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Committee Handover & Institutional Memory</h2>
                  <p className="text-xs text-[var(--text-muted)]">Prevent knowledge loss across graduating committee batches.</p>
                </div>
                {canSignHandover && (
                  <button
                    onClick={() => setShowHandoverModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Create Handover Record
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {handoverRecords.map((rec, idx) => (
                  <div key={idx} className="glass-card p-6 border border-purple-500/30 space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Executive Handover Record</span>
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Term {rec.year}</h3>
                      </div>
                      <div className="text-right text-[11px] font-mono text-[var(--text-subtle)]">
                        <div>Signed Off: {rec.signedOffBy}</div>
                        <div>Date: {rec.signOffDate}</div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[var(--text-subtle)] block text-[10px]">EVENTS COMPLETED</span>
                        <span className="text-xl font-bold text-indigo-400">{rec.completedEvents}</span>
                      </div>
                      <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[var(--text-subtle)] block text-[10px]">PROJECTS DELIVERED</span>
                        <span className="text-xl font-bold text-cyan-400">{rec.completedProjects}</span>
                      </div>
                      <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[var(--text-subtle)] block text-[10px]">ARCHIVED RECORDS</span>
                        <span className="text-xl font-bold text-purple-400">{rec.archivedRecordsCount}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase font-bold text-amber-300">Institutional Notes & Operational Secrets</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-muted)]">
                        {rec.importantNotes.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                      <h4 className="text-xs font-mono uppercase font-bold text-indigo-300">Pending Handover Responsibilities</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-muted)]">
                        {rec.pendingTasks.map((t, tIdx) => (
                          <li key={tIdx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 14: SETTINGS & PERMISSIONS (Phase 16)           */}
          {/* ==================================================== */}
          {currentTab === 'settings' && (
            <div className="glass-card p-8 border border-[var(--border-subtle)] max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Command Center Settings</h2>
                <p className="text-xs text-[var(--text-muted)]">Operational configuration and prototype permission controls.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-2">
                  <span className="font-bold block text-sm">Role-Based Access Matrix</span>
                  <p className="text-[var(--text-muted)]">
                    Current active user role is <strong className="text-indigo-400">{currentUserRole}</strong>.
                    Permissions are enforced across all navigation tabs, creation buttons, promotion modals, and faculty approval flows.
                  </p>
                </div>

                <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-2">
                <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-rose-500/30 space-y-3">
                  <div>
                    <span className="font-bold block text-sm text-rose-400">Reset Demo Data</span>
                    <p className="text-[var(--text-muted)] mt-1">
                      Clear all locally registered passes, modified events, added members, and custom promotions back to initial synthetic seed data.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onResetData}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset All Custom Data
                  </button>
                </div>

                  <span className="font-bold block text-sm">Local Client-Side Storage</span>
                  <p className="text-[var(--text-muted)]">
                    All created events, member promotions, registrations, and attendance updates persist across page reloads via centralized state sync.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==================================================== */}
      {/* 3. MODALS FOR COMMAND CENTER OPERATIONS              */}
      {/* ==================================================== */}

      {/* A. ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Add New Member to Roster</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onAddMember({
                  id: `m-${Date.now()}`,
                  name: newMemberName,
                  email: newMemberEmail,
                  role: newMemberRole,
                  department: 'Computer Science',
                  branch: newMemberBranch,
                  year: newMemberYear,
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                  bio: 'Passionate engineering student excited to contribute to club projects.',
                  status: 'Active',
                  joinedDate: new Date().toISOString().split('T')[0],
                  team: newMemberTeam,
                  skills: newMemberSkills.split(',').map(s => s.trim()),
                  attendanceRate: 100,
                  tasksCompleted: 0
                });
                setShowAddMemberModal(false);
                setNewMemberName('');
                setNewMemberEmail('');
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.s@git.edu"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Branch</label>
                  <input
                    type="text"
                    required
                    value={newMemberBranch}
                    onChange={(e) => setNewMemberBranch(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Year</label>
                  <select
                    value={newMemberYear}
                    onChange={(e) => setNewMemberYear(e.target.value as Member['year'])}
                    className="w-full text-xs"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Team Wing</label>
                  <select
                    value={newMemberTeam}
                    onChange={(e) => setNewMemberTeam(e.target.value as TeamType)}
                    className="w-full text-xs"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Events">Events</option>
                    <option value="Design & Media">Design & Media</option>
                    <option value="Operations">Operations</option>
                    <option value="Public Relations">Public Relations</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as Member['role'])}
                    className="w-full text-xs"
                  >
                    <option value="Member">Member</option>
                    <option value="Committee Member">Committee Member</option>
                    <option value="Committee Head">Committee Head</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newMemberSkills}
                  onChange={(e) => setNewMemberSkills(e.target.value)}
                  className="w-full text-xs"
                  placeholder="e.g. React, Python, C++, Docker"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2"
              >
                Save Member Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* B. CREATE EVENT MODAL */}
      {showCreateEventModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Create New Event</h3>
              <button onClick={() => setShowCreateEventModal(false)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const nativeEvent = e.nativeEvent as any;
                const isSubmittingForReview = nativeEvent?.submitter?.dataset?.action === 'review';
                const parsedCapacity = Math.max(10, parseInt(newEventCapacity, 10) || 100);

                onCreateEvent({
                  id: `e-${Date.now()}`,
                  title: newEventTitle,
                  category: newEventCategory,
                  date: newEventDate,
                  time: newEventTime,
                  venue: newEventVenue,
                  speaker: newEventSpeaker || 'GIT Club Mentors',
                  organizer: newEventOrganizer,
                  submittedBy: currentUserRole,
                  submittedById: 'curr-user',
                  capacity: parsedCapacity,
                  registeredCount: 0,
                  deadline: newEventDeadline,
                  description: newEventDescription,
                  poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
                  status: isSubmittingForReview ? 'Faculty Review' : 'Draft',
                  facultyApprovalStatus: 'Pending',
                  tags: [newEventCategory, 'Campus']
                });
                setShowCreateEventModal(false);
                setNewEventTitle('');
                setNewEventDescription('');
                setNewEventCapacity('100');
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web3 Architecture Deep Dive"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as EventItem['category'])}
                    className="w-full text-xs"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical Session">Technical Session</option>
                    <option value="Competition">Competition</option>
                    <option value="Project Expo">Project Expo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Venue</label>
                  <input
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Capacity (Attendees)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 100"
                    value={newEventCapacity}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setNewEventCapacity(val);
                    }}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Registration Deadline</label>
                  <input
                    type="date"
                    value={newEventDeadline}
                    onChange={(e) => setNewEventDeadline(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full text-xs"
                  placeholder="Outline the session takeaways, prerequisite tools, and schedule."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  data-action="draft"
                  className="flex-1 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold rounded-xl"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  data-action="review"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow"
                >
                  Submit for Faculty Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. CREATE PROJECT MODAL */}
      {showCreateProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Add Project to Portfolio</h3>
              <button onClick={() => setShowCreateProjectModal(false)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateProject({
                  id: `p-${Date.now()}`,
                  title: newProjectTitle,
                  description: newProjectDesc,
                  lead: newProjectLead,
                  team: [newProjectLead],
                  technologies: newProjectTech.split(',').map(t => t.trim()),
                  year: '2026',
                  status: 'Planning',
                  progress: 10,
                  deadline: newProjectDeadline
                });
                setShowCreateProjectModal(false);
                setNewProjectTitle('');
                setNewProjectDesc('');
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus LoRa Mesh Network"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Project Lead</label>
                  <input
                    type="text"
                    value={newProjectLead}
                    onChange={(e) => setNewProjectLead(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Deadline</label>
                  <input
                    type="date"
                    value={newProjectDeadline}
                    onChange={(e) => setNewProjectDeadline(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={newProjectTech}
                  onChange={(e) => setNewProjectTech(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* D. ASSIGN TASK MODAL */}
      {showCreateTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Assign Responsibility Task</h3>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateTask({
                  id: `tsk-${Date.now()}`,
                  title: newTaskTitle,
                  assignee: newTaskAssignee,
                  relatedType: 'Event',
                  relatedName: newTaskRelated,
                  priority: newTaskPriority,
                  deadline: newTaskDeadline,
                  status: 'To Do'
                });
                setShowCreateTaskModal(false);
                setNewTaskTitle('');
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm speaker hotel logistics and flight vouchers"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Assignee</label>
                  <input
                    type="text"
                    required
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Related Event / Project</label>
                  <input
                    type="text"
                    value={newTaskRelated}
                    onChange={(e) => setNewTaskRelated(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as CommitteeTask['priority'])}
                    className="w-full text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Deadline</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2"
              >
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* E. CREATE ANNOUNCEMENT MODAL */}
      {showCreateAnnouncementModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Publish Official Announcement</h3>
              <button onClick={() => setShowCreateAnnouncementModal(false)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateAnnouncement({
                  id: `ann-${Date.now()}`,
                  title: newAnnTitle,
                  shortDescription: newAnnDesc,
                  fullContent: newAnnContent || newAnnDesc,
                  category: newAnnCategory,
                  targetAudience: newAnnAudience,
                  date: new Date().toISOString().split('T')[0],
                  author: currentUserName,
                  authorRole: 'Club Head',
                  status: 'Published'
                });
                setShowCreateAnnouncementModal(false);
                setNewAnnTitle('');
                setNewAnnDesc('');
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Updates for Hackathon Tracks"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Category</label>
                  <select
                    value={newAnnCategory}
                    onChange={(e) => setNewAnnCategory(e.target.value as AnnouncementItem['category'])}
                    className="w-full text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[var(--text-subtle)]">Target Audience</label>
                  <select
                    value={newAnnAudience}
                    onChange={(e) => setNewAnnAudience(e.target.value as AnnouncementItem['targetAudience'])}
                    className="w-full text-xs"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Club Members">Club Members</option>
                    <option value="Registered Event Participants">Registered Event Participants</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Brief Summary</label>
                <input
                  type="text"
                  required
                  value={newAnnDesc}
                  onChange={(e) => setNewAnnDesc(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-2"
              >
                Publish to Campus Feed
              </button>
            </form>
          </div>
        </div>
      )}

      {/* F. CREATE HANDOVER RECORD MODAL */}
      {showHandoverModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Generate Committee Handover Record</h3>
              <button onClick={() => setShowHandoverModal(false)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateHandoverRecord({
                  year: '2026-2027',
                  previousCommittee: '2025-2026 Core Leadership (Ananya Verma & Aarav Sharma)',
                  incomingCommittee: '2026-2027 Incoming Core Council',
                  leadershipChanges: [
                    'Transition of Club Head presidency',
                    'Technical infrastructure keys transfer'
                  ],
                  completedEvents: events.filter(e => e.status === 'Completed').length,
                  completedProjects: projects.filter(p => p.status === 'Completed').length,
                  archivedRecordsCount: registrations.length + 420,
                  importantNotes: handoverNotes.split('\n').filter(Boolean),
                  pendingTasks: handoverTasks.split('\n').filter(Boolean),
                  signedOffBy: 'Ananya Verma (Club Head)',
                  signOffDate: new Date().toISOString().split('T')[0]
                });
                setShowHandoverModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Critical Institutional Notes (One per line)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. AWS grant account renewal date is March 15&#10;Security clearance letter format stored in Google Drive"
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[var(--text-subtle)]">Pending Tasks For Incoming Team (One per line)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Sign off Hackathon budget balance with faculty accountant&#10;Audit hardware lab kits"
                  value={handoverTasks}
                  onChange={(e) => setHandoverTasks(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl mt-2"
              >
                Sign & Seal Handover Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* G. MEMBER PROFILE INSPECTOR MODAL */}
      {selectedMemberProfile && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4 max-w-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMemberProfile.avatar}
                  alt={selectedMemberProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40"
                />
                <div>
                  <h3 className="text-lg font-bold">{selectedMemberProfile.name}</h3>
                  <p className="text-xs font-mono text-indigo-400">{selectedMemberProfile.role} • {selectedMemberProfile.team}</p>
                  <p className="text-[11px] text-[var(--text-subtle)] font-mono">{selectedMemberProfile.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMemberProfile(null)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2">
              <div className="p-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-subtle)] block">ATTENDANCE</span>
                <span className="font-bold text-emerald-400">{selectedMemberProfile.attendanceRate || 95}%</span>
              </div>
              <div className="p-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-subtle)] block">TASKS DONE</span>
                <span className="font-bold text-indigo-400">{selectedMemberProfile.tasksCompleted || 12}</span>
              </div>
              <div className="p-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-subtle)] block">STATUS</span>
                <span className="font-bold text-purple-400">{selectedMemberProfile.status}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-mono text-[10px] uppercase text-[var(--text-subtle)] font-bold">Bio & Background</span>
              <p className="text-[var(--text-muted)] bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-subtle)]">
                {selectedMemberProfile.bio}
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-mono text-[10px] uppercase text-[var(--text-subtle)] font-bold">Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMemberProfile.skills.map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-[10px] border border-indigo-500/20">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {selectedMemberProfile.readyForPromotion && canPromote && (
              <button
                onClick={() => {
                  onPromoteMember(selectedMemberProfile);
                  setSelectedMemberProfile(null);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Crown className="w-4 h-4 text-amber-300" /> Open Promotion Review
              </button>
            )}
          </div>
        </div>
      )}

      {/* H. COMMAND CENTER TICKET METADATA MODAL (Phase 8) */}
      {viewingTicketModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 space-y-4 max-w-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">Participation Ticket Record</h3>
              </div>
              <button onClick={() => setViewingTicketModal(null)} className="text-[var(--text-subtle)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-indigo-500/30 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-[var(--text-subtle)]">TICKET ID</span>
                <span className="font-bold text-indigo-400">{viewingTicketModal.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-subtle)]">PARTICIPANT</span>
                <span className="font-bold text-[var(--text-main)]">{viewingTicketModal.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-subtle)]">EMAIL</span>
                <span className="text-[var(--text-muted)]">{viewingTicketModal.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-subtle)]">EVENT</span>
                <span className="text-purple-300 font-bold">{viewingTicketModal.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-subtle)]">REGISTRATION DATE</span>
                <span>{viewingTicketModal.registrationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-subtle)]">PASS STATUS</span>
                <span className="text-emerald-400 font-bold">{viewingTicketModal.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-subtle)]">TICKET STATUS</span>
                <span className="text-cyan-400">{viewingTicketModal.ticketStatus}</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] text-center">
              Tickets are automatically generated and downloaded directly to the participant's device upon registration.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
