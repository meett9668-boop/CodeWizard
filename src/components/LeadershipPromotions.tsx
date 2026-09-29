import React, { useState } from 'react';
import { Member, PromotionHistory, PromotionRequest, UserSession } from '../types';
import {
  Crown, ArrowUpRight, TrendingUp, Shield, CheckCircle2, UserCheck,
  Sparkles, Clock, AlertCircle, Check, X, FileCheck, AlertTriangle
} from 'lucide-react';
import {
  canProposePromotion,
  canReviewPromotion,
  canFacultyApprove,
  validatePromotionTarget,
  isFaculty
} from '../utils/permissions';
import { Button } from './ui';

interface LeadershipPromotionsProps {
  members: Member[];
  promotionHistory: PromotionHistory[];
  promotionRequests: PromotionRequest[];
  currentUser: UserSession;
  onPromoteMember: (member: Member) => void;
  onApprovePromotionRequest: (reqId: string, remarks?: string) => void;
  onFacultyApprovePromotion: (reqId: string, remarks?: string) => void;
  onRejectPromotionRequest: (reqId: string, remarks?: string) => void;
}

export const LeadershipPromotions: React.FC<LeadershipPromotionsProps> = ({
  members,
  promotionHistory,
  promotionRequests,
  currentUser,
  onPromoteMember,
  onApprovePromotionRequest,
  onFacultyApprovePromotion,
  onRejectPromotionRequest
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'requests' | 'history'>('candidates');
  const [remarksInput, setRemarksInput] = useState<{ [key: string]: string }>({});

  const studentRep = members.find((m) => m.role === 'Student Representative');
  const clubHead = members.find((m) => m.role === 'Club Head');
  const committeeHeads = members.filter((m) => m.role === 'Committee Head');
  const candidatesForPromotion = members.filter((m) => m.readyForPromotion);

  const userCanPropose = canProposePromotion(currentUser.role);
  const userCanReview = canReviewPromotion(currentUser.role);
  const userCanFacultyApprove = canFacultyApprove(currentUser.role);

  const pendingRequests = promotionRequests.filter(r => r.status !== 'Approved' && r.status !== 'Rejected' && r.status !== 'Cancelled');

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-mono text-purple-300 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> INSTITUTIONAL GOVERNANCE PIPELINE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Leadership & Promotions Command</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Manage member advancement under strict committee nomination and faculty approval protocols.
        </p>

        {/* Governance Workflow Visual */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-bold text-indigo-400">Governance Pipeline:</span>
          <span>Nomination</span> &rarr; <span>Committee Review</span> &rarr; <span className="text-amber-400 font-bold">Faculty Approval</span> &rarr; <span className="text-emerald-400 font-bold">Official Role Update</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'candidates'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-surface)]'
          }`}
        >
          Eligible Candidates ({candidatesForPromotion.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl transition-all relative ${
            activeTab === 'requests'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-surface)]'
          }`}
        >
          Pending Approval Workflow
          {pendingRequests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-black font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-surface)]'
          }`}
        >
          Promotion Audit Log ({promotionHistory.length})
        </button>
      </div>

      {/* 1. PROGRESSION PIPELINE & EXECUTIVE HIERARCHY */}
      <div className="glass-card p-6 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[var(--bg-card)] to-indigo-950/20 space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" /> Club Leadership Progression Hierarchy
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            { role: 'Member', level: 'Level 1', color: 'border-gray-500/30 text-gray-300' },
            { role: 'Committee Member', level: 'Level 2', color: 'border-cyan-500/30 text-cyan-300' },
            { role: 'Committee Head', level: 'Level 3', color: 'border-indigo-500/30 text-indigo-300' },
            { role: 'Club Head', level: 'Level 4', color: 'border-purple-500/30 text-purple-300' },
            { role: 'Student Representative', level: 'Level 5', color: 'border-amber-500/30 text-amber-300' }
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${item.color} bg-[var(--bg-surface)] space-y-0.5`}>
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">{item.level}</span>
              <div className="text-xs font-bold">{item.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TAB: CANDIDATES READY FOR PROMOTION */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Candidates Recommended for Elevation
            </h2>
            <span className="text-xs font-mono text-[var(--text-subtle)]">
              {candidatesForPromotion.length} Members Eligible
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {candidatesForPromotion.map((candidate) => {
              const isSelf = currentUser.name.toLowerCase() === candidate.name.toLowerCase();

              return (
                <div
                  key={candidate.id}
                  className="glass-card p-6 border border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 to-[var(--bg-card)] space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                        {candidate.role} → {candidate.promotionRecommendation?.nextRole}
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
                      <div className="text-xs font-bold text-amber-400">Governance Recommendation:</div>
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

                  {/* Promotion Action Button - Guarded strictly against self-promotion and unauthorized roles */}
                  <div className="pt-2">
                    {isSelf ? (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs font-mono text-rose-400">
                        Self-promotion is strictly restricted.
                      </div>
                    ) : userCanPropose ? (
                      <button
                        onClick={() => onPromoteMember(candidate)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <Crown className="w-4 h-4 text-amber-300" /> Propose Promotion to {candidate.promotionRecommendation?.nextRole}
                      </button>
                    ) : (
                      <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-center text-xs font-mono text-[var(--text-muted)]">
                        Read-Only View • Promotion authority restricted to Committee Heads & Leadership
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB: PENDING APPROVAL WORKFLOW */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" /> Promotion Requests In Flight
            </h2>
          </div>

          {promotionRequests.length === 0 ? (
            <div className="p-8 text-center glass-card border border-[var(--border-subtle)] space-y-2 text-xs text-[var(--text-muted)]">
              <div>No active promotion requests in flight.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {promotionRequests.map((req) => {
                const isRequester = req.proposedBy.toLowerCase() === currentUser.name.toLowerCase();

                return (
                  <div
                    key={req.id}
                    className="glass-card p-6 border border-[var(--border-subtle)] space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : req.status === 'Pending Faculty Approval'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[var(--text-subtle)]">Proposed: {req.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <img src={req.memberAvatar} alt={req.memberName} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h3 className="text-base font-bold text-[var(--ink)]">{req.memberName}</h3>
                          <div className="text-xs font-mono text-purple-400 font-semibold">
                            {req.currentRole} → <span className="text-white font-bold">{req.targetRole}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-subtle)]">
                        <strong>Reason:</strong> "{req.reason}"
                      </p>

                      <div className="text-[11px] font-mono text-[var(--text-subtle)] space-y-0.5">
                        <div>Nominated By: <strong className="text-indigo-400">{req.proposedBy}</strong></div>
                        {req.committeeReviewer && <div>Committee Endorsement: {req.committeeReviewer} ({req.committeeRemarks || 'Endorsed'})</div>}
                        {req.facultyRemarks && <div className="text-amber-300">Faculty Remarks: {req.facultyRemarks}</div>}
                      </div>
                    </div>

                    {/* Stage Approval Controls */}
                    <div className="flex flex-col gap-2 shrink-0 md:min-w-56">
                      {req.status === 'Pending Committee Review' && (
                        <>
                          {userCanReview && !isRequester ? (
                            <button
                              onClick={() => onApprovePromotionRequest(req.id, 'Recommended by Committee for Faculty Sign-off')}
                              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" /> Endorse for Faculty
                            </button>
                          ) : isRequester ? (
                            <div className="text-[11px] font-mono text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-center">
                              Awaiting Committee Review (Requester separation enforced)
                            </div>
                          ) : (
                            <div className="text-[11px] font-mono text-[var(--text-muted)] p-2 text-center">
                              Pending Leadership Review
                            </div>
                          )}
                        </>
                      )}

                      {req.status === 'Pending Faculty Approval' && (
                        <>
                          {userCanFacultyApprove ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Faculty remarks..."
                                value={remarksInput[req.id] || ''}
                                onChange={(e) => setRemarksInput({ ...remarksInput, [req.id]: e.target.value })}
                                className="w-full text-xs p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                              />
                              <button
                                onClick={() => onFacultyApprovePromotion(req.id, remarksInput[req.id] || 'Institutional approval granted.')}
                                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Final Faculty Sign-Off
                              </button>
                              <button
                                onClick={() => onRejectPromotionRequest(req.id, remarksInput[req.id] || 'Declined during faculty review.')}
                                className="w-full px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-xs rounded-xl border border-rose-500/30"
                              >
                                Reject Promotion
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs font-mono text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-center">
                              Pending Faculty Approval (Dr. Suresh V. Patil)
                            </div>
                          )}
                        </>
                      )}

                      {req.status === 'Approved' && (
                        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Official Governance Elevation Sealed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: PROMOTION AUDIT LOG */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Promotion History Audit Log
          </h2>

          <div className="glass-card p-6 border border-[var(--border-subtle)] space-y-4">
            {promotionHistory.map((ph) => (
              <div
                key={ph.id}
                className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={ph.memberAvatar} alt={ph.memberName} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold">{ph.memberName}</h4>
                      <span className="text-xs font-mono text-purple-400 font-semibold">
                        {ph.fromRole} → {ph.toRole}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{ph.reason}</p>
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-[var(--text-subtle)]">
                  <div>Promoted: {ph.date}</div>
                  <div>Nominated: <span className="text-indigo-400">{ph.promotedBy}</span></div>
                  {ph.approvedByFaculty && (
                    <div className="text-emerald-400 font-bold">Faculty Sign-Off: {ph.approvedByFaculty}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
