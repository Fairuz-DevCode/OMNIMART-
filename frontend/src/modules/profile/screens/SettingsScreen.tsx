import React from 'react';
import {
  View,
  Text,
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
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

export const SettingsScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const settingsSections = [
    {
      title: 'Akun Saya',
      items: [
        { id: 'profile', icon: 'person-outline', label: 'Profil Saya', sub: user?.name || 'f41ruzzz' },
        { id: 'address', icon: 'location-outline', label: 'Alamat Saya', sub: '3 Alamat Tersimpan' },
        { id: 'bank', icon: 'card-outline', label: 'Kartu / Rekening Bank', sub: 'Visa **** 4021' },
      ],
    },
    {
      title: 'Pengaturan',
      items: [
        { id: 'security', icon: 'shield-checkmark-outline', label: 'Akun & Keamanan', sub: 'Sangat Aman' },
        { id: 'notifications', icon: 'notifications-outline', label: 'Pengaturan Notifikasi', sub: 'Aktif' },
        { id: 'language', icon: 'globe-outline', label: 'Bahasa / Language', sub: 'Bahasa Indonesia' },
      ],
    },
    {
      title: 'Dukungan',
      items: [
        { id: 'help', icon: 'help-circle-outline', label: 'Pusat Bantuan' },
        { id: 'terms', icon: 'document-text-outline', label: 'Ketentuan Layanan & Kebijakan Privasi' },
        { id: 'about', icon: 'information-circle-outline', label: 'Tentang Aplikasi', sub: 'v1.0.0' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Akun</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {settingsSections.map((sec, secIdx) => (
          <View key={secIdx} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {sec.title}
            </Text>
            <View style={styles.card}>
              {sec.items.map((item, itemIdx) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    style={styles.itemRow}
                    activeOpacity={0.7}
                    onPress={() => Alert.alert(item.label, 'Fitur sedang dalam pengembangan')}
                  >
                    <View style={styles.itemLeft}>
                      <Ionicons name={item.icon as any} size={20} color="#555555" />
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.itemRight}>
                      {item.sub && <Text style={styles.itemSub}>{item.sub}</Text>}
                      <Ionicons name="chevron-forward" size={16} color="#BDBDBD" />
                    </View>
                  </TouchableOpacity>
                  {itemIdx < sec.items.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 14,
  },
  logoutBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
});
