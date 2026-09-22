# 🌟 Luxury Stays — Hotel Booking & VIP Concierge Mobile App

<div align="center">

[![Flutter](https://img.shields.io/badge/Flutter-3.24+-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.5+-0175C2?style=for-the-badge&logo=dart&logoColor=white)](https://dart.dev)
[![State Management](https://img.shields.io/badge/State_Management-BLoC_v8-blueviolet?style=for-the-badge)](https://bloclibrary.dev)
[![Architecture](https://img.shields.io/badge/Architecture-Clean_Architecture-green?style=for-the-badge)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Admin](https://img.shields.io/badge/Admin-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)]()

**A state-of-the-art Luxury Hotel Booking & VIP Concierge mobile application built with Flutter, featuring BLoC pattern, Clean Architecture, offline-first storage, dynamic pricing, real-time reviews, and AI Concierge assistance.**

</div>

---

## 📱 Mobile App Key Features (Flutter)

- 🏨 **Curated Luxury Properties**: Interactive hotel directory with category filters (Beachfront, Mountain, City, Boutique, Overwater Sanctuary).
- 📅 **Dynamic Pricing & Room Availability Engine**: Real-time weekend surcharge calculation, night breakdowns, and inventory tracking.
- 💬 **AI Luxury Concierge**: In-app AI travel assistant offering personalized dining, yacht charter, and itinerary recommendations.
- 🎟️ **Instant QR Voucher & PDF Invoicing**: Generates scan-ready booking QR vouchers and downloadable VIP PDF travel invoices.
- 🔔 **Push Notification & Trip Reminders**: Integrated notification feed for check-in alerts, booking confirmations, and promo drops.
- 🏷️ **Promo Code & VIP Tier Engine**: Percentage and fixed discount voucher validation with tier loyalty points.
- 📴 **Offline-First Storage (Hive)**: Seamless offline caching for favorites, booking history, and cached hotel data.
- 🎨 **Sleek Glassmorphic Luxury UI**: Tailored typography, dark theme support, shimmer loading states, and smooth micro-animations.

---

## 🏛️ Project Architecture

The Flutter mobile application is structured using **Clean Architecture** with feature-first modularity:

```
mobile_app/
└── lib/
    ├── config/             # Theme tokens, route definitions, API constants
    ├── core/               # Network client (Dio), error handlers, utils & formatters
    ├── features/
    │   ├── ai_concierge/   # AI Concierge chat, message models & BLoC
    │   ├── auth/           # Login, registration, token persistence & BLoC
    │   ├── booking/        # Hotels, room selection, checkout, invoice PDF, QR voucher & BLoCs
    │   └── notifications/  # Push notification handling & alert feeds
    └── main.dart           # App entry point & dependency injection
```

---

## 📂 Repository Structure

```
├── mobile_app/      # 📱 Flutter Mobile Application (iOS & Android)
├── backend_api/     # 🌐 Node.js / Express REST API (Auth, Bookings, Reviews, FCM)
├── admin_panel/     # 💻 React + Vite + Tailwind CSS Admin Management Dashboard
├── .gitattributes   # ⚙️ GitHub Linguist configuration (Primary: Flutter / Dart)
├── .gitignore       # 🛡️ Global ignore rules for Flutter & Node environments
└── README.md        # 📖 Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (`^3.24.0` or later)
- [Node.js](https://nodejs.org) (`v18+`)
- [Git](https://git-scm.com)

---

### 1️⃣ Run the Flutter Mobile App

```bash
# Navigate to mobile app directory
cd mobile_app

# Install Flutter dependencies
flutter pub get

# Run on connected device / simulator / emulator
flutter run
```

To execute mobile app tests:
```bash
flutter test
```

---

### 2️⃣ Run the Backend API (Optional / Local Dev)

```bash
# Navigate to backend directory
cd backend_api

# Install dependencies
npm install

# Start server (runs on http://localhost:5000)
npm run dev
```

---

### 3️⃣ Run the Admin Web Panel (Optional)

```bash
# Navigate to admin panel directory
cd admin_panel

# Install dependencies
npm install

# Launch Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🧪 Testing Summary

- ✅ **Flutter Test Suite**: All unit & serialization tests passing (`flutter test`).
- ✅ **Backend API Suite**: Health, Auth, Booking, and Review endpoints verified (`node test_api.js`).
- ✅ **Admin Web Panel**: Production build verification clean (`npm run build`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
