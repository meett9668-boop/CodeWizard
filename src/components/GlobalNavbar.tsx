import React, { useState } from 'react';
import {
  Sun, Moon, Shield, Menu, X, Terminal, ChevronRight, UserCheck, Sparkles, LogIn
} from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentUser: { name: string; role: Role; portal: 'public' | 'participant' | 'committee' } | null;
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
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <div className="w-full h-full bg-[var(--bg-primary)] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {publicNavLinks.map((link) => (
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

            {/* Auth Controls */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)]">
                <button
                  onClick={() => handleNavClick('participant-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentUser.portal === 'participant' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  Participant Portal
                </button>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentUser.portal === 'committee' ? 'bg-purple-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Command Center
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLoginModal('participant')}
                  className="btn-outline text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" /> Student Login
                </button>
                <button
                  onClick={() => onOpenLoginModal('committee')}
                  className="btn-primary text-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" /> Command Center
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {publicNavLinks.map((link) => (
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
                  className="w-full btn-outline text-xs justify-center"
                >
                  <LogIn className="w-3.5 h-3.5" /> Student Login
                </button>
                <button
                  onClick={() => { onOpenLoginModal('committee'); setMobileMenuOpen(false); }}
                  className="w-full btn-primary text-xs justify-center"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" /> Command Center
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick('participant-dashboard')}
                  className="w-full py-2.5 text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl"
                >
                  Participant Portal
                </button>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className="w-full py-2.5 text-xs font-bold bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Command Center
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
