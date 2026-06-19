import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || 'YOUR_GOOGLE_MAPS_API_KEY';

export default {
  API_URL,
  GOOGLE_MAPS_API_KEY,
};
