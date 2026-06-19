import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { DM_Sans_400Regular, DM_Sans_500Medium, DM_Sans_600SemiBold, DM_Sans_700Bold } from '@expo-google-fonts/dm-sans';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'DM Sans': DM_Sans_400Regular,
          'DM Sans_400Regular': DM_Sans_400Regular,
          'DM Sans_500Medium': DM_Sans_500Medium,
          'DM Sans_600SemiBold': DM_Sans_600SemiBold,
          'DM Sans_700Bold': DM_Sans_700Bold,
        });
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.splash}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
