import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../shared/context/CartContext';
import { COLORS } from '../../shared/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.labelStyle,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'catalog') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Saya',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 56,
    paddingBottom: 6,
    paddingTop: 4,
    elevation: 8,
  },
  labelStyle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -2,
  },
  badgeStyle: {
    backgroundColor: COLORS.error,
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '700',
  },
});
