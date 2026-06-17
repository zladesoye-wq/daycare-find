import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/parent/SearchScreen';
import ProviderDetailScreen from '../screens/parent/ProviderDetailScreen';
import TourBookingScreen from '../screens/parent/TourBookingScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function ParentSearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} />
      <Stack.Screen name="TourBooking" component={TourBookingScreen} />
    </Stack.Navigator>
  );
}
