import React from 'react';
import { PieChart } from 'lucide-react';

export default function CategoryChart({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-navy-800/90 border border-slate-800/90 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-outfit font-bold text-lg text-white">Category Demand</h3>
          <p className="text-xs text-slate-400">Share of bookings by destination vibe</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
          <PieChart className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">{cat.name}</span>
              <span className="text-gold-400">{cat.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color || '#D97706',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Highest performing</span>
        <span className="font-bold text-emerald-400">Overwater Villas (38%)</span>
      </div>
    </div>
  );
}
