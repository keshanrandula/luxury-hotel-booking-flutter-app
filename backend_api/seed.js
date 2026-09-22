const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Booking = require('./models/Booking');

dotenv.config();

const users = [
  {
    name: 'Alexander Wright',
    email: 'admin@luxurystays.io',
    password: 'adminpassword123',
    role: 'admin',
    tier: 'Black Diamond VIP',
    points: 92500,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 902-1200',
  },
  {
    name: 'Eleanor Vance',
    email: 'eleanor.vance@vip.io',
    password: 'password123',
    role: 'vip',
    tier: 'Platinum Elite',
    points: 48200,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 438-9921',
  },
  {
    name: 'Lord Harrison Smith',
    email: 'harrison.smith@royale.com',
    password: 'password123',
    role: 'vip',
    tier: 'Black Diamond VIP',
    points: 114000,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+44 20 7946 0912',
  },
  {
    name: 'Kavita Chawla',
    email: 'kavita.c@emirates.ae',
    password: 'password123',
    role: 'vip',
    tier: 'Gold Member',
    points: 29500,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phone: '+971 50 123 4567',
  },
  {
    name: 'Marcus Sterling',
    email: 'marcus.sterling@travel.io',
    password: 'password123',
    role: 'member',
    tier: 'Gold Member',
    points: 18400,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 334-1188',
  },
];

const hotels = [
  {
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
        name: 'Overwater Villa with Private Pool',
        bedType: '1 King Bed',
        maxGuests: 3,
        sizeSqM: 182,
        pricePerNight: 1450,
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        features: ['Direct Lagoon Access', 'Marble Bathroom', 'Sunset View'],
      },
      {
        name: 'Sunset Ocean Suite',
        bedType: '2 King Beds',
        maxGuests: 4,
        sizeSqM: 285,
        pricePerNight: 2250,
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        features: ['Panoramic Glass Floor', 'Private Infinity Pool', 'Dedicated Chef'],
      },
    ],
    reviews: [
      {
        userName: 'Eleanor Vance',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        date: 'Sep 2026',
        comment: 'An absolute masterpiece of hospitality. The overwater villa with direct ocean access and our dedicated butler made this memorable!',
      },
    ],
    isFeatured: true,
  },
  {
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
        name: 'Deluxe Alpine Suite',
        bedType: '1 King Bed',
        maxGuests: 3,
        sizeSqM: 110,
        pricePerNight: 1290,
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        features: ['Fireplace', 'Mountain Balcony', 'Bronze Bathtub'],
      },
    ],
    reviews: [],
    isFeatured: true,
  },
  {
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
        name: 'Ocean View Suite',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 105,
        pricePerNight: 1650,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        features: ['Spacious Terrace', 'Walk-in Closet', 'Arabian Gulf Views'],
      },
    ],
    reviews: [],
    isFeatured: true,
  },
  {
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
        name: 'Mesa View Suite with Private Plunge',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 140,
        pricePerNight: 2150,
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        features: ['Private Sky Terrace', 'Outdoor Fireplace', 'Deep Soaking Tub'],
      },
    ],
    reviews: [],
    isFeatured: true,
  },
  {
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
        name: 'Otemanu Overwater Villa Suite',
        bedType: '1 King Bed',
        maxGuests: 3,
        sizeSqM: 100,
        pricePerNight: 1850,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        features: ['Lagoon Sun Deck', 'Glass Viewing Panels', 'Deep Tub with Views'],
      },
    ],
    reviews: [],
    isFeatured: true,
  },
  {
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
        name: 'Grand Premier Sky Suite',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 121,
        pricePerNight: 1580,
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        features: ['Furo Soaking Tub', 'Shoji Paper Screens', 'Imperial Palace Gardens View'],
      },
    ],
    reviews: [],
    isFeatured: true,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    await User.deleteMany();
    await Hotel.deleteMany();
    await Booking.deleteMany();

    const createdUsers = await User.create(users);
    console.log(`✨ Created ${createdUsers.length} users with hashed credentials.`);

    const createdHotels = await Hotel.create(hotels);
    console.log(`✨ Created ${createdHotels.length} luxury hotels in MongoDB Atlas.`);

    const mockBooking = {
      hotelId: createdHotels[0]._id.toString(),
      hotelName: createdHotels[0].name,
      hotelImage: createdHotels[0].images[0],
      location: createdHotels[0].location,
      roomId: createdHotels[0].rooms[0]._id ? createdHotels[0].rooms[0]._id.toString() : 'rm-101',
      roomName: createdHotels[0].rooms[0].name,
      user: createdUsers[1]._id,
      guestName: createdUsers[1].name,
      guestEmail: createdUsers[1].email,
      guestPhone: createdUsers[1].phone,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      adults: 2,
      children: 0,
      nights: 4,
      roomTotal: 5800,
      taxesAndFees: 741,
      grandTotal: 6541,
      status: 'confirmed',
      paymentMethod: 'VIP Concierge Pay',
      specialRequests: 'Sunset view villa with vintage Dom Pérignon on arrival',
    };

    await Booking.create(mockBooking);
    console.log('✨ Created initial active VIP booking.');

    console.log('\n🎉 ALL INITIAL DATA SEEDED TO MONGODB ATLAS SUCCESSFULLY!\n');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeding error: ${err.message}`);
    process.exit(1);
  }
};

seedData();
