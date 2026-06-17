import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={48} color={colors.white} />
          </View>
          <Text style={styles.appName}>DaycareFind</Text>
          <Text style={styles.tagline}>
            Find the perfect daycare for your little ones
          </Text>
        </View>

        <View style={styles.featuresList}>
          <FeatureRow
            icon="search"
            text="Search nearby daycare providers"
          />
          <FeatureRow
            icon="calendar"
            text="Book tours with one tap"
          />
          <FeatureRow
            icon="notifications"
            text="Get notified when spots open"
          />
          <FeatureRow
            icon="wallet"
            text="Budget-friendly options highlighted"
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Find Daycare"
            onPress={() => navigation.navigate('Login', { role: 'parent' })}
            variant="primary"
            size="large"
            style={styles.button}
          />
          <Button
            title="List My Center"
            onPress={() => navigation.navigate('Login', { role: 'provider' })}
            variant="outlined"
            size="large"
            style={styles.button}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Button
            title="Log In"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            size="sm"
            style={styles.loginButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconBg}>
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.h1,
    color: colors.white,
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  buttonsContainer: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.7,
  },
  loginButton: {
    paddingHorizontal: 0,
    minHeight: 0,
  },
});