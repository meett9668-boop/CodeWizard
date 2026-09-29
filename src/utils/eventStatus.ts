import { EventItem } from '../types';

/**
 * Centralized Event Status & Registration Eligibility Helper.
 * Single source of truth across public events, event detail, participant portal, and committee center.
 */

export function isRegistrationOpen(event?: EventItem | null): boolean {
  if (!event) return false;
  return event.status === 'Registration Open' || event.status === 'Upcoming' || event.status === 'Published';
}

export function isDraft(event?: EventItem | null): boolean {
  if (!event) return false;
  return event.status === 'Draft';
}

export function isPendingFacultyApproval(event?: EventItem | null): boolean {
  if (!event) return false;
  return event.status === 'Faculty Review' || event.status === 'Submitted' || event.facultyApprovalStatus === 'Pending';
}

export function isPublished(event?: EventItem | null): boolean {
  if (!event) return false;
  return event.status === 'Published' || event.status === 'Registration Open' || event.status === 'Ongoing';
}

export function isCompleted(event?: EventItem | null): boolean {
  if (!event) return false;
  return event.status === 'Completed' || event.status === 'Archived';
}

export function isArchived(event?: EventItem | null): boolean {
  if (!event) return false;
  return event.status === 'Archived';
}