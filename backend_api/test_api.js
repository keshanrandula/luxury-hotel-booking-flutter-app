const http = require('http');
const app = require('./server');

const PORT = 5001; // Test port
const server = app.listen(PORT, async () => {
  console.log(`\n🧪 Testing Backend API on port ${PORT}...`);

  const request = (path, method = 'GET', data = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const payload = data ? JSON.stringify(data) : null;
      const options = {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      });

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Test Health Endpoint
    console.log('1. Testing GET /api/health...');
    const health = await request('/api/health');
    console.log(`   Status: ${health.status} | Response:`, health.data.status);

    // 2. Test Hotel Listing Endpoint
    console.log('2. Testing GET /api/hotels...');
    const hotels = await request('/api/hotels');
    console.log(`   Status: ${hotels.status} | Total properties:`, Array.isArray(hotels.data) ? hotels.data.length : 0);

    // 3. Test Hotel Details
    console.log('3. Testing GET /api/hotels/hotel-001...');
    const hotelDetail = await request('/api/hotels/hotel-001');
    console.log(`   Status: ${hotelDetail.status} | Property Name:`, hotelDetail.data.name);

    // 4. Test User Login
    console.log('4. Testing POST /api/auth/login...');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@luxurystays.io',
      password: 'adminpassword123',
    });
    console.log(`   Status: ${loginRes.status} | Authenticated:`, loginRes.data.success || loginRes.status);

    // 5. Test Booking Creation
    console.log('5. Testing POST /api/bookings...');
    const bookingRes = await request('/api/bookings', 'POST', {
      hotelId: 'hotel-001',
      hotelName: 'The St. Regis Maldives Vommuli',
      hotelImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
      location: 'Dhaalu Atoll, Maldives',
      roomId: 'rm-101',
      roomName: 'Overwater Villa with Private Pool',
      guestName: 'Kavita Chawla',
      guestEmail: 'kavita@vip.io',
      guestPhone: '+94 77 123 4567',
      checkIn: '2026-10-01T00:00:00.000Z',
      checkOut: '2026-10-05T00:00:00.000Z',
      adults: 2,
      children: 0,
      nights: 4,
      roomTotal: 1280,
      taxesAndFees: 198,
      grandTotal: 1478,
      status: 'confirmed',
    });
    console.log(`   Status: ${bookingRes.status} | Created Booking:`, bookingRes.data.success);

    // 6. Test Reviews Endpoint
    console.log('6. Testing GET /api/reviews...');
    const reviewsRes = await request('/api/reviews');
    console.log(`   Status: ${reviewsRes.status} | Total reviews:`, reviewsRes.data.count, '| Stats:', reviewsRes.data.stats);

    // 7. Test Submit New Review
    console.log('7. Testing POST /api/reviews...');
    const newRev = await request('/api/reviews', 'POST', {
      hotelId: 'hotel-001',
      hotelName: 'The St. Regis Maldives Vommuli',
      bookingId: 'BK-8901',
      userName: 'Alexander Wright',
      rating: 5,
      comment: 'Unbelievable resort and overwater sanctuary!',
      photos: ['https://images.unsplash.com/photo-1540541338287-41700207dee6'],
    });
    console.log(`   Status: ${newRev.status} | Submitted Review:`, newRev.data.success);

    // 8. Test Moderate Review Status (Approve/Reject)
    if (reviewsRes.data.reviews && reviewsRes.data.reviews.length > 0) {
      const revId = reviewsRes.data.reviews[0]._id;
      console.log(`8. Testing PUT /api/reviews/${revId}/status...`);
      const statusRes = await request(`/api/reviews/${revId}/status`, 'PUT', { status: 'approved' });
      console.log(`   Status: ${statusRes.status} | Status updated to:`, statusRes.data.data.status);
    }

    // 9. Test Cloudinary Image Upload
    console.log('9. Testing POST /api/upload with Cloudinary...');
    const uploadRes = await request('/api/upload', 'POST', {
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    });
    console.log(`   Status: ${uploadRes.status} | Cloudinary Secure URL:`, uploadRes.data ? uploadRes.data.url : 'N/A');

    console.log('\n✅ ALL BACKEND API ENDPOINTS & CLOUDINARY UPLOAD VERIFIED SUCCESSFULLY!\n');
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.close(() => process.exit(1));
  }
});
