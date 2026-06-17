import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../common';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

export default function BookingCard({ booking, onCancel, onPress }) {
  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const isPast = bookingDate < new Date();
  const canCancel = booking.status === 'pending' && !isPast;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(booking)} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.centerInfo}>
          <Text style={styles.centerName}>{booking.provider_name || booking.providerName}</Text>
          <Badge
            label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            type={booking.status}
            style={styles.statusBadge}
          />
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textMedium} />
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textMedium} />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        {booking.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.textMedium} />
            <Text style={styles.detailText} numberOfLines={2}>{booking.notes}</Text>
          </View>
        )}
      </View>

      {canCancel && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => onCancel?.(booking.id)}
        >
          <Text style={styles.cancelText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  centerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  centerName: {
    ...typography.h4,
    color: colors.textDark,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  details: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textMedium,
    flex: 1,
  },
  cancelBtn: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },
});