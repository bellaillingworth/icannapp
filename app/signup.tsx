import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { signUp } from '@/utils/auth';
import { db } from '@/config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // Store first and last name in Firestore under users collection
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });

      // Navigate to preferences page
      router.replace('/preferences');
    } catch (error) {
      let message = 'Failed to create account';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as any).code;
        if (code === 'auth/email-already-in-use') {
          message = 'Email is already in use';
        } else if (code === 'auth/invalid-email') {
          message = 'Invalid email address';
        } else if (code === 'auth/weak-password') {
          message = 'Password is too weak';
        }
      }
      Alert.alert('Error', message);
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
          Create Account
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#666"
        />

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

        <Pressable style={styles.signUpButton} onPress={handleSignUp}>
          <ThemedText style={styles.signUpButtonText}>Continue</ThemedText>
        </Pressable>

        <Pressable 
          style={styles.switchButton}
          onPress={() => router.replace('/signin')}
        >
          <ThemedText style={styles.switchButtonText}>
            Already have an account? Sign In
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
  signUpButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  switchButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
}); 