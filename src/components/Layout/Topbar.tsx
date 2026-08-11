import React, { useEffect, useRef, useState } from 'react';
import { Search, Flame, Menu, User, LogOut, CheckCircle2, Target } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { useAuth } from '../../context/AuthContext';
import { NavView } from './Sidebar';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onSelectView: (view: NavView) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu, onSelectView }) => {
  const { filter, setFilter, stats } = useTracker();
  const { user, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value }));
    if (e.target.value.trim()) {
      onSelectView('problems');
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filter.search}
            onChange={handleSearchChange}
            placeholder="Search problems, LeetCode #, patterns, tags... (Press ⌘K)"
            className="w-full h-10 pl-10 pr-12 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm pointer-events-none">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Tools: Streak, Goal, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-sm shadow-amber-950/20">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
          <span>{stats.currentStreak} Day Streak</span>
          {stats.longestStreak > stats.currentStreak && (
            <span className="text-[10px] text-amber-300/80 font-sans font-normal border-l border-amber-500/30 pl-2">
              Best: {stats.longestStreak}
            </span>
          )}
        </div>

        {/* Daily Goal Status */}
        <div
          onClick={() => onSelectView('today')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 transition-all cursor-pointer"
          title="Daily Goal Target"
        >
          <Target className="w-4 h-4 text-emerald-400" />
          <span>Goal:</span>
          <span className="font-mono font-bold text-emerald-400">
            {stats.solvedToday} / {user?.daily_goal || 3}
          </span>
          {stats.solvedToday >= (user?.daily_goal || 3) && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors focus:outline-none"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
            <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] font-mono text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  onSelectView('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account & Settings</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors border-t border-slate-800/80 mt-1"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
