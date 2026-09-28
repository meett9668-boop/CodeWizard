import React, { useState } from 'react';
import { EventItem, Member } from '../types';
import { Shield, X, Crown, User, Lock, Mail, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui';

/* --- LOGIN MODAL --- */
interface LoginModalProps {
  portal: 'participant' | 'committee';
  onClose: () => void;
  onLoginSuccess: (portal: 'participant' | 'committee', role?: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ portal, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(portal);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-8 space-y-6 relative">
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
            {portal === 'committee' ? 'Command Center Authentication' : 'Welcome to GIT Club'}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {portal === 'committee' ? 'Manage. Lead. Build.' : 'Discover. Participate. Grow.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-[var(--ink)]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder={portal === 'committee' ? 'e.g. ananya.v@git.edu' : 'e.g. karthik.r@git.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full !pl-10 !pr-4 !py-2.5 text-xs"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full !pl-10 !pr-4 !py-2.5 text-xs"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span className="font-mono">Demo: {portal === 'committee' ? 'ananya.v@git.edu' : 'karthik.r@git.edu'}</span>
            <button
              type="button"
              onClick={() => {
                setEmail(portal === 'committee' ? 'ananya.v@git.edu' : 'karthik.r@git.edu');
                setPassword('password123');
              }}
              className="text-[var(--coral)] hover:underline font-semibold ml-2"
            >
              Auto-fill
            </button>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-xs">
            {portal === 'committee' ? 'Enter Command Center' : 'Continue to Portal'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
};

/* --- EVENT REGISTRATION MODAL --- */
export const EventRegisterModal: React.FC<{
  event: EventItem;
  onClose: () => void;
  onConfirm: (participantData: { name: string; email: string; branch: string; year: string }) => void;
}> = ({
  event,
  onClose,
  onConfirm
}) => {
  const [name, setName] = useState('Karthik Raja');
  const [email, setEmail] = useState('karthik.r@git.edu');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('3rd Year');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    onConfirm({ name, email, branch, year });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1.5 text-left">
          <span className="text-[11px] font-mono text-[var(--coral)] font-bold uppercase tracking-wider">
            Event Registration
          </span>
          <h2 className="text-2xl font-bold text-[var(--ink)]">{event.title}</h2>
          <p className="text-xs text-[var(--text-muted)] font-mono">{event.date} • {event.venue}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full text-xs" />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">College Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs" />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">Branch</label>
              <input type="text" required value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full text-xs" />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[var(--ink)]">Year of Study</label>
              <input type="text" required value={year} onChange={(e) => setYear(e.target.value)} className="w-full text-xs" />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-xs mt-2">
            Confirm & Reserve Seat
          </Button>
        </form>
      </div>
    </div>
  );
};

/* --- PROMOTION MODAL --- */
export const PromotionModal: React.FC<{ member: Member; onClose: () => void; onConfirm: (member: Member, reason: string) => void }> = ({
  member,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState(member.promotionRecommendation?.reason || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    onConfirm(member, reason);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-8 space-y-6 relative border-2 border-[var(--ink)]">
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
          <h2 className="text-2xl font-bold text-[var(--ink)]">Authorize Member Promotion</h2>
          <p className="text-xs text-[var(--text-muted)]">Official Governance Elevation Record</p>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-4 text-left">
          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-[var(--ink)]" />
          <div>
            <h4 className="text-sm font-bold text-[var(--ink)]">{member.name}</h4>
            <div className="text-xs text-[var(--coral)] font-mono font-semibold">
              Current: {member.role} ➔ <span className="text-[var(--ink)] font-bold">{member.promotionRecommendation?.nextRole}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[var(--ink)]">Governance Promotion Justification</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-3.5 text-xs flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-white" /> Execute Promotion & Publish to History
          </Button>
        </form>
      </div>
    </div>
  );
};
