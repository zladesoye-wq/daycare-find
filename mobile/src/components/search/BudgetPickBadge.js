import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function BudgetPickBadge({ style }) {
  return (
    <View style={[styles.badge, style]}>
      <Ionicons name="star" size={12} color={colors.white} />
      <Text style={styles.text}>Budget Pick</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.budgetPickGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
    gap: 3,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
});