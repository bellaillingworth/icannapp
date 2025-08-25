import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { supabase } from '../supabaseClient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      // Navigate to the main app
      router.replace('/(tabs)/explore');
    } catch {
      Alert.alert('Error', 'Failed to sign in');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for a password reset link. If you don\'t see it, check your spam folder.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('@/assets/images/icanlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <ThemedText type="title" style={styles.title}>
          Sign In
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <Pressable style={styles.signInButton} onPress={handleSignIn}>
          <ThemedText style={styles.signInButtonText}>Sign In</ThemedText>
        </Pressable>

        <Pressable 
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <ThemedText style={styles.forgotPasswordText}>
            Forgot My Password?
          </ThemedText>
        </Pressable>

        <Pressable 
          style={styles.switchButton}
          onPress={() => router.replace('/signup')}
        >
          <ThemedText style={styles.switchButtonText}>
            Don&apos;t have an account? Sign Up
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 0,
  },
  switchButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
  forgotPasswordButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
}); 