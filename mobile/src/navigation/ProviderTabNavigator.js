import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

import DashboardScreen from '../screens/provider/DashboardScreen';
import AvailabilityScreen from '../screens/provider/AvailabilityScreen';
import BookingsScreen from '../screens/provider/BookingsScreen';
import ProfileScreen from '../screens/provider/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: { focused: 'grid', unfocused: 'grid-outline' },
  Availability: { focused: 'time', unfocused: 'time-outline' },
  Bookings: { focused: 'calendar', unfocused: 'calendar-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export default function ProviderTabNavigator() {
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Availability" component={AvailabilityScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}