# DaycareFind Backend

Node.js/Express API for DaycareFind.

## Tech Stack
- Node.js
- Express
- PostgreSQL
- JWT for Authentication
- Stripe for Payments
- Expo for Push Notifications
- Google Maps API for Geolocation/Distance

## Prerequisites
- Node.js (v18+)
- PostgreSQL

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Initialize the database schema:
   ```bash
   psql -d daycarefind -f src/db/schema.sql
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user (parent or provider)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires token)

## Environment Variables
- `PORT`: Port to run the server on (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `GOOGLE_MAPS_API_KEY`: Google Maps API key
- `EXPO_ACCESS_TOKEN`: Expo push notifications access token
