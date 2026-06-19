import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../common';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Button } from '../common';

export default function TourRequestCard({ request, onAccept, onDecline }) {
  const requestDate = new Date(request.date);
  const formattedDate = requestDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const canAct = request.status === 'pending';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.parentInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={colors.white} />
          </View>
          <View style={styles.parentDetails}>
            <Text style={styles.parentName}>{request.parent_name || 'Parent'}</Text>
            {request.parent_email && (
              <Text style={styles.parentEmail}>{request.parent_email}</Text>
            )}
          </View>
        </View>
        <Badge
          label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          type={request.status}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textMedium} />
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textMedium} />
          <Text style={styles.detailText}>{request.time}</Text>
        </View>
        {request.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.textMedium} />
            <Text style={styles.detailText} numberOfLines={2}>{request.notes}</Text>
          </View>
        )}
      </View>

      {canAct && (
        <View style={styles.actions}>
          <Button
            title="Decline"
            onPress={() => onDecline?.(request.id)}
            variant="outlined"
            size="sm"
            style={styles.actionBtn}
          />
          <Button
            title="Accept"
            onPress={() => onAccept?.(request.id)}
            variant="primary"
            size="sm"
            style={styles.actionBtn}
          />
        </View>
      )}
    </View>
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
  parentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentDetails: {
    flex: 1,
  },
  parentName: {
    ...typography.body,
    color: colors.textDark,
    fontWeight: '600',
  },
  parentEmail: {
    ...typography.caption,
    color: colors.textMedium,
  },
  details: {
    gap: spacing.sm,
    marginBottom: canAct => canAct ? spacing.md : 0,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
});