import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { Sidebar, NavView } from './components/Layout/Sidebar';
import { Topbar } from './components/Layout/Topbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProblemTableView } from './components/Problems/ProblemTableView';
import { PatternGridView } from './components/Patterns/PatternGridView';
import { My140View } from './components/My140/My140View';
import { RisingBrainView } from './components/RisingBrain/RisingBrainView';
import { TodayView } from './components/Today/TodayView';
import { RevisionView } from './components/Revision/RevisionView';
import { PracticeSessionView } from './components/Practice/PracticeSessionView';
import { CalendarView } from './components/Calendar/CalendarView';
import { StatisticsView } from './components/Statistics/StatisticsView';
import { AchievementsView } from './components/Achievements/AchievementsView';
import { SettingsView } from './components/Settings/SettingsView';
import { ProblemDetailModal } from './components/Problems/ProblemDetailModal';
import { AuthModal } from './components/Auth/AuthModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { selectedProblem, setSelectedProblem } = useTracker();
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
        Loading DSA Mastery Tracker...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onToggleMobileMenu={() => setIsOpenMobile(!isOpenMobile)}
          onSelectView={setCurrentView}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView onSelectView={setCurrentView} />}
          {currentView === 'problems' && <ProblemTableView />}
          {currentView === 'patterns' && <PatternGridView onSelectView={setCurrentView} />}
          {currentView === 'my140' && <My140View />}
          {currentView === 'risingbrain' && <RisingBrainView />}
          {currentView === 'today' && <TodayView />}
          {currentView === 'revision' && <RevisionView />}
          {currentView === 'practice' && <PracticeSessionView />}
          {currentView === 'statistics' && <StatisticsView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'achievements' && <AchievementsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Problem Detail Modal */}
      <ProblemDetailModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TrackerProvider>
        <AppContent />
      </TrackerProvider>
    </AuthProvider>
  );
}

export default App;
