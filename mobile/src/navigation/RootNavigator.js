import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import ParentTabNavigator from './ParentTabNavigator';
import ProviderRootStack from './ProviderRootStack';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { colors } from '../theme';

export default function RootNavigator() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  const getMainNavigator = () => {
    switch (role) {
      case 'parent':
        return <ParentTabNavigator />;
      case 'provider':
        return <ProviderRootStack />;
      case 'admin':
        // Admin could use a different navigator
        return <ParentTabNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.accent,
          background: colors.background,
          card: colors.white,
          text: colors.textDark,
          border: colors.border,
          notification: colors.accent,
        },
        fonts: {
          regular: { fontFamily: 'DM Sans', fontWeight: '400' },
          medium: { fontFamily: 'DM Sans', fontWeight: '500' },
          bold: { fontFamily: 'DM Sans', fontWeight: '700' },
          heavy: { fontFamily: 'DM Sans', fontWeight: '800' },
        },
      }}
    >
      {isAuthenticated ? getMainNavigator() : <AuthNavigator />}
    </NavigationContainer>
  );
}