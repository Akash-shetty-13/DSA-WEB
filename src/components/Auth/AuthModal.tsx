import React, { useState } from 'react';
import { BrainCircuit, Globe, Mail, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      loginWithEmail(email.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        {/* Brand */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto shadow-xl shadow-emerald-950/50 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <BrainCircuit className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">DSA Mastery Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to synchronize your progress across devices and track your DSA journey.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => loginWithGoogle()}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-100 font-bold text-xs rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Globe className="w-4 h-4 text-emerald-400" /> Continue with Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono text-slate-500">
              <span className="bg-slate-900 px-2">Or Sign In with Email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={loginAsGuest}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 pt-2"
          >
            <UserCheck className="w-3.5 h-3.5" /> Continue as Guest Demo User
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private scope per user via Supabase RLS</span>
        </div>
      </div>
    </div>
  );
};
