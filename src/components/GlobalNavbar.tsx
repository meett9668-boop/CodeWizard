import React, { useState } from 'react';
import {
  Sun, Moon, Shield, Menu, X, Terminal, LogIn, LogOut, LayoutDashboard,
  Calendar, BookmarkCheck, User, Sparkles, AlertTriangle
} from 'lucide-react';
import { UserSession } from '../types';
import { canAccessCommandCenter } from '../utils/permissions';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentUser: UserSession | null;
  onOpenLoginModal: (portal: 'participant' | 'committee') => void;
  onLogout: () => void;
}

export const GlobalNavbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  currentUser,
  onOpenLoginModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated Participant Navigation Items
  const participantNavLinks = [
    { id: 'participant-dashboard', label: 'Dashboard' },
    { id: 'events', label: 'Explore Events' },
    { id: 'my-registrations', label: 'My Registrations' },
    { id: 'my-tickets', label: 'My Tickets' },
    { id: 'my-participation', label: 'My Participation' },
    { id: 'announcements', label: 'Notifications' },
    { id: 'profile', label: 'Profile' },
  ];

  // Public Navigation Items
  const publicNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'committee', label: 'Committee' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'events', label: 'Events' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'history', label: 'History' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'contact', label: 'Contact' },
  ];

  // Committee Command Center Quick Links (when in committee mode)
  const committeeNavLinks = [
    { id: 'home', label: 'Public Portal' },
    { id: 'admin-dashboard', label: 'Command Center' },
    { id: 'events', label: 'All Events' },
  ];

  const isParticipantUser = currentUser?.role === 'Participant';
  const isCommitteeUser = canAccessCommandCenter(currentUser?.role);

  // Pick navigation links according to auth state
  const activeNavLinks = isParticipantUser
    ? participantNavLinks
    : isCommitteeUser
    ? committeeNavLinks
    : publicNavLinks;

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Wordmark */}
          <div 
            onClick={() => handleNavClick(isParticipantUser ? 'participant-dashboard' : 'home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <div className="w-full h-full bg-[var(--bg-primary)] rounded-[10px] flex items-center justify-center font-bold text-white text-base">
                G
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight flex items-center gap-1.5 font-mono">
                GIT <span className="gradient-text">CLUB</span>
              </span>
              <span className="text-[10px] tracking-widest text-[var(--text-subtle)] uppercase font-semibold">
                BUILD • COLLABORATE • INNOVATE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Strictly Role-Aware) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {activeNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  currentView === link.id
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-all"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Authenticated Persona Info & Safe Action Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-subtle)]">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--ink)]"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-[var(--ink)] leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] text-indigo-400 font-mono font-semibold">{currentUser.role}</div>
                  </div>
                </div>

                {/* Only Show Command Center button if user is authorized committee / faculty */}
                {isCommitteeUser && (
                  <button
                    onClick={() => handleNavClick('admin-dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      currentView === 'admin-dashboard'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> Command Center
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 border border-rose-500/20 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLoginModal('participant')}
                  className="btn-outline text-xs px-3 py-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" /> Participant Login
                </button>
                <button
                  onClick={() => onOpenLoginModal('committee')}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  <Shield className="w-3.5 h-3.5 mr-1 text-amber-300" /> Committee Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Strictly Role-Aware) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {activeNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                  currentView === link.id
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-bold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
            {!currentUser ? (
              <>
                <button
                  onClick={() => { onOpenLoginModal('participant'); setMobileMenuOpen(false); }}
                  className="w-full btn-outline text-xs justify-center py-2"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" /> Participant Login
                </button>
                <button
                  onClick={() => { onOpenLoginModal('committee'); setMobileMenuOpen(false); }}
                  className="w-full btn-primary text-xs justify-center py-2"
                >
                  <Shield className="w-3.5 h-3.5 mr-1 text-amber-300" /> Committee Login
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-bold text-[var(--ink)]">{currentUser.name}</div>
                  <div className="text-[10px] text-indigo-400 font-mono">{currentUser.role}</div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/20 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
