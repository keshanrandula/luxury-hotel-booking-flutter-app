import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Bookings from './pages/Bookings';
import Listings from './pages/Listings';
import AddHotel from './pages/AddHotel';
import Inventory from './pages/Inventory';
import Promos from './pages/Promos';
import Notifications from './pages/Notifications';
import Reviews from './pages/Reviews';
import Users from './pages/Users';
import { HotelService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statsData, setStatsData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviewsData, setReviewsData] = useState({ count: 0, stats: {}, reviews: [] });
  const [promosData, setPromosData] = useState({ count: 0, stats: {}, promos: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, bookingsRes, hotelsRes, usersRes, reviewsRes, promosRes] = await Promise.all([
        HotelService.getStats(),
        HotelService.getBookings(),
        HotelService.getHotels(),
        HotelService.getUsers(),
        HotelService.getReviews(),
        HotelService.getPromos(),
      ]);

      setStatsData(statsRes);
      setBookings(bookingsRes);
      setHotels(hotelsRes);
      setUsers(usersRes);
      setReviewsData(reviewsRes);
      setPromosData(promosRes);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await HotelService.updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      // Refresh stats
      const updatedStats = await HotelService.getStats();
      setStatsData(updatedStats);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  const handleReviewStatusUpdate = async (id, newStatus) => {
    setReviewsData((prev) => {
      const updatedReviews = prev.reviews.map((r) =>
        r._id === id ? { ...r, status: newStatus } : r
      );
      const pendingCount = updatedReviews.filter((r) => r.status === 'pending').length;
      const approvedCount = updatedReviews.filter((r) => r.status === 'approved').length;
      const rejectedCount = updatedReviews.filter((r) => r.status === 'rejected').length;

      return {
        ...prev,
        reviews: updatedReviews,
        stats: {
          ...prev.stats,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        },
      };
    });

    // Refresh hotel listings to reflect new ratings
    try {
      const updatedHotels = await HotelService.getHotels();
      setHotels(updatedHotels);
    } catch (_) {}
  };

  const handleDeleteReview = (id) => {
    setReviewsData((prev) => {
      const updatedReviews = prev.reviews.filter((r) => r._id !== id);
      return {
        ...prev,
        reviews: updatedReviews,
        stats: {
          ...prev.stats,
          total: updatedReviews.length,
          pending: updatedReviews.filter((r) => r.status === 'pending').length,
          approved: updatedReviews.filter((r) => r.status === 'approved').length,
          rejected: updatedReviews.filter((r) => r.status === 'rejected').length,
        },
      };
    });
  };

  const handleHotelAdded = async (newHotel) => {
    setHotels((prev) => [newHotel, ...prev]);
    const updatedStats = await HotelService.getStats();
    setStatsData(updatedStats);
    setActiveTab('listings');
  };

  const handleHotelDeleted = async (hotelId) => {
    try {
      await HotelService.deleteHotel(hotelId);
      setHotels((prev) => prev.filter((h) => h._id !== hotelId));
      const updatedStats = await HotelService.getStats();
      setStatsData(updatedStats);
    } catch (err) {
      console.error('Failed to delete hotel:', err);
    }
  };

  const pendingReviewsCount = reviewsData?.stats?.pending ?? 0;

  return (
    <div className="flex h-screen bg-[#090D16] text-slate-100 overflow-hidden font-jakarta">
      {/* Sidebar Rail */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onRefresh={loadAllData} isRefreshing={isRefreshing} />

        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-400">Loading Real Admin Data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  statsData={statsData}
                  bookings={bookings}
                  onNavigateTab={setActiveTab}
                  onStatusUpdate={handleStatusUpdate}
                />
              )}
              {activeTab === 'analytics' && (
                <Analytics />
              )}
              {activeTab === 'listings' && (
                <Listings
                  hotels={hotels}
                  onHotelAdded={handleHotelAdded}
                  onHotelDeleted={handleHotelDeleted}
                />
              )}
              {activeTab === 'inventory' && (
                <Inventory
                  hotels={hotels}
                  onRefresh={loadAllData}
                />
              )}
              {activeTab === 'promos' && (
                <Promos
                  promosData={promosData}
                  onRefresh={loadAllData}
                />
              )}
              {activeTab === 'notifications' && (
                <Notifications />
              )}
              {activeTab === 'add-hotel' && (
                <AddHotel onHotelAdded={handleHotelAdded} />
              )}
              {activeTab === 'bookings' && (
                <Bookings
                  bookings={bookings}
                  onStatusUpdate={handleStatusUpdate}
                  onRefresh={loadAllData}
                />
              )}
              {activeTab === 'reviews' && (
                <Reviews
                  reviewsData={reviewsData}
                  onStatusUpdate={handleReviewStatusUpdate}
                  onDeleteReview={handleDeleteReview}
                  onRefresh={loadAllData}
                />
              )}
              {activeTab === 'users' && <Users users={users} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
