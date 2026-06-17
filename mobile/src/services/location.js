import * as Location from 'expo-location';

export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.warn('Failed to get location:', error);
    return null;
  }
}

export async function getAddressFromCoords(latitude, longitude) {
  try {
    const geocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (geocode.length > 0) {
      const addr = geocode[0];
      return {
        street: `${addr.street || ''} ${addr.streetNumber || ''}`.trim(),
        city: addr.city || '',
        region: addr.region || '',
        postalCode: addr.postalCode || '',
        formatted: [
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
        ]
          .filter(Boolean)
          .join(', '),
      };
    }
    return null;
  } catch (error) {
    console.warn('Failed to reverse geocode:', error);
    return null;
  }
}

export async function getCoordsFromAddress(address) {
  try {
    const geocode = await Location.geocodeAsync(address);
    if (geocode.length > 0) {
      return {
        latitude: geocode[0].latitude,
        longitude: geocode[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.warn('Failed to geocode address:', error);
    return null;
  }
}