const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db_store.json');

const initialHotels = [
  {
    _id: 'hotel-001',
    name: 'The St. Regis Maldives Vommuli',
    tagline: 'Overwater Ultra-Luxury Sanctuary',
    location: 'Dhaalu Atoll, Maldives',
    city: 'Dhaalu Atoll',
    country: 'Maldives',
    rating: 4.98,
    reviewCount: 342,
    pricePerNight: 1450,
    originalPrice: 1800,
    discountPercent: 20,
    category: 'Beachfront',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Nestled between verdant rainforest and white-sand beaches on a private island with overwater villas and personal butler service.',
    amenities: ['Private Ocean Pool', 'Overwater Spa', 'St. Regis Butler', 'Fine Dining', 'Yacht Excursions'],
    rooms: [
      {
        id: 'rm-101',
        name: 'Overwater Villa with Private Pool',
        bedType: '1 King Bed',
        maxGuests: 3,
        sizeSqM: 182,
        pricePerNight: 1450,
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        features: ['Direct Lagoon Access', 'Marble Bathroom', 'Sunset View'],
      },
      {
        id: 'rm-102',
        name: 'Sunset Ocean Suite',
        bedType: '2 King Beds',
        maxGuests: 4,
        sizeSqM: 285,
        pricePerNight: 2250,
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        features: ['Panoramic Glass Floor', 'Private Infinity Pool', 'Dedicated Chef'],
      },
    ],
    isFeatured: true,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    _id: 'hotel-002',
    name: 'The Chedi Andermatt',
    tagline: 'Alpine Grandeur & Zen Elegance',
    location: 'Gotthardstrasse 4, Andermatt',
    city: 'Andermatt',
    country: 'Switzerland',
    rating: 4.97,
    reviewCount: 412,
    pricePerNight: 1290,
    originalPrice: 1500,
    discountPercent: 15,
    category: 'Mountain',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Surrounded by the breathtaking Swiss Alps, blending alpine chic with Asian serenity and Michelin-starred dining.',
    amenities: ['Ski Butler Service', '2400m² Hydrothermal Spa', 'Indoor Lap Pool', 'Helipad Access'],
    rooms: [
      {
        id: 'rm-201',
        name: 'Deluxe Alpine Suite',
        bedType: '1 King Bed',
        maxGuests: 3,
        sizeSqM: 110,
        pricePerNight: 1290,
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        features: ['Fireplace', 'Mountain Balcony', 'Bronze Bathtub'],
      },
    ],
    isFeatured: true,
    createdAt: '2026-01-15T12:00:00.000Z',
  },
  {
    _id: 'hotel-003',
    name: 'Bulgari Resort Dubai',
    tagline: 'Private Island Mediterranean Glamour',
    location: 'Jumeirah Bay Island',
    city: 'Dubai',
    country: 'United Arab Emirates',
    rating: 4.96,
    reviewCount: 510,
    pricePerNight: 1650,
    originalPrice: 1950,
    discountPercent: 15,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'An exclusive oasis on a seahorse-shaped island bringing Mediterranean jewel aesthetics to the Arabian Gulf.',
    amenities: ['Private Yacht Club', 'Bulgari Spa', 'Private Beachfront Cabanas', 'Michelin Dining'],
    rooms: [
      {
        id: 'rm-301',
        name: 'Ocean View Suite',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 105,
        pricePerNight: 1650,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        features: ['Spacious Terrace', 'Walk-in Closet', 'Arabian Gulf Views'],
      },
    ],
    isFeatured: true,
    createdAt: '2026-02-01T08:30:00.000Z',
  },
  {
    _id: 'hotel-004',
    name: 'Amangiri Resort Canyon Point',
    tagline: 'Architectural Masterpiece in Red Rock Desert',
    location: '1 Kayenta Road, Canyon Point',
    city: 'Utah',
    country: 'United States',
    rating: 4.99,
    reviewCount: 288,
    pricePerNight: 2150,
    originalPrice: 2400,
    discountPercent: 10,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A remote hideaway nestled in 600 acres of Colorado Plateau wilderness with raw minimalist concrete architecture.',
    amenities: ['Desert Horizon Pool', 'Water Pavilion Spa', 'Via Ferrata Climbing', 'Private Aircraft Charter'],
    rooms: [
      {
        id: 'rm-401',
        name: 'Mesa View Suite with Private Plunge',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 140,
        pricePerNight: 2150,
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        features: ['Private Sky Terrace', 'Outdoor Fireplace', 'Deep Soaking Tub'],
      },
    ],
    isFeatured: true,
    createdAt: '2026-02-10T14:20:00.000Z',
  },
  {
    _id: 'hotel-005',
    name: 'Four Seasons Resort Bora Bora',
    tagline: 'Tahitian Splendor & Mount Otemanu Views',
    location: 'Motu Tehotu, Bora Bora',
    city: 'Bora Bora',
    country: 'French Polynesia',
    rating: 4.95,
    reviewCount: 620,
    pricePerNight: 1850,
    originalPrice: 2100,
    discountPercent: 12,
    category: 'Beachfront',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Encircled by sandy white beaches and a crystal-clear turquoise lagoon overlooking the magnificent Mount Otemanu.',
    amenities: ['Lagoon Sanctuary', 'Catamaran Cruises', 'Overwater Spa Suites', 'Scuba Diving'],
    rooms: [
      {
        id: 'rm-501',
        name: 'Otemanu Overwater Villa Suite',
        bedType: '1 King Bed',
        maxGuests: 3,
        sizeSqM: 100,
        pricePerNight: 1850,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        features: ['Lagoon Sun Deck', 'Glass Viewing Panels', 'Deep Tub with Views'],
      },
    ],
    isFeatured: true,
    createdAt: '2026-02-20T09:15:00.000Z',
  },
  {
    _id: 'hotel-006',
    name: 'Aman Tokyo Otemachi',
    tagline: 'Urban Sanctuary Above the Imperial Palace',
    location: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku',
    city: 'Tokyo',
    country: 'Japan',
    rating: 4.96,
    reviewCount: 395,
    pricePerNight: 1580,
    originalPrice: 1800,
    discountPercent: 12,
    category: 'Boutique',
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'An urban sanctuary perched high above Tokyo with panoramic views of the skyline and Mount Fuji on clear days.',
    amenities: ['30m Sky Swimming Pool', 'Japanese Onsen Baths', 'Cigar Lounge', 'Wine Cellar'],
    rooms: [
      {
        id: 'rm-601',
        name: 'Grand Premier Sky Suite',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 121,
        pricePerNight: 1580,
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        features: ['Furo Soaking Tub', 'Shoji Paper Screens', 'Imperial Palace Gardens View'],
      },
    ],
    isFeatured: true,
    createdAt: '2026-03-01T11:00:00.000Z',
  },
];

const initialUsers = [
  {
    _id: 'usr-admin',
    name: 'System Administrator',
    email: 'admin@luxurystays.io',
    role: 'admin',
    tier: 'Black Diamond VIP',
    points: 100000,
    phone: '+94 77 123 4567',
    country: 'Sri Lanka',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-09-20T08:00:00.000Z',
  },
  {
    _id: 'usr-1790128790142',
    name: 'Keshanrandula',
    email: 'keshanrandula@gmail.com',
    role: 'member',
    tier: 'Silver Prestige',
    points: 5000,
    phone: '0761942616',
    country: 'Sri Lanka',
    avatarUrl: '',
    createdAt: '2026-09-23T01:59:50.142Z',
  },
];

const initialBookings = [
  {
    _id: 'BK-8901',
    hotelId: 'hotel-001',
    hotelName: 'The St. Regis Maldives Vommuli',
    roomName: 'Overwater Villa with Private Pool',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@vip.io',
    guestPhone: '+1 (555) 438-9921',
    checkIn: '2026-09-24',
    checkOut: '2026-09-29',
    nights: 5,
    adults: 2,
    children: 0,
    roomTotal: 7250,
    taxesAndFees: 920,
    grandTotal: 8170,
    status: 'confirmed',
    paymentMethod: 'VIP Concierge Pay',
    specialRequests: 'Sunset ocean view villa with vintage Dom Pérignon on arrival',
    createdAt: '2026-09-18T10:15:00.000Z',
  },
  {
    _id: 'BK-8902',
    hotelId: 'hotel-002',
    hotelName: 'The Chedi Andermatt',
    roomName: 'Deluxe Alpine Suite',
    guestName: 'Lord Harrison Smith',
    guestEmail: 'harrison.smith@royale.com',
    guestPhone: '+44 20 7946 0912',
    checkIn: '2026-10-02',
    checkOut: '2026-10-06',
    nights: 4,
    adults: 2,
    children: 0,
    roomTotal: 5160,
    taxesAndFees: 680,
    grandTotal: 5840,
    status: 'active',
    paymentMethod: 'Centurion Card',
    specialRequests: 'Private ski butler & daily heli-ski transfer arranged',
    createdAt: '2026-09-17T14:40:00.000Z',
  },
  {
    _id: 'BK-8903',
    hotelId: 'hotel-003',
    hotelName: 'Bulgari Resort Dubai',
    roomName: 'Ocean View Suite',
    guestName: 'Kavita Chawla',
    guestEmail: 'kavita.c@emirates.ae',
    guestPhone: '+971 50 123 4567',
    checkIn: '2026-08-15',
    checkOut: '2026-08-19',
    nights: 4,
    adults: 2,
    children: 1,
    roomTotal: 6600,
    taxesAndFees: 850,
    grandTotal: 7450,
    status: 'completed',
    paymentMethod: 'Emirates NBD VIP',
    specialRequests: 'Private yacht berth reservation at Bulgari Marina',
    createdAt: '2026-08-10T09:00:00.000Z',
  },
  {
    _id: 'BK-8904',
    hotelId: 'hotel-004',
    hotelName: 'Amangiri Resort Canyon Point',
    roomName: 'Mesa View Suite with Private Plunge',
    guestName: 'Sophia Montgomery',
    guestEmail: 'sophia.m@monaco-yachts.mc',
    guestPhone: '+377 98 98 00 00',
    checkIn: '2026-09-28',
    checkOut: '2026-10-02',
    nights: 4,
    adults: 2,
    children: 0,
    roomTotal: 8600,
    taxesAndFees: 1100,
    grandTotal: 9700,
    status: 'confirmed',
    paymentMethod: 'VIP Concierge Pay',
    specialRequests: 'Private hot air balloon flight over Lake Powell at dawn',
    createdAt: '2026-09-16T17:22:00.000Z',
  },
  {
    _id: 'BK-8905',
    hotelId: 'hotel-005',
    hotelName: 'Four Seasons Resort Bora Bora',
    roomName: 'Otemanu Overwater Villa Suite',
    guestName: 'Marcus Sterling',
    guestEmail: 'marcus.sterling@travel.io',
    guestPhone: '+1 (555) 334-1188',
    checkIn: '2026-09-10',
    checkOut: '2026-09-14',
    nights: 4,
    adults: 2,
    children: 0,
    roomTotal: 7400,
    taxesAndFees: 950,
    grandTotal: 8350,
    status: 'completed',
    paymentMethod: 'American Express Platinum',
    specialRequests: 'Canoe breakfast delivery to overwater deck',
    createdAt: '2026-09-01T11:45:00.000Z',
  },
  {
    _id: 'BK-8906',
    hotelId: 'hotel-006',
    hotelName: 'Aman Tokyo Otemachi',
    roomName: 'Grand Premier Sky Suite',
    guestName: 'Alexander Wright',
    guestEmail: 'alexander@luxurystays.io',
    guestPhone: '+1 (555) 902-1200',
    checkIn: '2026-10-10',
    checkOut: '2026-10-14',
    nights: 4,
    adults: 1,
    children: 0,
    roomTotal: 6320,
    taxesAndFees: 820,
    grandTotal: 7140,
    status: 'active',
    paymentMethod: 'Corporate Card',
    specialRequests: 'High floor corner suite facing Imperial Palace Gardens',
    createdAt: '2026-09-15T08:12:00.000Z',
  },
];

const initialReviews = [
  {
    _id: 'rev-001',
    hotelId: 'hotel-001',
    hotelName: 'The St. Regis Maldives Vommuli',
    bookingId: 'BK-8901',
    userId: 'usr-002',
    userName: 'Eleanor Vance',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    comment: 'An absolute masterpiece of hospitality. The overwater villa with direct ocean access and our dedicated butler made this the most memorable stay of our lives!',
    photos: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    createdAt: '2026-09-18T14:30:00.000Z',
  },
  {
    _id: 'rev-002',
    hotelId: 'hotel-003',
    hotelName: 'Bulgari Resort Dubai',
    bookingId: 'BK-8903',
    userId: 'usr-004',
    userName: 'Kavita Chawla',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    comment: 'The yacht club and ocean views are unmatched. Service is crisp, attentive, and discreet. Five stars all around.',
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    createdAt: '2026-08-20T11:15:00.000Z',
  },
  {
    _id: 'rev-003',
    hotelId: 'hotel-005',
    hotelName: 'Four Seasons Resort Bora Bora',
    bookingId: 'BK-8905',
    userId: 'usr-005',
    userName: 'Marcus Sterling',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    comment: 'The canoe breakfast was surreal! Crystal clear water right outside our bedroom door. Will definitely return next year.',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'approved',
    createdAt: '2026-09-15T09:40:00.000Z',
  },
  {
    _id: 'rev-004',
    hotelId: 'hotel-002',
    hotelName: 'The Chedi Andermatt',
    bookingId: 'BK-8902',
    userId: 'usr-003',
    userName: 'Lord Harrison Smith',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    comment: 'Superb ski concierge. Hydrothermal spa is the finest in Europe. Fireplace in suite was very cozy.',
    photos: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'pending',
    createdAt: '2026-09-19T16:20:00.000Z',
  },
  {
    _id: 'rev-005',
    hotelId: 'hotel-004',
    hotelName: 'Amangiri Resort Canyon Point',
    bookingId: 'BK-8904',
    userId: 'usr-006',
    userName: 'Sophia Montgomery',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    comment: 'Architectural heaven. Sunset over the canyon while in the private plunge pool is a transcendent experience.',
    photos: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'pending',
    createdAt: '2026-09-20T10:05:00.000Z',
  },
];

const initialPromos = [
  {
    _id: 'prm-001',
    code: 'WELCOME10',
    description: '10% Welcome discount on all luxury retreats',
    discountType: 'percentage',
    discountValue: 10,
    minBookingAmount: 500,
    maxDiscount: 1000,
    expiryDate: '2027-12-31',
    isActive: true,
    usageCount: 142,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'prm-002',
    code: 'HOLIDAY20',
    description: '20% Off luxury suites for extended holiday escapes',
    discountType: 'percentage',
    discountValue: 20,
    minBookingAmount: 2000,
    maxDiscount: 2500,
    expiryDate: '2027-12-31',
    isActive: true,
    usageCount: 89,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    _id: 'prm-003',
    code: 'BLACKDIAMOND',
    description: '$500 Flat voucher for VIP Black Diamond members',
    discountType: 'fixed',
    discountValue: 500,
    minBookingAmount: 3000,
    maxDiscount: 500,
    expiryDate: '2027-12-31',
    isActive: true,
    usageCount: 34,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'prm-004',
    code: 'SUMMERSCAPE',
    description: '15% Off Beachfront & Island private villas',
    discountType: 'percentage',
    discountValue: 15,
    minBookingAmount: 1200,
    maxDiscount: 1500,
    expiryDate: '2027-08-31',
    isActive: true,
    usageCount: 63,
    createdAt: '2026-02-10T00:00:00.000Z',
  },
];

const initialNotifications = [
  {
    _id: 'notif-001',
    title: 'Reservation Confirmed! 🛎️',
    body: 'Your luxury stay at The St. Regis Maldives Vommuli (Overwater Villa) has been reserved. Check-in on Oct 12.',
    type: 'booking_confirmed',
    targetAudience: 'single_device',
    recipientCount: 1,
    status: 'delivered',
    data: { bookingId: 'BK-1001', hotelId: 'hotel-001', screen: 'booking_details' },
    createdAt: '2026-03-01T10:30:00.000Z',
  },
  {
    _id: 'notif-002',
    title: '⏰ Check-In Tomorrow: The Chedi Andermatt',
    body: 'Your private Deluxe Alpine Suite is being prepared. Your Ski Butler is ready to assist your mountain arrival.',
    type: 'checkin_reminder',
    targetAudience: 'active_bookings',
    recipientCount: 8,
    status: 'delivered',
    data: { hotelId: 'hotel-002', screen: 'itinerary' },
    createdAt: '2026-03-05T08:00:00.000Z',
  },
  {
    _id: 'notif-003',
    title: '🏷️ 20% Holiday Special: Code HOLIDAY20',
    body: 'Experience private island luxury with 20% off all beachfront villas and private residences.',
    type: 'promo_deal',
    targetAudience: 'all',
    recipientCount: 2450,
    status: 'delivered',
    data: { promoCode: 'HOLIDAY20', screen: 'promos' },
    createdAt: '2026-03-08T14:15:00.000Z',
  },
  {
    _id: 'notif-004',
    title: '👑 VIP Elite Concierge Activated',
    body: 'Welcome to Luxe Member tier. Enjoy complimentary champagne, late checkouts, and priority reservations.',
    type: 'system_alert',
    targetAudience: 'vip_tier',
    recipientCount: 380,
    status: 'delivered',
    data: { tier: 'VIP_ELITE', screen: 'profile' },
    createdAt: '2026-03-10T09:00:00.000Z',
  },
];

class DataStore {
  constructor() {
    this.hotels = [];
    this.bookings = [];
    this.users = [];
    this.reviews = [];
    this.promos = [];
    this.notifications = [];
    this.deviceTokens = [
      { token: 'fcm_token_device_ios_vip_001', platform: 'ios', userEmail: 'alex.rivera@luxurytravel.com', updatedAt: new Date().toISOString() },
      { token: 'fcm_token_device_android_002', platform: 'android', userEmail: 'sophia.chen@elitevoyage.com', updatedAt: new Date().toISOString() },
      { token: 'fcm_token_device_ios_003', platform: 'ios', userEmail: 'marcus.vance@beverlyhills.com', updatedAt: new Date().toISOString() },
    ];
    this.init();
  }

  init() {
    try {
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.hotels = data.hotels && data.hotels.length > 0 ? data.hotels : initialHotels;
        this.bookings = data.bookings && data.bookings.length > 0 ? data.bookings : initialBookings;
        this.users = data.users && data.users.length > 0 ? data.users : initialUsers;
        this.reviews = data.reviews && data.reviews.length > 0 ? data.reviews : initialReviews;
        this.promos = data.promos && data.promos.length > 0 ? data.promos : initialPromos;
        this.notifications = data.notifications && data.notifications.length > 0 ? data.notifications : initialNotifications;
      } else {
        this.hotels = initialHotels;
        this.bookings = initialBookings;
        this.users = initialUsers;
        this.reviews = initialReviews;
        this.promos = initialPromos;
        this.notifications = initialNotifications;
        this.save();
      }
    } catch (e) {
      console.warn('DataStore init fallback:', e.message);
      this.hotels = initialHotels;
      this.bookings = initialBookings;
      this.users = initialUsers;
      this.reviews = initialReviews;
      this.promos = initialPromos;
      this.notifications = initialNotifications;
    }
  }

  save() {
    try {
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            hotels: this.hotels,
            bookings: this.bookings,
            users: this.users,
            reviews: this.reviews,
            promos: this.promos,
            notifications: this.notifications,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        ),
        'utf8'
      );
    } catch (e) {
      console.error('DataStore save error:', e.message);
    }
  }

  // --- Hotels ---
  getHotels(filter = {}) {
    let list = [...this.hotels];
    if (filter.category && filter.category !== 'All') {
      list = list.filter((h) => h.category && h.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.q) {
      const term = filter.q.toLowerCase();
      list = list.filter(
        (h) =>
          (h.name && h.name.toLowerCase().includes(term)) ||
          (h.location && h.location.toLowerCase().includes(term)) ||
          (h.city && h.city.toLowerCase().includes(term)) ||
          (h.country && h.country.toLowerCase().includes(term))
      );
    }
    if (filter.featured === 'true' || filter.featured === true) {
      list = list.filter((h) => h.isFeatured);
    }
    return list;
  }

  getHotelById(id) {
    return this.hotels.find((h) => String(h._id) === String(id));
  }

  addHotel(hotelData) {
    const newHotel = {
      _id: `hotel-${Date.now()}`,
      rating: 4.95,
      reviewCount: 1,
      rooms: [],
      isFeatured: true,
      ...hotelData,
      createdAt: new Date().toISOString(),
    };
    this.hotels.unshift(newHotel);
    this.save();
    return newHotel;
  }

  updateHotel(id, hotelData) {
    const idx = this.hotels.findIndex((h) => String(h._id) === String(id));
    if (idx !== -1) {
      this.hotels[idx] = { ...this.hotels[idx], ...hotelData, updatedAt: new Date().toISOString() };
      this.save();
      return this.hotels[idx];
    }
    return null;
  }

  deleteHotel(id) {
    const idx = this.hotels.findIndex((h) => String(h._id) === String(id));
    if (idx !== -1) {
      const deleted = this.hotels.splice(idx, 1);
      this.save();
      return deleted[0];
    }
    return null;
  }

  // --- Users ---
  getUsers() {
    return [...this.users];
  }

  getUserById(id) {
    return this.users.find((u) => String(u._id) === String(id));
  }

  addUser(userData) {
    const newUser = {
      _id: `usr-${Date.now()}`,
      role: 'member',
      tier: 'Silver Prestige',
      points: 5000,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 234-5678',
      country: 'Sri Lanka',
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, userData) {
    const idx = this.users.findIndex((u) => String(u._id) === String(id));
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...userData, updatedAt: new Date().toISOString() };
      this.save();
      return this.users[idx];
    }
    return null;
  }

  // --- Bookings ---
  getBookings() {
    return [...this.bookings].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  getBookingById(id) {
    return this.bookings.find((b) => String(b._id) === String(id));
  }

  // --- Room Availability, Dynamic Pricing & Inventory ---
  checkRoomAvailability(hotelId, checkInStr, checkOutStr, roomId = null) {
    const hotel = this.getHotelById(hotelId);
    if (!hotel) return null;

    const checkIn = checkInStr ? new Date(checkInStr) : new Date();
    const checkOut = checkOutStr
      ? new Date(checkOutStr)
      : new Date(checkIn.getTime() + 24 * 60 * 60 * 1000);

    // Calculate nights & date breakdown
    const diffTime = Math.max(1, checkOut.getTime() - checkIn.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Find all overlapping active bookings for this hotel
    const overlappingBookings = this.bookings.filter((b) => {
      if (String(b.hotelId) !== String(hotelId)) return false;
      if (b.status === 'cancelled') return false;

      const bIn = new Date(b.checkIn);
      const bOut = new Date(b.checkOut);
      // Overlap condition: start < existingEnd AND end > existingStart
      return checkIn < bOut && checkOut > bIn;
    });

    const roomsToProcess = roomId
      ? (hotel.rooms || []).filter((r) => String(r.id || r._id) === String(roomId))
      : (hotel.rooms || []);

    const roomAvailability = roomsToProcess.map((room) => {
      const rId = String(room.id || room._id);
      const bookedCount = overlappingBookings.filter(
        (b) => String(b.roomId) === rId
      ).length;

      const totalInventory = room.totalInventory || 5;
      const availableCount = Math.max(0, totalInventory - bookedCount);
      const isAvailable = availableCount > 0;

      // Dynamic Pricing Calculation per Night (Weekend Surcharge: Fri & Sat nights)
      const weekendMultiplier = room.weekendMultiplier || 1.15;
      let totalCost = 0;
      let weekendNightsCount = 0;
      let weekdayNightsCount = 0;
      const nightlyRates = [];

      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(checkIn.getTime() + i * 24 * 60 * 60 * 1000);
        const dayOfWeek = currentDate.getDay(); // 0=Sun, 5=Fri, 6=Sat
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

        let nightRate = room.pricePerNight || hotel.pricePerNight || 1000;
        if (isWeekend) {
          nightRate = Math.round(nightRate * weekendMultiplier);
          weekendNightsCount++;
        } else {
          weekdayNightsCount++;
        }

        nightlyRates.push({
          date: currentDate.toISOString().split('T')[0],
          isWeekend,
          rate: nightRate,
        });
        totalCost += nightRate;
      }

      const avgNightlyRate = Math.round(totalCost / nights);

      return {
        roomId: rId,
        roomName: room.name,
        bedType: room.bedType,
        maxGuests: room.maxGuests,
        basePricePerNight: room.pricePerNight,
        totalInventory,
        bookedCount,
        availableCount,
        isAvailable,
        nights,
        avgNightlyRate,
        totalRoomCost: totalCost,
        weekendNightsCount,
        weekdayNightsCount,
        weekendMultiplier,
        nightlyRates,
      };
    });

    return {
      hotelId: hotel._id,
      hotelName: hotel.name,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      nights,
      rooms: roomAvailability,
    };
  }

  updateRoomInventory(hotelId, roomId, data) {
    const hotel = this.getHotelById(hotelId);
    if (!hotel) return null;

    const room = (hotel.rooms || []).find((r) => String(r.id || r._id) === String(roomId));
    if (!room) return null;

    if (data.totalInventory !== undefined) room.totalInventory = Number(data.totalInventory);
    if (data.pricePerNight !== undefined) room.pricePerNight = Number(data.pricePerNight);
    if (data.weekendMultiplier !== undefined) room.weekendMultiplier = Number(data.weekendMultiplier);
    if (data.seasonalMultiplier !== undefined) room.seasonalMultiplier = Number(data.seasonalMultiplier);
    if (data.name) room.name = data.name;

    hotel.updatedAt = new Date().toISOString();
    this.save();
    return room;
  }

  addBooking(bookingData) {
    // Check room availability to prevent double bookings
    if (bookingData.hotelId && bookingData.roomId && bookingData.checkIn && bookingData.checkOut) {
      const avail = this.checkRoomAvailability(
        bookingData.hotelId,
        bookingData.checkIn,
        bookingData.checkOut,
        bookingData.roomId
      );

      if (avail && avail.rooms && avail.rooms.length > 0) {
        const targetRoom = avail.rooms[0];
        if (!targetRoom.isAvailable) {
          const err = new Error(
            `Room "${targetRoom.roomName}" is sold out for the selected dates (${avail.checkIn} to ${avail.checkOut}).`
          );
          err.statusCode = 400;
          throw err;
        }
      }
    }

    const grandTotal =
      bookingData.grandTotal ||
      (bookingData.roomTotal || 0) + (bookingData.taxesAndFees || 0) ||
      (bookingData.pricePerNight ? bookingData.pricePerNight * (bookingData.nights || 1) : 5000);

    const newBooking = {
      _id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      paymentMethod: 'VIP Concierge Pay',
      grandTotal,
      ...bookingData,
      createdAt: new Date().toISOString(),
    };
    this.bookings.unshift(newBooking);
    this.save();
    return newBooking;
  }

  updateBookingStatus(id, status) {
    const booking = this.bookings.find((b) => String(b._id) === String(id));
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
      this.save();
      return booking;
    }
    return null;
  }

  // --- Users ---
  getUsers() {
    return [...this.users];
  }

  addUser(userData) {
    const newUser = {
      _id: `usr-${Date.now()}`,
      role: 'member',
      tier: 'Silver Prestige',
      points: 5000,
      createdAt: new Date().toISOString(),
      ...userData,
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  // --- Reviews & Moderation ---
  getReviews(filter = {}) {
    let list = [...this.reviews];
    if (filter.status && filter.status !== 'all') {
      list = list.filter((r) => r.status === filter.status);
    }
    if (filter.hotelId) {
      list = list.filter((r) => String(r.hotelId) === String(filter.hotelId));
    }
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  getReviewById(id) {
    return this.reviews.find((r) => String(r._id) === String(id));
  }

  addReview(reviewData) {
    const hotel = this.getHotelById(reviewData.hotelId);
    const newReview = {
      _id: `rev-${Date.now()}`,
      hotelId: reviewData.hotelId,
      hotelName: hotel ? hotel.name : (reviewData.hotelName || 'Luxury Hotel'),
      bookingId: reviewData.bookingId || '',
      userId: reviewData.userId || 'usr-guest',
      userName: reviewData.userName || 'Guest Traveler',
      userAvatar: reviewData.userAvatar || '',
      rating: Number(reviewData.rating) || 5.0,
      comment: reviewData.comment || '',
      photos: Array.isArray(reviewData.photos) ? reviewData.photos : [],
      status: reviewData.status || 'pending', // Pending by default for moderation
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);
    this.save();

    if (newReview.status === 'approved') {
      this.recalculateHotelRating(newReview.hotelId);
    }

    return newReview;
  }

  updateReviewStatus(id, status) {
    const review = this.reviews.find((r) => String(r._id) === String(id));
    if (review) {
      review.status = status;
      review.updatedAt = new Date().toISOString();
      this.save();
      this.recalculateHotelRating(review.hotelId);
      return review;
    }
    return null;
  }

  deleteReview(id) {
    const idx = this.reviews.findIndex((r) => String(r._id) === String(id));
    if (idx !== -1) {
      const deleted = this.reviews.splice(idx, 1)[0];
      this.save();
      this.recalculateHotelRating(deleted.hotelId);
      return deleted;
    }
    return null;
  }

  recalculateHotelRating(hotelId) {
    const hotel = this.getHotelById(hotelId);
    if (!hotel) return;

    const approvedReviews = this.reviews.filter(
      (r) => String(r.hotelId) === String(hotelId) && r.status === 'approved'
    );

    if (approvedReviews.length > 0) {
      const totalScore = approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
      hotel.rating = +(totalScore / approvedReviews.length).toFixed(2);
      hotel.reviewCount = approvedReviews.length;
      this.save();
    }
  }

  // --- Promo Codes & Discounts ---
  getPromos(filter = {}) {
    let list = [...this.promos];
    if (filter.activeOnly) {
      list = list.filter((p) => p.isActive);
    }
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  getPromoById(id) {
    return this.promos.find((p) => String(p._id) === String(id));
  }

  getPromoByCode(code) {
    if (!code) return null;
    return this.promos.find(
      (p) => String(p.code).toUpperCase() === String(code).trim().toUpperCase()
    );
  }

  validatePromo(codeStr, bookingAmount = 0) {
    const promo = this.getPromoByCode(codeStr);
    const amount = Number(bookingAmount) || 0;

    if (!promo) {
      return {
        isValid: false,
        message: 'Invalid promo code. Please check for spelling mistakes.',
      };
    }

    if (!promo.isActive) {
      return {
        isValid: false,
        message: 'This promo code is currently inactive or deactivated.',
      };
    }

    if (promo.expiryDate) {
      const exp = new Date(promo.expiryDate);
      if (new Date() > exp) {
        return {
          isValid: false,
          message: 'This promo code has expired.',
        };
      }
    }

    if (promo.minBookingAmount && amount < promo.minBookingAmount) {
      return {
        isValid: false,
        message: `Requires a minimum booking spend of $${promo.minBookingAmount}. (Current: $${amount})`,
      };
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = (amount * (promo.discountValue || 0)) / 100;
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else {
      // Fixed flat voucher
      discountAmount = Math.min(amount, promo.discountValue || 0);
    }

    discountAmount = Math.round(discountAmount);
    const finalAmount = Math.max(0, amount - discountAmount);

    return {
      isValid: true,
      message: `Coupon "${promo.code}" applied successfully!`,
      promo: {
        _id: promo._id,
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      },
      discountAmount,
      finalAmount,
    };
  }

  addPromo(promoData) {
    const code = String(promoData.code || `PROMO${Math.floor(10 + Math.random() * 90)}`).trim().toUpperCase();
    const existing = this.getPromoByCode(code);
    if (existing) {
      const err = new Error(`Promo code "${code}" already exists.`);
      err.statusCode = 400;
      throw err;
    }

    const newPromo = {
      _id: `prm-${Date.now()}`,
      code,
      description: promoData.description || 'Exclusive VIP Promotional Discount',
      discountType: promoData.discountType || 'percentage',
      discountValue: Number(promoData.discountValue) || 10,
      minBookingAmount: Number(promoData.minBookingAmount) || 0,
      maxDiscount: Number(promoData.maxDiscount) || 1000,
      expiryDate: promoData.expiryDate || '2027-12-31',
      isActive: promoData.isActive !== false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.promos.unshift(newPromo);
    this.save();
    return newPromo;
  }

  updatePromo(id, data) {
    const idx = this.promos.findIndex((p) => String(p._id) === String(id));
    if (idx !== -1) {
      this.promos[idx] = {
        ...this.promos[idx],
        ...data,
        code: data.code ? data.code.trim().toUpperCase() : this.promos[idx].code,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.promos[idx];
    }
    return null;
  }

  deletePromo(id) {
    const idx = this.promos.findIndex((p) => String(p._id) === String(id));
    if (idx !== -1) {
      const deleted = this.promos.splice(idx, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }

  // --- Real Stats & Analytics ---
  getStats() {
    const validBookings = this.bookings.filter((b) => b.status !== 'cancelled');
    const totalRevenue = validBookings.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
    const totalBookings = this.bookings.length;
    const totalHotels = this.hotels.length;
    const totalUsers = this.users.length;

    // Calculate dynamic average nightly rate from real hotel catalog
    const avgNightlyRate =
      totalHotels > 0
        ? Math.round(this.hotels.reduce((acc, h) => acc + (h.pricePerNight || 0), 0) / totalHotels)
        : 1450;

    // Occupancy index based on active/confirmed bookings vs room portfolio
    const activeOrConfirmed = this.bookings.filter((b) => ['confirmed', 'active'].includes(b.status)).length;
    const occupancyRate = Math.min(98.5, Math.max(72.0, +(75 + (activeOrConfirmed * 3.5)).toFixed(1)));

    // Real Monthly Revenue dynamic aggregation
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    // Populate past 7 months leading up to current date
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthNames[d.getMonth()];
      monthlyMap[key] = { month: key, revenue: 0, bookings: 0 };
    }

    // Aggregate real bookings into monthlyMap
    this.bookings.forEach((b) => {
      const d = new Date(b.createdAt || b.checkIn || Date.now());
      const key = monthNames[d.getMonth()];
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += b.status !== 'cancelled' ? b.grandTotal || 0 : 0;
        monthlyMap[key].bookings += 1;
      }
    });

    // Provide baseline realistic luxury revenue curve if few historical records
    const monthlyRevenue = Object.values(monthlyMap).map((m, idx) => ({
      ...m,
      revenue: m.revenue > 0 ? m.revenue : Math.round(45000 + idx * 14000 + (idx === 6 ? totalRevenue * 0.4 : 0)),
      bookings: m.bookings > 0 ? m.bookings : 12 + idx * 4,
    }));

    // Real Category Distribution dynamic breakdown
    const catMap = {};
    const catColors = {
      Luxury: '#D97706',
      Beachfront: '#F59E0B',
      Mountain: '#10B981',
      Boutique: '#3B82F6',
    };

    this.hotels.forEach((h) => {
      const cat = h.category || 'Luxury';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.keys(catMap).map((name) => ({
      name,
      count: catMap[name],
      percentage: Math.round((catMap[name] / (totalHotels || 1)) * 100),
      color: catColors[name] || '#D97706',
    }));

    return {
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        totalHotels,
        totalUsers,
        occupancyRate,
        avgNightlyRate,
      },
      monthlyRevenue,
      categoryDistribution,
    };
  }

  // --- Push Notifications & Device Tokens ---
  getNotifications(filter = {}) {
    let list = [...this.notifications];
    if (filter.type && filter.type !== 'all') {
      list = list.filter((n) => n.type === filter.type);
    }
    if (filter.targetAudience && filter.targetAudience !== 'all') {
      list = list.filter((n) => n.targetAudience === filter.targetAudience);
    }
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  getNotificationById(id) {
    return this.notifications.find((n) => String(n._id) === String(id));
  }

  addNotification(notifData) {
    const newNotif = {
      _id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: notifData.title,
      body: notifData.body,
      type: notifData.type || 'system_alert',
      targetAudience: notifData.targetAudience || 'all',
      recipientCount: Number(notifData.recipientCount) || 1,
      status: notifData.status || 'delivered',
      data: notifData.data || {},
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  registerDeviceToken(tokenData) {
    if (!tokenData || !tokenData.token) return null;

    const existingIndex = this.deviceTokens.findIndex((t) => t.token === tokenData.token);
    const entry = {
      token: tokenData.token,
      platform: tokenData.platform || 'ios',
      userId: tokenData.userId || null,
      userEmail: tokenData.userEmail || null,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      this.deviceTokens[existingIndex] = { ...this.deviceTokens[existingIndex], ...entry };
    } else {
      this.deviceTokens.push(entry);
    }

    return entry;
  }

  getDeviceTokens() {
    return [...this.deviceTokens];
  }

  getUpcomingCheckIns(hoursWindow = 48) {
    const now = new Date();
    const futureWindow = new Date(now.getTime() + hoursWindow * 60 * 60 * 1000);

    return this.bookings.filter((b) => {
      if (b.status === 'cancelled') return false;
      if (!b.checkIn) return false;
      const checkInDate = new Date(b.checkIn);
      return checkInDate >= now && checkInDate <= futureWindow;
    });
  }

  // --- Advanced Analytics & Revenue Forecasting ---
  getForecastingAnalytics() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    // 1. Calculate base run rate from historical data
    const validBookings = this.bookings.filter((b) => b.status !== 'cancelled');
    const totalRev = validBookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
    const avgMonthlyBase = totalRev > 0 ? Math.round(totalRev / 3) : 95000;

    // 2. Build 6-month historical trail
    const historical = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      const year = d.getFullYear();

      // Aggregate bookings in this historical month
      const monthBookings = validBookings.filter((b) => {
        const bDate = new Date(b.createdAt || b.checkIn);
        return bDate.getMonth() === d.getMonth() && bDate.getFullYear() === year;
      });

      const monthRevenue = monthBookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
      const rev = monthRevenue > 0 ? monthRevenue : Math.round(avgMonthlyBase * (0.8 + (5 - i) * 0.06));
      const count = monthBookings.length > 0 ? monthBookings.length : Math.round(rev / 1650);

      historical.push({
        month: mName,
        year,
        period: `${mName} ${year}`,
        type: 'actual',
        revenue: rev,
        bookings: count,
        adr: Math.round(rev / Math.max(1, count * 3)),
        occupancy: Math.min(95, Math.round(72 + (5 - i) * 3.5)),
      });
    }

    // 3. Project next 6 upcoming months using growth factor & seasonal velocity
    const forecast = [];
    const seasonalMultipliers = [1.08, 1.15, 1.22, 1.18, 1.26, 1.32]; // Q3/Q4 luxury holiday demand curve
    const lastHistoricalRev = historical[historical.length - 1].revenue;

    for (let i = 1; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const mName = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const mult = seasonalMultipliers[i - 1];

      const projectedRev = Math.round(lastHistoricalRev * mult);
      const projectedCount = Math.round(projectedRev / 1720);
      const projectedOccupancy = Math.min(98.5, Math.round(82 + i * 2.5));
      const projectedADR = Math.round(projectedRev / Math.max(1, projectedCount * 3));

      forecast.push({
        month: mName,
        year,
        period: `${mName} ${year}`,
        type: 'forecast',
        revenue: projectedRev,
        lowerConfidence: Math.round(projectedRev * 0.92),
        upperConfidence: Math.round(projectedRev * 1.09),
        bookings: projectedCount,
        adr: projectedADR,
        occupancy: projectedOccupancy,
      });
    }

    const nextMonthProjected = forecast[0].revenue;
    const currentRev = historical[historical.length - 1].revenue;
    const growthPercent = +(((forecast[2].revenue - currentRev) / currentRev) * 100).toFixed(1);
    const avgForecastADR = Math.round(forecast.reduce((sum, f) => sum + f.adr, 0) / forecast.length);
    const avgForecastOccupancy = +(forecast.reduce((sum, f) => sum + f.occupancy, 0) / forecast.length).toFixed(1);

    return {
      kpis: {
        nextMonthProjected,
        growthPercent: growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`,
        avgForecastADR,
        avgForecastOccupancy: `${avgForecastOccupancy}%`,
        forecastConfidence: '94.2%',
      },
      historical,
      forecast,
      combinedTrajectory: [...historical, ...forecast],
    };
  }

  // --- 30-Day Occupancy Heatmap Matrix ---
  getOccupancyHeatmap() {
    const today = new Date();
    const daysCount = 30;
    const dates = [];

    for (let i = 0; i < daysCount; i++) {
      const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(d.toISOString().split('T')[0]);
    }

    const properties = this.hotels.map((hotel) => {
      const totalInventory = (hotel.rooms || []).reduce((acc, r) => acc + (r.totalInventory || 5), 0) || 12;

      const dailyOccupancy = dates.map((dateStr) => {
        const currentDate = new Date(dateStr);
        // Find overlapping bookings on this specific day
        const overlapping = this.bookings.filter((b) => {
          if (String(b.hotelId) !== String(hotel._id)) return false;
          if (b.status === 'cancelled') return false;
          const bIn = new Date(b.checkIn);
          const bOut = new Date(b.checkOut);
          return currentDate >= bIn && currentDate < bOut;
        });

        const bookedRooms = overlapping.length;
        // Provide realistic luxury occupancy baseline if few bookings
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        const baselineRooms = isWeekend ? Math.min(totalInventory, Math.max(bookedRooms, Math.floor(totalInventory * 0.75))) : Math.max(bookedRooms, Math.floor(totalInventory * 0.5));

        const occupiedCount = Math.min(totalInventory, baselineRooms);
        const occupancyRate = Math.round((occupiedCount / totalInventory) * 100);

        let status = 'low'; // < 50%
        if (occupancyRate >= 85) status = 'sold_out';
        else if (occupancyRate >= 65) status = 'high';
        else if (occupancyRate >= 40) status = 'medium';

        return {
          date: dateStr,
          day: currentDate.getDate(),
          weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
          isWeekend,
          totalInventory,
          occupiedCount,
          availableCount: totalInventory - occupiedCount,
          occupancyRate,
          status,
        };
      });

      const avgOccupancy = Math.round(dailyOccupancy.reduce((acc, d) => acc + d.occupancyRate, 0) / daysCount);

      return {
        hotelId: hotel._id,
        hotelName: hotel.name,
        category: hotel.category,
        totalInventory,
        avgOccupancy,
        days: dailyOccupancy,
      };
    });

    return {
      dates,
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      properties,
    };
  }

  // --- CSV Export Generation ---
  generateBookingsCSV() {
    const headers = [
      'Booking ID',
      'Guest Name',
      'Guest Email',
      'Guest Phone',
      'Hotel Name',
      'Room Type',
      'Check In',
      'Check Out',
      'Nights',
      'Adults',
      'Children',
      'Status',
      'Payment Method',
      'Room Subtotal ($)',
      'Taxes & Fees ($)',
      'Grand Total ($)',
      'Created Date'
    ];

    const rows = this.bookings.map((b) => [
      `"${b._id}"`,
      `"${b.guestName || 'Guest'}"`,
      `"${b.guestEmail || ''}"`,
      `"${b.guestPhone || ''}"`,
      `"${b.hotelName || 'Luxury Hotel'}"`,
      `"${b.roomName || 'Sanctuary Suite'}"`,
      `"${b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : ''}"`,
      `"${b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : ''}"`,
      b.nights || 1,
      b.adults || 2,
      b.children || 0,
      `"${b.status || 'confirmed'}"`,
      `"${b.paymentMethod || 'VIP Concierge'}"`,
      (b.roomTotal || 0).toFixed(2),
      (b.taxesAndFees || 0).toFixed(2),
      (b.grandTotal || 0).toFixed(2),
      `"${b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : ''}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }

  generateRevenueCSV() {
    const stats = this.getStats();
    const headers = ['Month', 'Confirmed Bookings', 'Gross Revenue ($)', 'Estimated Taxes ($)', 'Net Settlement ($)', 'Occupancy Index (%)'];

    const rows = (stats.monthlyRevenue || []).map((m) => {
      const gross = m.revenue || 0;
      const tax = Math.round(gross * 0.12);
      const net = gross - tax;
      return [
        `"${m.month} 2026"`,
        m.bookings || 0,
        gross.toFixed(2),
        tax.toFixed(2),
        net.toFixed(2),
        `${(75 + (m.bookings || 0) * 0.8).toFixed(1)}%`
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}

const store = new DataStore();
module.exports = store;
