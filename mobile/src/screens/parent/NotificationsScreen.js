import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Header, LoadingSpinner, EmptyState } from '../../components/common';
import { notificationApi } from '../../services/api';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.list();
      const data = res.data;
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread || 0);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
      setNotifications([
        { id: '1', title: 'Tour Confirmed!', body: 'Your tour at Sunshine Daycare has been confirmed for tomorrow at 9:00 AM.', is_read: false, created_at: new Date().toISOString() },
        { id: '2', title: 'New Spot Available', body: 'Bright Future Child Care has new spots open in the infant program!', is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', title: 'Tour Reminder', body: 'Reminder: Your tour at Little Explorers Academy is tomorrow at 1:00 PM.', is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
        { id: '4', title: 'Booking Cancelled', body: 'Your tour at Tiny Tots Learning Center has been cancelled.', is_read: true, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchNotifications(); };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
    }
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.is_read && styles.unreadCard]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={[styles.iconCircle, !item.is_read && styles.unreadIcon]}>
        <Ionicons
          name={!item.is_read ? 'notifications' : 'notifications-outline'}
          size={20}
          color={!item.is_read ? colors.white : colors.textMedium}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.is_read && styles.unreadTitle]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{formatTime(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Notifications"
          showBack
          onBack={() => navigation.goBack()}
          rightAction
          rightIcon="checkmark-done"
          onRightPress={handleMarkAllRead}
        />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        showBack
        onBack={() => navigation.goBack()}
        rightAction
        rightIcon="checkmark-done"
        onRightPress={handleMarkAllRead}
      />
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBar} onPress={handleMarkAllRead}>
          <Ionicons name="checkmark-done" size={18} color={colors.accent} />
          <Text style={styles.markAllText}>Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />
        }
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="No notifications" message="You're all caught up!" />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  markAllBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.sm, backgroundColor: colors.accent + '10',
    gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  markAllText: { ...typography.caption, color: colors.accent, fontWeight: '600' },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.md, ...shadows.sm, gap: spacing.md,
  },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.accent },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lightGray,
    alignItems: 'center', justifyContent: 'center',
  },
  unreadIcon: { backgroundColor: colors.primary },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: spacing.sm },
  title: { ...typography.body, color: colors.textDark, fontWeight: '500', flex: 1 },
  unreadTitle: { fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  body: { ...typography.bodySmall, color: colors.textMedium, marginBottom: spacing.xs, lineHeight: 20 },
  time: { ...typography.caption, color: colors.textLight },
});