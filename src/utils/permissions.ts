import { Role } from '../types';

/**
 * Authoritative permissions checking module for GIT Club Platform.
 * Enforces role-based boundaries on UI, actions, and routes.
 */

// Role hierarchy rank for comparison
export const ROLE_HIERARCHY: Record<Role, number> = {
  'Participant': 0,
  'Member': 1,
  'Committee Member': 2,
  'Event Lead': 3,
  'Project Lead': 3,
  'Committee Head': 4,
  'Club Head / Admin': 5,
  'Admin / Club Head': 5,
  'Student Representative': 5,
  'Faculty Coordinator': 6,
};

// Check if user has permission to enter Command Center at all
export function canAccessCommandCenter(role?: Role | null): boolean {
  if (!role) return false;
  return role !== 'Participant' && role !== 'Member';
}

// Check if user is a faculty member
export function isFaculty(role?: Role | null): boolean {
  return role === 'Faculty Coordinator';
}

// Check if user is executive leadership (Club Head or Student Rep)
export function isExecutiveLeadership(role?: Role | null): boolean {
  return role === 'Club Head / Admin' || role === 'Admin / Club Head' || role === 'Student Representative';
}

// Can promote or propose promotions
// General Committee Members cannot promote!
export function canProposePromotion(role?: Role | null): boolean {
  if (!role) return false;
  return role === 'Club Head / Admin' || role === 'Admin / Club Head' || role === 'Student Representative' || role === 'Committee Head';
}

// Can review promotion at Committee level
export function canReviewPromotion(role?: Role | null): boolean {
  return isExecutiveLeadership(role);
}

// Faculty approval is strictly required for final promotion and institutional event approval
export function canFacultyApprove(role?: Role | null): boolean {
  return role === 'Faculty Coordinator';
}

// Can create event drafts
export function canCreateEvent(role?: Role | null): boolean {
  if (!role) return false;
  return [
    'Club Head / Admin',
    'Admin / Club Head',
    'Student Representative',
    'Committee Head',
    'Event Lead'
  ].includes(role);
}

// Can edit assigned/existing events
export function canManageEvents(role?: Role | null): boolean {
  return canCreateEvent(role);
}

// Can submit an event for faculty approval
export function canSubmitEventForApproval(role?: Role | null): boolean {
  return canCreateEvent(role);
}

// Can approve event internally before faculty review
export function canCommitteeReviewEvent(role?: Role | null): boolean {
  return isExecutiveLeadership(role);
}

// Can publish event once approved by Faculty
export function canPublishEvent(role?: Role | null): boolean {
  if (!role) return false;
  return isExecutiveLeadership(role) || role === 'Committee Head' || role === 'Faculty Coordinator';
}

// Can manage projects
export function canManageProjects(role?: Role | null): boolean {
  if (!role) return false;
  return [
    'Club Head / Admin',
    'Student Representative',
    'Committee Head',
    'Project Lead'
  ].includes(role);
}

// Can manage members / add members
export function canManageMembers(role?: Role | null): boolean {
  if (!role) return false;
  return isExecutiveLeadership(role) || role === 'Committee Head';
}

// Can create campus-wide announcements
export function canCreateAnnouncement(role?: Role | null): boolean {
  if (!role) return false;
  return isExecutiveLeadership(role) || role === 'Committee Head' || role === 'Faculty Coordinator';
}

// Can assign tasks to committee
export function canAssignTasks(role?: Role | null): boolean {
  if (!role) return false;
  return isExecutiveLeadership(role) || role === 'Committee Head' || role === 'Event Lead' || role === 'Project Lead';
}

// Can sign handover documents
export function canSignHandover(role?: Role | null): boolean {
  return isExecutiveLeadership(role) || role === 'Faculty Coordinator';
}

// Can view attendance and check-in
export function canManageAttendance(role?: Role | null): boolean {
  return canAccessCommandCenter(role);
}

// Guard against Self-Promotion
export function validatePromotionTarget(currentUserId: string, targetMemberId: string): { allowed: boolean; error?: string } {
  if (currentUserId === targetMemberId) {
    return {
      allowed: false,
      error: 'Self-promotion is strictly prohibited. An authorized leader must propose promotions for other members.'
    };
  }
  return { allowed: true };
}

// Check route permissions for Command Center tabs
export function canAccessCommandTab(tabId: string, role?: Role | null): boolean {
  if (!canAccessCommandCenter(role)) return false;

  switch (tabId) {
    case 'dashboard':
    case 'events':
    case 'registrations':
    case 'attendance':
    case 'tasks':
    case 'analytics':
    case 'notifications':
    case 'settings':
      return true;

    case 'members':
      return true; // Read-only for general committee; edit protected by action guards

    case 'promotions':
      // Only leadership, committee heads, and faculty
      return canProposePromotion(role) || isFaculty(role);

    case 'approvals':
      // Executive leaders review; Faculty gives final approval
      return isExecutiveLeadership(role) || isFaculty(role) || role === 'Committee Head';

    case 'projects':
      return canManageProjects(role) || role === 'Committee Member';

    case 'announcements':
      return true; // Visible to committee, create guarded

    case 'handover':
      return true; // Visible to committee, sign guarded

    default:
      return false;
  }
}
