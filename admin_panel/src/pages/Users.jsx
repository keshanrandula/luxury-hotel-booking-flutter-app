import React, { useState } from 'react';
import { Search, Crown, Phone, Mail, Award } from 'lucide-react';

export default function Users({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.tier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
            VIP Membership Directory
          </h2>
          <p className="text-xs text-slate-400">
            High net worth travelers, Black Diamond cardholders & concierge point balances
          </p>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members by name or tier..."
            className="w-full bg-navy-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="p-5 rounded-2xl bg-navy-800/90 border border-slate-800/90 hover:border-gold-500/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">{user.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 p-3 rounded-xl bg-navy-900/80 border border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Tier Status</p>
                  <p className="font-bold text-gold-400 mt-0.5">{user.tier || 'Member'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Luxury Points</p>
                  <p className="font-bold text-white mt-0.5">{(user.points || 5000).toLocaleString()} pts</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Phone className="w-3 h-3 text-slate-500" />
                {user.phone || '+1 (555) 234-5678'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
