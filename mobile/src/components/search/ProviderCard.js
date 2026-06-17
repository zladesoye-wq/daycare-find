import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Badge } from '../common';
import BudgetPickBadge from './BudgetPickBadge';

export default function ProviderCard({
  provider,
  onPress,
  onFavorite,
  isFavorite,
}) {
  const spots = provider.available_spots ?? 0;
  const spotType = spots >= 5 ? 'spots' : spots >= 1 ? 'few' : 'full';
  const spotLabel = spots >= 5 ? `${spots} spots` : spots >= 1 ? `${spots} left` : 'Full';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          {provider.image_url ? (
            <Image source={{ uri: provider.image_url }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="business" size={32} color={colors.mediumGray} />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {provider.name}
            </Text>
            <TouchableOpacity
              onPress={() => onFavorite?.(provider.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? colors.error : colors.textLight}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.address} numberOfLines={1}>
            {provider.address}
          </Text>

          <View style={styles.badgesRow}>
            {provider.distance !== undefined && provider.distance !== null && (
              <Badge
                label={`${Number(provider.distance).toFixed(1)} mi`}
                type="spots"
                style={styles.badge}
              />
            )}
            <Badge label={`$${provider.monthly_price || '—'}/mo`} type="spots" style={styles.badge} />
            <Badge label={spotLabel} type={spotType} style={styles.badge} />
          </View>

          {provider.budget_pick && (
            <BudgetPickBadge style={styles.budgetBadge} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.h4,
    color: colors.textDark,
    flex: 1,
    marginRight: spacing.sm,
  },
  address: {
    ...typography.bodySmall,
    color: colors.textMedium,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badge: {},
  budgetBadge: {
    marginTop: spacing.xs,
  },
});