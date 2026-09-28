import React from 'react';
import { ProjectItem, FacultyMember, HistoryMilestone, AnnouncementItem, AchievementItem } from '../types';
import { Code2, ExternalLink, Mail, MapPin } from 'lucide-react';

/* --- PROJECTS PAGE --- */
export const ProjectsPage: React.FC<{ projects: ProjectItem[] }> = ({ projects }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[var(--coral)] font-mono font-bold">Technical Portfolio</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--ink)]">
          GIT Club <span className="text-[var(--coral)]">Open Source Projects</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Production-grade systems, hardware platforms, and software engines engineered by student teams.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, idx) => {
          const tones: Array<'yellow' | 'lavender' | 'sky'> = ['yellow', 'lavender', 'sky'];
          const tone = tones[idx % 3];
          const toneBg = tone === 'yellow' ? 'bg-[#FFD84D]' : tone === 'lavender' ? 'bg-[#C9A8FF]' : 'bg-[#A8D8FF]';

          return (
            <div key={p.id} className="bg-white border-[1.5px] border-[var(--ink)] rounded-[20px] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm hover:-translate-y-0.5 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-[8px] border border-[var(--ink)] ${toneBg} text-[var(--ink)]`}>
                    ● {p.status}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">Year: {p.year}</span>
                </div>

                <h3 className="text-xl font-bold text-[var(--ink)]">{p.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{p.description}</p>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-[var(--ink)]">
                    <span>Engineering Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] font-medium bg-[#F7F5F0] text-[var(--ink)] rounded-[6px] border border-[var(--border-subtle)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-[var(--text-muted)]">
                  Team Lead: <span className="text-[var(--ink)] font-bold">{p.lead}</span> ({p.team.join(', ')})
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--ink)]">
                    <Code2 className="w-4 h-4" /> Repository
                  </a>
                )}
                {p.demoUrl && (
                  <a href={p.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[var(--coral)] hover:underline ml-auto">
                    Live Prototype <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* --- FACULTY PAGE --- */
export const FacultyPage: React.FC<{ faculty: FacultyMember[] }> = ({ faculty }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[var(--coral)] font-mono font-bold">Academic Leadership</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--ink)]">
          Faculty <span className="text-[var(--coral)]">Coordinators & Mentors</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Guiding GIT Club with institutional wisdom, research governance, and academic direction.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {faculty.map((f) => (
          <div key={f.id} className="bg-white border-[1.5px] border-[var(--ink)] rounded-[20px] p-7 space-y-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={f.avatar} alt={f.name} className="w-16 h-16 rounded-[14px] object-cover border-[1.5px] border-[var(--ink)]" />
                <div>
                  <h3 className="text-xl font-bold text-[var(--ink)]">{f.name}</h3>
                  <p className="text-xs font-bold text-[var(--coral)]">{f.role}</p>
                  <p className="text-xs text-[var(--text-muted)]">{f.department}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.bio}</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--coral)]" /> {f.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--coral)]" /> {f.office}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- ACHIEVEMENTS PAGE --- */
export const AchievementsPage: React.FC<{ achievements: AchievementItem[] }> = ({ achievements }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[var(--coral)] font-mono font-bold">Hall of Fame</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--ink)]">
          Major <span className="text-[var(--coral)]">Achievements & Milestones</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          National hackathon titles, open-source honors, and student research awards.
        </p>
      </div>

      <div className="space-y-4">
        {achievements.map((ach) => (
          <div key={ach.id} className="bg-white border-[1.5px] border-[var(--ink)] rounded-[20px] p-6 sm:p-7 grid md:grid-cols-12 gap-6 items-center shadow-sm">
            <div className="md:col-span-8 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold rounded-[8px] border border-[var(--ink)] bg-[#FFD84D] text-[var(--ink)]">
                  {ach.badge}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">{ach.date}</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--ink)]">{ach.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{ach.description}</p>
              
              <div className="text-xs text-[var(--text-muted)] pt-1">
                Team: <span className="text-[var(--ink)] font-bold">{ach.teamMembers.join(', ')}</span>
              </div>
            </div>

            <div className="md:col-span-4 text-left md:text-right border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-4 md:pt-0 md:pl-6 space-y-1">
              <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Event / Organization</div>
              <div className="text-sm font-bold text-[var(--ink)]">{ach.event}</div>
              <div className="text-xs text-[var(--coral)] font-bold">{ach.position}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- HISTORY PAGE --- */
export const HistoryPage: React.FC<{ history: HistoryMilestone[] }> = ({ history }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[var(--coral)] font-mono font-bold">Chronological Timeline</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--ink)]">
          Club <span className="text-[var(--coral)]">History & Growth</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          The journey of GIT Club from a 10-member initiative to a 500+ student tech organization.
        </p>
      </div>

      <div className="relative border-l-2 border-[var(--ink)] ml-4 sm:ml-32 space-y-8 py-4">
        {history.map((m, idx) => (
          <div key={idx} className="relative pl-8 sm:pl-12 group">
            {/* Year Tag on Left for larger screens */}
            <div className="hidden sm:block absolute -left-36 top-1 text-right w-28">
              <span className="text-2xl font-black font-mono text-[var(--coral)]">{m.year}</span>
            </div>

            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[var(--coral)] border-2 border-[var(--ink)] group-hover:scale-125 transition-transform" />

            <div className="bg-white border-[1.5px] border-[var(--ink)] rounded-[20px] p-6 space-y-2 shadow-sm">
              <div className="sm:hidden text-lg font-bold font-mono text-[var(--coral)] mb-1">{m.year}</div>
              <h3 className="text-lg font-bold text-[var(--ink)]">{m.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{m.description}</p>
              {m.stats && (
                <div className="pt-2 text-xs font-bold text-[var(--coral)] border-t border-[var(--border-subtle)]">
                  ⚡ {m.stats}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- ANNOUNCEMENTS PAGE --- */
export const AnnouncementsPage: React.FC<{ announcements: AnnouncementItem[] }> = ({ announcements }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[var(--coral)] font-mono font-bold">News & Notices</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--ink)]">
          Official <span className="text-[var(--coral)]">Announcements</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Stay informed on upcoming recruitment drives, event registrations, and equipment updates.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((ann, idx) => {
          const tones: Array<'yellow' | 'lavender' | 'sky'> = ['lavender', 'yellow', 'sky'];
          const tone = tones[idx % 3];
          const toneBg = tone === 'yellow' ? 'bg-[#FFD84D]' : tone === 'lavender' ? 'bg-[#C9A8FF]' : 'bg-[#A8D8FF]';

          return (
            <div key={ann.id} className="bg-white border-[1.5px] border-[var(--ink)] rounded-[20px] p-6 sm:p-7 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2.5 py-0.5 rounded-[8px] border border-[var(--ink)] font-bold text-[var(--ink)] ${toneBg}`}>
                  {ann.category}
                </span>
                <span className="text-[var(--text-muted)] font-mono">{ann.date}</span>
              </div>

              <h2 className="text-xl font-bold text-[var(--ink)]">{ann.title}</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{ann.fullContent || ann.shortDescription}</p>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Author: <strong className="text-[var(--ink)]">{ann.author}</strong> ({ann.authorRole})</span>
                <span className="text-[#27a858] font-bold">● {ann.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
