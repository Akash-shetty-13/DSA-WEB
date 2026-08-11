import React, { useState } from 'react';
import { Settings, Download, Upload, User, Moon, Sun, CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTracker } from '../../context/TrackerContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, loginWithGoogle, logout } = useAuth();
  const { exportDataJSON, exportProgressCSV, importDataJSON } = useTracker();

  const [dailyGoal, setDailyGoal] = useState(user?.daily_goal || 3);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(user?.theme || 'dark');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSaveProfile = () => {
    updateProfile({ daily_goal: dailyGoal, theme: theme });
    alert('Settings saved successfully!');
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_mastery_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csvStr = exportProgressCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_mastery_progress_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = importDataJSON(content);
      setImportStatus(res);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Account & Data Settings</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage profile settings, daily goals, data import/export, and database options.
        </p>
      </div>

      {/* Database Connection Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database & Persistence Engine</h3>
              <p className="text-xs text-slate-400">
                {isSupabaseConfigured ? 'Supabase PostgreSQL database connected' : 'Local Persistent Engine active (Instant offline capability)'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              isSupabaseConfigured
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-teal-950 text-teal-400 border-teal-800'
            }`}
          >
            {isSupabaseConfigured ? 'Supabase Online' : 'Local Offline Mode'}
          </span>
        </div>
      </div>

      {/* Profile & Target Goals Form */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span>User Profile & Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Display Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Daily Problem Target</label>
            <input
              type="number"
              value={dailyGoal}
              onChange={e => setDailyGoal(Number(e.target.value))}
              min={1}
              max={20}
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Theme</label>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value as any)}
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="dark">Dark Theme (Developer First)</option>
              <option value="light">Light Theme</option>
              <option value="system">System Preference</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Data Import & Export */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Data Import & Export</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Options */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Export My Progress</h4>
            <p className="text-xs text-slate-400">
              Download your complete problem progress, notes, solutions, and revision history.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDownloadJSON}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
              <button
                onClick={handleDownloadCSV}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Import Option */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Import JSON Data</h4>
            <p className="text-xs text-slate-400">
              Upload a previously exported JSON file to merge your progress safely without data deletion.
            </p>

            <div className="pt-2">
              <label className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Select JSON File
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {importStatus && (
              <div
                className={`p-3 rounded-lg text-xs font-mono border ${
                  importStatus.success
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950/60 text-rose-400 border-rose-800'
                }`}
              >
                {importStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
