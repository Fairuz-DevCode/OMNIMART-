import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { OrdersScreen } from '../modules/orders/screens/OrdersScreen';

export default function OrdersRoute() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  return <OrdersScreen initialTab={tab || 'Dikemas'} />;
}
