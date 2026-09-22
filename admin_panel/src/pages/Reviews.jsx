import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Search, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Camera, 
  X, 
  Sparkles,
  Award
} from 'lucide-react';
import { HotelService } from '../services/api';

export default function Reviews({ reviewsData, onStatusUpdate, onDeleteReview, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePhoto, setActivePhoto] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const reviews = reviewsData?.reviews || [];
  const stats = reviewsData?.stats || {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
    averageRating: 4.9,
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.hotelName && r.hotelName.toLowerCase().includes(term)) ||
      (r.userName && r.userName.toLowerCase().includes(term)) ||
      (r.comment && r.comment.toLowerCase().includes(term)) ||
      (r.bookingId && r.bookingId.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id, status) => {
    setProcessingId(id);
    try {
      await HotelService.updateReviewStatus(id, status);
      if (onStatusUpdate) {
        onStatusUpdate(id, status);
      }
    } catch (err) {
      console.error('Failed to moderate review:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this guest review?')) {
      return;
    }
    setProcessingId(id);
    try {
      await HotelService.deleteReview(id);
      if (onDeleteReview) {
        onDeleteReview(id);
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
              Guest Reviews & Reputation Moderation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              Live Console
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit customer ratings, verify guest stay photos, and approve or reject feedback.
          </p>
        </div>

        {/* Action / Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-slate-700/60 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Reviews</p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">{stats.total || reviews.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Pending Queue
            </p>
            <p className="font-outfit text-2xl font-extrabold text-amber-400 mt-1">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Approved Reviews
            </p>
            <p className="font-outfit text-2xl font-extrabold text-emerald-400 mt-1">{stats.approved}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gold-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-gold-400" /> Avg Score
            </p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">
              {stats.averageRating ? stats.averageRating.toFixed(1) : '4.9'} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900/60 p-3 rounded-2xl border border-slate-800/80">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Reviews', count: stats.total },
            { id: 'pending', label: 'Pending Approval', count: stats.pending, badgeColor: 'bg-amber-500/20 text-amber-300' },
            { id: 'approved', label: 'Approved', count: stats.approved, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
            { id: 'rejected', label: 'Rejected', count: stats.rejected, badgeColor: 'bg-rose-500/20 text-rose-300' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === item.id
                  ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-navy-900 shadow-md shadow-gold-500/20'
                  : 'bg-navy-800 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  filter === item.id
                    ? 'bg-navy-900/30 text-navy-950'
                    : item.badgeColor || 'bg-slate-700/50 text-slate-300'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guest, hotel, or comments..."
            className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition"
          />
        </div>
      </div>

      {/* Review Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-navy-800/40 border border-slate-800/80">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No reviews found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `No results matching "${searchTerm}". Try a different keyword.`
              : `There are currently no reviews in the "${filter}" status filter.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.map((review) => {
            const isPending = review.status === 'pending';
            const isApproved = review.status === 'approved';
            const isRejected = review.status === 'rejected';

            return (
              <div
                key={review._id}
                className={`p-6 rounded-2xl bg-navy-800/80 border transition duration-200 ${
                  isPending
                    ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Reviewer & Hotel Header */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={
                        review.userAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={review.userName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-gold-500/40 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{review.userName}</h4>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-navy-900 border border-slate-700 text-gold-400">
                          {review.hotelName}
                        </span>
                        {review.bookingId && (
                          <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                            #{review.bookingId}
                          </span>
                        )}
                      </div>

                      {/* Stars & Date */}
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(review.rating)
                                  ? 'text-gold-400 fill-gold-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                          <span className="text-xs font-extrabold text-gold-400 ml-1">
                            {Number(review.rating).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 lg:self-start">
                    {isPending && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 animate-pulse" /> Pending Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" /> Live & Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                        <XCircle className="w-3 h-3" /> Rejected / Hidden
                      </span>
                    )}

                    {/* Moderation Controls */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700/60">
                      {!isApproved && (
                        <button
                          disabled={processingId === review._id}
                          onClick={() => handleStatusChange(review._id, 'approved')}
                          title="Approve and Publish Review"
                          className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          disabled={processingId === review._id}
                          onClick={() => handleStatusChange(review._id, 'rejected')}
                          title="Reject / Hide Review"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        disabled={processingId === review._id}
                        onClick={() => handleDelete(review._id)}
                        title="Delete permanently"
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment Text Body */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-slate-200 text-xs sm:text-sm leading-relaxed font-sans bg-navy-900/40 p-3.5 rounded-xl">
                  "{review.comment}"
                </div>

                {/* Attached Guest Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mt-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <Camera className="w-3.5 h-3.5 text-gold-400" />
                      <span>Guest Uploaded Photos ({review.photos.length})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {review.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setActivePhoto(photo)}
                          className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700/80 cursor-pointer group shadow-sm hover:scale-105 transition-transform"
                        >
                          <img
                            src={photo}
                            alt={`Guest stay photo ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:brightness-110 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Search className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Photo Preview Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl max-h-[85vh] bg-navy-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 p-2 bg-navy-950/80 hover:bg-slate-800 rounded-full text-white z-10 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-3 bg-navy-950 border-b border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Camera className="w-4 h-4 text-gold-400" />
              <span>Verified Guest Photo Inspection</span>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-black/40 p-4">
              <img
                src={activePhoto}
                alt="Full preview"
                className="max-h-[70vh] w-auto rounded-lg object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
