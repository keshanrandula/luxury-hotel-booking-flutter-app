import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Building, MapPin, Sparkles, DollarSign, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { HotelService } from '../services/api';

export default function AddHotel({ onHotelAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Luxury',
    city: '',
    country: '',
    location: '',
    pricePerNight: '',
    originalPrice: '',
    discountPercent: 0,
    description: '',
    amenities: 'Private Ocean Pool, Overwater Spa, St. Regis Butler, Fine Dining, Yacht Excursions',
    images: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    roomName: 'Oceanview Presidential Suite',
    roomBed: '1 King Bed',
    roomPrice: '',
    isFeatured: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await HotelService.uploadImage(file);
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          images: prev.images ? `${prev.images}, ${res.url}` : res.url,
        }));
      }
    } catch (err) {
      alert('Upload to Cloudinary notice: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newHotel = {
      name: formData.name,
      tagline: formData.tagline,
      category: formData.category,
      city: formData.city,
      country: formData.country,
      location: formData.location,
      pricePerNight: Number(formData.pricePerNight),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      discountPercent: Number(formData.discountPercent) || 0,
      description: formData.description,
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: formData.isFeatured,
      rating: 4.95,
      reviewCount: 1,
      rooms: [
        {
          name: formData.roomName || 'Signature Luxury Suite',
          bedType: formData.roomBed || '1 King Bed',
          maxGuests: 2,
          sizeSqM: 120,
          pricePerNight: Number(formData.roomPrice || formData.pricePerNight),
          imageUrl: formData.images.split(',')[0] || '',
          features: ['Ocean View', 'Private Jacuzzi', 'Butler Service'],
        },
      ],
      reviews: [],
    };

    const res = await HotelService.createHotel(newHotel);
    setLoading(false);
    setSuccess(true);
    if (onHotelAdded) onHotelAdded(res.data || newHotel);

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-outfit text-2xl font-extrabold text-white tracking-tight">
          Publish Luxury Property
        </h2>
        <p className="text-xs text-slate-400">
          List new exclusive resorts, overwater villas and chalets to the global mobile app catalogue
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-semibold animate-slideDown">
          <CheckCircle2 className="w-5 h-5" />
          <span>Property successfully published to MongoDB Atlas catalogue and synced to mobile apps!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-navy-800/90 border border-slate-800/90 shadow-2xl space-y-6">
        {/* Section 1: Property Identity */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" /> Property Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hotel Name</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Mansour Marrakech"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tagline / Headline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. A Palatial Oasis in the Imperial City"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Category */}
        <div className="pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Location & Vibe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="Luxury">Luxury</option>
                <option value="Beachfront">Beachfront</option>
                <option value="Mountain">Mountain</option>
                <option value="Boutique">Boutique</option>
                <option value="Urban">Urban</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">City / Atoll</label>
              <input
                type="text"
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Marrakech"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country</label>
              <input
                type="text"
                required
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Morocco"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Address / Location</label>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Rue Abou Abbas El Sebti, Medina, Marrakech"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Rates */}
        <div className="pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Nightly Rates & Promotion
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Base Rate ($ USD / night)</label>
              <input
                type="number"
                required
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                placeholder="e.g. 1650"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Original / Rack Rate ($ USD)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="e.g. 1950"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Discount (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Media, Description & Amenities */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Property Imagery (Cloudinary / CDN URLs)</label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-medium transition-colors">
                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                <span>{uploadingImage ? 'Uploading...' : 'Upload to Cloudinary'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://res.cloudinary.com/dioosqpp7/..."
              className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 font-mono"
            />
            {/* Image Preview Strip */}
            {formData.images && (
              <div className="mt-2.5 flex items-center gap-2 overflow-x-auto py-1">
                {formData.images.split(',').map((imgUrl, i) => {
                  const trimmed = imgUrl.trim();
                  if (!trimmed) return null;
                  return (
                    <div key={i} className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-700 bg-navy-900 shrink-0">
                      <img src={trimmed} alt={`preview-${i}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amenities (Comma-separated)</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Story & Overview</label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a compelling luxury narrative of the resort..."
              className="w-full bg-navy-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded accent-gold-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Pin to "Featured Escapes" Hero Carousel on Mobile App
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold text-sm shadow-xl shadow-gold-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Publishing to Atlas...' : '+ Publish Luxury Property to Worldwide Catalog'}
          </button>
        </div>
      </form>
    </div>
  );
}
