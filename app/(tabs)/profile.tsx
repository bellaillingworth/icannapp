import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { checklists } from './explore';

type GradeLevel = '9th' | '10th' | '11th' | '12th';
type UserRole = 'Student' | 'Parent' | 'Teacher';
type CollegePlan = '2-year college' | '4-year college' | 'Not decided';

type UserData = {
  name: string;
  email: string;
  grade: GradeLevel;
  role: UserRole;
  collegePlan?: CollegePlan;
};

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    grade: '9th',
    role: 'Student',
  });
  const [originalGrade, setOriginalGrade] = useState<GradeLevel>('9th');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
        setOriginalGrade(JSON.parse(userDataString).grade);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const handleSave = async () => {
    try {
      // Update user data
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // If grade changed, reset checklist progress for the new grade
      if (userData.grade !== originalGrade) {
        // Remove old grade's progress
        await AsyncStorage.removeItem(`checklist_progress_${originalGrade}`);
        // Initialize new grade's progress with default tasks
        const newGradeTasks = checklists[userData.grade];
        await AsyncStorage.setItem(`checklist_progress_${userData.grade}`, JSON.stringify(newGradeTasks));
      }
      
      setIsEditing(false);
      setOriginalGrade(userData.grade);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      router.replace('/signup');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
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
          Profile
        </ThemedText>

        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.label}>Name:</ThemedText>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            editable={isEditing}
            placeholderTextColor="#666"
          />

          <ThemedText style={styles.label}>Email:</ThemedText>
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <ThemedText style={styles.label}>Grade:</ThemedText>
          <ThemedView style={styles.gradeSelector}>
            {(['9th', '10th', '11th', '12th'] as GradeLevel[]).map((grade) => (
              <Pressable
                key={grade}
                style={[
                  styles.gradeButton,
                  userData.grade === grade && styles.selectedButton,
                ]}
                onPress={() => isEditing && setUserData({ ...userData, grade })}
              >
                <ThemedText
                  style={[
                    styles.selectorButtonText,
                    userData.grade === grade && styles.selectedButtonText,
                  ]}
                >
                  {grade}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText style={styles.label}>Role:</ThemedText>
          <ThemedView style={styles.selectorContainer}>
            {(['Student', 'Parent', 'Teacher'] as UserRole[]).map((role) => (
              <Pressable
                key={role}
                style={[
                  styles.selectorButton,
                  userData.role === role && styles.selectedButton,
                ]}
                onPress={() => isEditing && setUserData({ ...userData, role })}
              >
                <ThemedText
                  style={[
                    styles.selectorButtonText,
                    userData.role === role && styles.selectedButtonText,
                  ]}
                >
                  {role}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText style={styles.label}>College Plan (Optional):</ThemedText>
          <ThemedView style={styles.selectorContainer}>
            {(['2-year college', '4-year college', 'Not decided'] as CollegePlan[]).map((plan) => (
              <Pressable
                key={plan}
                style={[
                  styles.selectorButton,
                  userData.collegePlan === plan && styles.selectedButton,
                ]}
                onPress={() => isEditing && setUserData({ ...userData, collegePlan: plan })}
              >
                <ThemedText
                  style={[
                    styles.selectorButtonText,
                    userData.collegePlan === plan && styles.selectedButtonText,
                  ]}
                >
                  {plan}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditing(false);
                    loadUserData(); // Reload original data
                  }}
                >
                  <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
                <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
              </Pressable>
            )}
          </ThemedView>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </Pressable>
        </ThemedView>
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
    paddingTop: 60,
    paddingBottom: 100,
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
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
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
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#f44336',
    fontSize: 18,
    fontWeight: '600',
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
}); 