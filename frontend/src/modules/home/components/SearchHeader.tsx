import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../shared/context/CartContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onCartPress?: () => void;
  onMessagePress?: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCartPress,
  onMessagePress,
}) => {
  const { totalItemsCount } = useCart();
  const cartBadge = totalItemsCount;
  const messageBadge = 3;

  return (
    <View style={styles.header}>
      <View style={styles.searchRow}>
        {/* Search Input Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kursi Lipat Camping"
            placeholderTextColor={COLORS.primary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          <TouchableOpacity activeOpacity={0.7} style={styles.cameraIcon}>
            <Ionicons name="camera-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons: Cart & Message */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onCartPress} activeOpacity={0.8}>
            <Ionicons name="cart-outline" size={24} color={COLORS.textLight} />
            {totalItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={onMessagePress} activeOpacity={0.8}>
            <Ionicons name="chatbubble-ellipses-outline" size={23} color={COLORS.textLight} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{messageBadge}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm + 2,
    paddingBottom: SPACING.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm + 2,
    height: 38,
    marginRight: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    paddingVertical: 0,
  },
  cameraIcon: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: 6,
    marginLeft: 4,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.surface,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
});
