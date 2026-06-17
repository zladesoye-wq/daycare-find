import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { Header, LoadingSpinner, EmptyState } from '../../components/common';
import ProviderCard from '../../components/search/ProviderCard';
import { favoritesApi, providerApi } from '../../services/api';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setError(null);
      const response = await favoritesApi.list();
      setFavorites(response.data?.favorites || response.data || []);
    } catch (err) {
      console.warn('Failed to fetch favorites:', err);
      // Mock data for development
      setFavorites([]);
      if (!loading) {
        setError('Could not load favorites.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (providerId) => {
    try {
      await favoritesApi.remove(providerId);
      setFavorites((prev) => prev.filter((f) => f.id !== providerId));
    } catch (err) {
      console.warn('Failed to remove favorite:', err);
      Alert.alert('Error', 'Could not remove favorite. Please try again.');
    }
  };

  const handleToggleFavorite = (providerId) => {
    handleRemoveFavorite(providerId);
  };

  const handleNavigateToDetail = (provider) => {
    navigation.navigate('SearchTab', {
      screen: 'ProviderDetail',
      params: { provider },
    });
  };

  const renderItem = ({ item }) => (
    <ProviderCard
      provider={item}
      onPress={() => handleNavigateToDetail(item)}
      onFavorite={handleToggleFavorite}
      isFavorite={true}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Favorites" />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Favorites" />
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            message="Tap the heart icon on any daycare provider to save them here."
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});