import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { HotelService } from '../services/api';

export default function Bookings({ bookings, onStatusUpdate }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === 'all' || b.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      b.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    await HotelService.updateBookingStatus(id, newStatus);
    onStatusUpdate(id, newStatus);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
            Reservation Management Console
          </h2>
          <p className="text-xs text-slate-400">
            Live itinerary tracking, VIP guest requests & stay status updates
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          {['all', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === status
                  ? 'bg-gold-600 text-navy-900 shadow-md shadow-gold-600/20'
                  : 'bg-navy-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by hotel, guest name or ref..."
          className="w-full bg-navy-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-gold-500"
        />
      </div>

      {/* Bookings Table Card */}
      <div className="p-6 rounded-2xl bg-navy-800/90 border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="pb-3.5 pl-2">Ref ID</th>
                <th className="pb-3.5">Property & Suite</th>
                <th className="pb-3.5">Guest & Contact</th>
                <th className="pb-3.5">Dates & Nights</th>
                <th className="pb-3.5">Payment</th>
                <th className="pb-3.5">Grand Total</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right pr-2">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No reservations matching current filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
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
                    <td className="py-4">
                      <p className="text-slate-300 font-medium">
                        {b.checkIn} → {b.checkOut}
                      </p>
                      <p className="text-[11px] text-slate-500">{b.nights} Nights</p>
                    </td>
                    <td className="py-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                        {b.paymentMethod || 'Concierge Pay'}
                      </span>
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
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'completed')}
                            title="Mark Completed"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'cancelled')}
                            title="Cancel Reservation"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
