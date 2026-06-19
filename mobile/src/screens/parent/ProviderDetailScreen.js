import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Button, Badge } from '../../components/common';
import BudgetPickBadge from '../../components/search/BudgetPickBadge';
import { favoritesApi } from '../../services/api';

export default function ProviderDetailScreen({ route, navigation }) {
  const { provider } = route.params;
  const [isFavorite, setIsFavorite] = useState(provider.is_favorited || false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesApi.list();
      const favs = response.data?.favorites || response.data || [];
      const isFav = favs.some((f) => f.id === provider.id);
      setIsFavorite(isFav);
    } catch (err) {
      // Silently fail, use default
    }
  };

  const toggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.remove(provider.id);
        setIsFavorite(false);
      } else {
        await favoritesApi.add(provider.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.warn('Failed to toggle favorite:', err);
      // Fall back to local toggle
      setIsFavorite(!isFavorite);
    } finally {
      setFavLoading(false);
    }
  };

  const spots = provider.available_spots ?? 0;
  const spotType = spots >= 5 ? 'spots' : spots >= 1 ? 'few' : 'full';
  const spotStatus =
    spots >= 5
      ? `${spots} spots available`
      : spots >= 1
      ? `Only ${spots} spots left!`
      : 'Currently full';

  const handleCall = () => {
    if (provider.phone) {
      Linking.openURL(`tel:${provider.phone}`);
    }
  };

  const handleBookTour = () => {
    navigation.navigate('TourBooking', { providerId: provider.id, providerName: provider.name });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={toggleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.error : colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {provider.image_url ? (
            <Image source={{ uri: provider.image_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="business" size={64} color={colors.mediumGray} />
            </View>
          )}

          {/* Overlay info */}
          <View style={styles.heroOverlay}>
            <Text style={styles.heroName}>{provider.name}</Text>
            <View style={styles.heroInfoRow}>
              <Ionicons name="location" size={14} color={colors.white} />
              <Text style={styles.heroAddress}>{provider.address}</Text>
            </View>
            {provider.distance !== undefined && provider.distance !== null && (
              <Text style={styles.heroDistance}>
                {Number(provider.distance).toFixed(1)} miles away
              </Text>
            )}
          </View>

          {/* Badges over hero */}
          <View style={styles.heroBadges}>
            {provider.budget_pick && <BudgetPickBadge />}
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoRow}>
          <View style={[styles.quickInfoCard, { backgroundColor: colors.primary + '10' }]}>
            <Ionicons name="pricetag" size={20} color={colors.primary} />
            <Text style={styles.quickInfoValue}>
              ${provider.monthly_price || '—'}
            </Text>
            <Text style={styles.quickInfoLabel}>per month</Text>
          </View>
          <View style={[styles.quickInfoCard, { backgroundColor: colors.accent + '10' }]}>
            <Ionicons name="people" size={20} color={colors.accent} />
            <Text style={styles.quickInfoValue}>
              {provider.available_spots ?? 0}
            </Text>
            <Text style={styles.quickInfoLabel}>spots left</Text>
          </View>
          <View style={[styles.quickInfoCard, { backgroundColor: colors.warning + '10' }]}>
            <Ionicons name="call" size={20} color={colors.warning} />
            <TouchableOpacity onPress={handleCall}>
              <Text style={styles.quickInfoCall}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Availability Status */}
        <View style={styles.availabilitySection}>
          <View style={[styles.spotIndicator, { backgroundColor: colors[spotType] + '20' }]}>
            <View style={[styles.spotDot, { backgroundColor: colors[spotType] }]} />
            <Text style={[styles.spotText, { color: colors[spotType] }]}>
              {spotStatus}
            </Text>
          </View>
        </View>

        {/* Description */}
        {provider.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{provider.description}</Text>
          </View>
        )}

        {/* Age Groups */}
        {provider.age_groups && provider.age_groups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age Groups Served</Text>
            <View style={styles.ageGroupRow}>
              {provider.age_groups.map((age) => (
                <View key={age} style={styles.ageGroupChip}>
                  <Text style={styles.ageGroupText}>
                    {age.charAt(0).toUpperCase() + age.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingAge}>
                {provider.requested_age_group
                  ? provider.requested_age_group.charAt(0).toUpperCase() +
                    provider.requested_age_group.slice(1)
                  : 'Monthly'}
              </Text>
              <Text style={styles.pricingAmount}>
                ${provider.monthly_price || '—'}
              </Text>
            </View>
            <Text style={styles.pricingNote}>
              Contact provider for full pricing details for all age groups
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactCard}>
            {provider.phone && (
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={18} color={colors.textMedium} />
                <Text style={styles.contactText}>{provider.phone}</Text>
              </View>
            )}
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={18} color={colors.textMedium} />
              <Text style={styles.contactText}>{provider.address}</Text>
            </View>
          </View>
        </View>

        {/* Spacer for bottom buttons */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={styles.bottomBar}>
        <Button
          title="Call Provider"
          onPress={handleCall}
          variant="outlined"
          style={styles.bottomBtnHalf}
        />
        {spots === 0 ? (
          <Button
            title="Join Waitlist"
            onPress={() => {}}
            variant="primary"
            style={styles.bottomBtnHalf}
          />
        ) : (
          <Button
            title="Book a Tour"
            onPress={handleBookTour}
            variant="primary"
            style={styles.bottomBtnHalf}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  heroContainer: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroName: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  heroInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  heroAddress: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
  },
  heroDistance: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  heroBadges: {
    position: 'absolute',
    top: spacing.lg + 40,
    right: spacing.lg,
  },
  quickInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: -24,
    gap: spacing.sm,
  },
  quickInfoCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  quickInfoValue: {
    ...typography.h4,
    color: colors.textDark,
  },
  quickInfoLabel: {
    ...typography.caption,
    color: colors.textMedium,
  },
  quickInfoCall: {
    ...typography.bodySmall,
    color: colors.warning,
    fontWeight: '700',
    marginTop: 4,
  },
  availabilitySection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  spotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  spotDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  spotText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textMedium,
    lineHeight: 24,
  },
  ageGroupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ageGroupChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.round,
  },
  ageGroupText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  pricingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pricingAge: {
    ...typography.body,
    color: colors.textDark,
    fontWeight: '600',
  },
  pricingAmount: {
    ...typography.h4,
    color: colors.accent,
  },
  pricingNote: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
    gap: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contactText: {
    ...typography.body,
    color: colors.textDark,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  bottomBtnHalf: {
    flex: 1,
  },
});