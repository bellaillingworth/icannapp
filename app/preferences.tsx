import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { checklists } from './(tabs)/explore';

type GradeLevel = '9th' | '10th' | '11th' | '12th';
type UserRole = 'Student' | 'Parent' | 'Teacher';
type CollegePlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship';

export default function PreferencesScreen() {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('9th');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [selectedCollegePlan, setSelectedCollegePlan] = useState<CollegePlan | ''>('');

  const handleSavePreferences = async () => {
    try {
      // Validate required fields
      if (!selectedGrade || !selectedRole) {
        Alert.alert('Error', 'Please select both grade and role');
        return;
      }

      // Get existing user data
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User data not found');
        router.replace('/signup');
        return;
      }

      const userData = JSON.parse(userDataString);
      
      // Update user data with preferences
      const updatedUserData = {
        ...userData,
        grade: selectedGrade,
        role: selectedRole,
        collegePlan: selectedCollegePlan || undefined,
      };

      // Save updated user data
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

      // Initialize checklist data for the selected grade
      const initialChecklistData = checklists[selectedGrade];
      await AsyncStorage.setItem(`checklist_progress_${selectedGrade}`, JSON.stringify(initialChecklistData));
      
      // Add a small delay before navigation to ensure data is saved
      setTimeout(() => {
        router.replace('/(tabs)/explore');
      }, 100);
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences');
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
          Tell Us About Yourself
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          This information helps us personalize your experience
        </ThemedText>

        <ThemedText style={styles.label}>Select Your Grade:</ThemedText>
        <ThemedView style={styles.gradeSelector}>
          {(['9th', '10th', '11th', '12th'] as GradeLevel[]).map((grade) => (
            <Pressable
              key={grade}
              style={[
                styles.gradeButton,
                selectedGrade === grade && styles.selectedButton,
              ]}
              onPress={() => setSelectedGrade(grade)}
            >
              <ThemedText
                style={[
                  styles.selectorButtonText,
                  selectedGrade === grade && styles.selectedButtonText,
                ]}
              >
                {grade}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText style={styles.label}>Select Your Role:</ThemedText>
        <ThemedView style={styles.selectorContainer}>
          {(['Student', 'Parent', 'Teacher'] as UserRole[]).map((role) => (
            <Pressable
              key={role}
              style={[
                styles.selectorButton,
                selectedRole === role && styles.selectedButton,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <ThemedText
                style={[
                  styles.selectorButtonText,
                  selectedRole === role && styles.selectedButtonText,
                ]}
              >
                {role}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText style={styles.label}>College Plan (Optional):</ThemedText>
        <ThemedView style={styles.selectorContainer}>
          {(['2-year college', '4-year college', 'Not decided', 'Apprenticeship'] as CollegePlan[]).map((plan) => (
            <Pressable
              key={plan}
              style={[
                styles.selectorButton,
                selectedCollegePlan === plan && styles.selectedButton,
              ]}
              onPress={() => setSelectedCollegePlan(plan)}
            >
              <ThemedText
                style={[
                  styles.selectorButtonText,
                  selectedCollegePlan === plan && styles.selectedButtonText,
                ]}
              >
                {plan}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <Pressable style={styles.saveButton} onPress={handleSavePreferences}>
          <ThemedText style={styles.saveButtonText}>Continue</ThemedText>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  gradeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  gradeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  selectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#0a7ea4',
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 