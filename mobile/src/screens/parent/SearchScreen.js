import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { LoadingSpinner, EmptyState } from '../../components/common';
import NotificationBell from '../../components/common/NotificationBell';
import FilterBar from '../../components/search/FilterBar';
import ProviderCard from '../../components/search/ProviderCard';
import { providerApi, notificationApi } from '../../services/api';
import { getCurrentLocation } from '../../services/location';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INITIAL_FILTERS = {
  zip: '',
  radius: 10,
  ageGroup: null,
  maxPrice: 2000,
  subsidy: false,
};

export default function SearchScreen({ navigation }) {
  const { token } = useAuth();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const mapRef = useRef(null);

  // Get user location on mount
  useEffect(() => {
    (async () => {
      const loc = await getCurrentLocation();
      if (loc) {
        setUserLocation(loc);
        setFilters((prev) => ({
          ...prev,
          lat: loc.latitude,
          lng: loc.longitude,
        }));
      }
    })();
  }, []);

  // Fetch providers when filters change
  useEffect(() => {
    fetchProviders();
  }, [filters]);

  // Fetch unread notifications count on focus
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const res = await notificationApi.list({ limit: 1 });
          setUnreadCount(res.data?.unread || 0);
        } catch (err) {
          // Silently fail
        }
      })();
    }, [])
  );

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.zip) params.zip = filters.zip;
      if (filters.radius !== 10) params.radius = filters.radius;
      if (filters.ageGroup) params.age_group = filters.ageGroup;
      if (filters.maxPrice < 2000) params.max_price = filters.maxPrice;
      if (filters.subsidy) params.subsidy = 'true';
      if (filters.lat && filters.lng) {
        params.lat = filters.lat;
        params.lng = filters.lng;
      }

      const response = await providerApi.search(params);
      const data = response.data?.providers || response.data || [];
      setProviders(data);
    } catch (err) {
      console.warn('Failed to fetch providers:', err);
      setError(err.message || 'Failed to load providers');
      // Fallback to mock data
      setProviders(getMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProviders();
    setRefreshing(false);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
  };

  const toggleFavorite = (providerId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) {
        next.delete(providerId);
      } else {
        next.add(providerId);
      }
      return next;
    });
  };

  const navigateToDetail = (provider) => {
    navigation.navigate('ProviderDetail', { provider });
  };

  const renderProviderCard = ({ item }) => (
    <ProviderCard
      provider={item}
      onPress={() => navigateToDetail(item)}
      onFavorite={toggleFavorite}
      isFavorite={favorites.has(item.id)}
    />
  );

  const renderListHeader = () => {
    if (providers.length === 0) return null;
    return (
      <View style={styles.listHeader}>
        <Text style={styles.resultCount}>
          {providers.length} provider{providers.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    );
  };

  // Generate mock providers for development
  const getMockProviders = () => [
    {
      id: '1',
      name: 'Sunshine Daycare',
      address: '123 Main St, Springfield',
      distance: 0.8,
      monthly_price: 850,
      available_spots: 5,
      total_spots: 12,
      age_groups: ['infant', 'toddler'],
      budget_pick: true,
      lat: userLocation?.latitude ? userLocation.latitude + 0.005 : 40.7128,
      lng: userLocation?.longitude ? userLocation.longitude + 0.005 : -74.006,
      image_url: null,
      phone: '(555) 123-4567',
      description: 'A warm, nurturing environment for children ages 6 weeks to 3 years.',
    },
    {
      id: '2',
      name: "Little Explorers Academy",
      address: '456 Oak Ave, Springfield',
      distance: 1.2,
      monthly_price: 1200,
      available_spots: 2,
      total_spots: 16,
      age_groups: ['toddler', 'preschool'],
      budget_pick: false,
      lat: userLocation?.latitude ? userLocation.latitude - 0.008 : 40.7200,
      lng: userLocation?.longitude ? userLocation.longitude + 0.01 : -74.000,
      image_url: null,
      phone: '(555) 234-5678',
      description: 'Play-based learning with certified early childhood educators.',
    },
    {
      id: '3',
      name: 'Bright Future Child Care',
      address: '789 Pine Rd, Springfield',
      distance: 2.5,
      monthly_price: 600,
      available_spots: 0,
      total_spots: 8,
      age_groups: ['infant', 'toddler', 'preschool'],
      budget_pick: true,
      lat: userLocation?.latitude ? userLocation.latitude + 0.015 : 40.7050,
      lng: userLocation?.longitude ? userLocation.longitude - 0.005 : -74.010,
      image_url: null,
      phone: '(555) 345-6789',
      description: 'Affordable, high-quality care in a loving home-like setting.',
    },
    {
      id: '4',
      name: 'Tiny Tots Learning Center',
      address: '321 Elm St, Springfield',
      distance: 3.1,
      monthly_price: 950,
      available_spots: 3,
      total_spots: 10,
      age_groups: ['infant', 'preschool'],
      budget_pick: false,
      lat: userLocation?.latitude ? userLocation.latitude - 0.012 : 40.7180,
      lng: userLocation?.longitude ? userLocation.longitude + 0.015 : -73.995,
      image_url: null,
      phone: '(555) 456-7890',
      description: 'STEM-focused preschool program with experienced teachers.',
    },
  ];

  if (loading && providers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find Daycare</Text>
        </View>
        <LoadingSpinner fullScreen message="Searching for providers..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Daycare</Text>
        <NotificationBell
          onPress={() => navigation.navigate('NotificationsList')}
          unreadCount={unreadCount}
        />
      </View>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

      {/* Map/List Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, !showMap && styles.toggleBtnActive]}
          onPress={() => setShowMap(false)}
        >
          <Ionicons
            name="list"
            size={16}
            color={!showMap ? colors.white : colors.textMedium}
          />
          <Text
            style={[
              styles.toggleText,
              !showMap && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, showMap && styles.toggleBtnActive]}
          onPress={() => setShowMap(true)}
        >
          <Ionicons
            name="map"
            size={16}
            color={showMap ? colors.white : colors.textMedium}
          />
          <Text
            style={[
              styles.toggleText,
              showMap && styles.toggleTextActive,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {error && providers.length === 0 ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Oops!"
          message={error}
          actionLabel="Try Again"
          onAction={fetchProviders}
        />
      ) : showMap ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || 40.7128,
              longitude: userLocation?.longitude || -74.006,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {providers.map((provider) => (
              <Marker
                key={provider.id}
                coordinate={{
                  latitude: parseFloat(provider.lat) || 40.7128,
                  longitude: parseFloat(provider.lng) || -74.006,
                }}
                pinColor={provider.budget_pick ? colors.accent : colors.primary}
                onPress={() => navigateToDetail(provider)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{provider.name}</Text>
                    <Text style={styles.calloutText}>
                      ${provider.monthly_price}/mo • {provider.available_spots} spots
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProviderCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No providers found"
              message="Try adjusting your filters or searching a different area."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 4,
    backgroundColor: colors.lightGray,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    ...typography.caption,
    color: colors.textMedium,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultCount: {
    ...typography.bodySmall,
    color: colors.textMedium,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  callout: {
    padding: spacing.sm,
    maxWidth: 200,
  },
  calloutTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textDark,
  },
  calloutText: {
    ...typography.caption,
    color: colors.textMedium,
  },
});