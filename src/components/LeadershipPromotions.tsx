import React from 'react';
import { Member, PromotionHistory } from '../types';
import { Crown, ArrowUpRight, TrendingUp, Shield, CheckCircle2, UserCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';

interface LeadershipPromotionsProps {
  members: Member[];
  promotionHistory: PromotionHistory[];
  onPromoteMember: (member: Member) => void;
}

export const LeadershipPromotions: React.FC<LeadershipPromotionsProps> = ({
  members,
  promotionHistory,
  onPromoteMember
}) => {
  const studentRep = members.find((m) => m.role === 'Student Representative');
  const clubHead = members.find((m) => m.role === 'Club Head');
  const committeeHeads = members.filter((m) => m.role === 'Committee Head');
  const candidatesForPromotion = members.filter((m) => m.readyForPromotion);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-mono text-purple-300 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> SPECIAL GOVERNANCE FEATURE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Leadership & Promotions Command</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Manage member advancement, review promotion candidates, and track club governance history.
        </p>
      </div>

      {/* 1. VISUAL PROGRESSION PIPELINE */}
      <div className="glass-card p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[var(--bg-card)] to-indigo-950/20 space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" /> Club Leadership Progression Hierarchy
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center relative">
          {[
            { role: 'Member', level: 'Level 1', color: 'border-gray-500/30 text-gray-300' },
            { role: 'Committee Member', level: 'Level 2', color: 'border-cyan-500/30 text-cyan-300' },
            { role: 'Committee Head', level: 'Level 3', color: 'border-indigo-500/30 text-indigo-300' },
            { role: 'Club Head', level: 'Level 4', color: 'border-purple-500/30 text-purple-300' },
            { role: 'Student Representative', level: 'Level 5', color: 'border-amber-500/30 text-amber-300' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.color} bg-[var(--bg-surface)] space-y-1 relative`}>
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">{item.level}</span>
              <div className="text-xs sm:text-sm font-bold">{item.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CURRENT EXECUTIVE LEADERSHIP */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Active Leadership Council</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {studentRep && (
            <div className="glass-card p-5 border border-amber-500/30 bg-amber-500/5 space-y-3">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded-full">
                👑 Student Representative
              </span>
              <div className="flex items-center gap-3">
                <img src={studentRep.avatar} alt={studentRep.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-base font-bold">{studentRep.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{studentRep.branch}</p>
                </div>
              </div>
            </div>
          )}

          {clubHead && (
            <div className="glass-card p-5 border border-purple-500/30 bg-purple-500/5 space-y-3">
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold rounded-full">
                ⚡ Club Head
              </span>
              <div className="flex items-center gap-3">
                <img src={clubHead.avatar} alt={clubHead.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-base font-bold">{clubHead.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{clubHead.branch}</p>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-5 border border-indigo-500/30 bg-indigo-500/5 space-y-3">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold rounded-full">
              🛡️ {committeeHeads.length} Committee Heads
            </span>
            <div className="flex -space-x-2 pt-1">
              {committeeHeads.map((h) => (
                <img key={h.id} src={h.avatar} alt={h.name} className="w-10 h-10 rounded-full border-2 border-[var(--bg-card)] object-cover" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MEMBERS READY FOR PROMOTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Candidates Recommended for Promotion
          </h2>
          <span className="text-xs font-mono text-[var(--text-subtle)]">
            {candidatesForPromotion.length} Members Eligible
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {candidatesForPromotion.map((candidate) => (
            <div key={candidate.id} className="glass-card p-6 border border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 to-[var(--bg-card)] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                    {candidate.role} ➔ {candidate.promotionRecommendation?.nextRole}
                  </span>
                  <span className="text-xs text-[var(--text-subtle)] font-mono">Joined: {candidate.joinedDate}</span>
                </div>

                <div className="flex items-center gap-4">
                  <img src={candidate.avatar} alt={candidate.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40" />
                  <div>
                    <h3 className="text-lg font-bold">{candidate.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{candidate.branch} • {candidate.year}</p>
                    <p className="text-xs text-indigo-400 font-mono font-semibold">{candidate.team} Wing</p>
                  </div>
                </div>

                <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-2">
                  <div className="text-xs font-bold text-amber-400">Recommendation Reason:</div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {candidate.promotionRecommendation?.reason}
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-mono text-[var(--text-subtle)] block mb-1">Key Contributions:</span>
                    <ul className="space-y-1">
                      {candidate.promotionRecommendation?.contributions.map((c, idx) => (
                        <li key={idx} className="text-xs text-[var(--text-main)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onPromoteMember(candidate)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Crown className="w-4 h-4 text-amber-300" /> Approve Promotion to {candidate.promotionRecommendation?.nextRole}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PROMOTION HISTORY TIMELINE */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Promotion History Audit Log
        </h2>

        <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-4">
          {promotionHistory.map((ph) => (
            <div key={ph.id} className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={ph.memberAvatar} alt={ph.memberName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">{ph.memberName}</h4>
                    <span className="text-xs font-mono text-purple-400 font-semibold">
                      {ph.fromRole} ➔ {ph.toRole}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-1">{ph.reason}</p>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-[var(--text-subtle)]">
                <div>Promoted: {ph.date}</div>
                <div>Authorized by: <span className="text-indigo-400">{ph.promotedBy}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
