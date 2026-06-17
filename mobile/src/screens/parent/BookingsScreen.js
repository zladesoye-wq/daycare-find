import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header, EmptyState } from '../../components/common';
import { colors, spacing } from '../../theme';

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Bookings" />
      <EmptyState
        icon="search-outline"
        title="Bookings"
        message="This screen is coming soon."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
