import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryChips } from '../../home/components/CategoryChips';
import { ProductCard } from '../../home/components/ProductCard';
import { MOCK_PRODUCTS } from '../../home/data/mockHomeData';
import { apiFetch } from '../../../shared/services/api';
import { Product } from '../../../types';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../../shared/theme/colors';

export const CatalogScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await apiFetch('/products');
      if (res && res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (e) {}
  };

  const filteredProducts = products.filter(
    (p) =>
      selectedCategory === 'all' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Catalog</Text>
        <Text style={styles.headerSubtitle}>Discover our complete inventory</Text>
      </View>

      <View style={styles.chipsWrapper}>
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push('/product/' + item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chipsWrapper: {
    marginVertical: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
});
