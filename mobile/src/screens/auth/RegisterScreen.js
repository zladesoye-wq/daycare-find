import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('parent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password.trim() || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    setLoading(true);
    try {
      const userData = { id: '1', name, email, phone, role };
      const authToken = 'mock-jwt-token';
      await register(userData, authToken, role);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join DaycareFind today</Text>
          </View>
          <View style={styles.roleToggle}>
            <TouchableOpacity style={[styles.roleOption, role === 'parent' && styles.roleActive]} onPress={() => setRole('parent')}>
              <Ionicons name="people" size={20} color={role === 'parent' ? colors.white : colors.textMedium} />
              <Text style={[styles.roleText, role === 'parent' && styles.roleTextActive]}>Parent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleOption, role === 'provider' && styles.roleActive]} onPress={() => setRole('provider')}>
              <Ionicons name="business" size={20} color={role === 'provider' ? colors.white : colors.textMedium} />
              <Text style={[styles.roleText, role === 'provider' && styles.roleTextActive]}>Provider</Text>
            </TouchableOpacity>
          </View>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <Input label="Full Name" value={name} onChangeText={setName} placeholder="Enter your full name" autoCapitalize="words" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Create a password (min 6 chars)" secureTextEntry />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Enter your phone number" keyboardType="phone-pad" />
          <Button title="Create Account" onPress={handleRegister} loading={loading} size="large" style={styles.signupButton} />
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button title="Sign In" onPress={() => navigation.navigate('Login')} variant="ghost" size="sm" style={styles.loginBtn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  backButton: { marginBottom: spacing.xl },
  header: { marginBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textDark, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMedium },
  roleToggle: { flexDirection: 'row', backgroundColor: colors.lightGray, borderRadius: 8, padding: 4, marginBottom: spacing.xxl },
  roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, borderRadius: 6, gap: spacing.sm },
  roleActive: { backgroundColor: colors.primary },
  roleText: { ...typography.bodySmall, color: colors.textMedium, fontWeight: '600' },
  roleTextActive: { color: colors.white },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.error + '10', padding: spacing.md, borderRadius: 8, marginBottom: spacing.lg, gap: spacing.sm },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },
  signupButton: { marginBottom: spacing.xl, marginTop: spacing.md },
  loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginText: { ...typography.bodySmall, color: colors.textMedium },
  loginBtn: { paddingHorizontal: 0, minHeight: 0 },
});
