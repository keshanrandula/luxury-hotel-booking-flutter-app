import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  BarChart3,
  Flame,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [forecastData, setForecastData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [exportToast, setExportToast] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [forecastRes, heatmapRes] = await Promise.all([
        api.getForecastStats(),
        api.getOccupancyHeatmap(),
      ]);
      setForecastData(forecastRes);
      setHeatmapData(heatmapRes);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportBookings = () => {
    api.downloadBookingsCSV();
    setExportToast('Downloading complete Bookings Ledger CSV...');
    setTimeout(() => setExportToast(null), 4000);
  };

  const handleExportRevenue = () => {
    api.downloadRevenueCSV();
    setExportToast('Downloading Financial & Revenue Report CSV...');
    setTimeout(() => setExportToast(null), 4000);
  };

  const kpis = forecastData?.kpis || {
    nextMonthProjected: 48600,
    growthPercent: '+22.0%',
    avgForecastADR: 573,
    avgForecastOccupancy: '91.0%',
    forecastConfidence: '94.2%',
  };

  const trajectory = forecastData?.combinedTrajectory || [];

  const maxRevenue = trajectory.length > 0
    ? Math.max(...trajectory.map((t) => t.upperConfidence || t.revenue))
    : 100000;

  const getHeatmapColor = (status, rate) => {
    if (rate >= 85) return 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-900/40';
    if (rate >= 65) return 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-900/30';
    if (rate >= 40) return 'bg-emerald-600/80 text-white font-medium';
    return 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Export Toast Banner */}
      {exportToast && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-between shadow-lg shadow-amber-950/30">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm font-medium">{exportToast}</p>
          </div>
          <button onClick={() => setExportToast(null)} className="text-amber-400 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs uppercase tracking-widest mb-1">
            <TrendingUp size={14} />
            Business Intelligence & Revenue Forecasting
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Financial Analytics & Reports</h1>
          <p className="text-slate-400 text-sm mt-1">
            6-Month machine-learning revenue forecasting, 30-day occupancy heatmaps, and 1-click CSV data exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBookings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-sm font-semibold transition-all shadow-sm"
          >
            <Download size={15} className="text-amber-400" />
            Export Bookings (.CSV)
          </button>
          <button
            onClick={handleExportRevenue}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            <FileSpreadsheet size={15} />
            Export Financial Report (.CSV)
          </button>
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Refresh Analytics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Forecasting KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projected Next Month</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">${kpis.nextMonthProjected?.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mt-1">
            <Sparkles size={13} /> {kpis.forecastConfidence} Confidence Level
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projected Q4 Growth</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">{kpis.growthPercent}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <ArrowUpRight size={13} className="text-emerald-400" /> Above industry luxury baseline
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Forecasted ADR</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">${kpis.avgForecastADR}</div>
          <div className="text-xs text-slate-400 mt-1">Average Daily Rate per suite</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Forecasted Occupancy</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Flame size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{kpis.avgForecastOccupancy}</div>
          <div className="text-xs text-purple-400 font-medium mt-1">High-demand peak season</div>
        </div>
      </div>

      {/* Revenue Trajectory & Forecast Chart Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-amber-500" size={20} />
              Revenue Trajectory: Historical vs 6-Month Projection
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Machine projection based on seasonality, booking pacing, and average daily room rates.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-600"></span>
              <span className="text-slate-300 font-medium">Actual Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></span>
              <span className="text-amber-400 font-bold">Projected Forecast</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="h-64 flex items-end gap-2 md:gap-4 pt-6 pb-2 px-2 overflow-x-auto">
          {trajectory.map((item, index) => {
            const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100));
            const isForecast = item.type === 'forecast';

            return (
              <div key={index} className="flex-1 min-w-[50px] flex flex-col items-center gap-2 group relative">
                {/* Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-16 bg-slate-950 border border-slate-700 text-white text-[11px] rounded-lg py-1 px-2 pointer-events-none z-20 whitespace-nowrap shadow-xl">
                  <div className="font-bold text-amber-400">{item.period} ({item.type})</div>
                  <div>Revenue: ${item.revenue.toLocaleString()}</div>
                  <div className="text-slate-400">Occupancy: {item.occupancy}% | ADR: ${item.adr}</div>
                </div>

                {/* Bar */}
                <div className="w-full flex flex-col justify-end items-center h-48">
                  <span className="text-[10px] font-bold text-slate-300 mb-1 opacity-80">
                    ${(item.revenue / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 group-hover:scale-y-[1.03] origin-bottom ${
                      isForecast
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  ></div>
                </div>

                {/* X-Axis Label */}
                <div className="text-center">
                  <div className={`text-xs font-bold ${isForecast ? 'text-amber-400' : 'text-slate-300'}`}>
                    {item.month}
                  </div>
                  <div className="text-[10px] text-slate-500">'{String(item.year).slice(-2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-Day Occupancy Heatmap Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="text-amber-500" size={20} />
              30-Day Resort Occupancy Density Heatmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live density grid: Color-coded day-by-day room capacity across all 7 luxury properties.
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span>
              <span className="text-slate-400">&lt; 40% Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600/80"></span>
              <span className="text-emerald-400">40-64% Med</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span className="text-amber-300">65-84% High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              <span className="text-rose-300">85%+ Sold Out</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[850px] space-y-3">
            {heatmapData?.properties?.map((prop) => (
              <div key={prop.hotelId} className="flex items-center gap-3 p-3 bg-slate-900/90 border border-slate-800/90 rounded-2xl">
                {/* Hotel Label */}
                <div className="w-48 shrink-0">
                  <div className="font-bold text-white text-xs truncate" title={prop.hotelName}>
                    {prop.hotelName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">{prop.totalInventory} Suites</span>
                    <span className="text-[10px] font-bold text-amber-400">Avg {prop.avgOccupancy}%</span>
                  </div>
                </div>

                {/* 30-Day Cells */}
                <div className="flex items-center gap-1 flex-1">
                  {prop.days?.map((day, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => setSelectedDayDetail({ hotelName: prop.hotelName, day })}
                      className={`h-9 flex-1 rounded-md text-[10px] flex flex-col items-center justify-center transition-transform hover:scale-110 relative group ${getHeatmapColor(
                        day.status,
                        day.occupancyRate
                      )}`}
                    >
                      <span>{day.day}</span>
                      <span className="text-[8px] opacity-80">{day.occupancyRate}%</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Detail Box */}
        {selectedDayDetail && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {selectedDayDetail.hotelName} • {selectedDayDetail.day.date} ({selectedDayDetail.day.weekday})
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Occupancy: <span className="font-bold text-amber-400">{selectedDayDetail.day.occupancyRate}%</span> ({selectedDayDetail.day.occupiedCount} of {selectedDayDetail.day.totalInventory} Suites Booked, {selectedDayDetail.day.availableCount} Remaining)
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedDayDetail(null)}
              className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-1 bg-slate-800 rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* 1-Click Export Center Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="text-amber-500" size={20} />
          Executive Data Export & Ledger Center
        </h2>
        <p className="text-xs text-slate-400">
          Download real-time system spreadsheets formatted for Excel, Google Sheets, or accounting systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Reservations & Bookings Ledger</div>
                <div className="text-xs text-slate-400 mt-0.5">Guest contacts, dates, pricing, promo codes</div>
              </div>
            </div>
            <button
              onClick={handleExportBookings}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400 hover:text-white transition-all"
            >
              Export .CSV
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BarChart3 size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Monthly Revenue & Tax Summary</div>
                <div className="text-xs text-slate-400 mt-0.5">Gross volume, tax levies, net payouts</div>
              </div>
            </div>
            <button
              onClick={handleExportRevenue}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-400 hover:text-white transition-all"
            >
              Export .CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
