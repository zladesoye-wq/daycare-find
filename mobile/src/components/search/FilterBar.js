import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Button } from '../common';

const AGE_GROUPS = ['infant', 'toddler', 'preschool'];

const AGE_LABELS = {
  infant: 'Infant',
  toddler: 'Toddler',
  preschool: 'Preschool',
};

export default function FilterBar({ filters, onFilterChange, onClearAll }) {
  const [activeModal, setActiveModal] = useState(null);

  const hasActiveFilters =
    filters.zip ||
    filters.ageGroup ||
    filters.radius !== 10 ||
    filters.maxPrice !== 2000 ||
    filters.subsidy;

  const chipData = [
    {
      key: 'zip',
      label: filters.zip || 'ZIP Code',
      icon: 'location-outline',
      active: !!filters.zip,
    },
    {
      key: 'distance',
      label: `${filters.radius} mi`,
      icon: 'navigate-outline',
      active: filters.radius !== 10,
    },
    {
      key: 'age',
      label: filters.ageGroup ? AGE_LABELS[filters.ageGroup] : 'Age',
      icon: 'people-outline',
      active: !!filters.ageGroup,
    },
    {
      key: 'price',
      label: filters.maxPrice < 2000 ? `$${filters.maxPrice}` : 'Price',
      icon: 'wallet-outline',
      active: filters.maxPrice < 2000,
    },
    {
      key: 'subsidy',
      label: filters.subsidy ? 'Subsidy ✓' : 'Subsidy',
      icon: 'checkmark-circle-outline',
      active: !!filters.subsidy,
    },
  ];

  const renderModal = () => {
    if (!activeModal) return null;

    const modalConfigs = {
      zip: {
        title: 'ZIP Code',
        render: () => (
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Enter ZIP Code</Text>
            <TextInput
              style={styles.zipInput}
              value={filters.zip}
              onChangeText={(v) => onFilterChange('zip', v)}
              placeholder="e.g. 10001"
              keyboardType="number-pad"
              maxLength={5}
              placeholderTextColor={colors.textLight}
            />
            <Button
              title="Apply"
              onPress={() => setActiveModal(null)}
              style={styles.modalButton}
            />
          </View>
        ),
      },
      distance: {
        title: 'Distance',
        render: () => (
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Radius: {filters.radius} miles</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={filters.radius}
              onValueChange={(v) => onFilterChange('radius', Math.round(v))}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 mi</Text>
              <Text style={styles.sliderLabel}>50 mi</Text>
            </View>
            <Button
              title="Done"
              onPress={() => setActiveModal(null)}
              style={styles.modalButton}
            />
          </View>
        ),
      },
      age: {
        title: 'Age Group',
        render: () => (
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Select age group</Text>
            {AGE_GROUPS.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.ageOption,
                  filters.ageGroup === group && styles.ageOptionActive,
                ]}
                onPress={() => {
                  onFilterChange(
                    'ageGroup',
                    filters.ageGroup === group ? null : group
                  );
                  setActiveModal(null);
                }}
              >
                <Text
                  style={[
                    styles.ageOptionText,
                    filters.ageGroup === group && styles.ageOptionTextActive,
                  ]}
                >
                  {AGE_LABELS[group]}
                </Text>
                {filters.ageGroup === group && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.accent}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ),
      },
      price: {
        title: 'Max Monthly Price',
        render: () => (
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>
              Up to ${filters.maxPrice}/month
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={500}
              maximumValue={3000}
              step={50}
              value={filters.maxPrice}
              onValueChange={(v) => onFilterChange('maxPrice', Math.round(v))}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>$500</Text>
              <Text style={styles.sliderLabel}>$3000</Text>
            </View>
            <Button
              title="Done"
              onPress={() => setActiveModal(null)}
              style={styles.modalButton}
            />
          </View>
        ),
      },
      subsidy: {
        title: 'Subsidy Accepted',
        render: () => (
          <View style={styles.modalBody}>
            <TouchableOpacity
              style={styles.subsidyToggle}
              onPress={() => {
                onFilterChange('subsidy', !filters.subsidy);
                setActiveModal(null);
              }}
            >
              <Ionicons
                name={filters.subsidy ? 'checkbox' : 'square-outline'}
                size={24}
                color={filters.subsidy ? colors.accent : colors.textMedium}
              />
              <Text style={styles.subsidyText}>
                Only show providers that accept subsidy
              </Text>
            </TouchableOpacity>
          </View>
        ),
      },
    };

    const config = modalConfigs[activeModal];
    if (!config) return null;

    return (
      <Modal
        visible={true}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SafeAreaView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{config.title}</Text>
                <TouchableOpacity onPress={() => setActiveModal(null)}>
                  <Ionicons name="close" size={24} color={colors.textDark} />
                </TouchableOpacity>
              </View>
              {config.render()}
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {chipData.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, chip.active && styles.chipActive]}
            onPress={() => setActiveModal(chip.key)}
          >
            <Ionicons
              name={chip.icon}
              size={14}
              color={chip.active ? colors.accent : colors.textMedium}
            />
            <Text
              style={[
                styles.chipText,
                chip.active && styles.chipTextActive,
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearChip} onPress={onClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chipsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.lightGray,
    gap: 4,
  },
  chipActive: {
    backgroundColor: colors.accent + '20',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.caption,
    color: colors.textMedium,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  clearChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  clearText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.textDark,
  },
  modalBody: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  modalLabel: {
    ...typography.body,
    color: colors.textDark,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  modalButton: {
    marginTop: spacing.xl,
  },
  zipInput: {
    ...typography.body,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textDark,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  sliderLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  ageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ageOptionActive: {
    backgroundColor: colors.accent + '10',
    paddingHorizontal: spacing.md,
    marginHorizontal: -spacing.md,
    borderRadius: borderRadius.md,
  },
  ageOptionText: {
    ...typography.body,
    color: colors.textDark,
  },
  ageOptionTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  subsidyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  subsidyText: {
    ...typography.body,
    color: colors.textDark,
    flex: 1,
  },
});