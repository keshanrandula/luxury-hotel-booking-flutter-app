import React from 'react';
import { Search, Bell, Moon, Sun, RefreshCw } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing }) {
  return (
    <header className="h-18 bg-navy-800/80 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Quick search bookings, members, properties..."
          className="w-full bg-navy-900/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          title="Refresh Live Data"
          className="p-2 rounded-xl bg-navy-900 border border-slate-700/60 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-gold-400' : ''}`} />
        </button>

        <button className="relative p-2 rounded-xl bg-navy-900 border border-slate-700/60 text-slate-300 hover:text-gold-400 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-gold-500 absolute top-1.5 right-1.5 ring-2 ring-navy-800 animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        <div className="flex items-center gap-2 pl-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-emerald-400">Atlas Live Sync</span>
        </div>
      </div>
    </header>
  );
}
