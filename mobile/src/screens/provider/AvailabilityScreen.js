import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Header, EmptyState } from '../../components/common';
import { colors } from '../../theme';

export default function AvailabilityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Availability" />
      <EmptyState
        icon="grid-outline"
        title="Availability"
        message="This screen is coming soon."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
