import React from 'react';
import { DollarSign, BookmarkCheck, Building2, Users, BedDouble, Star } from 'lucide-react';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import CategoryChart from '../components/CategoryChart';

export default function Dashboard({ statsData, bookings, onNavigateTab }) {
  const stats = statsData?.stats || {};
  const monthlyRevenue = statsData?.monthlyRevenue || [];
  const categoryDistribution = statsData?.categoryDistribution || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-navy-800 via-slate-800 to-navy-900 border border-slate-700/60 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            VIP Operations Center
          </span>
          <h2 className="font-outfit text-3xl font-extrabold text-white mt-3 leading-tight">
            Global Portfolio & Concierge Intelligence
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Monitor real-time guest arrivals, luxury revenue streams, and room inventory across 500+ world-class sanctuary retreats.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => onNavigateTab('hotels')}
              className="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold text-xs shadow-lg shadow-gold-600/30 transition-all transform hover:-translate-y-0.5"
            >
              + Publish New Property
            </button>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 transition-all"
            >
              Review Live Bookings
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gold-600/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Gross Revenue"
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          subtitle="Net after commission"
        />
        <StatCard
          title="Active Reservations"
          value={stats.totalBookings || 0}
          change="+12.1%"
          isPositive={true}
          icon={BookmarkCheck}
          subtitle="100% verified guests"
        />
        <StatCard
          title="Occupancy Index"
          value={`${stats.occupancyRate || 85}%`}
          change="+4.2%"
          isPositive={true}
          icon={BedDouble}
          subtitle="High season peak"
        />
        <StatCard
          title="VIP Member Base"
          value={stats.totalUsers || 0}
          change="+22.8%"
          isPositive={true}
          icon={Users}
          subtitle="Avg spend $4.2k/trip"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div>
          <CategoryChart categories={categoryDistribution} />
        </div>
      </div>

      {/* Recent Reservations Snapshot Table */}
      <div className="p-6 rounded-2xl bg-navy-800/90 border border-slate-800/90 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-outfit font-bold text-lg text-white">Recent Guest Check-Ins</h3>
            <p className="text-xs text-slate-400">Real-time incoming itineraries from mobile app</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors"
          >
            View All Reservations →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="pb-3 pl-2">Booking Ref</th>
                <th className="pb-3">Property</th>
                <th className="pb-3">Guest Details</th>
                <th className="pb-3">Stay Dates</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.slice(0, 4).map((b) => (
                <tr key={b._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-2 font-mono font-bold text-gold-400">
                    #{b._id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-white text-xs">{b.hotelName}</p>
                    <p className="text-[11px] text-slate-400">{b.roomName}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-semibold text-slate-200">{b.guestName}</p>
                    <p className="text-[11px] text-slate-500">{b.guestEmail}</p>
                  </td>
                  <td className="py-4 text-slate-300">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="py-4 font-bold text-white text-xs">
                    ${(b.grandTotal || 0).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'active'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : b.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
