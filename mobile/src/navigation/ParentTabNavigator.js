import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

import SearchScreen from '../screens/parent/SearchScreen';
import FavoritesScreen from '../screens/parent/FavoritesScreen';
import BookingsScreen from '../screens/parent/BookingsScreen';
import ProfileScreen from '../screens/parent/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Search: { focused: 'search', unfocused: 'search-outline' },
  Favorites: { focused: 'heart', unfocused: 'heart-outline' },
  Bookings: { focused: 'calendar', unfocused: 'calendar-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export default function ParentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          const iconColor = focused ? colors.accent : colors.white;
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.white,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: 'transparent',
          paddingBottom: spacing.sm,
          paddingTop: spacing.xs,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}