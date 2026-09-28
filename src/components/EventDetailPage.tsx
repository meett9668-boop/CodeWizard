import React from 'react';
import { EventItem } from '../types';
import { Clock, MapPin, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from './ui';

interface EventDetailPageProps {
  event: EventItem;
  onNavigate: (view: string) => void;
  onOpenRegisterModal: (event: EventItem) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onNavigate, onOpenRegisterModal }) => {
  const isUpcoming = event.status === 'Upcoming' || event.status === 'Published';
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('events')}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--ink)] hover:text-[var(--coral)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Events
      </button>

      {/* Hero Header */}
      <Card tone="sky" className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 relative h-64 sm:h-80 overflow-hidden rounded-xl border border-[var(--ink)]/20">
            <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <Badge variant="indigo">{event.category}</Badge>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--ink)] font-bold">{event.date}</span>
                <Badge variant={isUpcoming ? 'emerald' : 'neutral'} withDot>
                  {event.status}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[var(--ink)] leading-tight">{event.title}</h1>

              <div className="space-y-2 pt-2 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--ink)]" /> <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--ink)]" /> <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--ink)]" />{' '}
                  <span>
                    Capacity: {event.capacity} ({event.registeredCount} Registered)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[var(--ink)]/15">
              {isUpcoming ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onOpenRegisterModal(event)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Register Now for Event
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button disabled variant="outline" className="w-full">
                  Registrations Closed
                </Button>
              )}
              <p className="text-[11px] text-center font-mono text-[var(--text-muted)]">
                Deadline: {event.deadline} • Seats remaining: {seatsLeft}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-3">
            <h2 className="text-xl font-bold text-[var(--ink)]">About the Event</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </Card>

          {/* Speakers & Hosts */}
          <Card className="p-6 space-y-3">
            <h3 className="text-lg font-bold text-[var(--ink)]">Keynote Speaker & Host</h3>
            <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--yellow)] text-[var(--ink)] border border-[var(--ink)] flex items-center justify-center font-bold text-lg">
                🎙️
              </div>
              <div>
                <h4 className="text-base font-bold text-[var(--ink)]">{event.speaker}</h4>
                <p className="text-xs text-[var(--text-muted)]">Organized by: {event.organizer}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Event Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--ink)]">Event Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Category</span>
                <span className="font-semibold text-[var(--coral)]">{event.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Date</span>
                <span className="font-mono text-[var(--ink)]">{event.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Time</span>
                <span className="font-mono text-[var(--ink)]">{event.time}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Venue</span>
                <span className="font-semibold text-[var(--ink)]">{event.venue}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Registration Deadline</span>
                <span className="font-mono text-[var(--coral)]">{event.deadline}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-2">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag, i) => (
                  <Badge key={i} variant="amber">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
