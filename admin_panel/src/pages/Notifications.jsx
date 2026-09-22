import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Sparkles,
  Calendar,
  CheckCircle2,
  Users,
  Smartphone,
  Tag,
  Clock,
  Radio,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDeliveredPush: 0,
    registeredDevices: 3400,
    bookingAlertsSent: 0,
    checkInRemindersSent: 0,
    promoCampaignsSent: 0,
    deliverySuccessRate: '99.8%',
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dispatching, setDispatching] = useState(false);
  const [reminding, setReminding] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  // Composer Form State
  const [formData, setFormData] = useState({
    title: '🌟 VIP Summer Escapes: 20% Off Private Villas',
    body: 'Indulge in complimentary ocean champagne and private helicopter transfers on bookings over 3 nights.',
    type: 'promo_deal',
    targetAudience: 'all',
    deepLink: 'promo:SUMMERSCAPE',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notifsData, statsData] = await Promise.all([
        api.getNotifications(),
        api.getNotificationStats(),
      ]);
      setNotifications(notifsData);
      if (statsData && Object.keys(statsData).length > 0) {
        setStats((prev) => ({ ...prev, ...statsData }));
      }
    } catch (err) {
      console.error('Failed to load notifications data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    try {
      setDispatching(true);
      const res = await api.sendPushNotification({
        title: formData.title,
        body: formData.body,
        type: formData.type,
        targetAudience: formData.targetAudience,
        data: {
          deepLink: formData.deepLink,
          source: 'admin_broadcast',
        },
      });

      setSuccessToast(`Push broadcast successfully dispatched to ${res.data?.recipientCount || 'target'} devices!`);
      setTimeout(() => setSuccessToast(null), 5000);
      fetchData();
    } catch (err) {
      alert('Failed to dispatch notification: ' + (err.response?.data?.message || err.message));
    } finally {
      setDispatching(false);
    }
  };

  const handleTriggerCheckInReminders = async () => {
    try {
      setReminding(true);
      const res = await api.triggerCheckInReminders();
      setSuccessToast(`Dispatched ${res.count || 1} upcoming check-in concierge reminders!`);
      setTimeout(() => setSuccessToast(null), 5000);
      fetchData();
    } catch (err) {
      alert('Failed to trigger reminders: ' + err.message);
    } finally {
      setReminding(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'promo_deal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Tag size={12} /> Promo Deal
          </span>
        );
      case 'checkin_reminder':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock size={12} /> Check-In Reminder
          </span>
        );
      case 'booking_confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} /> Booking Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles size={12} /> System Alert
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Toast Banner */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-lg shadow-emerald-950/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-medium">{successToast}</p>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs uppercase tracking-widest mb-1">
            <Radio size={14} className="animate-pulse" />
            FCM Cloud Messaging Operations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Push Notifications & Broadcasts</h1>
          <p className="text-slate-400 text-sm mt-1">
            Dispatch automated booking confirmations, 24h check-in alerts, and promotional push campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerCheckInReminders}
            disabled={reminding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Clock size={16} className={reminding ? 'animate-spin text-amber-400' : 'text-amber-400'} />
            {reminding ? 'Scanning...' : 'Dispatch 24h Check-in Reminders'}
          </button>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Refresh Logs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Push Delivered</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Send size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats.totalDeliveredPush.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
            <ShieldCheck size={14} /> {stats.deliverySuccessRate} Delivery Rate
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Devices (FCM)</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Smartphone size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats.registeredDevices.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">iOS & Android registered tokens</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Check-in Reminders</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats.checkInRemindersSent.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">24h arrival alerts sent</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Promo Broadcasts</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats.promoCampaignsSent}</div>
          <div className="text-xs text-purple-400 font-medium mt-1">Special discount pushes</div>
        </div>
      </div>

      {/* Main Section: Composer & Live Device Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Push Composer Form */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Push Broadcast Campaign</h2>
              <p className="text-xs text-slate-400">Compose and dispatch instant rich push notifications to mobile guests</p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Notification Headline (Title)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={90}
                placeholder="e.g. 🌟 20% Holiday Special: Code HOLIDAY20"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Message Body
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                required
                rows={3}
                maxLength={250}
                placeholder="Enter compelling message text with perks or itinerary notes..."
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Supports emojis & concierge formatting</span>
                <span>{formData.body.length} / 250</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Campaign Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="promo_deal">🏷️ Promotional Deal</option>
                  <option value="checkin_reminder">⏰ Check-In Reminder</option>
                  <option value="booking_confirmed">🛎️ Booking Alert</option>
                  <option value="system_alert">👑 System / VIP Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Target Audience (FCM Topic)
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="all">🌍 All Registered Guests (Global)</option>
                  <option value="active_bookings">📅 Guests with Active Reservations</option>
                  <option value="vip_tier">👑 VIP Elite Tier Members</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Deep Link Action / Promo Tag (Optional)
              </label>
              <input
                type="text"
                value={formData.deepLink}
                onChange={(e) => setFormData({ ...formData, deepLink: e.target.value })}
                placeholder="e.g. promo:WELCOME10 or screen:booking_details"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={dispatching}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                <Send size={16} className={dispatching ? 'animate-bounce' : ''} />
                {dispatching ? 'Broadcasting to FCM...' : 'Dispatch Live Push Notification'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Realistic Device Lockscreen Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Live Device Preview</span>
            <p className="text-xs text-slate-400 mt-0.5">Real-time mobile lockscreen simulation</p>
          </div>

          {/* Smartphone Frame */}
          <div className="w-[300px] h-[580px] bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden ring-1 ring-white/10">
            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-950 mr-2"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
            </div>

            {/* Lockscreen Header */}
            <div className="text-center text-slate-300 mt-2">
              <div className="text-4xl font-extralight tracking-tight text-white">09:41</div>
              <div className="text-[11px] font-medium text-slate-400 mt-1">Monday, September 21</div>
            </div>

            {/* Push Notification Bubble Card */}
            <div className="my-auto w-full">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl ring-1 ring-amber-500/30 animate-pulse-slow">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 text-[10px] font-black shadow-sm">
                      L
                    </div>
                    <span className="text-[11px] font-bold text-white">LUXESTAYS CONCIERGE</span>
                  </div>
                  <span className="text-[10px] text-slate-400">now</span>
                </div>

                <div className="text-[12px] font-bold text-amber-300 leading-tight">
                  {formData.title || 'Notification Headline'}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-3">
                  {formData.body || 'Your notification body preview will update here in real time...'}
                </div>

                {formData.deepLink && (
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-amber-400 font-medium">
                    <span>Tap to view offer</span>
                    <ArrowRight size={10} />
                  </div>
                )}
              </div>
            </div>

            {/* Lockscreen Bottom Buttons */}
            <div className="flex items-center justify-between px-4 pb-2">
              <div className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
                🔦
              </div>
              <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
              <div className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
                📷
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Push Campaign Delivery Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Push Dispatches & Delivery Logs</h2>
            <p className="text-xs text-slate-400">Audit history of automated and broadcast push messages</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Logs' },
              { id: 'promo_deal', label: 'Promos 🏷️' },
              { id: 'checkin_reminder', label: 'Check-in ⏰' },
              { id: 'booking_confirmed', label: 'Bookings 🛎️' },
              { id: 'system_alert', label: 'System 👑' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Type & Status</th>
                <th className="py-3 px-4">Headline & Message</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4 text-center">Recipients</th>
                <th className="py-3 px-4 text-right">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                    No push notifications found for this category.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        {getTypeBadge(item.type)}
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 size={10} /> Delivered
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">{item.body}</div>
                      {item.data?.promoCode && (
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Coupon: {item.data.promoCode}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-300 capitalize bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        {item.targetAudience?.replace('_', ' ') || 'All Subscribers'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-white text-xs">
                      {item.recipientCount ? item.recipientCount.toLocaleString() : '1'}
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
};

export default Notifications;
