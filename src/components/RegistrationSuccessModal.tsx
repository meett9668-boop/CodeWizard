import confetti from 'canvas-confetti';
import React from 'react';
import { TicketData } from '../types';
import {
  CheckCircle2, Download, Printer, Calendar, ExternalLink, X, QrCode,
  Ticket as TicketIcon, Clock, MapPin, User, Sparkles, AlertCircle
} from 'lucide-react';
import { Button } from './ui';
import {
  manualDownloadTicket,
  printTicketPass,
  generateIcsCalendar,
  createGoogleCalendarUrl
} from '../utils/ticketGenerator';

interface RegistrationSuccessModalProps {
  ticket: TicketData;
  onClose: () => void;
  onViewInPortal: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  ticket,
  onClose,
  onViewInPortal
}) => {
  const isWaitlist = ticket.status === 'Waitlisted';

  React.useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff5a36', '#6366f1', '#eab308', '#10b981', '#ec4899']
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff5a36', '#6366f1', '#eab308']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#ec4899', '#6366f1']
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch (e) {}
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 space-y-6 relative max-w-xl border-2 border-indigo-500/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="space-y-2 text-center">
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
            isWaitlist
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Registration Completed
          </div>

          <h2 className="text-2xl font-black text-[var(--ink)]">
            {isWaitlist ? 'Waitlist Seat Confirmed' : 'Your Seat Has Been Confirmed!'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            {isWaitlist
              ? 'Event capacity has reached its maximum threshold. You are in priority waitlist position for attendee openings.'
              : 'Your official participation pass has been securely generated and registered in the institutional ledger.'}
          </p>
        </div>

        {/* In-App Visual Pass Preview */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-md">
          {/* Top Pass Strip */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                G
              </div>
              <span className="font-mono text-xs font-bold tracking-wider">GIT CLUB PARTICIPATION PASS</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              isWaitlist ? 'bg-amber-400 text-black' : 'bg-emerald-400 text-black'
            }`}>
              {ticket.status}
            </span>
          </div>

          {/* Pass Body Content */}
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[var(--ink)]">{ticket.eventName}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {ticket.eventDate} • {ticket.eventTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" /> {ticket.eventVenue}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Attendee</div>
                <div className="font-bold text-[var(--ink)] mt-0.5 truncate">{ticket.participantName}</div>
                <div className="text-[10px] font-mono text-indigo-400 truncate">{ticket.participantEmail}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Pass Number</div>
                <div className="font-mono font-bold text-indigo-400 mt-0.5">{ticket.ticketId}</div>
                <div className="text-[10px] font-mono text-[var(--text-subtle)]">ID: {ticket.studentId || 'STUDENT'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls - Deliberate Manual Actions Only (No Automatic Downloads) */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="primary"
              onClick={() => manualDownloadTicket(ticket)}
              className="py-3 text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" /> Download Pass
            </Button>
            <Button
              variant="outline"
              onClick={() => printTicketPass(ticket)}
              className="py-3 text-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save Pass
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={createGoogleCalendarUrl(ticket)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-main)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Add to Google Calendar
            </a>
            <button
              onClick={() => generateIcsCalendar(ticket)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-main)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Download .ICS
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-subtle)]">
          <span>Saved to your account</span>
          <button
            onClick={() => {
              onClose();
              onViewInPortal();
            }}
            className="text-[var(--coral)] hover:underline font-bold"
          >
            Go to My Tickets & Registrations ?
          </button>
        </div>
      </div>
    </div>
  );
};
