import React from 'react';
import {
  Calendar, Clock, MapPin, Users, ArrowRight,
  Terminal, Code2, Zap, ChevronRight, Rocket, Cpu, GitBranch
} from 'lucide-react';
import { EventItem, ProjectItem, AchievementItem, AnnouncementItem } from '../types';
import { Card, Badge, Button } from './ui';

interface HomePageProps {
  onNavigate: (view: string, detailId?: string) => void;
  featuredEvent: EventItem;
  projects: ProjectItem[];
  achievements: AchievementItem[];
  announcements: AnnouncementItem[];
  onOpenRegisterModal: (event: EventItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredEvent,
  projects,
  achievements,
  announcements,
  onOpenRegisterModal
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Editorial Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--yellow)] border border-[var(--ink)]">
              <GitBranch className="w-3.5 h-3.5 text-[var(--ink)]" />
              <span className="text-[11px] font-mono font-bold text-[var(--ink)] tracking-wider uppercase">
                GIT CLUB • STUDENT TECH OPERATING SYSTEM
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-[var(--ink)]">
              BUILD. <br />
              <span className="text-[var(--coral)]">COLLABORATE.</span> <br />
              INNOVATE.
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] font-normal leading-relaxed max-w-xl">
              A student-built technology community where ideas become products, teams become builders, and experiments turn into production software.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('events')}
              >
                Explore Events & Tracks
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('committee')}
              >
                Meet the Committee
              </Button>
            </div>
          </div>

          {/* Right Architecture Preview Card */}
          <div className="lg:col-span-5">
            <Card tone="lavender" className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--ink)]/15 pb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-[var(--ink)] font-bold ml-2">git-club-core</span>
                </div>
                <Badge variant="indigo">v2.4 Live</Badge>
              </div>

              <div className="space-y-3 font-mono text-xs text-[var(--ink)]">
                <div className="p-3 bg-white rounded-xl border border-[var(--ink)]/20 flex items-center justify-between">
                  <div className="font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[var(--coral)]" /> Core Technical Wings
                  </div>
                  <Badge variant="emerald" withDot>Online</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-3 bg-white rounded-xl border border-[var(--ink)]/20 space-y-1">
                    <div className="font-bold flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-[var(--coral)]" /> Systems & Cloud</div>
                    <p className="text-[10px] text-[var(--text-muted)]">K8s • Rust • DevOps</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[var(--ink)]/20 space-y-1">
                    <div className="font-bold flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-[var(--coral)]" /> AI / Machine Learning</div>
                    <p className="text-[10px] text-[var(--text-muted)]">PyTorch • LLMs • RAG</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Members', value: '45+' },
          { label: 'Annual Events', value: '18+' },
          { label: 'Production Projects', value: '12+' },
          { label: 'Hackathon Wins', value: '8' }
        ].map((st, i) => (
          <Card key={i} tone={i === 0 ? 'yellow' : i === 1 ? 'lavender' : i === 2 ? 'sky' : undefined} className="p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--ink)]">{st.value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1 font-semibold">{st.label}</div>
          </Card>
        ))}
      </section>

      {/* 3. FEATURED EVENT BANNER */}
      {featuredEvent && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] font-bold">UP NEXT</span>
              <h2 className="text-2xl font-bold text-[var(--ink)]">Featured Bootcamp</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('events')}>
              View All <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>

          <Card tone="sky" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <img
                  src={featuredEvent.poster}
                  alt={featuredEvent.title}
                  className="w-full h-56 object-cover rounded-xl border border-[var(--ink)]/20 shadow-sm"
                />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <Badge variant="indigo" withDot>{featuredEvent.category}</Badge>
                <h3 className="text-2xl font-bold text-[var(--ink)] leading-snug">{featuredEvent.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[var(--ink)]" /> {featuredEvent.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[var(--ink)]" /> {featuredEvent.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[var(--ink)]" /> {featuredEvent.venue}</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="primary" onClick={() => onOpenRegisterModal(featuredEvent)}>
                    Register Free
                  </Button>
                  <Button variant="outline" onClick={() => onNavigate('event-detail', featuredEvent.id)}>
                    View Syllabus
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* 4. WHAT WE DO */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] font-bold">PILLARS</span>
          <h2 className="text-2xl font-bold text-[var(--ink)]">What We Do</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '01', title: 'Workshops', desc: 'Hands-on masterclasses in AI, Cloud Native, Rust, and Web3 development.', icon: Terminal },
            { num: '02', title: 'Hackathons', desc: '36-hour continuous sprint events solving real-world challenge tracks.', icon: Zap },
            { num: '03', title: 'Open Source', desc: 'Building and maintaining open-source systems for campus and beyond.', icon: Code2 },
            { num: '04', title: 'Tech Talks', desc: 'Deep-dive technology talks led by industry mentors and student leads.', icon: Rocket }
          ].map((item, idx) => (
            <Card key={idx} className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--coral)]">
                <span>{item.num}</span>
                <item.icon className="w-4 h-4 text-[var(--ink)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--ink)]">{item.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. ACHIEVEMENTS & ANNOUNCEMENTS */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] font-bold">HALL OF FAME</span>
            <h2 className="text-2xl font-bold text-[var(--ink)]">Recent Wins</h2>
          </div>
          <div className="space-y-3">
            {achievements.slice(0, 3).map((ach) => (
              <Card key={ach.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <Badge variant="amber">{ach.badge}</Badge>
                  <span className="text-[var(--text-muted)]">{ach.date}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--ink)]">{ach.title}</h3>
                <p className="text-xs text-[var(--text-muted)]">{ach.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] font-bold">UPDATES</span>
            <h2 className="text-2xl font-bold text-[var(--ink)]">Announcements</h2>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <Card key={ann.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <Badge variant="indigo">{ann.category}</Badge>
                  <span className="text-[var(--text-muted)]">{ann.date}</span>
                </div>
                <h4
                  className="text-sm font-bold text-[var(--ink)] hover:text-[var(--coral)] cursor-pointer"
                  onClick={() => onNavigate('announcements')}
                >
                  {ann.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">{ann.shortDescription}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section>
        <Card tone="yellow" className="p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
            Ready to build with us?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink)]/80 max-w-lg mx-auto">
            Join GIT Club to access workshops, hackathon team matching, and open source development tracks.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="secondary" onClick={() => onNavigate('events')}>
              Explore All Tracks
            </Button>
            <Button variant="outline" onClick={() => onNavigate('about')}>
              About the Club
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};
