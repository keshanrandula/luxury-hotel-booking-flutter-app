import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, change, isPositive, icon: Icon, subtitle }) {
  return (
    <div className="p-5 rounded-2xl bg-navy-800/90 border border-slate-800/90 relative overflow-hidden group hover:border-gold-500/40 transition-all duration-300 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="font-outfit text-2xl font-extrabold text-white mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-gold-600/10 to-gold-400/10 border border-gold-500/20 text-gold-400 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1 font-semibold">
          {isPositive ? (
            <span className="flex items-center text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          ) : (
            <span className="flex items-center text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          <span className="text-slate-500 font-normal ml-1">vs last month</span>
        </div>
        {subtitle && <span className="text-slate-400 text-[11px]">{subtitle}</span>}
      </div>
    </div>
  );
}
