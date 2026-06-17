# DaycareFind Mobile

React Native / Expo mobile app for iOS and Android.

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Setup

```bash
cd mobile
npm install
```

## Running the App

```bash
npm start
```

Scan the QR code with Expo Go (iOS/Android) or press:
- `a` for Android emulator
- `i` for iOS simulator (macOS only)

## Project Structure

```
mobile/
  App.js                  # Entry point
  src/
    theme/                # Colors, typography, spacing
    components/common/    # Reusable UI components
    components/search/    # Search-specific components
    components/booking/   # Booking components
    components/provider/  # Provider-specific components
    context/              # React Context providers
    services/             # API, auth, notifications, location
    navigation/           # Navigation config
    screens/auth/         # Auth flow screens
    screens/parent/       # Parent-facing screens
    screens/provider/     # Provider-facing screens
    screens/admin/        # Admin screens
  assets/                 # Images, icons, fonts
```

## Environment

Configure the API base URL in `app.json` under `extra.apiBaseUrl`.

## Design

- **Primary:** Navy #1A3557
- **Accent:** Mint #2ECC8A
- **Font:** DM Sans
- **Cards:** White, 12px radius, subtle shadow
