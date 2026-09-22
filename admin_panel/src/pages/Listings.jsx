import React, { useState } from 'react';
import { Plus, Building2, MapPin, DollarSign, Star, Trash2, Edit3, X, Check, Sparkles } from 'lucide-react';
import { HotelService } from '../services/api';

const AVAILABLE_AMENITIES = [
  'Private Ocean Pool',
  'Overwater Spa',
  'St. Regis Butler',
  'Fine Dining',
  'Yacht Excursions',
  'Ski Butler',
  'Helipad Access',
  'Free High-Speed Wi-Fi',
  'Infinity Pool',
  'Vitality Spa',
];

export default function Listings({ hotels, onHotelAdded, onHotelDeleted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Luxury',
    city: '',
    country: '',
    location: '',
    pricePerNight: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Private Ocean Pool', 'Overwater Spa', 'Fine Dining'],
    isFeatured: true,
  });

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newListing = {
        name: formData.name,
        tagline: formData.tagline || 'Exclusive Luxury Sanctuary',
        category: formData.category,
        city: formData.city,
        country: formData.country,
        location: formData.location,
        pricePerNight: Number(formData.pricePerNight),
        description: formData.description,
        amenities: formData.amenities,
        images: [formData.imageUrl],
        isFeatured: formData.isFeatured,
        rating: 4.95,
        reviewCount: 1,
        rooms: [
          {
            name: 'Signature Suite',
            bedType: '1 King Bed',
            pricePerNight: Number(formData.pricePerNight),
            imageUrl: formData.imageUrl,
            features: ['Panoramic View', 'Luxury Bath'],
          },
        ],
        reviews: [],
      };

      const res = await HotelService.createHotel(newListing);
      if (onHotelAdded) onHotelAdded(res.data || newListing);

      setIsModalOpen(false);
      setFormData({
        name: '',
        tagline: '',
        category: 'Luxury',
        city: '',
        country: '',
        location: '',
        pricePerNight: '',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        amenities: ['Private Ocean Pool', 'Overwater Spa'],
        isFeatured: true,
      });
    } catch (err) {
      alert('Failed to publish hotel listing: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotel) => {
    if (window.confirm(`Are you sure you want to remove "${hotel.name}" from live listings?`)) {
      setDeletingId(hotel._id);
      try {
        if (onHotelDeleted) await onHotelDeleted(hotel._id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredHotels = hotels.filter(
    (h) => selectedCategory === 'All' || h.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
            Hotel & Sanctuary Listings
          </h2>
          <p className="text-xs text-slate-400">
            Live catalog synchronized with backend API ({hotels.length} active luxury properties)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold text-xs shadow-lg shadow-gold-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Listing
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Luxury', 'Beachfront', 'Mountain', 'Boutique'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-gold-600 text-navy-900 shadow-md shadow-gold-600/20'
                : 'bg-navy-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            No properties found in this category.
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="rounded-2xl bg-navy-800/90 border border-slate-800/90 overflow-hidden shadow-xl hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-navy-900">
                  <img
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white tracking-wider">
                    {hotel.category || 'Luxury'}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-gold-400">
                    <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    <span>{hotel.rating || 4.9}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{hotel.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(hotel.amenities || []).slice(0, 3).map((amenity, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300">
                        {amenity}
                      </span>
                    ))}
                    {(hotel.amenities || []).length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-gold-400 font-semibold">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Actions Footer */}
              <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Nightly from</span>
                  <span className="font-outfit font-extrabold text-lg text-gold-400">${(hotel.pricePerNight || 0).toLocaleString()}</span>
                  <span className="text-xs text-slate-400"> / night</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(hotel)}
                    disabled={deletingId === hotel._id}
                    title="Delete Hotel"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-navy-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700/80 flex items-center justify-between bg-navy-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-600/20 text-gold-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-white">Add New Hotel Listing</h3>
                  <p className="text-xs text-slate-400">Publish a new property to the mobile app & web booking engine</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Property Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Soneva Jani Overwater"
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Beachfront">Beachfront</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Boutique">Boutique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Noonu Atoll"
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Maldives"
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nightly Rate ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    placeholder="e.g. 1850"
                    className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Location Address</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Medhufaru Island, Noonu Atoll, Maldives"
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              {/* Amenities Selector Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Amenities & Features</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gold-600/20 border-gold-500 text-gold-400 font-bold'
                            : 'bg-navy-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the bespoke luxury experience..."
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold text-xs shadow-lg shadow-gold-600/30 transition-all flex items-center gap-2"
                >
                  {loading ? 'Publishing...' : '+ Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
