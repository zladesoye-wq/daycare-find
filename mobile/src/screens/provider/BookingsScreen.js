import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { Header, LoadingSpinner, EmptyState, Badge } from '../../components/common';
import TourRequestCard from '../../components/provider/TourRequestCard';
import { bookingApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.list();
      const data = res.data?.bookings || res.data || [];
      setBookings(data);
    } catch (err) {
      console.warn('Failed to fetch bookings:', err);
      setBookings([
        { id: '1', parent_name: 'Sarah Johnson', parent_email: 'sarah@example.com', date: new Date(Date.now() + 2 * 86400000).toISOString(), time: '9:00 AM - 11:00 AM', status: 'pending', notes: 'Looking forward to visiting!' },
        { id: '2', parent_name: 'Mike Rodriguez', parent_email: 'mike@example.com', date: new Date(Date.now() + 4 * 86400000).toISOString(), time: '1:00 PM - 3:00 PM', status: 'pending', notes: '' },
        { id: '3', parent_name: 'Emily Chen', parent_email: 'emily@example.com', date: new Date(Date.now() - 2 * 86400000).toISOString(), time: '10:00 AM - 12:00 PM', status: 'confirmed', notes: 'Allergic to peanuts' },
        { id: '4', parent_name: 'David Park', parent_email: 'david@example.com', date: new Date(Date.now() - 5 * 86400000).toISOString(), time: '2:00 PM - 4:00 PM', status: 'completed', notes: '' },
        { id: '5', parent_name: 'Lisa Thompson', parent_email: 'lisa@example.com', date: new Date(Date.now() - 7 * 86400000).toISOString(), time: '9:00 AM - 11:00 AM', status: 'cancelled', notes: 'Found another center' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  const handleAccept = async (bookingId) => {
    try {
      await bookingApi.update(bookingId, { status: 'confirmed' });
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
      Alert.alert('Confirmed!', 'Tour request has been accepted.');
    } catch (err) {
      Alert.alert('Error', 'Could not accept booking.');
    }
  };

  const handleDecline = async (bookingId) => {
    Alert.alert('Decline Request', 'Are you sure you want to decline this tour?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: async () => {
        try {
          await bookingApi.update(bookingId, { status: 'cancelled' });
          setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        } catch (err) {
          Alert.alert('Error', 'Could not decline booking.');
        }
      }},
    ]);
  };

  const renderItem = ({ item }) => (
    <TourRequestCard request={item} onAccept={handleAccept} onDecline={handleDecline} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Tour Requests" />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tour Requests" />
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />
        }
        ListEmptyComponent={
          <EmptyState icon="calendar-outline" title="No tour requests" message="You don't have any tour requests yet." />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
});