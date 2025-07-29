import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, ActivityIndicator, View, Modal } from 'react-native';
import { supabase } from '../supabaseClient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type GradeLevel = '9th' | '10th' | '11th' | '12th';
type GraduationYear = '2026' | '2027' | '2028' | '2029' | 'N/A';
type PostHighSchoolPlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship' | 'N/A';

function Dropdown({ label, value, options, onSelect }: { label: string; value: string; options: string[]; onSelect: (value: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={{ marginBottom: 15 }}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable style={styles.input} onPress={() => setIsOpen(true)}>
        <ThemedText>{value}</ThemedText>
      </Pressable>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={styles.optionButton}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  <ThemedText>{option}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert('Success!', 'Please check your email to confirm your account, then you can sign in.');
      
      // Navigate safely after the alert is dismissed.
      // Using setTimeout ensures this runs after the current render cycle.
      setTimeout(() => {
        router.replace('/signin');
      }, 0);

    } catch (error: any) {
      Alert.alert('Error signing up', error.message);
    } finally {
      setLoading(false);
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
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
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
        <Pressable style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
          <ThemedText style={styles.signUpButtonText}>Continue</ThemedText>
          )}
        </Pressable>
        <Pressable 
          style={styles.switchButton}
          onPress={() => router.replace('/signin')}
          disabled={loading}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
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
  // Dropdown styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 10,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
}); 