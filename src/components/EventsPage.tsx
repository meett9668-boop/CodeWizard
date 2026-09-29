import React, { useState } from 'react';
import { EventItem } from '../types';
import { Bookmark, Clock, MapPin, Users, ArrowRight, Sparkles, Search } from 'lucide-react';
import { Card, Badge, Button, Table, TableHead } from './ui';

interface EventsPageProps {
  events: EventItem[];
  onNavigate: (view: string, id?: string) => void;
  onOpenRegisterModal: (event: EventItem) => void;
  initialSearch?: string;
  onSearchChange?: (val: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, onNavigate, onOpenRegisterModal, initialSearch = '', onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  React.useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const handleSearchTermChange = (val: string) => {
    setSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const categories = ['All', 'Workshop', 'Hackathon', 'Technical Session', 'Project Expo'];
  const tones: Array<'yellow' | 'lavender' | 'sky'> = ['yellow', 'lavender', 'sky'];

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Workshop':
        return 'indigo';
      case 'Hackathon':
        return 'amber';
      case 'Technical Session':
        return 'purple';
      case 'Project Expo':
        return 'cyan';
      default:
        return 'neutral';
    }
  };

  // Avatar stack mock images
  const studentAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading Left, Filter Pills Right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
            Courses & Workshops
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Build production-grade skills through hands-on bootcamps and team sprints.
          </p>
        </div>

        {/* Search Input & Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, topic..."
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="w-full pl-9 pr-3 search-input-pill"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* 3-Column Card Grid with pastel tones (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event, idx) => {
          const tone = tones[idx % tones.length];
          const isBookmarked = bookmarkedIds.includes(event.id);
          const percent = Math.min(
            100,
            Math.round((event.registeredCount / Math.max(1, event.capacity)) * 100)
          );

          return (
            <Card
              key={event.id}
              tone={tone}
              className="flex flex-col justify-between h-full p-5"
            >
              <div>
                {/* Header: Badge Chip top-left, Bookmark icon top-right */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant={getCategoryBadgeVariant(event.category)} withDot>
                    {event.category}
                  </Badge>
                  <button
                    onClick={() => toggleBookmark(event.id)}
                    className="p-1.5 rounded-full hover:bg-black/5 text-[var(--ink)] transition-colors"
                    aria-label="Bookmark course"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-[var(--ink)] text-[var(--ink)]' : 'text-[var(--ink)]'
                      }`}
                    />
                  </button>
                </div>

                {/* 2-Line Title */}
                <h3
                  onClick={() => onNavigate('event-detail', event.id)}
                  className="font-bold text-base sm:text-lg text-[var(--ink)] line-clamp-2 leading-snug cursor-pointer hover:opacity-85 transition-opacity"
                >
                  {event.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Meta stats */}
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono mt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--ink)]" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--ink)]" /> {event.venue.split('(')[0]}
                  </span>
                </div>

                {/* Progress x/y label with thick rounded progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
                    <span>Progress {event.registeredCount}/{event.capacity}</span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{percent}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>

              {/* Bottom: Avatar Stack + Button */}
              <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-[var(--ink)]/10">
                <div className="avatar-stack">
                  {studentAvatars.map((src, i) => (
                    <img key={i} src={src} alt="Student avatar" />
                  ))}
                  <span className="avatar-more">+{(idx + 1) * 7}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('event-detail', event.id)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenRegisterModal(event)}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Row: 2/3 Next Items Table Card + 1/3 Dark Promo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        
        {/* 2/3 Next Items Table Card */}
        <div className="lg:col-span-8">
          <Card className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--ink)]">
                    Upcoming Sessions & Workshops
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Verified tracks with syllabus checkpoints & active speaker slots
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All
                </Button>
              </div>

              <Table>
                <TableHead columns={['Session Name', 'Track', 'Date & Time', 'Mentor / Lead', 'Action']} />
                <tbody>
                  {events.slice(0, 4).map((item) => (
                    <tr key={item.id}>
                      <td className="font-semibold text-[var(--ink)]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--coral)] shrink-0" />
                          <span className="line-clamp-1">{item.title}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant={getCategoryBadgeVariant(item.category)}>
                          {item.category}
                        </Badge>
                      </td>
                      <td className="text-xs text-[var(--text-muted)] font-mono whitespace-nowrap">
                        {item.date} • {item.time}
                      </td>
                      <td className="text-xs text-[var(--text-main)] font-medium">
                        {item.speaker || 'GIT Core Lead'}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => onOpenRegisterModal(item)}
                          className="text-xs font-bold text-[var(--coral)] hover:underline inline-flex items-center gap-1"
                        >
                          Join <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>

        {/* 1/3 Promo Card (Dark Tone with Yellow Badge, Avatar Stack, Coral Button) */}
        <div className="lg:col-span-4">
          <Card tone="dark" className="h-full flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="amber" withDot>
                  Special Sprint
                </Badge>
                <Sparkles className="w-4 h-4 text-[var(--yellow)]" />
              </div>

              <div>
                <h4 className="text-xl font-bold tracking-tight text-white">
                  Join Code Wizards Hackathon
                </h4>
                <p className="text-xs text-[#d9d9d9] mt-2 leading-relaxed">
                  Compete in teams of 2–4 to build transformative developer tooling and AI workflows. 
                  Direct mentorship from industry alumni.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-white/80">Active Builders Registered</div>
                <div className="avatar-stack">
                  {studentAvatars.map((src, i) => (
                    <img key={i} src={src} alt="Builder" />
                  ))}
                  <span className="avatar-more accent">+42</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full mt-6"
              onClick={() => onNavigate('events')}
            >
              Explore Full Track
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
};
