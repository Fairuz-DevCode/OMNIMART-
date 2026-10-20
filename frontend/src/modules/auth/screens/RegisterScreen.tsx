import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../shared/context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../shared/theme/colors';

export const RegisterScreen = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nama lengkap tidak boleh kosong';
    if (!email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!email.includes('@')) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!password) {
      newErrors.password = 'Kata sandi tidak boleh kosong';
    } else if (password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Pendaftaran Berhasil 🎉', 'Selamat datang di LuxeCart!', [
        { text: 'Mulai Belanja', onPress: () => router.replace('/(tabs)') },
      ]);
    } else {
      Alert.alert('Gagal Mendaftar', result.message || 'Silakan periksa kembali data Anda.');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Decorative Brand Header */}
      <SafeAreaView edges={['top']} style={styles.topBanner}>
        <View style={styles.headerContent}>
          <View style={styles.brandContainer}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.brandTitle}>Daftar Akun</Text>
              <Text style={styles.brandSubtitle}>Bergabung & Nikmati Promo Eksklusif</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.skipBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.skipBtnText}>Lewati</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Curved Form Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sheet Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Buat Akun Baru</Text>
            <Text style={styles.mainDesc}>
              Lengkapi data diri di bawah ini untuk memulai pengalaman belanja
            </Text>
          </View>

          {/* Full Name Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nama Lengkap</Text>
            <View
              style={[
                styles.inputWrapper,
                nameFocused && styles.inputFocused,
                errors.name ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.name ? COLORS.error : nameFocused ? COLORS.primary : COLORS.textMuted}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan nama lengkap Anda"
                placeholderTextColor="#A0A0A0"
                value={name}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                onChangeText={(val) => {
                  setName(val);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
            </View>
            {errors.name && <Text style={styles.errorMsg}>{errors.name}</Text>}
          </View>

          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Alamat Email</Text>
            <View
              style={[
                styles.inputWrapper,
                emailFocused && styles.inputFocused,
                errors.email ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={errors.email ? COLORS.error : emailFocused ? COLORS.primary : COLORS.textMuted}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="nama@email.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}
          </View>

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Kata Sandi</Text>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputFocused,
                errors.password ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? COLORS.error : passwordFocused ? COLORS.primary : COLORS.textMuted}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#A0A0A0"
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeToggle}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorMsg}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Konfirmasi Kata Sandi</Text>
            <View
              style={[
                styles.inputWrapper,
                confirmPasswordFocused && styles.inputFocused,
                errors.confirmPassword ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={errors.confirmPassword ? COLORS.error : confirmPasswordFocused ? COLORS.primary : COLORS.textMuted}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Ulangi kata sandi Anda"
                placeholderTextColor="#A0A0A0"
                value={confirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeToggle}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnInner}>
                <Text style={styles.primaryButtonText}>Daftar Sekarang</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </View>
            )}
          </TouchableOpacity>

          {/* Login Link Footer */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.loginHighlight}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  topBanner: {
    backgroundColor: COLORS.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 26,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    fontWeight: '500',
  },
  skipBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  mainDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E5E7EB',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#F9FAFB',
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  eyeToggle: {
    padding: 6,
  },
  errorMsg: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 10,
  },
  loginPrompt: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loginHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
