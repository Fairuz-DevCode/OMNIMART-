import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../../types';
import { useCart } from '../../../shared/context/CartContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useCart();
  const wishlisted = isWishlisted(product.id);

  const formatRupiah = (val: number) => {
    if (val < 1000) return 'Rp ' + (val * 1000);
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Product Image & Badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />

        {/* Discount Badge */}
        {product.oldPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </Text>
          </View>
        )}

        {/* Mall Tag */}
        <View style={styles.mallTag}>
          <Text style={styles.mallText}>Mall</Text>
        </View>

        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={wishlisted ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Promotion Badge */}
          {product.badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
        </View>

        {/* Pricing & Add to Cart Action */}
        <View style={styles.footerContainer}>
          <View style={styles.priceRow}>
            <View style={styles.priceWrapper}>
              <Text style={styles.priceText}>
                {formatRupiah(Math.round(product.price))}
              </Text>
              {product.oldPrice && (
                <Text style={styles.oldPriceText}>
                  {formatRupiah(Math.round(product.oldPrice))}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => addToCart(product)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          {/* Rating & Sold count */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color="#FFB800" />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)}
            </Text>
            <Text style={styles.soldText}>
              | Terjual {product.reviewsCount > 999 ? '1rb+' : product.reviewsCount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flex: 1,
    maxWidth: '49%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFE600',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
  },
  mallTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#D0011B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  mallText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  wishlistBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 8,
    justifyContent: 'space-between',
    flex: 1,
  },
  productName: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
    fontWeight: 'normal',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footerContainer: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  priceWrapper: {
    flex: 1,
    marginRight: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  oldPriceText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  cartBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  ratingText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    marginLeft: 2,
    fontWeight: '600',
  },
  soldText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
});
