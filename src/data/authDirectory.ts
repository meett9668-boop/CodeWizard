import { Role, UserSession } from '../types';

/**
 * Authoritative Identity & Roster Directory.
 * Represents server-side identity registry mapping authentic credentials to fixed, unalterable roles.
 * Users cannot choose or manipulate their role in the client.
 */

export interface AuthoritativeAccount {
  id: string;
  email: string;
  name: string;
  role: Role;
  portal: 'participant' | 'committee';
  studentId?: string;
  branch?: string;
  year?: string;
  avatar: string;
}

export const AUTHORITATIVE_ACCOUNTS: AuthoritativeAccount[] = [
  // 1. FACULTY COORDINATOR (Approver)
  {
    id: 'usr-suresh-patil',
    email: 'coordinator.gitclub@git.edu',
    name: 'Dr. Suresh V. Patil',
    role: 'Faculty Coordinator',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  // 2. CLUB HEAD / ADMIN
  {
    id: 'usr-ananya-verma',
    email: 'ananya.v@git.edu',
    name: 'Ananya Verma',
    role: 'Club Head / Admin',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  // 3. STUDENT REPRESENTATIVE
  {
    id: 'usr-aarav-sharma',
    email: 'aarav.sharma@git.edu',
    name: 'Aarav Sharma',
    role: 'Student Representative',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  // 4. COMMITTEE HEAD (Technical)
  {
    id: 'usr-rohan-deshmukh',
    email: 'rohan.d@git.edu',
    name: 'Rohan Deshmukh',
    role: 'Committee Head',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  // 5. EVENT LEAD (Events Wing)
  {
    id: 'usr-priya-kulkarni',
    email: 'priya.k@git.edu',
    name: 'Priya Kulkarni',
    role: 'Event Lead',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  // 6. PROJECT LEAD (AI & Systems)
  {
    id: 'usr-diya-nair',
    email: 'diya.n@git.edu',
    name: 'Diya Nair',
    role: 'Project Lead',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
  },
  // 7. COMMITTEE MEMBER (Operational)
  {
    id: 'usr-sneha-patil',
    email: 'sneha.p@git.edu',
    name: 'Sneha Patil',
    role: 'Committee Member',
    portal: 'committee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  // 8. PARTICIPANT / STUDENT
  {
    id: 'usr-karthik-raja',
    email: 'karthik.r@git.edu',
    name: 'Karthik Raja',
    role: 'Participant',
    portal: 'participant',
    studentId: 'GIT2023CSE042',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

/**
 * Resolves authenticated identity from email.
 * Role is strictly bound to the authenticated record and cannot be client-overridden.
 */
export function authenticateUser(email: string, portal: 'participant' | 'committee'): UserSession | null {
  const normalizedEmail = email.trim().toLowerCase();
  const match = AUTHORITATIVE_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail
  );

  if (match) {
    return {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      portal: match.portal,
      studentId: match.studentId,
      branch: match.branch,
      year: match.year,
      avatar: match.avatar
    };
  }

  // If email is not in registered accounts:
  if (portal === 'participant') {
    return {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'Participant', // Strictly participant, cannot elevate
      portal: 'participant',
      studentId: 'GIT-ENROLL-PENDING',
      branch: 'Engineering',
      year: '1st Year',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  }

  return null;
}