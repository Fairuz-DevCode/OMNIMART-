import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  badge?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'pulsa',
    name: 'Pulsa & Tagihan',
    icon: 'phone-portrait-outline',
    color: '#00BFA5',
    bgColor: '#E0F2F1',
  },
  {
    id: 'food',
    name: 'Food & Snack',
    icon: 'fast-food-outline',
    color: '#EE4D2D',
    bgColor: '#FFEBEE',
    badge: 'PROMO',
  },
  {
    id: 'vip',
    name: 'VIP Member+',
    icon: 'ribbon-outline',
    color: '#FFB800',
    bgColor: '#FFF8E1',
  },
  {
    id: 'voucher',
    name: 'Bagi - Bagi Voucher',
    icon: 'gift-outline',
    color: '#E91E63',
    bgColor: '#FCE4EC',
  },
  {
    id: 'instant',
    name: 'Belanja Instant',
    icon: 'bicycle-outline',
    color: '#00BCD4',
    bgColor: '#E0F7FA',
  },
];

interface CategoryGridProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoryChips: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.itemContainer, isSelected && styles.itemSelected]}
              activeOpacity={0.7}
              onPress={() => onSelectCategory && onSelectCategory(cat.id)}
            >
              {/* Icon Container */}
              <View style={styles.iconWrapper}>
                <View style={[styles.iconBox, { backgroundColor: cat.bgColor }]}>
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>

                {cat.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cat.badge}</Text>
                  </View>
                )}
              </View>

              <Text
                style={[styles.nameText, isSelected && styles.nameSelected]}
                numberOfLines={2}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  itemContainer: {
    alignItems: 'center',
    width: 74,
    marginHorizontal: 4,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  itemSelected: {
    backgroundColor: '#FFF0ED',
  },
  iconWrapper: {
    position: 'relative',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  nameSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
