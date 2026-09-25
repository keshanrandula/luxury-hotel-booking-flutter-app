import React, { useState } from 'react';
import { Search, Crown, Phone, Mail, MapPin, Calendar, UserCheck, ShieldCheck } from 'lucide-react';

export default function Users({ users = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = (users || []).filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.toLowerCase().includes(term)) ||
      (u.country && u.country.toLowerCase().includes(term)) ||
      (u.tier && u.tier.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name = '') => {
    const colors = [
      'from-amber-500 to-yellow-600',
      'from-blue-600 to-indigo-700',
      'from-emerald-500 to-teal-700',
      'from-purple-600 to-pink-600',
      'from-rose-500 to-orange-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
              Registered Users & VIP Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              {users.length} Real Users
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time registered customer accounts, contact numbers, countries & luxury reward points
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, country..."
            className="w-full bg-navy-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Users Cards Grid */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-800/50 border border-slate-800 text-slate-400">
          <UserCheck className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-white">No registered users found</p>
          <p className="text-xs mt-1 text-slate-500">
            {searchTerm ? `No users match "${searchTerm}"` : 'Registered users will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => {
            const initials = getInitials(user.name);
            const gradient = getAvatarGradient(user.name || user.email);
            const formattedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recently';

            return (
              <div
                key={user._id || user.id || user.email}
                className="p-5 rounded-2xl bg-navy-800/90 border border-slate-800/90 hover:border-gold-500/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl && !user.avatarUrl.includes('unsplash.com') ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-500/40"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white text-sm ring-2 ring-gold-500/30 shadow-inner`}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm leading-tight truncate">
                          {user.name || 'VIP Member'}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20 shrink-0">
                      {user.role === 'admin' ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Crown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Tier & Points */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-navy-900/80 border border-slate-800/90 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Tier Status</p>
                      <p className="font-bold text-gold-400 mt-0.5">{user.tier || 'Silver Prestige'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Luxury Points</p>
                      <p className="font-bold text-white mt-0.5">{(user.points || 5000).toLocaleString()} pts</p>
                    </div>
                  </div>
                </div>

                {/* Footer Details: Phone, Country, Date & Role */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-end justify-between text-xs gap-2">
                  <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3 h-3 text-gold-400/80 shrink-0" />
                      <span>{user.phone || 'No phone provided'}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3 h-3 text-gold-400/80 shrink-0" />
                      <span>{user.country || 'Sri Lanka'}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      <span>Joined {formattedDate}</span>
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                    }`}
                  >
                    {user.role || 'Member'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
