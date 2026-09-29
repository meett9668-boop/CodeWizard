export type Role =
  | 'Participant'
  | 'Admin / Club Head'
  | 'Member'
  | 'Committee Member'
  | 'Event Lead'
  | 'Project Lead'
  | 'Committee Head'
  | 'Club Head / Admin'
  | 'Student Representative'
  | 'Faculty Coordinator';

export type MemberStatus = 'Applicant' | 'Active' | 'Committee' | 'Alumni' | 'Inactive';

export type TeamType =
  | 'Technical'
  | 'Events'
  | 'Design & Media'
  | 'Public Relations'
  | 'Logistics'
  | 'Operations';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  portal: 'public' | 'participant' | 'committee';
  studentId?: string;
  branch?: string;
  year?: string;
  avatar?: string;
}

export interface Member {
  id: string;
  name: string;
  role: 'Student Representative' | 'Club Head' | 'Committee Head' | 'Event Lead' | 'Project Lead' | 'Committee Member' | 'Member';
  department: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  branch: string;
  email: string;
  avatar: string;
  bio: string;
  github?: string;
  linkedin?: string;
  status: MemberStatus;
  joinedDate: string;
  team: TeamType;
  skills: string[];
  eventsContributed?: string[];
  projectsContributed?: string[];
  tasksCompleted?: number;
  attendanceRate?: number;
  readyForPromotion?: boolean;
  promotionRecommendation?: {
    nextRole: Member['role'];
    reason: string;
    contributions: string[];
  };
}

export type PromotionStatus =
  | 'Draft'
  | 'Pending Committee Review'
  | 'Pending Faculty Approval'
  | 'Approved'
  | 'Rejected'
  | 'Changes Requested'
  | 'Cancelled';

export interface PromotionRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  currentRole: Member['role'];
  targetRole: Member['role'];
  reason: string;
  effectiveDate: string;
  proposedBy: string;
  proposedById: string;
  status: PromotionStatus;
  committeeReviewer?: string;
  committeeRemarks?: string;
  facultyReviewer?: string;
  facultyRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionHistory {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  fromRole: string;
  toRole: string;
  reason: string;
  date: string;
  promotedBy: string;
  approvedByFaculty?: string;
}

export type EventStatus =
  | 'Draft'
  | 'Faculty Review'
  | 'Submitted'
  | 'Pending Faculty Review'
  | 'Approved'
  | 'Published'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Ongoing'
  | 'Completed'
  | 'Archived'
  | 'Upcoming';

export type FacultyApprovalStatus = 'Pending' | 'Approved' | 'Changes Requested' | 'Rejected';

export interface EventItem {
  id: string;
  title: string;
  category: 'Workshop' | 'Hackathon' | 'Technical Session' | 'Competition' | 'Project Expo';
  date: string;
  time: string;
  venue: string;
  speaker: string;
  organizer: string;
  submittedBy?: string;
  submittedById?: string;
  description: string;
  poster: string;
  registeredCount: number;
  capacity: number;
  deadline: string;
  status: EventStatus;
  facultyApprovalStatus: FacultyApprovalStatus;
  facultyReviewer?: string;
  facultyReviewDate?: string;
  facultyRemarks?: string;
  featured?: boolean;
  tags: string[];
}

export interface TicketData {
  ticketId: string;
  registrationId: string;
  participantName: string;
  participantEmail: string;
  studentId?: string;
  branch?: string;
  year?: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  registrationDate: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled';
  generatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  studentId?: string;
  branch: string;
  year: string;
  registrationDate: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled';
  attendance: 'Attended' | 'Absent' | 'Pending';
  ticketId: string;
  ticketStatus: 'Generated' | 'Pending';
  ticketGeneratedAt: string;
}

export type ProjectStatus =
  | 'Proposal'
  | 'Approved'
  | 'Planning'
  | 'Development'
  | 'Testing'
  | 'Completed'
  | 'Showcase'
  | 'Archived';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  team: string[];
  lead: string;
  technologies: string[];
  year: string;
  status: ProjectStatus;
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  deadline: string;
  image?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Overdue';

export interface CommitteeTask {
  id: string;
  title: string;
  assignee: string;
  assigneeAvatar?: string;
  relatedType: 'Event' | 'Project' | 'General';
  relatedId?: string;
  relatedName: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Award' | 'Competition' | 'Certification' | 'Milestone';
  event: string;
  position: string;
  teamMembers: string[];
  date: string;
  description: string;
  badge: string;
  image?: string;
}

export type AnnouncementAudience =
  | 'Everyone'
  | 'Club Members'
  | 'Registered Event Participants'
  | 'Specific Event Participants';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'General' | 'Event' | 'Recruitment' | 'Project' | 'Urgent';
  shortDescription: string;
  fullContent?: string;
  date: string;
  author: string;
  authorRole: string;
  targetAudience: AnnouncementAudience;
  image?: string;
  status: 'Draft' | 'Review' | 'Published' | 'Archived';
}

export interface FacultyMember {
  id: string;
  name: string;
  role: 'Faculty Coordinator' | 'Faculty Mentor' | 'Department Head';
  department: string;
  email: string;
  office: string;
  bio: string;
  avatar: string;
}

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
  stats?: string;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'event' | 'promotion' | 'registration' | 'project' | 'announcement' | 'system' | 'approval' | 'task';
}

export interface CommitteeHandoverRecord {
  year: string;
  previousCommittee: string;
  incomingCommittee: string;
  leadershipChanges: string[];
  completedEvents: number;
  completedProjects: number;
  archivedRecordsCount: number;
  importantNotes: string[];
  pendingTasks: string[];
  signedOffBy: string;
  signOffDate: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
  category: 'event' | 'registration' | 'member' | 'promotion' | 'project' | 'task' | 'announcement' | 'attendance' | 'approval';
}
