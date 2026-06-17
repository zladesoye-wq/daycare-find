import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const badgeColors = {
  spots: { bg: colors.spotsGreen + '20', text: colors.spotsGreen },
  few: { bg: colors.spotsYellow + '20', text: colors.spotsYellow },
  full: { bg: colors.spotsRed + '20', text: colors.spotsRed },
  budget: { bg: colors.budgetPickGreen + '20', text: colors.budgetPickGreen },
  premium: { bg: colors.primary + '20', text: colors.primary },
  pending: { bg: colors.warning + '20', text: colors.warning },
  confirmed: { bg: colors.success + '20', text: colors.success },
  completed: { bg: colors.accent + '20', text: colors.accent },
  cancelled: { bg: colors.error + '20', text: colors.error },
};

export default function Badge({ label, type = 'spots', style }) {
  const badgeStyle = badgeColors[type] || badgeColors.spots;

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }, style]}>
      <Text style={[styles.text, { color: badgeStyle.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});