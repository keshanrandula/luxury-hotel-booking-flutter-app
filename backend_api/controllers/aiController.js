const store = require('../config/dataStore');
const Hotel = require('../models/Hotel');

/**
 * AI Luxury Concierge Controller
 * Provides context-aware intelligent responses about hotels, destinations,
 * itineraries, amenities, dining menus, and special packages.
 */

// Helper to get active hotels catalog
async function getCatalogHotels() {
  try {
    const mongoHotels = await Hotel.find();
    if (mongoHotels && mongoHotels.length > 0) {
      return mongoHotels;
    }
  } catch (_) {}
  return store.getHotels();
}

exports.chatWithConcierge = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or travel query.',
      });
    }

    const query = message.trim().toLowerCase();
    const hotels = await getCatalogHotels();

    // Context analysis
    let matchedHotels = [];
    let reply = '';
    let suggestions = [];

    // 1. Check if user is asking for specific hotel or category
    const isBeach = query.includes('beach') || query.includes('ocean') || query.includes('sea') || query.includes('tangalle') || query.includes('mirissa');
    const isHill = query.includes('hill') || query.includes('tea') || query.includes('ella') || query.includes('hatton') || query.includes('nuwara eliya') || query.includes('mountain');
    const isHeritage = query.includes('galle') || query.includes('fort') || query.includes('heritage') || query.includes('colonial') || query.includes('culture');
    const isLuxury = query.includes('luxury') || query.includes('best') || query.includes('top') || query.includes('exclusive') || query.includes('vip') || query.includes('villa');
    const isDining = query.includes('food') || query.includes('dining') || query.includes('menu') || query.includes('breakfast') || query.includes('restaurant') || query.includes('chef') || query.includes('eat');
    const isItinerary = query.includes('itinerary') || query.includes('plan') || query.includes('days') || query.includes('trip') || query.includes('tour') || query.includes('day 1') || query.includes('visit');
    const isPrice = query.includes('price') || query.includes('rate') || query.includes('cost') || query.includes('cheap') || query.includes('discount') || query.includes('deal') || query.includes('offer');
    const isAmenities = query.includes('amenit') || query.includes('pool') || query.includes('spa') || query.includes('wifi') || query.includes('jacuzzi') || query.includes('helipad') || query.includes('butler');

    // Find specific hotel mentioned (smart token & partial matching)
    const specificHotel = hotels.find((h) => {
      const nameTokens = h.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && !['resort', 'hotel', 'villa', 'retreat', 'sanctuary', 'the'].includes(w));
      return query.includes(h.name.toLowerCase()) || 
             nameTokens.some((token) => query.includes(token)) ||
             (h.city && query.includes(h.city.toLowerCase()));
    });

    if (specificHotel) {
      matchedHotels = [specificHotel];

      if (isDining) {
        reply = `✨ **Gastronomy & Dining at ${specificHotel.name}**\n\nAt **${specificHotel.name}** in ${specificHotel.city}, culinary excellence is curated by master executive chefs:\n\n` +
          `• **Artisan Breakfast**: Farm-to-table tropical fruits, freshly baked brioches, Ceylon artisan tea pairings, and champagne mimosas.\n` +
          `• **Signature Seafood Grill**: Fresh catch of the Indian Ocean, jumbo tiger prawns, reef lobster, and yellowfin tuna carpaccio.\n` +
          `• **Private Dining Experiences**: Candlelit beachside setup, private overwater pavilion, or vintage wine cellar dinners with personal sommelier.\n\n` +
          `Would you like me to arrange a reservation or include dinner in your accommodation package?`;
        suggestions = ['View Available Rooms', 'Book Private Dining', 'Explore Spa Treatments'];
      } else if (isAmenities) {
        const amList = specificHotel.amenities && specificHotel.amenities.length > 0 
          ? specificHotel.amenities.map((a) => `• **${a}**`).join('\n')
          : '• Private Infinity Pool\n• Hydrothermal Spa\n• 24/7 Dedicated Butler Service\n• Fine Dining Restaurants';

        reply = `✨ **Exclusive Amenities at ${specificHotel.name}**\n\nHere are the world-class signature amenities available for our VIP guests at **${specificHotel.name}**:\n\n` +
          `${amList}\n\n` +
          `⭐ Guest Rating: **${specificHotel.rating || 4.95}/5.0** (${specificHotel.reviewCount || 150}+ verified reviews).\n` +
          `Nightly rates start at **$${specificHotel.pricePerNight} USD / night**.`;
        suggestions = [`Book ${specificHotel.name}`, 'Check Room Categories', 'Inquire Concierge Transfer'];
      } else {
        reply = `✨ **Welcome to ${specificHotel.name}**\n\n*${specificHotel.tagline || 'Exclusive Luxury Sanctuary'}*\n\n` +
          `📍 **Location**: ${specificHotel.location}\n` +
          `💵 **Nightly Rate**: $${specificHotel.pricePerNight} USD / night ${specificHotel.discountPercent ? `(Save ${specificHotel.discountPercent}%)` : ''}\n\n` +
          `${specificHotel.description}\n\n` +
          `Would you like to reserve this sanctuary or view available room configurations?`;
        suggestions = [`Book Room at $${specificHotel.pricePerNight}/night`, 'Dining & Spa Options', 'Nearby Attractions'];
      }
    } else if (isItinerary) {
      matchedHotels = hotels.slice(0, 3);
      reply = `🗺️ **Bespoke 3-Day Ceylon Luxury Sanctuary Itinerary**\n\n` +
        `Here is a hand-crafted VIP itinerary designed for unparalleled comfort and authentic island wonders:\n\n` +
        `**Day 1: Colonial Grandeur & Coastal Sunset (Galle Fort)**\n` +
        `• *Morning*: Private luxury chauffeur transfer to UNESCO Galle Fort.\n` +
        `• *Afternoon*: Check-in at your heritage sanctuary. Walk cobblestone ramparts with our private historian.\n` +
        `• *Evening*: Oceanfront champagne cocktail reception followed by private courtyard seafood dinner.\n\n` +
        `**Day 2: Tea Trails & Misty Highland Serenity (Ella / Hatton)**\n` +
        `• *Morning*: Scenic private helicopter or VIP First Class Observation train through misty tea estates.\n` +
        `• *Afternoon*: Organic tea plucking masterclass & Mountain View Hydrothermal Spa session.\n` +
        `• *Evening*: 5-course gourmet dining paired with vintage single-origin Ceylon black tea.\n\n` +
        `**Day 3: Ocean Seclusion & Private Plunge Pool (Tangalle / Mirissa)**\n` +
        `• *Morning*: Private luxury yacht charter for blue whale watching off Mirissa Bay.\n` +
        `• *Afternoon*: Rejuvenating beachfront Ayurvedic massage & sunset coconut grove walk.\n` +
        `• *Night*: Stargazing bonfire dinner by the golden sands.\n\n` +
        `Would you like me to book any of these featured properties for your travel dates?`;
      suggestions = ['View Featured Beachfront Resorts', 'Explore Highland Chalets', 'Book Chauffeur Transfer'];
    } else if (isBeach) {
      matchedHotels = hotels.filter((h) => (h.category && h.category.toLowerCase() === 'beachfront') || (h.location && (h.location.toLowerCase().includes('beach') || h.location.toLowerCase().includes('tangalle') || h.location.toLowerCase().includes('mirissa') || h.location.toLowerCase().includes('maldives')))).slice(0, 3);
      if (matchedHotels.length === 0) matchedHotels = hotels.slice(0, 2);

      reply = `🏖️ **Top Luxury Beachfront Sanctuaries**\n\nHere are our finest handpicked oceanfront properties with private plunge pools, direct golden sand access, and butler service:\n\n` +
        matchedHotels.map((h, i) => `**${i + 1}. ${h.name}** (${h.city || h.location})\n• *Rate*: $${h.pricePerNight}/night\n• *Vibe*: ${h.tagline || 'Private Oceanfront Oasis'}`).join('\n\n') +
        `\n\nEach property includes complimentary daily artisan breakfast and priority concierge reservations.`;
      suggestions = ['Check Oceanview Suites', 'Private Yacht Charters', 'View Hill Country Escapes'];
    } else if (isHill) {
      matchedHotels = hotels.filter((h) => (h.category && h.category.toLowerCase() === 'mountain') || (h.location && (h.location.toLowerCase().includes('ella') || h.location.toLowerCase().includes('hatton') || h.location.toLowerCase().includes('tea') || h.location.toLowerCase().includes('switzerland')))).slice(0, 3);
      if (matchedHotels.length === 0) matchedHotels = hotels.slice(0, 2);

      reply = `⛰️ **Misty Highlands & Tea Country Chalets**\n\nImmerse yourself in cooler elevations, panoramic tea estate views, and colonial fireplace lounges:\n\n` +
        matchedHotels.map((h, i) => `**${i + 1}. ${h.name}** (${h.city})\n• *Rate*: $${h.pricePerNight}/night\n• *Highlight*: ${h.tagline || 'Panoramic Mountain Views'}`).join('\n\n') +
        `\n\nWould you like assistance selecting a panoramic chalet?`;
      suggestions = ['View Chalets in Ella', 'Book Tea Estate Tour', 'Explore Beachfront Villas'];
    } else if (isPrice || query.includes('offer') || query.includes('discount')) {
      matchedHotels = hotels.slice(0, 3);
      reply = `💎 **Exclusive VIP Member Rates & Offers**\n\nAs a valued LuxeStays traveler, you enjoy privileged rates across our global portfolio:\n\n` +
        matchedHotels.map((h) => `• **${h.name}**: Starting at **$${h.pricePerNight} USD/night** ${h.discountPercent ? `(🔥 Save ${h.discountPercent}% VIP discount)` : ''}`).join('\n') +
        `\n\n✨ **Complimentary VIP Inclusions**:\n• Daily artisan champagne breakfast\n• Early 11:00 AM check-in & late 3:00 PM check-out (subject to availability)\n• $100 Resort Spa credit per stay`;
      suggestions = ['Book with VIP Perks', 'Plan 3-Day Itinerary', 'Ask About Dining'];
    } else {
      matchedHotels = hotels.slice(0, 2);
      reply = `✨ **Hello! I am your AI Luxury Concierge.**\n\nI am delighted to assist you with bespoke travel plans, handpicked sanctuary recommendations, dining inquiries, and private excursions.\n\n` +
        `Here are some things you can ask me:\n` +
        `• *"Recommend beachfront resorts with private plunge pools"*\n` +
        `• *"Plan a 3-day luxury tour in Sri Lanka"*\n` +
        `• *"Tell me about the dining and spa at ${hotels[0]?.name || 'our luxury resorts'}"*\n` +
        `• *"What are the best hill country chalets for couples?"*\n\n` +
        `How may I curate your journey today?`;
      suggestions = ['🏖️ Best Beachfront Sanctuaries', '⛰️ 3-Day Luxury Itinerary', '🍽️ Gourmet Dining & Menus', '💎 Exclusive VIP Deals'];
    }

    res.status(200).json({
      success: true,
      message: reply,
      suggestions,
      recommendedHotels: matchedHotels.map((h) => ({
        id: h._id || h.id,
        name: h.name,
        tagline: h.tagline,
        location: h.location,
        city: h.city,
        pricePerNight: h.pricePerNight,
        rating: h.rating,
        category: h.category,
        image: h.images && h.images.length > 0 ? h.images[0] : '',
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
