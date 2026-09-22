import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  Hotel, 
  Users, 
  Sparkles, 
  Sliders, 
  LogOut, 
  ShieldCheck,
  Star,
  CalendarRange,
  Tag,
  Bell,
  TrendingUp
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pendingReviewsCount = 0 }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp, badge: 'Forecast' },
    { id: 'listings', label: 'Listings', icon: Hotel },
    { id: 'inventory', label: 'Room Inventory', icon: CalendarRange, badge: 'Realtime' },
    { id: 'promos', label: 'Promo Coupons', icon: Tag, badge: 'Deals' },
    { id: 'notifications', label: 'Push Alerts (FCM)', icon: Bell, badge: 'FCM' },
    { id: 'add-hotel', label: 'Add Hotel', icon: Sparkles, badge: 'New' },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck2, badge: 'Live' },
    { 
      id: 'reviews', 
      label: 'Reviews', 
      icon: Star, 
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Pending` : 'Verified',
      badgeColor: pendingReviewsCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-navy-800 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/20 text-navy-900">
              <Sparkles className="w-5 h-5 text-navy-900 font-bold" />
            </div>
            <div>
              <h1 className="font-outfit font-extrabold tracking-widest text-lg text-white">
                LUXE<span className="text-gold-500">STAYS</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                Concierge Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-6 space-y-1.5">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Operations
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-600/20 to-transparent border-l-4 border-gold-500 text-gold-400 font-semibold pl-3'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${item.badgeColor || 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin User Footer Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-navy-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-500 to-amber-300 flex items-center justify-center text-navy-900 font-bold text-xs">
              AW
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Alexander W.</p>
              <div className="flex items-center gap-1 text-[10px] text-gold-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>
          <button 
            title="Sign Out"
            onClick={() => alert('Logged out from admin console')}
            className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
