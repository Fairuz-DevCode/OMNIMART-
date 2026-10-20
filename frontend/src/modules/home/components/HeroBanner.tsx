import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

interface HeroBannerProps {
  onPressBanner?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onPressBanner }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bannerWrapper}
        activeOpacity={0.9}
        onPress={onPressBanner}
      >
        {/* Main Banner Left Card */}
        <View style={styles.leftBanner}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
            }}
            style={styles.bannerImg}
            resizeMode="cover"
          />

          <View style={styles.bannerContent}>
            <View style={styles.brandHeader}>
              <Text style={styles.brandName}>ADVAN</Text>
              <Text style={styles.brandTag}>Super Brand Day</Text>
            </View>

            <View style={styles.discountRow}>
              <Text style={styles.discountLabel}>DISKON S.D</Text>
              <Text style={styles.discountValue}>80%</Text>
            </View>

            <View style={styles.voucherBadge}>
              <Text style={styles.voucherLabel}>VOUCHER S.D</Text>
              <Text style={styles.voucherValue}>100RB</Text>
            </View>
          </View>
        </View>

        {/* Banner Right Live Card */}
        <View style={styles.rightBanner}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop',
            }}
            style={styles.bannerImg}
            resizeMode="cover"
          />
          <View style={styles.rightContent}>
            <Text style={styles.liveTitle}>EKSTRA VOUCHER S.D 150RB</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE NOW</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Shopee Style Info Strip */}
      <View style={styles.infoStrip}>
        <View style={styles.infoLeft}>
          <Text style={styles.spayLaterText}>SPayLater</Text>
          <Text style={styles.infoDesc}>Beli Sekarang Bayar Nanti 0%</Text>
        </View>
        <Text style={styles.infoAction}>Aktifkan &gt;</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  bannerWrapper: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    height: 126,
    backgroundColor: COLORS.primary,
  },
  leftBanner: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    padding: 12,
    overflow: 'hidden',
  },
  bannerImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
  },
  bannerContent: {
    zIndex: 10,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textLight,
    letterSpacing: 2,
    marginRight: 8,
  },
  brandTag: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginRight: 6,
  },
  discountValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFE600',
  },
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  voucherLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginRight: 4,
  },
  voucherValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFE600',
  },
  rightBanner: {
    width: 110,
    position: 'relative',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#D73211',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
  },
  rightContent: {
    zIndex: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  liveTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textLight,
    lineHeight: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D0011B',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textLight,
    marginRight: 4,
  },
  liveText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spayLaterText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 6,
  },
  infoDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  infoAction: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
