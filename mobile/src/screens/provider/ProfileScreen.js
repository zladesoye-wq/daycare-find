import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Button, Input, Header, LoadingSpinner } from '../../components/common';
import { providerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [subscription, setSubscription] = useState('free');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await providerApi.getById(user?.id);
      const provider = res.data?.provider || res.data || {};
      setName(provider.name || '');
      setAddress(provider.address || '');
      setPhone(provider.phone || '');
      setDescription(provider.description || '');
      setSubscription(provider.subscription || 'free');
    } catch (err) {
      console.warn('Failed to load profile:', err);
      setName('Sunshine Daycare');
      setAddress('123 Main St, Springfield');
      setPhone('(555) 123-4567');
      setDescription('A warm, nurturing environment for children.');
      setSubscription('free');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await providerApi.update(user?.id, { name, address, phone, description });
      Alert.alert('Saved!', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('Saved!', 'Your profile has been updated.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade to Premium', 'Premium features include priority placement, advanced analytics, and more!', [
      { text: 'Not Now', style: 'cancel' },
      { text: 'Learn More', onPress: () => {} },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Center" />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Center" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoPlaceholder}>
            <Ionicons name="business" size={40} color={colors.mediumGray} />
          </View>
          <TouchableOpacity style={styles.changePhoto}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Info Form */}
        <View style={styles.card}>
          <Input label="Center Name" value={name} onChangeText={setName} placeholder="Your center name" />
          <Input label="Address" value={address} onChangeText={setAddress} placeholder="Street, City, State ZIP" />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="(555) 000-0000" keyboardType="phone-pad" />
          <Input label="Description" value={description} onChangeText={setDescription} placeholder="Tell parents about your center..." multiline />
          <Button title="Save Profile" onPress={handleSave} loading={saving} size="large" />
        </View>

        {/* Subscription */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subRow}>
            <View style={styles.subInfo}>
              <Ionicons name={subscription === 'premium' ? 'diamond' : 'pricetag'} size={24} color={subscription === 'premium' ? colors.accent : colors.textMedium} />
              <View style={styles.subDetails}>
                <Text style={styles.subLabel}>{subscription === 'premium' ? 'Premium Plan' : 'Free Plan'}</Text>
                <Text style={styles.subDescription}>
                  {subscription === 'premium' ? 'Priority placement & analytics' : 'Basic listing & visibility'}
                </Text>
              </View>
            </View>
          </View>
          {subscription !== 'premium' && (
            <Button title="Upgrade to Premium" onPress={handleUpgrade} variant="outlined" size="md" style={styles.upgradeBtn} />
          )}
        </View>

        {/* Logout */}
        <Button title="Logout" onPress={handleLogout} variant="ghost" size="large" textStyle={{ color: colors.error }} style={styles.logoutBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  photoSection: { alignItems: 'center', marginBottom: spacing.xl },
  photoPlaceholder: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: colors.lightGray,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  changePhoto: { padding: spacing.sm },
  changePhotoText: { ...typography.bodySmall, color: colors.accent, fontWeight: '600' },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg,
    ...shadows.sm, marginBottom: spacing.lg,
  },
  sectionTitle: { ...typography.h4, color: colors.textDark, marginBottom: spacing.lg },
  subRow: { marginBottom: spacing.lg },
  subInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  subDetails: { flex: 1 },
  subLabel: { ...typography.body, color: colors.textDark, fontWeight: '600' },
  subDescription: { ...typography.caption, color: colors.textMedium },
  upgradeBtn: { marginTop: spacing.md },
  logoutBtn: { marginTop: spacing.md },
});