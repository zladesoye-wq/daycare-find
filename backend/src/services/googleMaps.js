const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

const geocodeZip = async (zip) => {
  try {
    const response = await client.geocode({
      params: {
        address: zip,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

module.exports = { geocodeZip };
