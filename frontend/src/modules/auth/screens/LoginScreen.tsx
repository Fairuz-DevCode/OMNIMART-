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

export const LoginScreen = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Gagal Masuk', result.message || 'Email atau kata sandi salah. Silakan coba lagi.');
    }
  };

  const fillDemoAccount = () => {
    setEmail('test@example.com');
    setPassword('password123');
    setErrors({});
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Decorative Brand Header */}
      <SafeAreaView edges={['top']} style={styles.topBanner}>
        <View style={styles.headerContent}>
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="bag-handle" size={26} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>LuxeCart</Text>
              <Text style={styles.brandSubtitle}>Belanja Mudah, Hemat & Terpercaya</Text>
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
            <Text style={styles.mainTitle}>Masuk Akun</Text>
            <Text style={styles.mainDesc}>
              Silakan masukkan email dan kata sandi Anda untuk melanjutkan
            </Text>
          </View>

          {/* Quick Demo Account Chip */}
          <TouchableOpacity
            style={styles.demoCard}
            onPress={fillDemoAccount}
            activeOpacity={0.85}
          >
            <View style={styles.demoLeft}>
              <View style={styles.demoIconBox}>
                <Ionicons name="key" size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoTitle}>Akun Demo Cepat</Text>
                <Text style={styles.demoSubtitle}>test@example.com • sandi: password123</Text>
              </View>
            </View>
            <View style={styles.demoBtnPill}>
              <Text style={styles.demoBtnText}>Pakai</Text>
            </View>
          </TouchableOpacity>


          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
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
            <View style={styles.passwordLabelRow}>
              <Text style={styles.fieldLabel}>Kata Sandi</Text>
              <TouchableOpacity
                onPress={() => Alert.alert('Lupa Kata Sandi', 'Silakan gunakan akun demo atau hubungi admin.')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotLink}>Lupa Sandi?</Text>
              </TouchableOpacity>
            </View>

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

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnInner}>
                <Text style={styles.primaryButtonText}>Masuk Sekarang</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </View>
            )}
          </TouchableOpacity>



          {/* Register Footer */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.7}>
              <Text style={styles.registerHighlight}>Daftar Akun Baru</Text>
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
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 26,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  brandTitle: {
    fontSize: 22,
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
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0ED',
    borderWidth: 1,
    borderColor: '#FFD6CC',
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 22,
  },
  demoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  demoIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  demoSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  demoBtnPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD6CC',
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 10,
  },
  registerPrompt: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  registerHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
