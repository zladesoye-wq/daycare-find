import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header, EmptyState } from '../../components/common';
import { colors, spacing } from '../../theme';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Favorites" />
      <EmptyState
        icon="search-outline"
        title="Favorites"
        message="This screen is coming soon."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
