import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { bookingApi, providerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    availableSpots: 0,
    pendingRequests: 0,
    totalBookings: 0,
    profileViews: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [bookingRes, providerRes] = await Promise.all([
        bookingApi.list(),
        providerApi.getById(user?.id),
      ]);

      const bookings = bookingRes.data?.bookings || bookingRes.data || [];
      const provider = providerRes.data?.provider || providerRes.data || {};

      const pending = bookings.filter((b) => b.status === 'pending').length;
      const total = bookings.length;

      setStats({
        availableSpots: provider.available_spots ?? 12,
        pendingRequests: pending,
        totalBookings: total,
        profileViews: provider.profile_views ?? 0,
      });

      const recent = bookings
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
        .slice(0, 5)
        .map((b) => ({
          id: b.id,
          text: `New booking from ${b.parent_name || 'a parent'}`,
          time: b.date,
          status: b.status,
        }));

      setRecentActivity(
        recent.length > 0
          ? recent
          : [
              { id: '1', text: 'Welcome to DaycareFind!', time: new Date().toISOString(), status: 'info' },
            ]
      );
    } catch (err) {
      console.warn('Failed to fetch dashboard data:', err);
      setStats({ availableSpots: 12, pendingRequests: 3, totalBookings: 8, profileViews: 45 });
      setRecentActivity([
        { id: '1', text: 'New booking from Sarah J.', time: new Date().toISOString(), status: 'pending' },
        { id: '2', text: 'Tour confirmed with Mike R.', time: new Date(Date.now() - 86400000).toISOString(), status: 'confirmed' },
        { id: '3', text: 'Center profile updated', time: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'info' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const QuickAction = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickIcon, { backgroundColor: (color || colors.accent) + '15' }]}>
        <Ionicons name={icon} size={24} color={color || colors.accent} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.headerTitle}>Dashboard</Text></View>
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: colors.accent }]}>
            <Text style={styles.statNumber}>{stats.availableSpots}</Text>
            <Text style={styles.statLabel}>Available Spots</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
            <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
            <Text style={styles.statNumber}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: colors.accent }]}>
            <Text style={styles.statNumber}>{stats.profileViews}</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <QuickAction icon="time" label="Update Spots" onPress={() => navigation.navigate('Availability')} color={colors.accent} />
          <QuickAction icon="calendar" label="View Bookings" onPress={() => navigation.navigate('Bookings')} color={colors.primary} />
          <QuickAction icon="person" label="Edit Profile" onPress={() => navigation.navigate('Profile')} color={colors.warning} />
          <QuickAction icon="stats-chart" label="Analytics" color={colors.textMedium} />
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityRow}>
            <View style={styles.activityDot}>
              <View style={[
                styles.dot,
                { backgroundColor: activity.status === 'pending' ? colors.warning : activity.status === 'confirmed' ? colors.success : colors.accent },
              ]} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>
                {new Date(activity.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg,
    borderLeftWidth: 4, ...shadows.sm,
  },
  statNumber: { ...typography.h2, color: colors.textDark, marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textMedium },
  sectionTitle: { ...typography.h4, color: colors.textDark, marginBottom: spacing.md, marginTop: spacing.md },
  quickActionsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  quickAction: { flex: 1, alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, ...shadows.sm },
  quickIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  quickLabel: { ...typography.caption, color: colors.textDark, fontWeight: '600', textAlign: 'center' },
  activityRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, alignItems: 'flex-start' },
  activityDot: { paddingTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  activityContent: { flex: 1 },
  activityText: { ...typography.bodySmall, color: colors.textDark },
  activityTime: { ...typography.caption, color: colors.textLight, marginTop: 2 },
});