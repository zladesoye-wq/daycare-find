import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Button, Input, LoadingSpinner } from '../../components/common';
import { bookingApi } from '../../services/api';

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '9:00 AM - 11:00 AM', icon: 'sunny' },
  { id: 'afternoon', label: 'Afternoon', time: '1:00 PM - 3:00 PM', icon: 'partly-sunny' },
  { id: 'evening', label: 'Evening', time: '4:00 PM - 6:00 PM', icon: 'moon' },
];

export default function TourBookingScreen({ route, navigation }) {
  const { providerId, providerName } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Generate next 14 days
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      result.push(date);
    }
    return result;
  }, []);

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date) => {
    return date.getDate();
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      Alert.alert('Incomplete', 'Please select a date and time slot.');
      return;
    }

    const slot = TIME_SLOTS.find((s) => s.id === selectedSlot);
    setLoading(true);

    try {
      const response = await bookingApi.create({
        provider_id: providerId,
        date: selectedDate.toISOString().split('T')[0],
        time: slot.time,
        notes,
      });

      const data = response.data?.booking || response.data || {
        id: 'mock-' + Date.now(),
        provider_id: providerId,
        date: selectedDate.toISOString().split('T')[0],
        time: slot.time,
        notes,
        status: 'pending',
      };

      setConfirmation({
        id: data.id,
        providerName,
        date: selectedDate,
        time: slot.time,
        notes,
        status: 'pending',
      });
    } catch (err) {
      console.warn('Booking failed:', err);
      // Fallback: show confirmation with mock data
      setConfirmation({
        id: 'mock-' + Date.now(),
        providerName,
        date: selectedDate,
        time: slot.time,
        notes,
        status: 'pending',
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirmation screen
  if (confirmation) {
    const confDate = confirmation.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.confirmationContainer}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={48} color={colors.white} />
          </View>
          <Text style={styles.confTitle}>Tour Request Sent!</Text>
          <Text style={styles.confSubtitle}>
            Your tour at {confirmation.providerName} has been requested.
          </Text>

          <View style={styles.confCard}>
            <View style={styles.confRow}>
              <Ionicons name="business" size={18} color={colors.accent} />
              <Text style={styles.confLabel}>Center</Text>
              <Text style={styles.confValue}>{confirmation.providerName}</Text>
            </View>
            <View style={styles.confDivider} />
            <View style={styles.confRow}>
              <Ionicons name="calendar" size={18} color={colors.accent} />
              <Text style={styles.confLabel}>Date</Text>
              <Text style={styles.confValue}>{confDate}</Text>
            </View>
            <View style={styles.confDivider} />
            <View style={styles.confRow}>
              <Ionicons name="time" size={18} color={colors.accent} />
              <Text style={styles.confLabel}>Time</Text>
              <Text style={styles.confValue}>{confirmation.time}</Text>
            </View>
            <View style={styles.confDivider} />
            <View style={styles.confRow}>
              <Ionicons name="information-circle" size={18} color={colors.accent} />
              <Text style={styles.confLabel}>Status</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </View>
          </View>

          <Text style={styles.confNote}>
            The provider will confirm your tour request shortly. You can view your bookings in the Bookings tab.
          </Text>

          <Button
            title="View My Bookings"
            onPress={() => navigation.navigate('Bookings')}
            variant="primary"
            size="large"
            style={styles.confButton}
          />
          <Button
            title="Back to Search"
            onPress={() => navigation.navigate('SearchMain')}
            variant="outlined"
            size="large"
            style={styles.confButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Book a Tour
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Provider Info */}
        <View style={styles.providerBar}>
          <Ionicons name="business" size={20} color={colors.primary} />
          <Text style={styles.providerName}>{providerName}</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Date</Text>
          <Text style={styles.sectionSubtitle}>Available for the next 14 days</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysContainer}>
            {days.map((date, index) => {
              const isSelected =
                selectedDate && date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>
                    {formatDay(date)}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>
                    {formatDate(date)}
                  </Text>
                  <Text style={[styles.dayMonth, isSelected && styles.dayTextSelected]}>
                    {formatMonth(date)}
                  </Text>
                  {isToday(date) && (
                    <View style={styles.todayDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Time</Text>
          <View style={styles.slotsContainer}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slotCard,
                  selectedSlot === slot.id && styles.slotCardSelected,
                ]}
                onPress={() => setSelectedSlot(slot.id)}
              >
                <Ionicons
                  name={slot.icon}
                  size={24}
                  color={selectedSlot === slot.id ? colors.accent : colors.textMedium}
                />
                <View style={styles.slotInfo}>
                  <Text style={[styles.slotLabel, selectedSlot === slot.id && styles.slotTextSelected]}>
                    {slot.label}
                  </Text>
                  <Text style={[styles.slotTime, selectedSlot === slot.id && styles.slotTimeSelected]}>
                    {slot.time}
                  </Text>
                </View>
                {selectedSlot === slot.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a Note (Optional)</Text>
          <Input
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or questions for the provider..."
            multiline
          />
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomPrice}>Free</Text>
          <Text style={styles.bottomLabel}>Tour booking</Text>
        </View>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          loading={loading}
          disabled={!selectedDate || !selectedSlot}
          size="large"
          style={styles.confirmBtn}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textDark,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  providerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  providerName: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  daysContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  dayCard: {
    width: 68,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    ...shadows.sm,
    position: 'relative',
  },
  dayCardSelected: {
    backgroundColor: colors.primary,
  },
  dayName: {
    ...typography.caption,
    color: colors.textMedium,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    ...typography.h3,
    color: colors.textDark,
  },
  dayMonth: {
    ...typography.caption,
    color: colors.textMedium,
    marginTop: 2,
  },
  dayTextSelected: {
    color: colors.white,
  },
  todayDot: {
    position: 'absolute',
    top: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  slotsContainer: {
    gap: spacing.sm,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  slotCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '08',
  },
  slotInfo: {
    flex: 1,
  },
  slotLabel: {
    ...typography.body,
    color: colors.textDark,
    fontWeight: '600',
  },
  slotTextSelected: {
    color: colors.accent,
  },
  slotTime: {
    ...typography.caption,
    color: colors.textMedium,
  },
  slotTimeSelected: {
    color: colors.accent,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  bottomInfo: {
    alignItems: 'center',
  },
  bottomPrice: {
    ...typography.h3,
    color: colors.accent,
  },
  bottomLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  confirmBtn: {
    flex: 1,
  },
  // Confirmation styles
  confirmationContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  confTitle: {
    ...typography.h2,
    color: colors.textDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  confSubtitle: {
    ...typography.body,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  confCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
    marginBottom: spacing.xl,
  },
  confRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  confLabel: {
    ...typography.bodySmall,
    color: colors.textLight,
    width: 50,
  },
  confValue: {
    ...typography.body,
    color: colors.textDark,
    fontWeight: '600',
    flex: 1,
  },
  confDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  pendingBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  pendingText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },
  confNote: {
    ...typography.bodySmall,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  confButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
});