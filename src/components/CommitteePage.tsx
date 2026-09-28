import React from 'react';
import { Member } from '../types';
import { Mail, Globe, Crown } from 'lucide-react';
import { Card, Badge } from './ui';

interface CommitteePageProps {
  members: Member[];
}

export const CommitteePage: React.FC<CommitteePageProps> = ({ members }) => {
  const studentRep = members.find((m) => m.role === 'Student Representative');
  const clubHead = members.find((m) => m.role === 'Club Head');
  const committeeHeads = members.filter((m) => m.role === 'Committee Head');
  const committeeMembers = members.filter((m) => m.role === 'Committee Member' || m.role === 'Member');

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="amber">Leadership Hierarchy</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
          Meet the <span className="text-[var(--coral)]">Committee</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          The student architects, domain leads, and coordinators driving operations and development.
        </p>
      </div>

      {/* Leadership Tier 1: Student Representative & Club Head */}
      <div className="space-y-4">
        <h2 className="text-center text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
          Executive Leadership
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {studentRep && (
            <Card tone="yellow" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="indigo" withDot>
                  Student Representative
                </Badge>
                <Crown className="w-4 h-4 text-[var(--ink)]" />
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={studentRep.avatar}
                  alt={studentRep.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--ink)]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">{studentRep.name}</h3>
                  <p className="text-xs text-[var(--ink)]/80 font-medium">{studentRep.department}</p>
                  <p className="text-xs text-[var(--text-muted)] font-mono">{studentRep.year}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--ink)]/85 leading-relaxed">{studentRep.bio}</p>
              <div className="flex items-center gap-3 pt-2 text-xs border-t border-[var(--ink)]/15">
                <a href={studentRep.github} target="_blank" rel="noreferrer" className="text-[var(--ink)] hover:text-[var(--coral)]">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={studentRep.linkedin} target="_blank" rel="noreferrer" className="text-[var(--ink)] hover:text-[var(--coral)]">
                  <Mail className="w-4 h-4" />
                </a>
                <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">{studentRep.email}</span>
              </div>
            </Card>
          )}

          {clubHead && (
            <Card tone="lavender" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="indigo" withDot>
                  Club Head / President
                </Badge>
                <Crown className="w-4 h-4 text-[var(--ink)]" />
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={clubHead.avatar}
                  alt={clubHead.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--ink)]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">{clubHead.name}</h3>
                  <p className="text-xs text-[var(--ink)]/80 font-medium">{clubHead.department}</p>
                  <p className="text-xs text-[var(--text-muted)] font-mono">{clubHead.year}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--ink)]/85 leading-relaxed">{clubHead.bio}</p>
              <div className="flex items-center gap-3 pt-2 text-xs border-t border-[var(--ink)]/15">
                <a href={clubHead.github} target="_blank" rel="noreferrer" className="text-[var(--ink)] hover:text-[var(--coral)]">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={clubHead.linkedin} target="_blank" rel="noreferrer" className="text-[var(--ink)] hover:text-[var(--coral)]">
                  <Mail className="w-4 h-4" />
                </a>
                <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">{clubHead.email}</span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Leadership Tier 2: Committee Heads */}
      <div className="space-y-4">
        <h2 className="text-center text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
          Domain Committee Heads
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {committeeHeads.map((head, i) => (
            <Card key={head.id} tone={i % 3 === 0 ? 'sky' : i % 3 === 1 ? 'yellow' : 'lavender'} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="indigo">{head.team} Wing</Badge>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{head.year}</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={head.avatar}
                  alt={head.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[var(--ink)]"
                />
                <div>
                  <h4 className="text-base font-bold text-[var(--ink)]">{head.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{head.role}</p>
                </div>
              </div>

              <p className="text-xs text-[var(--ink)]/80 line-clamp-2 leading-relaxed">{head.bio}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--ink)]/10 text-xs">
                <div className="flex gap-2">
                  <a href={head.github} target="_blank" rel="noreferrer" className="text-[var(--ink)] hover:text-[var(--coral)]">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                  <a href={head.linkedin} target="_blank" rel="noreferrer" className="text-[var(--ink)] hover:text-[var(--coral)]">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{head.email}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leadership Tier 3: Core Members */}
      <div className="space-y-4">
        <h2 className="text-center text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
          Contributors & Core Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {committeeMembers.map((member) => (
            <Card key={member.id} className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <h5 className="text-sm font-bold text-[var(--ink)]">{member.name}</h5>
                  <p className="text-[10px] text-[var(--text-muted)]">{member.branch} • {member.year}</p>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{member.bio}</p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                <span>{member.team}</span>
                <Badge variant="emerald">{member.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
