import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { apiFetch } from '../../../shared/services/api';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';
import { saveOrder } from '../../../shared/services/orderStorage';

export const CartScreen = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, totalAmount, clearCart, refreshCart } = useCart();
  const { token } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  React.useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const shippingFee = cartItems.length > 0 ? 12000 : 0;
  const subtotalRupiah = Math.round(totalAmount);
  const shippingRupiah = Math.round(shippingFee);
  const grandTotalRupiah = subtotalRupiah + shippingRupiah;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    try {
      const currentItems = [...cartItems];
      const now = Date.now();

      // Save to local storage for instant tracking & offline support
      saveOrder({
        id: 'ord_' + now,
        orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        items: currentItems,
        totalAmount: grandTotalRupiah,
        subtotal: subtotalRupiah,
        shippingFee: shippingRupiah,
        paidAt: now,
        shopName: 'Toko Resmi Shopee',
      });

      if (token) {
        const orderPayload = {
          shipping_address: 'Alamat pengiriman default',
          shipping_fee: shippingRupiah,
        };

        const orderResponse = await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify(orderPayload),
        }, token);

        const orderId = orderResponse?.data?.id;
        if (orderId) {
          await apiFetch('/payments/orders/' + orderId, {
            method: 'POST',
            body: JSON.stringify({ payment_method: 'transfer' }),
          }, token);
        }
      }

      await clearCart();

      Alert.alert(
        'Pembayaran Berhasil 🎉',
        'Pesanan Anda telah dibayar dan langsung masuk ke daftar Dikemas. Total: Rp' + grandTotalRupiah.toLocaleString('id-ID'),
        [
          {
            text: 'Lacak Pesanan Saya',
            onPress: () => {
              router.replace({ pathname: '/orders', params: { tab: 'Dikemas' } });
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Checkout Gagal', err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderCartItem = ({ item }: { item: (typeof cartItems)[0] }) => (
    <View style={styles.cartCard}>
      <TouchableOpacity
        style={styles.cartItemRow}
        activeOpacity={0.8}
        onPress={() => router.push('/product/' + item.product.id)}
      >
        <Image
          source={{ uri: item.product.imageUrl }}
          style={styles.cartItemImg}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <View style={styles.titleRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.trashBtn}>
              <Ionicons name="trash-outline" size={18} color="#D0011B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemCategory}>{item.product.category}</Text>
          <Text style={styles.itemPrice}>
            Rp{Math.round(item.product.price < 1000 ? item.product.price * 1000 : item.product.price).toLocaleString('id-ID')}
          </Text>

          {/* Quantity Controls */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={14} color="#222222" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={14} color="#222222" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang Saya ({cartItems.length})</Text>
        <View style={{ width: 32 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="cart-outline" size={54} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Keranjang Belanja Kosong</Text>
          <Text style={styles.emptySub}>
            Wah, keranjang belanjamu masih kosong nih. Yuk cari produk impianmu sekarang!
          </Text>
          <TouchableOpacity
            style={styles.startShopBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.startShopText}>Mulai Belanja</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.product.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout Footer */}
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal Produk</Text>
              <Text style={styles.summaryValue}>Rp{subtotalRupiah.toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimasi Ongkir</Text>
              <Text style={styles.summaryValue}>Rp{shippingRupiah.toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>Rp{grandTotalRupiah.toLocaleString('id-ID')}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, isCheckingOut && styles.disabledBtn]}
              onPress={handleCheckout}
              activeOpacity={0.85}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.checkoutBtnText}>Memproses...</Text>
                </>
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.checkoutBtnText}>Checkout Sekarang</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  listContent: {
    padding: 14,
  },
  cartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemImg: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  trashBtn: {
    padding: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: COLORS.surface,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  startShopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  startShopText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  checkoutBtn: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
