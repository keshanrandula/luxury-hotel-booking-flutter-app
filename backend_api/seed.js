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
    points: 85000,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 902-1200',
  },
  {
    name: 'Eleanor Vance',
    email: 'eleanor.vance@vip.io',
    password: 'password123',
    role: 'vip',
    tier: 'Platinum Elite',
    points: 32000,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 438-9921',
  },
  {
    name: 'Marcus Sterling',
    email: 'marcus.sterling@travel.io',
    password: 'password123',
    role: 'member',
    tier: 'Gold Member',
    points: 15400,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 334-1188',
  },
];

const hotels = [
  {
    name: 'The St. Regis Maldives Vommuli',
    tagline: 'Overwater Ultra-Luxury Sanctuary',
    location: 'Dhaalu Atoll, Maldives',
    city: 'Maldives',
    country: 'Maldives',
    rating: 4.95,
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
        userName: 'Sophia Lauren',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        date: 'Sep 2025',
        comment: 'An absolute paradise. The butler service was flawless.',
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
    ],
    description: 'Surrounded by the breathtaking Swiss Alps, blending alpine chic with Asian serenity and Michelin-starred dining.',
    amenities: ['Ski Butler Service', '2400m² Hydrothermal Spa', 'Indoor Lap Pool'],
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
    rating: 4.94,
    reviewCount: 510,
    pricePerNight: 1650,
    originalPrice: 1950,
    discountPercent: 15,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'An exclusive oasis on a seahorse-shaped island bringing Mediterranean jewel aesthetics to the Arabian Gulf.',
    amenities: ['Private Yacht Club', 'Bulgari Spa', 'Private Beachfront Cabanas'],
    rooms: [
      {
        name: 'Ocean View Suite',
        bedType: '1 King Bed',
        maxGuests: 2,
        sizeSqM: 105,
        pricePerNight: 1650,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        features: ['Spacious Terrace', 'Walk-in Closet'],
      },
    ],
    reviews: [],
    isFeatured: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking_db');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Hotel.deleteMany();
    await Booking.deleteMany();

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users.`);

    const createdHotels = await Hotel.create(hotels);
    console.log(`Created ${createdHotels.length} luxury hotels.`);

    const mockBooking = {
      hotelId: createdHotels[0]._id.toString(),
      hotelName: createdHotels[0].name,
      hotelImage: createdHotels[0].images[0],
      location: createdHotels[0].location,
      roomId: 'rm-001',
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
      paymentMethod: 'concierge',
      specialRequests: 'Sunset view villa with vintage champagne upon arrival',
    };

    await Booking.create(mockBooking);
    console.log('Created initial mock booking.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`Seeding notice/error: ${err.message}`);
    process.exit(0);
  }
};

seedData();
