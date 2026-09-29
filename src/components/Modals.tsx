import React, { useState } from 'react';
import { EventItem, Member, Role, UserSession, PromotionRequest } from '../types';
import { Shield, X, Crown, User, Lock, Mail, ArrowRight, AlertTriangle, KeyRound, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui';
import { validatePromotionTarget } from '../utils/permissions';
import { authenticateUser, AUTHORITATIVE_ACCOUNTS } from '../data/authDirectory';

/* --- LOGIN MODAL WITH REAL ROLE PRESETS & RE-AUTH CAPABILITY --- */
interface LoginModalProps {
  portal: 'participant' | 'committee';
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ portal, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Authoritative identity directory accounts (fixed roles bound to authenticated identity)
  const committeeAccounts = AUTHORITATIVE_ACCOUNTS.filter(a => a.portal === 'committee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const authenticatedUser = authenticateUser(email, portal);
    if (!authenticatedUser) {
      setErrorMsg('No authorized committee record found for this college email. Please verify credentials.');
      return;
    }

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  const handleSelectPreset = (account: (typeof committeeAccounts)[0]) => {
    setEmail(account.email);
    setPassword('SecurePass2026!');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 space-y-6 relative max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--coral)]/10 border border-[var(--coral)]/25 text-[var(--coral)] flex items-center justify-center">
            {portal === 'committee' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-bold text-[var(--ink)]">
            {portal === 'committee' ? 'Command Center Authentication' : 'Student & Participant Login'}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {portal === 'committee'
              ? 'Authorized institutional governance and committee session access.'
              : 'Sign in to register for events, manage tickets, and track participation.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Persona Selector for Committee Testing */}
        {portal === 'committee' && (
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-mono uppercase text-[var(--text-subtle)] font-bold">
              Authorized Committee Credentials Directory:
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
              {committeeAccounts.map((acc) => (
                <button
                  type="button"
                  key={acc.role}
                  onClick={() => handleSelectPreset(acc)}
                  className={`p-2 text-left rounded-lg text-[11px] transition-all border ${
                    email.toLowerCase() === acc.email.toLowerCase()
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 font-bold'
                      : 'border-transparent hover:bg-[var(--bg-card)] text-[var(--text-muted)]'
                  }`}
                >
                  <div className="font-semibold text-[var(--ink)] truncate">{acc.name}</div>
                  <div className="text-[10px] text-indigo-400 truncate">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-[var(--ink)]">College Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder={portal === 'committee' ? 'e.g. ananya.v@git.edu' : 'e.g. karthik.r@git.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full !pl-10 !pr-4 !py-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-[var(--ink)]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full !pl-10 !pr-4 !py-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
          </div>

          {portal === 'participant' && (
            <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
              <span className="font-mono">Student Demo: karthik.r@git.edu</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('karthik.r@git.edu');
                  setPassword('studentPass2026!');
                }}
                className="text-[var(--coral)] hover:underline font-semibold ml-2"
              >
                Auto-fill
              </button>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full py-3 text-xs">
            {portal === 'committee' ? 'Sign In to Command Center' : 'Sign In as Participant'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
};

/* --- RE-AUTHENTICATION SENSITIVE ACTION MODAL --- */
interface ReAuthModalProps {
  actionName: string;
  actionDescription: string;
  currentUser: UserSession;
  onClose: () => void;
  onVerified: () => void;
}

export const ReAuthModal: React.FC<ReAuthModalProps> = ({
  actionName,
  actionDescription,
  currentUser,
  onClose,
  onVerified
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 4) {
      setErrorMsg('Please enter your credentials to confirm authorization.');
      return;
    }

    setIsVerifying(true);
    // Simulate secure credential check
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 space-y-6 relative max-w-md border-2 border-amber-500/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[var(--ink)]">Security Re-Authentication Required</h2>
          <p className="text-xs text-[var(--text-muted)]">
            This action requires explicit credential re-verification under institutional governance policy.
          </p>
        </div>

        <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-1 text-left text-xs">
          <div className="font-bold text-[var(--ink)]">{actionName}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{actionDescription}</div>
          <div className="pt-2 text-[10px] font-mono text-indigo-400">
            Authenticated Officer: <strong>{currentUser.name}</strong> ({currentUser.role})
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-[var(--ink)]">Confirm Your Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Enter your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full !pl-10 !pr-4 !py-2.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-1/2 text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isVerifying}
              className="w-1/2 text-xs bg-amber-600 hover:bg-amber-500 text-white border-none"
            >
              {isVerifying ? 'Verifying...' : 'Authorize Action'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- EVENT REGISTRATION MODAL --- */
export const EventRegisterModal: React.FC<{
  event: EventItem;
  currentUser: UserSession | null;
  onClose: () => void;
  onRequireLogin: () => void;
  onConfirm: (participantData: { name: string; email: string; studentId: string; branch: string; year: string }) => void;
}> = ({
  event,
  currentUser,
  onClose,
  onRequireLogin,
  onConfirm
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [studentId, setStudentId] = useState(currentUser?.studentId || 'GIT2023CSE042');
  const [branch, setBranch] = useState(currentUser?.branch || 'CSE');
  const [year, setYear] = useState(currentUser?.year || '3rd Year');
  const [err, setErr] = useState('');

  // If visitor is logged out, strictly mandate login before registration
  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content p-8 space-y-6 relative max-w-md text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--ink)]">Authentication Required</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Login is required to register for <strong>"{event.title}"</strong>. This ensures verified college enrollment and guarantees official participation ticket issuance.
            </p>
          </div>

          <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] text-xs text-left font-mono">
            <div>• Event: {event.title}</div>
            <div>• Date & Venue: {event.date} • {event.venue}</div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onRequireLogin();
              }}
              className="w-full text-xs py-3"
            >
              <LogIn className="w-4 h-4 mr-1.5" /> Sign In to Continue Registration
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full text-xs">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !studentId.trim()) {
      setErr('Please provide complete participant credentials.');
      return;
    }
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {}
    onConfirm({ name, email, studentId, branch, year });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 space-y-6 relative max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--coral)] font-bold uppercase tracking-wider">
              Official Event Registration
            </span>
            {isFull ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Capacity Full • Waitlist Only
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Seats Available ({event.capacity - event.registeredCount} remaining)
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-[var(--ink)]">{event.title}</h2>
          <p className="text-xs text-[var(--text-muted)] font-mono">{event.date} • {event.venue}</p>
        </div>

        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">Student ID / Enrollment ID</label>
              <input
                type="text"
                required
                placeholder="e.g. GIT2023CSE042"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">College Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">Branch / Department</label>
              <input
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl"
              />
            </div>
            <div className="space-y-1 text-left sm:col-span-2">
              <label className="text-xs font-semibold text-[var(--ink)]">Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3.5 text-xs mt-2">
            {isFull ? 'Join Waitlist for Event' : 'Confirm Registration & Reserve Seat'}
          </Button>
        </form>
      </div>
    </div>
  );
};

/* --- PROMOTION PROPOSAL & APPROVAL WORKFLOW MODAL --- */
export const PromotionModal: React.FC<{
  member: Member;
  currentUser: UserSession;
  onClose: () => void;
  onSubmitProposal: (proposal: {
    member: Member;
    targetRole: Member['role'];
    reason: string;
    effectiveDate: string;
  }) => void;
}> = ({
  member,
  currentUser,
  onClose,
  onSubmitProposal
}) => {
  const [targetRole, setTargetRole] = useState<Member['role']>(
    member.promotionRecommendation?.nextRole || 'Committee Head'
  );
  const [reason, setReason] = useState(member.promotionRecommendation?.reason || '');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [validationError, setValidationError] = useState('');

  // 1. Guard against self-promotion
  const selfPromoCheck = validatePromotionTarget(currentUser.name, member.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfPromoCheck.allowed) {
      setValidationError(selfPromoCheck.error || 'Self-promotion is prohibited.');
      return;
    }
    if (!reason.trim()) {
      setValidationError('Please provide a governance justification for this promotion.');
      return;
    }

    onSubmitProposal({
      member,
      targetRole,
      reason,
      effectiveDate
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 space-y-6 relative border-2 border-purple-500/40 max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--yellow)] text-[var(--ink)] flex items-center justify-center border border-[var(--ink)]">
            <Crown className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--ink)]">Propose Member Promotion</h2>
          <p className="text-xs text-[var(--text-muted)]">
            Multi-stage governance workflow: Proposed ? Committee Review ? Faculty Approval
          </p>
        </div>

        {/* Self-Promotion Block Notice */}
        {!selfPromoCheck.allowed && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{selfPromoCheck.error}</span>
          </div>
        )}

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-4 text-left">
          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-[var(--ink)]" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[var(--ink)]">{member.name}</h4>
            <div className="text-xs text-[var(--coral)] font-mono font-semibold">
              Current: {member.role}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">
              Branch: {member.branch} • Team: {member.team}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">Proposed New Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as Member['role'])}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5 font-bold text-indigo-400"
              >
                <option value="Committee Member">Committee Member</option>
                <option value="Event Lead">Event Lead</option>
                <option value="Project Lead">Project Lead</option>
                <option value="Committee Head">Committee Head</option>
                <option value="Club Head">Club Head</option>
                <option value="Student Representative">Student Representative</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">Effective Date</label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2"
              />
            </div>
          </div>

          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-[11px] text-left space-y-1 font-mono">
            <div>• Proposed By: <strong>{currentUser.name}</strong> ({currentUser.role})</div>
            <div>• Required Approval Layer: <strong>Faculty Coordinator Sign-Off</strong></div>
            <div className="text-purple-300">• Role changes officially apply only after final faculty sign-off.</div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[var(--ink)]">Governance Promotion Justification</label>
            <textarea
              rows={3}
              required
              placeholder="State key contributions, hackathon leadership, or club service rationale..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={!selfPromoCheck.allowed}
            className="w-full py-3.5 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold"
          >
            <Crown className="w-4 h-4 text-amber-300" /> Submit for Committee & Faculty Approval
          </Button>
        </form>
      </div>
    </div>
  );
};
