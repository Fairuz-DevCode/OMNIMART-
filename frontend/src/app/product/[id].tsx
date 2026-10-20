import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProductDetailScreen } from '../../modules/product/screens/ProductDetailScreen';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProductDetailScreen productId={id} />;
}
