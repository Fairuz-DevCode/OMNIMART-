import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../../shared/context/CartContext';
import { MOCK_PRODUCTS } from '../../home/data/mockHomeData';
import { Product } from '../../../types';
import { apiFetch } from '../../../shared/services/api';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

interface ProductDetailScreenProps {
  productId?: string;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ productId }) => {
  const router = useRouter();
  const { addToCart, totalItemsCount } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [product, setProduct] = useState<Product>(() => {
    return (
      MOCK_PRODUCTS.find((p) => p.id === productId || p.id === String(productId)?.replace('prod_', '')) ||
      MOCK_PRODUCTS[0]
    );
  });

  React.useEffect(() => {
    if (!productId) return;
    const cleanId = String(productId).replace('prod_', '');
    apiFetch('/products/' + cleanId)
      .then((res) => {
        if (res && res.data) {
          setProduct({
            ...res.data,
            id: String(res.data.id),
            price: Number(res.data.price),
            oldPrice: res.data.oldPrice ? Number(res.data.oldPrice) : (res.data.old_price ? Number(res.data.old_price) : undefined),
          });
        }
      })
      .catch(() => {});
  }, [productId]);

  const rawPrice = Number(product.price) || 0;
  const currentPriceNum = rawPrice < 1000 ? rawPrice * 1000 : rawPrice;
  const rawOldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const oldPriceNum = rawOldPrice ? (rawOldPrice < 1000 ? rawOldPrice * 1000 : rawOldPrice) : null;

  const formattedPrice = 'Rp' + Math.round(currentPriceNum).toLocaleString('id-ID');
  const formattedOldPrice = oldPriceNum
    ? 'Rp' + Math.round(oldPriceNum).toLocaleString('id-ID')
    : null;
  const discountPercent = oldPriceNum && oldPriceNum > currentPriceNum
    ? Math.round(((oldPriceNum - currentPriceNum) / oldPriceNum) * 100)
    : 35;

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    Alert.alert('Sukses', 'Produk ditambahkan');
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQuantity);
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Produk</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert('Bagikan', 'Link produk tersalin!')}>
            <Ionicons name="share-social-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={22} color="#FFFFFF" />
            {totalItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImg} resizeMode="cover" />
          <View style={styles.mallTag}>
            <Text style={styles.mallTagText}>Mall | ORI</Text>
          </View>
        </View>

        {/* Pricing & Tag Banner */}
        <View style={styles.sectionCard}>
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formattedPrice}</Text>
            {formattedOldPrice && (
              <Text style={styles.oldPrice}>{formattedOldPrice}</Text>
            )}
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>-{discountPercent}%</Text>
            </View>
          </View>
        </View>

        {/* Product Title Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.productTitle}>{product.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingVal}>{product.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.metaText}>{product.reviewsCount} Penilaian</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.metaText}>10RB+ Terjual</Text>
          </View>
        </View>

        {/* Protection & Voucher Banner */}
        <View style={[styles.sectionCard, styles.rowBetween]}>
          <Ionicons name="shield-checkmark" size={20} color="#00BFA5" />
          <View style={styles.protectInfo}>
            <Text style={styles.protectTitle}>Perlindungan Kerusakan Produk</Text>
            <Text style={styles.protectSub}>Dapatkan perlindungan instan untuk pesanan Anda</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#757575" />
        </View>

        {/* Shipping Option */}
        <View style={styles.sectionCard}>
          <View style={styles.shippingRow}>
            <Ionicons name="car-outline" size={18} color={COLORS.primary} />
            <View style={styles.shippingInfo}>
              <Text style={styles.shippingTitle}>Ongkos Kirim Gratis</Text>
              <Text style={styles.shippingSub}>Pengiriman Cepat (Estimasi 1-2 Hari Kerja)</Text>
            </View>
          </View>
        </View>

        {/* Specifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Spesifikasi Produk</Text>
          <View style={[styles.specRow, styles.specBorder]}>
            <Text style={styles.specLabel}>Merek</Text>
            <Text style={styles.specValue}>TrailTop Official</Text>
          </View>
          <View style={[styles.specRow, styles.specBorder]}>
            <Text style={styles.specLabel}>Kapasitas</Text>
            <Text style={styles.specValue}>Max 150 KG</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Bahan</Text>
            <Text style={styles.specValue}>Pipa Baja Berkualitas Tinggi & Oxford 600D</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Deskripsi Produk</Text>
          <Text style={styles.descText}>
            {product.description ||
              'Kursi lipat camping outdoor portable dengan kualitas material baja tebal anti karat, mudah dilipat dan praktis dibawa ke mana saja saat berkemah, piknik, mau pun memancing.'}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatAction}
          onPress={() => Alert.alert('Chat', 'Membuka chat penjual')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} />
          <Text style={styles.chatActionText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="cart-outline" size={18} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.addToCartText}>+ Keranjang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          activeOpacity={0.85}
        >
          <Text style={styles.buyNowText}>Beli Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 48,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  headerBtn: {
    padding: 4,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  mallTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#D0011B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mallTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountTag: {
    backgroundColor: '#FFE600',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  discountTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  separator: {
    color: '#E0E0E0',
    marginHorizontal: 6,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protectInfo: {
    flex: 1,
    marginLeft: 10,
  },
  protectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  protectSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingInfo: {
    marginLeft: 10,
  },
  shippingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  shippingSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  specBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  specLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  specValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  descText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 30,
  },
  chatAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  chatActionText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
});
