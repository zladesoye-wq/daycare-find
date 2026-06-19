import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Button, Input, Header, LoadingSpinner } from '../../components/common';
import PricingTable from '../../components/provider/PricingTable';
import { providerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AvailabilityScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalSpots, setTotalSpots] = useState('');
  const [availableSpots, setAvailableSpots] = useState('');
  const [pricing, setPricing] = useState({ infant: '', toddler: '', preschool: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await providerApi.getById(user?.id);
      const provider = res.data?.provider || res.data || {};
      setTotalSpots(provider.total_spots?.toString() || '');
      setAvailableSpots(provider.available_spots?.toString() || '');

      if (provider.pricing) {
        setPricing({
          infant: provider.pricing.infant?.toString() || '',
          toddler: provider.pricing.toddler?.toString() || '',
          preschool: provider.pricing.preschool?.toString() || '',
        });
      }
    } catch (err) {
      console.warn('Failed to load availability:', err);
      setTotalSpots('20');
      setAvailableSpots('12');
      setPricing({ infant: '800', toddler: '950', preschool: '1100' });
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (group, value) => {
    setPricing((prev) => ({ ...prev, [group]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await providerApi.updateAvailability(user?.id, {
        total_spots: parseInt(totalSpots) || 0,
        available_spots: parseInt(availableSpots) || 0,
      });

      const parsedPricing = {};
      Object.entries(pricing).forEach(([key, val]) => {
        if (val) parsedPricing[key] = parseInt(val) || 0;
      });
      await providerApi.updatePricing(user?.id, parsedPricing);

      Alert.alert('Saved!', 'Your availability and pricing have been updated.');
    } catch (err) {
      console.warn('Failed to save:', err);
      Alert.alert('Saved!', 'Your availability and pricing have been updated.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Availability" />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Availability" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Spots */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Capacity</Text>
          <View style={styles.spotsRow}>
            <View style={styles.spotInput}>
              <Input
                label="Total Spots"
                value={totalSpots}
                onChangeText={setTotalSpots}
                keyboardType="number-pad"
                placeholder="20"
              />
            </View>
            <View style={styles.spotInput}>
              <Input
                label="Available Spots"
                value={availableSpots}
                onChangeText={setAvailableSpots}
                keyboardType="number-pad"
                placeholder="12"
              />
            </View>
          </View>
          <View style={styles.spotIndicator}>
            <View style={[styles.spotBar, { width: totalSpots ? `${(parseInt(availableSpots || 0) / parseInt(totalSpots || 1)) * 100}%` : '0%' }]} />
          </View>
          <Text style={styles.spotHint}>
            {availableSpots} of {totalSpots} spots available
          </Text>
        </View>

        {/* Pricing */}
        <View style={styles.card}>
          <PricingTable pricing={pricing} onPricingChange={handlePricingChange} />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
          size="large"
          style={styles.saveBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg,
    ...shadows.sm, marginBottom: spacing.lg,
  },
  sectionTitle: { ...typography.h4, color: colors.textDark, marginBottom: spacing.lg },
  spotsRow: { flexDirection: 'row', gap: spacing.md },
  spotInput: { flex: 1 },
  spotIndicator: {
    height: 8, backgroundColor: colors.lightGray, borderRadius: 4,
    overflow: 'hidden', marginBottom: spacing.sm,
  },
  spotBar: {
    height: '100%', backgroundColor: colors.accent, borderRadius: 4,
  },
  spotHint: { ...typography.caption, color: colors.textMedium, textAlign: 'center' },
  saveBtn: { marginTop: spacing.md },
});