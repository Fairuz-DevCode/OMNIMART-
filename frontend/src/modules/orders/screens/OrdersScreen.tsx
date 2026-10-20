import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Alert,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MOCK_PRODUCTS } from '../../home/data/mockHomeData';
import { ProductCard } from '../../home/components/ProductCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';
import { useAuth } from '../../../shared/context/AuthContext';
import { apiFetch } from '../../../shared/services/api';
import { getStoredOrders, getOrderStatus, markOrderAsCompleted, LocalOrderItem } from '../../../shared/services/orderStorage';

const TABS = [
  'Semua',
  'Belum Bayar',
  'Dikemas',
  'Dikirim',
  'Selesai',
  'Pengembalian',
  'Dibatalkan',
];

interface OrdersScreenProps {
  initialTab?: string;
}

interface UnifiedOrder {
  id: string;
  orderNumber: string;
  shopName: string;
  isStar?: boolean;
  isMall?: boolean;
  status: 'Belum Bayar' | 'Dikemas' | 'Dikirim' | 'Selesai' | 'Dibatalkan' | 'Pengembalian';
  title: string;
  variant?: string;
  qty: number;
  price: string;
  oldPrice?: string;
  totalPrice: string;
  image: string;
  coinNotice?: string;
  productId?: string;
  backendId?: number;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ initialTab = 'Dikemas' }) => {
  const router = useRouter();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    TABS.includes(initialTab) ? initialTab : 'Dikemas'
  );
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync tab change from props if navigated dynamically
  useEffect(() => {
    if (initialTab && TABS.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadOrders = useCallback(async () => {
    setLoading(true);

    // 1. Load local orders with silent cooldown & manual completion check
    const localOrders: LocalOrderItem[] = getStoredOrders();
    const formattedLocal: UnifiedOrder[] = localOrders.map((ord) => {
      const currentStatus = getOrderStatus(ord.paidAt, ord.completedAt);
      const firstItem = ord.items[0];

      return {
        id: ord.id,
        orderNumber: ord.orderNumber,
        shopName: ord.shopName || 'Shopee Mall Official',
        isStar: true,
        isMall: true,
        status: currentStatus,
        title: firstItem ? firstItem.product.name : 'Produk Pesanan',
        variant: firstItem?.selectedColor || firstItem?.selectedSize || 'Standar',
        qty: firstItem ? firstItem.quantity : 1,
        price: 'Rp' + Math.round(firstItem?.product.price || 0).toLocaleString('id-ID'),
        totalPrice: 'Rp' + Math.round(ord.totalAmount).toLocaleString('id-ID'),
        image: firstItem?.product.imageUrl || 'https://images.unsplash.com/photo-1506521782023-6058fda68c83?q=80&w=500&auto=format&fit=crop',
        coinNotice: 'Nilai pesanan untuk dapatkan ekstra koin cashback',
        productId: firstItem?.product.id,
      };
    });

    // 2. Fetch backend orders if logged in
    let backendFormatted: UnifiedOrder[] = [];
    if (token) {
      try {
        const res = await apiFetch('/orders', { method: 'GET' }, token);
        if (res && res.data && Array.isArray(res.data)) {
          backendFormatted = res.data.map((item: any) => {
            const firstItem = item.items && item.items[0] ? item.items[0] : null;
            return {
              id: String(item.id),
              backendId: item.id,
              orderNumber: item.order_number,
              shopName: 'Shopee Official Store',
              isStar: true,
              isMall: true,
              status: item.status_label || 'Dikemas',
              title: firstItem ? firstItem.product_name : 'Produk',
              variant: 'Standar',
              qty: firstItem ? firstItem.quantity : 1,
              price: 'Rp' + Math.round(firstItem ? firstItem.unit_price : item.total_amount).toLocaleString('id-ID'),
              totalPrice: 'Rp' + Math.round(item.total_amount).toLocaleString('id-ID'),
              image: firstItem?.product_image || 'https://images.unsplash.com/photo-1506521782023-6058fda68c83?q=80&w=500&auto=format&fit=crop',
              coinNotice: 'Nilai pesanan untuk dapatkan koin',
              productId: firstItem ? String(firstItem.product_id) : undefined,
            };
          });
        }
      } catch (e) {
        console.log('Error fetching backend orders:', e);
      }
    }

    // Combine and deduplicate orders by orderNumber/id
    const combined = [...formattedLocal, ...backendFormatted];
    const uniqueOrders: UnifiedOrder[] = [];
    const seen = new Set<string>();

    for (const o of combined) {
      if (!seen.has(o.orderNumber || o.id)) {
        seen.add(o.orderNumber || o.id);
        uniqueOrders.push(o);
      }
    }

    setOrders(uniqueOrders);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleConfirmReceived = (order: UnifiedOrder) => {
    Alert.alert(
      'Konfirmasi Pesanan Diterima',
      'Apakah Anda yakin telah menerima pesanan ini dengan baik? Pesanan akan dipindahkan ke tab Selesai.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Diterima',
          onPress: async () => {
            // Update in local storage
            markOrderAsCompleted(order.id);
            markOrderAsCompleted(order.orderNumber);

            // Update in backend database if backend order
            if (token && order.backendId) {
              try {
                await apiFetch(`/orders/${order.backendId}/complete`, { method: 'POST' }, token);
              } catch (e) {
                console.log('Error completing order in backend:', e);
              }
            }

            // Immediately change tab to 'Selesai' and refresh
            setActiveTab('Selesai');
            loadOrders();

            Alert.alert(
              'Pesanan Selesai 🎉',
              'Terima kasih telah berbelanja! Pesanan Anda telah selesai. Silakan berikan penilaian produk.'
            );
          },
        },
      ]
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'Semua') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat pesanan...</Text>
        </View>
      );
    }

    if (filteredOrders.length > 0) {
      return (
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {filteredOrders.map((item) => (
            <View key={item.id} style={styles.orderCard}>
              {/* Shop Header */}
              <View style={styles.shopHeader}>
                <View style={styles.shopLeft}>
                  {item.isStar && (
                    <View style={styles.starBadge}>
                      <Text style={styles.starBadgeText}>Star+</Text>
                    </View>
                  )}
                  {item.isMall && (
                    <View style={styles.mallBadge}>
                      <Text style={styles.mallBadgeText}>Mall | ORI</Text>
                    </View>
                  )}
                  <Text style={styles.shopName}>{item.shopName}</Text>
                </View>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>

              {/* Product Info */}
              <TouchableOpacity
                style={styles.productRow}
                activeOpacity={0.8}
                onPress={() => item.productId && router.push('/product/' + item.productId)}
              >
                <Image source={{ uri: item.image }} style={styles.productImg} />
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.productVariant}>{item.variant} x{item.qty}</Text>

                  <View style={styles.priceRow}>
                    {item.oldPrice && <Text style={styles.oldPriceText}>{item.oldPrice}</Text>}
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Total {item.qty} produk: <Text style={styles.totalValue}>{item.totalPrice}</Text>
                </Text>
              </View>

              {item.coinNotice && (
                <View style={styles.coinBanner}>
                  <Ionicons name="sparkles" size={14} color="#FFB800" />
                  <Text style={styles.coinText} numberOfLines={1}>
                    {item.coinNotice}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#9E9E9E" />
                </View>
              )}

              {/* Action Buttons based on status */}
              <View style={styles.actionsRow}>
                {item.status === 'Dikemas' && (
                  <>
                    <TouchableOpacity
                      style={styles.secondaryBtn}
                      onPress={() => Alert.alert('Hubungi Penjual', 'Membuka chat dengan penjual')}
                    >
                      <Text style={styles.secondaryBtnText}>Hubungi Penjual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={() => Alert.alert('Rincian Pesanan', 'Pesanan sedang dipersiapkan dan dikemas oleh penjual.')}
                    >
                      <Text style={styles.primaryBtnText}>Rincian Pesanan</Text>
                    </TouchableOpacity>
                  </>
                )}

                {item.status === 'Dikirim' && (
                  <>
                    <TouchableOpacity
                      style={styles.secondaryBtn}
                      onPress={() => Alert.alert('Lacak Ekspedisi', 'Kurir sedang membawa paket menuju alamat pengiriman Anda.')}
                    >
                      <Text style={styles.secondaryBtnText}>Lacak Paket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={() => handleConfirmReceived(item)}
                    >
                      <Text style={styles.primaryBtnText}>Pesanan Diterima</Text>
                    </TouchableOpacity>
                  </>
                )}

                {item.status === 'Selesai' && (
                  <>
                    <TouchableOpacity
                      style={styles.secondaryBtn}
                      onPress={() => Alert.alert('Beli Lagi', 'Menambahkan produk ke keranjang')}
                    >
                      <Text style={styles.secondaryBtnText}>Beli Lagi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={() => Alert.alert('Beri Penilaian', 'Terima kasih atas ulasan bintang 5 Anda!')}
                    >
                      <Text style={styles.primaryBtnText}>Nilai</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={MOCK_PRODUCTS}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="clipboard-outline" size={42} color="#00BFA5" />
            </View>
            <Text style={styles.emptyText}>Belum ada pesanan di tab {activeTab}</Text>

            {/* Recommendation Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>
                Kamu Mungkin Juga Suka
              </Text>
              <View style={styles.dividerLine} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push('/product/' + item.id)}
          />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pesanan Saya</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => loadOrders()}>
            <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert('Pesan', 'Membuka chat')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.primary} />
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Tabs Bar */}
      <View style={styles.tabsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {renderContent()}
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
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerBtn: {
    padding: 4,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 7.5,
    minWidth: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabsBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabsContent: {
    paddingHorizontal: 4,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scrollList: {
    padding: 10,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  shopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 6,
  },
  starBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mallBadge: {
    backgroundColor: '#D0011B',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 6,
  },
  mallBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shopName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F5F5F5',
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  productVariant: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    alignSelf: 'flex-end',
  },
  oldPriceText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontWeight: '900',
    color: COLORS.primary,
  },
  coinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEA',
    padding: 8,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FFEBAA',
  },
  coinText: {
    flex: 1,
    fontSize: 10,
    color: '#8C6200',
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  secondaryBtnText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
