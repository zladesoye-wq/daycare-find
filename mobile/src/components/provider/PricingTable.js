import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const AGE_GROUPS = [
  { key: 'infant', label: 'Infant (0-12 mo)' },
  { key: 'toddler', label: 'Toddler (1-3 yr)' },
  { key: 'preschool', label: 'Preschool (3-5 yr)' },
];

export default function PricingTable({ pricing, onPricingChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Pricing</Text>
      {AGE_GROUPS.map((group) => (
        <View key={group.key} style={styles.row}>
          <Text style={styles.label}>{group.label}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              value={pricing[group.key]?.toString() || ''}
              onChangeText={(v) => onPricingChange(group.key, v)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textLight}
            />
            <Text style={styles.suffix}>/mo</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.textDark,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    width: 140,
  },
  dollarSign: {
    ...typography.body,
    color: colors.textMedium,
    fontWeight: '600',
  },
  input: {
    ...typography.body,
    color: colors.textDark,
    flex: 1,
    paddingVertical: spacing.sm,
    textAlign: 'right',
  },
  suffix: {
    ...typography.caption,
    color: colors.textLight,
    marginLeft: 4,
  },
});