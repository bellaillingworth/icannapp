import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { checklists } from './explore';

type GradeLevel = '9th' | '10th' | '11th' | '12th';
type UserRole = 'Student' | 'Parent' | 'Guardian' | 'School Counselor' | 'College Access Professional' | 'Educator' | 'Trio/GEARUP/Upward Bound';
type CollegePlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship';

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

function Dropdown({ label, value, options, onSelect, disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        style={[styles.dropdownButton, disabled && styles.disabledButton]}
        onPress={() => !disabled && setIsOpen(true)}
      >
        <ThemedText style={[styles.dropdownButtonText, disabled && styles.disabledText]}>{value}</ThemedText>
        {!disabled && <ThemedText style={styles.dropdownArrow}>▼</ThemedText>}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <ThemedView style={styles.modalContent}>
            <ScrollView style={styles.optionsContainer}>
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionButton,
                    value === option && styles.selectedOption
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      value === option && styles.selectedOptionText
                    ]}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </ThemedView>
        </Pressable>
      </Modal>
    </View>
  );
}

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  grade: GradeLevel;
  role: UserRole;
  collegePlan?: CollegePlan;
};

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
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
        const data = JSON.parse(userDataString);
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          grade: data.grade || '9th',
          role: data.role || 'Student',
          collegePlan: data.collegePlan
        });
        setOriginalGrade(data.grade || '9th');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const handleSave = async () => {
    try {
      // Update user data
      const updatedUserData = {
        ...userData,
        // Keep other fields from existing user data
        ...JSON.parse(await AsyncStorage.getItem('userData') || '{}')
      };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      
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
          <ThemedText style={styles.label}>First Name:</ThemedText>
          <TextInput
            style={styles.input}
            value={userData.firstName}
            onChangeText={(text) => setUserData({ ...userData, firstName: text })}
            editable={isEditing}
            placeholderTextColor="#666"
          />

          <ThemedText style={styles.label}>Last Name:</ThemedText>
          <TextInput
            style={styles.input}
            value={userData.lastName}
            onChangeText={(text) => setUserData({ ...userData, lastName: text })}
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

          <Dropdown
            label="Grade Level:"
            value={userData.grade}
            options={['9th', '10th', '11th', '12th']}
            onSelect={(value) => isEditing && setUserData({ ...userData, grade: value as GradeLevel })}
            disabled={!isEditing}
          />

          <Dropdown
            label="Role:"
            value={userData.role}
            options={[
              'Student',
              'Parent',
              'Guardian',
              'School Counselor',
              'College Access Professional',
              'Educator',
              'Trio/GEARUP/Upward Bound'
            ]}
            onSelect={(value) => isEditing && setUserData({ ...userData, role: value as UserRole })}
            disabled={!isEditing}
          />

          <Dropdown
            label="College Plan:"
            value={userData.collegePlan || 'Not decided'}
            options={['2-year college', '4-year college', 'Not decided', 'Apprenticeship']}
            onSelect={(value) => isEditing && setUserData({ ...userData, collegePlan: value as CollegePlan })}
            disabled={!isEditing}
          />

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
    marginBottom: 15,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  disabledText: {
    color: '#666',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#0a7ea4',
    fontWeight: '600',
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
}); 