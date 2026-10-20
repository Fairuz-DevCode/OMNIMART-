import React from 'react';
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
import { useAuth } from '../../../shared/context/AuthContext';
import { useCart } from '../../../shared/context/CartContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

export const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { totalItemsCount } = useCart();

  const cartBadgeCount = totalItemsCount;
  const chatBadgeCount = 3;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Red Header Card */}
        <View style={styles.topHeader}>
          {/* Action Icons Row: Gear, Cart, Message */}
          <View style={styles.headerIconsRow}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/cart')}>
              <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
              {totalItemsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItemsCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} onPress={() => Alert.alert('Pesan', 'Membuka pesan')}>
              <Ionicons name="chatbubble-ellipses-outline" size={23} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{chatBadgeCount}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* User Profile Details Row */}
          <View style={styles.userRow}>
            <Image
              source={{
                uri:
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
              }}
              style={styles.avatar}
            />

            <View style={styles.userInfo}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{user?.name || 'f41ruzzz'}</Text>
                <TouchableOpacity style={styles.silverBadge} activeOpacity={0.8}>
                  <Text style={styles.silverBadgeText}>Silver ›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.followRow}>
                <Text style={styles.followText}>0 Mengikuti</Text>
                <Text style={styles.followText}>0 Pengikut</Text>
              </View>
            </View>
          </View>

          {/* VIP+ Extra Discount Banner Card */}
          <TouchableOpacity
            style={styles.vipBanner}
            activeOpacity={0.9}
            onPress={() => Alert.alert('VIP Member', 'Diskon 20% otomatis digunakan saat checkout!')}
          >
            <View style={styles.vipTag}>
              <Text style={styles.vipTagText}>VIP+</Text>
            </View>
            <Text style={styles.vipDesc} numberOfLines={1}>
              Dapatkan Extra Diskon 20% Setiap Hari
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#B78103" />
          </TouchableOpacity>
        </View>

        {/* Pesanan Saya Section */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Pesanan Saya</Text>
            <TouchableOpacity
              style={styles.orderHistoryBtn}
              onPress={() => router.push({ pathname: '/orders', params: { tab: 'Semua' } })}
            >
              <Text style={styles.orderHistoryText}>Lihat Riwayat Pesanan</Text>
              <Ionicons name="chevron-forward" size={14} color="#757575" />
            </TouchableOpacity>
          </View>

          {/* 4 Order Quick Action Buttons */}
          <View style={styles.orderActionsRow}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push({ pathname: '/orders', params: { tab: 'Belum Bayar' } })}
            >
              <Ionicons name="wallet-outline" size={28} color="#333333" />
              <Text style={styles.actionText}>Belum Bayar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push({ pathname: '/orders', params: { tab: 'Dikemas' } })}
            >
              <Ionicons name="cube-outline" size={28} color="#333333" />
              <Text style={styles.actionText}>Dikemas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push({ pathname: '/orders', params: { tab: 'Dikirim' } })}
            >
              <Ionicons name="bus-outline" size={28} color="#333333" />
              <Text style={styles.actionText}>Dikirim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push({ pathname: '/orders', params: { tab: 'Selesai' } })}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons name="star-outline" size={28} color="#333333" />
                <View style={styles.reviewBadge}>
                  <Text style={styles.reviewBadgeText}>2</Text>
                </View>
              </View>
              <Text style={styles.actionText}>Beri Penilaian</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra Services List Card */}
        <View style={styles.servicesCard}>
          <TouchableOpacity style={styles.serviceRow} activeOpacity={0.7}>
            <View style={styles.serviceLeft}>
              <Ionicons name="phone-portrait-outline" size={22} color="#00BFA5" />
              <Text style={styles.serviceLabel}>Pulsa, Tagihan & Tiket</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePromo}>Diskon Rp125RB</Text>
              <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.serviceRow} activeOpacity={0.7}>
            <View style={styles.serviceLeft}>
              <Ionicons name="fast-food-outline" size={22} color={COLORS.primary} />
              <Text style={styles.serviceLabel}>Food & Snack</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePromo}>Gratis Ongkir</Text>
              <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  topHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  headerIconsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerIconBtn: {
    position: 'relative',
    padding: 4,
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
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginRight: 8,
  },
  silverBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  silverBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  followText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginRight: 12,
  },
  vipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEAA7',
    borderRadius: BORDER_RADIUS.sm,
    padding: 10,
  },
  vipTag: {
    backgroundColor: '#B78103',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  vipTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  vipDesc: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8C6200',
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  orderHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderHistoryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  orderActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 4,
  },
  reviewBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  reviewBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  servicesCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  serviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePromo: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 14,
  },
});
