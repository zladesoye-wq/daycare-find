import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) {
  const isPrimary = variant === 'primary';
  const isOutlined = variant === 'outlined';
  const isGhost = variant === 'ghost';
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary && styles.primary,
        isOutlined && styles.outlined,
        isGhost && styles.ghost,
        isSmall && styles.small,
        isLarge && styles.large,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.white : colors.accent}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && styles.primaryText,
            isOutlined && styles.outlinedText,
            isGhost && styles.ghostText,
            isSmall && styles.smallText,
            isLarge && styles.largeText,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 36,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
    color: colors.white,
  },
  primaryText: {
    color: colors.white,
  },
  outlinedText: {
    color: colors.accent,
  },
  ghostText: {
    color: colors.accent,
  },
  smallText: {
    ...typography.buttonSmall,
  },
  largeText: {
    ...typography.button,
  },
  disabledText: {
    opacity: 0.7,
  },
});