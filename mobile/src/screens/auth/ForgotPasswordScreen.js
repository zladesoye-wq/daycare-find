import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={48} color={colors.accent} style={styles.icon} />
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>
        {sent ? (
          <View style={styles.sentContainer}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            <Text style={styles.sentTitle}>Email Sent!</Text>
            <Text style={styles.sentText}>Check your inbox for the password reset link.</Text>
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} variant="outlined" style={styles.button} />
          </View>
        ) : (
          <>
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
            <Button title="Send Reset Link" onPress={handleSubmit} loading={loading} size="large" style={styles.button} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  backButton: { padding: spacing.lg, paddingTop: spacing.xl },
  content: { flex: 1, paddingHorizontal: spacing.xxl, justifyContent: 'center' },
  icon: { alignSelf: 'center', marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.textDark, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMedium, textAlign: 'center', marginBottom: spacing.xxl },
  button: { marginTop: spacing.lg },
  sentContainer: { alignItems: 'center' },
  sentTitle: { ...typography.h3, color: colors.textDark, marginTop: spacing.lg, marginBottom: spacing.sm },
  sentText: { ...typography.body, color: colors.textMedium, textAlign: 'center', marginBottom: spacing.xl },
});
