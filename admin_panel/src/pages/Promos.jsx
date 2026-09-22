import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  X, 
  TrendingUp,
  Percent,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { HotelService } from '../services/api';

export default function Promos({ promosData, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Form state
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('percentage');
  const [formValue, setFormValue] = useState(15);
  const [formMinSpend, setFormMinSpend] = useState(1000);
  const [formMaxDiscount, setFormMaxDiscount] = useState(1500);
  const [formExpiry, setFormExpiry] = useState('2027-12-31');

  const promos = promosData?.promos || [];
  const stats = promosData?.stats || {
    total: promos.length,
    active: promos.filter((p) => p.isActive).length,
    inactive: promos.filter((p) => !p.isActive).length,
    totalRedemptions: promos.reduce((acc, p) => acc + (p.usageCount || 0), 0),
  };

  const filteredPromos = promos.filter((p) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && p.isActive) ||
      (filter === 'inactive' && !p.isActive);

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.code.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const handleToggleActive = async (id, currentStatus) => {
    setProcessingId(id);
    try {
      await HotelService.updatePromo(id, { isActive: !currentStatus });
      setSuccessToast(`Promo code ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccessToast(''), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to toggle promo status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      return;
    }
    setProcessingId(id);
    try {
      await HotelService.deletePromo(id);
      setSuccessToast(`Promo code "${code}" removed.`);
      setTimeout(() => setSuccessToast(''), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete promo:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!formCode.trim()) {
      alert('Please enter a promo code');
      return;
    }

    try {
      await HotelService.createPromo({
        code: formCode.trim().toUpperCase(),
        description: formDesc.trim() || 'Exclusive VIP Promotional Discount',
        discountType: formType,
        discountValue: Number(formValue),
        minBookingAmount: Number(formMinSpend),
        maxDiscount: Number(formMaxDiscount),
        expiryDate: formExpiry,
        isActive: true,
      });

      setSuccessToast(`Promo code "${formCode.toUpperCase()}" created!`);
      setTimeout(() => setSuccessToast(''), 3000);
      setIsModalOpen(false);
      // Reset form
      setFormCode('');
      setFormDesc('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create promo code');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xl shadow-emerald-900/30 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
              Promotional Codes & Vouchers Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              Discounts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create coupon campaigns, manage minimum spends, and monitor VIP redemptions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-navy-950 font-bold rounded-xl text-xs transition shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Promo Campaigns</p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">{stats.total || promos.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Coupons
            </p>
            <p className="font-outfit text-2xl font-extrabold text-emerald-400 mt-1">{stats.active}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gold-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Total Redemptions
            </p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">{stats.totalRedemptions} Uses</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Max Discount Limit</p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">$2,500 / stay</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900/60 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Codes', count: stats.total },
            { id: 'active', label: 'Active', count: stats.active, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
            { id: 'inactive', label: 'Inactive', count: stats.inactive, badgeColor: 'bg-slate-700/50 text-slate-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === item.id
                  ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-900 shadow-md shadow-gold-500/20'
                  : 'bg-navy-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  filter === item.id ? 'bg-navy-900/30 text-navy-950' : item.badgeColor || 'bg-slate-700 text-slate-300'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search promo code or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition"
          />
        </div>
      </div>

      {/* Promo Cards Grid */}
      {filteredPromos.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-navy-800/40 border border-slate-800/80">
          <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No promo codes found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? `No coupons matching "${searchTerm}".` : 'Create your first promotional discount coupon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPromos.map((promo) => {
            const isPercentage = promo.discountType === 'percentage';
            const isCopied = copiedCode === promo.code;

            return (
              <div
                key={promo._id}
                className={`p-5 rounded-2xl bg-navy-800/80 border transition relative overflow-hidden flex flex-col justify-between ${
                  promo.isActive ? 'border-slate-800 hover:border-gold-500/50' : 'border-slate-800/50 opacity-60'
                }`}
              >
                {/* Dashed Left Border luxury effect */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-500 to-amber-600" />

                <div>
                  <div className="flex items-start justify-between gap-3">
                    {/* Code Chip */}
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-1.5 rounded-xl bg-navy-950 border border-gold-500/40 font-mono font-extrabold text-sm text-gold-400 tracking-wider flex items-center gap-2 shadow-inner">
                        <span>{promo.code}</span>
                        <button
                          onClick={() => handleCopy(promo.code)}
                          title="Copy Promo Code"
                          className="text-slate-400 hover:text-white transition p-0.5"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          isPercentage ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isPercentage ? `${promo.discountValue}% OFF` : `$${promo.discountValue} FLAT`}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <button
                      disabled={processingId === promo._id}
                      onClick={() => handleToggleActive(promo._id, promo.isActive)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
                        promo.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{promo.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mt-3 leading-relaxed">
                    {promo.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Min Spend: </span>
                      <strong className="text-slate-200">${promo.minBookingAmount || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Max Discount: </span>
                      <strong className="text-slate-200">${promo.maxDiscount || 'Unlimited'}</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Expires: <strong>{promo.expiryDate || 'No Expiry'}</strong></span>
                    </div>
                    <div>
                      <span className="text-slate-500">Total Uses: </span>
                      <strong className="text-gold-400">{promo.usageCount || 0} redemptions</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    Created {new Date(promo.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  <button
                    disabled={processingId === promo._id}
                    onClick={() => handleDelete(promo._id, promo.code)}
                    title="Delete Promo"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-navy-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scaleUp">
            <div className="p-5 bg-navy-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Create New Promotional Code</h3>
                  <p className="text-[11px] text-slate-400">Configure discount value, minimum spends, and limits</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Promo Code Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LUXE25, AUTUMN500"
                  className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-gold-400 placeholder:text-slate-600 focus:outline-none focus:border-gold-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Campaign Description
                </label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. 25% discount for luxury weekend escapes"
                  className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Flat Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Min Booking Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formMinSpend}
                    onChange={(e) => setFormMinSpend(Number(e.target.value))}
                    className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Max Discount Cap ($)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formMaxDiscount}
                    onChange={(e) => setFormMaxDiscount(Number(e.target.value))}
                    className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                  className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 bg-navy-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Coupon Preview</p>
                  <p className="font-mono font-bold text-xs text-gold-400 mt-0.5">{formCode || 'CODE_PREVIEW'}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-gold-500/20 text-gold-400 font-extrabold text-xs">
                  {formType === 'percentage' ? `${formValue || 0}% OFF` : `$${formValue || 0} FLAT`}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-navy-950 font-bold rounded-xl text-xs transition shadow-md shadow-gold-500/20"
                >
                  Publish Coupon Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
