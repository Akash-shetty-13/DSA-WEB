import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Boxes,
  BookmarkCheck,
  Zap,
  CalendarCheck,
  RotateCcw,
  BarChart3,
  Calendar as CalendarIcon,
  Trophy,
  Settings,
  BrainCircuit
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export type NavView =
  | 'dashboard'
  | 'problems'
  | 'patterns'
  | 'my140'
  | 'risingbrain'
  | 'today'
  | 'revision'
  | 'practice'
  | 'statistics'
  | 'calendar'
  | 'achievements'
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile
}) => {
  const { stats, revisionQueue } = useTracker();

  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems' as NavView, label: 'Problems Table', icon: Code2, count: stats.totalProblems },
    { id: 'patterns' as NavView, label: 'Patterns Cards', icon: Boxes },
    { id: 'my140' as NavView, label: 'My 140 Sheet', icon: BookmarkCheck, badge: `${stats.customSheetStats.solved}/${stats.customSheetStats.total}` },
    { id: 'risingbrain' as NavView, label: 'RisingBrain Sheet', icon: Zap, badge: `${stats.risingBrainStats.solved}/${stats.risingBrainStats.total}` },
    { id: 'today' as NavView, label: 'Today Tracker', icon: CalendarCheck, badge: stats.solvedToday > 0 ? `${stats.solvedToday} solved` : undefined, highlight: true },
    { id: 'revision' as NavView, label: 'Revision Queue', icon: RotateCcw, count: revisionQueue.length, alert: revisionQueue.length > 0 },
    { id: 'practice' as NavView, label: 'Practice Session', icon: BrainCircuit },
    { id: 'statistics' as NavView, label: 'Statistics', icon: BarChart3 },
    { id: 'calendar' as NavView, label: 'Activity Calendar', icon: CalendarIcon },
    { id: 'achievements' as NavView, label: 'Achievements', icon: Trophy },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              DSA Mastery
            </h1>
            <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-emerald-400/90 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Tracker v1.0
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.alert
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Quick Summary */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Mastery Progress</span>
            <span className="font-mono font-bold text-emerald-400">{stats.progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2.5 font-mono">
            {stats.solvedCount} of {stats.totalProblems} Problems Solved
          </p>
        </div>
      </aside>
    </>
  );
};
