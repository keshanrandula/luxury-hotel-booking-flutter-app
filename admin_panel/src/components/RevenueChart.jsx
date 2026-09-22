import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="p-6 rounded-2xl bg-navy-800/90 border border-slate-800/90 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-outfit font-bold text-lg text-white">Monthly Revenue Analytics</h3>
          <p className="text-xs text-slate-400">Total gross volume across global destinations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+24.8% YoY</span>
        </div>
      </div>

      {/* SVG Responsive Curved Bar Graph */}
      <div className="h-56 flex items-end justify-between gap-4 pt-8 px-2">
        {data.map((item, idx) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-navy-900 border border-gold-500/40 px-2.5 py-1 rounded-lg text-center transition-all duration-200 pointer-events-none z-20 shadow-xl">
                <p className="text-[10px] text-slate-400">{item.month}</p>
                <p className="text-xs font-bold text-gold-400">${item.revenue.toLocaleString()}</p>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-800/60 rounded-xl h-44 flex items-end overflow-hidden p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full rounded-lg bg-gradient-to-t from-gold-600 to-gold-400 group-hover:from-amber-400 group-hover:to-gold-300 transition-all duration-500 shadow-md shadow-gold-500/20"
                />
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-slate-400 group-hover:text-gold-400 transition-colors">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
