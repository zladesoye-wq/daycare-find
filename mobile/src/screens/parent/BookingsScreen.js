import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Header, LoadingSpinner, EmptyState } from '../../components/common';
import BookingCard from '../../components/booking/BookingCard';
import { bookingApi } from '../../services/api';

const TABS = ['Upcoming', 'Past'];

export default function BookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingApi.list();
      const data = response.data?.bookings || response.data || [];
      setBookings(data);
    } catch (err) {
      console.warn('Failed to fetch bookings:', err);
      // Mock data for development
      setBookings([
        {
          id: '1',
          provider_name: 'Sunshine Daycare',
          providerName: 'Sunshine Daycare',
          date: new Date(Date.now() + 2 * 86400000).toISOString(),
          time: '9:00 AM - 11:00 AM',
          status: 'pending',
          notes: 'Looking forward to visiting!',
        },
        {
          id: '2',
          provider_name: "Little Explorers Academy",
          providerName: "Little Explorers Academy",
          date: new Date(Date.now() + 5 * 86400000).toISOString(),
          time: '1:00 PM - 3:00 PM',
          status: 'confirmed',
          notes: '',
        },
        {
          id: '3',
          provider_name: 'Bright Future Child Care',
          providerName: 'Bright Future Child Care',
          date: new Date(Date.now() - 3 * 86400000).toISOString(),
          time: '10:00 AM - 12:00 PM',
          status: 'completed',
          notes: 'Great visit!',
        },
        {
          id: '4',
          provider_name: 'Tiny Tots Learning Center',
          providerName: 'Tiny Tots Learning Center',
          date: new Date(Date.now() - 10 * 86400000).toISOString(),
          time: '2:00 PM - 4:00 PM',
          status: 'cancelled',
          notes: '',
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this tour?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingApi.update(bookingId, { status: 'cancelled' });
              setBookings((prev) =>
                prev.map((b) =>
                  b.id === bookingId ? { ...b, status: 'cancelled' } : b
                )
              );
            } catch (err) {
              console.warn('Failed to cancel booking:', err);
              Alert.alert('Error', 'Could not cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const filteredBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (activeTab === 'Upcoming') {
      return bookingDate >= now && b.status !== 'cancelled' && b.status !== 'completed';
    } else {
      return bookingDate < now || b.status === 'cancelled' || b.status === 'completed';
    }
  });

  const renderItem = ({ item }) => (
    <BookingCard
      booking={item}
      onCancel={handleCancel}
      onPress={() => {}}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Bookings" />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Bookings" />

      {/* Segmented Control */}
      <View style={styles.segmentedContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.segment, activeTab === tab && styles.segmentActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === tab && styles.segmentTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title={
              activeTab === 'Upcoming'
                ? 'No upcoming tours'
                : 'No past tours'
            }
            message={
              activeTab === 'Upcoming'
                ? 'Book a tour at a daycare center to see it here.'
                : 'Your completed and cancelled tours will appear here.'
            }
            actionLabel={
              activeTab === 'Upcoming' ? 'Find Daycares' : undefined
            }
            onAction={
              activeTab === 'Upcoming'
                ? () => navigation.navigate('SearchTab')
                : undefined
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    ...typography.bodySmall,
    color: colors.textMedium,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});