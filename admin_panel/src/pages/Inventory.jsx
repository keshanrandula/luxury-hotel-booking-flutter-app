import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Hotel, 
  Layers, 
  Sparkles, 
  Plus, 
  Minus, 
  Save, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  BedDouble,
  DollarSign,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { HotelService } from '../services/api';

export default function Inventory({ hotels, onRefresh }) {
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const next = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return next.toISOString().split('T')[0];
  });

  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingRoomId, setSavingRoomId] = useState(null);
  const [roomEdits, setRoomEdits] = useState({});
  const [successToast, setSuccessToast] = useState('');

  // Set default selected hotel
  useEffect(() => {
    if (hotels && hotels.length > 0 && !selectedHotelId) {
      setSelectedHotelId(hotels[0]._id);
    }
  }, [hotels, selectedHotelId]);

  const loadAvailability = async () => {
    if (!selectedHotelId) return;
    setLoading(true);
    try {
      const data = await HotelService.checkAvailability(selectedHotelId, {
        checkIn,
        checkOut,
      });
      setAvailabilityData(data);

      // Initialize roomEdits state
      const edits = {};
      if (data && data.rooms) {
        data.rooms.forEach((r) => {
          edits[r.roomId] = {
            totalInventory: r.totalInventory,
            pricePerNight: r.basePricePerNight,
            weekendMultiplier: r.weekendMultiplier || 1.15,
          };
        });
      }
      setRoomEdits(edits);
    } catch (err) {
      console.error('Failed to load availability:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [selectedHotelId, checkIn, checkOut]);

  const handleEditChange = (roomId, field, value) => {
    setRoomEdits((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));
  };

  const handleInventoryStep = async (roomId, delta) => {
    const current = roomEdits[roomId]?.totalInventory ?? 5;
    const nextVal = Math.max(1, current + delta);
    handleEditChange(roomId, 'totalInventory', nextVal);

    setSavingRoomId(roomId);
    try {
      await HotelService.updateRoomInventory(selectedHotelId, roomId, {
        totalInventory: nextVal,
      });
      setSuccessToast(`Stock updated to ${nextVal} units.`);
      setTimeout(() => setSuccessToast(''), 3000);
      await loadAvailability();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update inventory step:', err);
    } finally {
      setSavingRoomId(null);
    }
  };

  const handleSaveRoomPricing = async (roomId) => {
    const edits = roomEdits[roomId];
    if (!edits) return;

    setSavingRoomId(roomId);
    try {
      await HotelService.updateRoomInventory(selectedHotelId, roomId, {
        totalInventory: Number(edits.totalInventory),
        pricePerNight: Number(edits.pricePerNight),
        weekendMultiplier: Number(edits.weekendMultiplier),
      });
      setSuccessToast(`Pricing & inventory rules saved!`);
      setTimeout(() => setSuccessToast(''), 3000);
      await loadAvailability();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save room pricing:', err);
    } finally {
      setSavingRoomId(null);
    }
  };

  const selectedHotel = hotels.find((h) => String(h._id) === String(selectedHotelId));

  // Overall Inventory Stats calculation
  const totalCapacity = (availabilityData?.rooms || []).reduce(
    (acc, r) => acc + (r.totalInventory || 0),
    0
  );
  const totalBooked = (availabilityData?.rooms || []).reduce(
    (acc, r) => acc + (r.bookedCount || 0),
    0
  );
  const totalAvailable = (availabilityData?.rooms || []).reduce(
    (acc, r) => acc + (r.availableCount || 0),
    0
  );
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

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
              Room Availability & Dynamic Inventory Console
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              Live Stock
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage unit stocks, simulate stay dates, prevent overbooking, and configure weekend rates.
          </p>
        </div>

        <button
          onClick={loadAvailability}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-slate-700/60 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Availability</span>
        </button>
      </div>

      {/* Hotel & Date Range Simulation Bar */}
      <div className="bg-navy-900/70 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Hotel Selector */}
        <div className="flex items-center gap-3 min-w-[280px] flex-1">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
            <Hotel className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Property
            </label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="w-full bg-navy-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold-500 transition"
            >
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} — {h.city || h.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Simulation Controls */}
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-navy-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-navy-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="pt-4">
            <span className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-gold-400">
              {availabilityData?.nights || 1} Night Stay
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Portfolio Units</p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">{totalCapacity} Units</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400">Available For Dates</p>
            <p className="font-outfit text-2xl font-extrabold text-emerald-400 mt-1">{totalAvailable} Units</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400">Booked / Occupied</p>
            <p className="font-outfit text-2xl font-extrabold text-amber-400 mt-1">{totalBooked} Units</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CalendarRange className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gold-400">Occupancy Ratio</p>
            <p className="font-outfit text-2xl font-extrabold text-white mt-1">{occupancyPercent}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Room Inventory List */}
      <div className="space-y-4">
        <h3 className="font-outfit text-lg font-bold text-white flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-gold-400" />
          <span>Room Types Inventory & Weekend Pricing Rules</span>
        </h3>

        {(!availabilityData?.rooms || availabilityData.rooms.length === 0) ? (
          <div className="p-12 text-center rounded-2xl bg-navy-800/40 border border-slate-800">
            <BedDouble className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">No rooms found for this property</h4>
            <p className="text-xs text-slate-400 mt-1">Add room categories to configure inventory and pricing rules.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {availabilityData.rooms.map((room) => {
              const edits = roomEdits[room.roomId] || {
                totalInventory: room.totalInventory,
                pricePerNight: room.basePricePerNight,
                weekendMultiplier: room.weekendMultiplier || 1.15,
              };

              const isLowStock = room.availableCount > 0 && room.availableCount <= 2;
              const isSoldOut = room.availableCount === 0;
              const weekendRate = Math.round(edits.pricePerNight * edits.weekendMultiplier);

              return (
                <div
                  key={room.roomId}
                  className={`p-6 rounded-2xl bg-navy-800/80 border transition ${
                    isSoldOut
                      ? 'border-rose-500/40 bg-rose-950/10'
                      : isLowStock
                      ? 'border-amber-500/40'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Room Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-outfit text-base font-bold text-white">{room.roomName}</h4>
                        {isSoldOut ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Sold Out for Dates
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Low Stock ({room.availableCount} Left)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Available ({room.availableCount} Available)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                        <span>🛏️ {room.bedType}</span>
                        <span>👥 Max {room.maxGuests} Guests</span>
                        <span>📅 Booked in range: <strong className="text-white">{room.bookedCount}</strong> of {room.totalInventory} units</span>
                      </div>

                      {/* Capacity Bar */}
                      <div className="mt-3 max-w-md">
                        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isSoldOut
                                ? 'bg-rose-500'
                                : isLowStock
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.round(((room.totalInventory - room.availableCount) / room.totalInventory) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock Stepper Controller */}
                    <div className="flex items-center gap-4 bg-navy-900/80 p-3 rounded-xl border border-slate-800">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Stock</p>
                        <p className="text-lg font-black text-white">{edits.totalInventory} Units</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={savingRoomId === room.roomId || edits.totalInventory <= 1}
                          onClick={() => handleInventoryStep(room.roomId, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition disabled:opacity-40"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={savingRoomId === room.roomId}
                          onClick={() => handleInventoryStep(room.roomId, 1)}
                          className="w-8 h-8 rounded-lg bg-gold-600/90 hover:bg-gold-500 text-navy-950 font-bold flex items-center justify-center transition disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Pricing Rules */}
                    <div className="flex flex-wrap items-center gap-4 bg-navy-900/80 p-3 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Base Weekday Rate
                        </label>
                        <div className="flex items-center gap-1 bg-navy-800 border border-slate-700 rounded-lg px-2 py-1">
                          <span className="text-xs text-slate-400">$</span>
                          <input
                            type="number"
                            value={edits.pricePerNight}
                            onChange={(e) =>
                              handleEditChange(room.roomId, 'pricePerNight', Number(e.target.value))
                            }
                            className="w-16 bg-transparent text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Weekend Markup
                        </label>
                        <select
                          value={edits.weekendMultiplier}
                          onChange={(e) =>
                            handleEditChange(room.roomId, 'weekendMultiplier', Number(e.target.value))
                          }
                          className="bg-navy-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-gold-400 focus:outline-none"
                        >
                          <option value={1.0}>No Surcharge (1.0x)</option>
                          <option value={1.1}>+10% (1.10x)</option>
                          <option value={1.15}>+15% (1.15x)</option>
                          <option value={1.2}>+20% (1.20x)</option>
                          <option value={1.25}>+25% (1.25x)</option>
                          <option value={1.3}>+30% (1.30x)</option>
                        </select>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Weekend Preview</p>
                        <p className="text-xs font-extrabold text-gold-400">${weekendRate} / night</p>
                      </div>

                      <button
                        disabled={savingRoomId === room.roomId}
                        onClick={() => handleSaveRoomPricing(room.roomId)}
                        className="px-3 py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-navy-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
