import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { checklists } from './(tabs)/explore';

type GradeLevel = '9th' | '10th' | '11th' | '12th';
type UserRole = 'Student' | 'Parent/Guardian';
type GraduationYear = '2026' | '2027' | '2028' | '2029' | 'N/A';
type CollegePlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship';

type UserPreferences = {
  icanTipOfWeek: boolean;
  gradeLevelAlerts: boolean;
  counselorEmails: boolean;
  collegeAccessProfessionals: boolean;
};

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
};

function Dropdown({ label, value, options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <ThemedText style={styles.dropdownButtonText}>{value}</ThemedText>
        <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
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

export default function PreferencesScreen() {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('9th');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [schoolName, setSchoolName] = useState('');
  const [graduationYear, setGraduationYear] = useState<GraduationYear>('2026');
  const [collegePlan, setCollegePlan] = useState<CollegePlan>('Not decided');

  const handleSavePreferences = async () => {
    try {
      // Validate required fields
      if (!selectedGrade || !selectedRole || !schoolName) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Navigate to explore page
      router.replace('/(tabs)/explore');
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
          Set Your Preferences
        </ThemedText>

        <ThemedView style={styles.formContainer}>
          <Dropdown
            label="Grade Level:"
            value={selectedGrade}
            options={['9th', '10th', '11th', '12th']}
            onSelect={(value) => setSelectedGrade(value as GradeLevel)}
          />

          <Dropdown
            label="Role:"
            value={selectedRole}
            options={['Student', 'Parent/Guardian']}
            onSelect={(value) => setSelectedRole(value as UserRole)}
          />

          <ThemedText style={styles.label}>School or Organization Name:</ThemedText>
          <TextInput
            style={styles.input}
            value={schoolName}
            onChangeText={setSchoolName}
            placeholder="Enter your school or organization name"
            placeholderTextColor="#666"
          />

          <Dropdown
            label="Graduation Year:"
            value={graduationYear}
            options={['2026', '2027', '2028', '2029', 'N/A']}
            onSelect={(value) => setGraduationYear(value as GraduationYear)}
          />

          <Dropdown
            label="College Plan:"
            value={collegePlan}
            options={['2-year college', '4-year college', 'Not decided', 'Apprenticeship']}
            onSelect={(value) => setCollegePlan(value as CollegePlan)}
          />

          <Pressable style={styles.saveButton} onPress={handleSavePreferences}>
            <ThemedText style={styles.saveButtonText}>Continue</ThemedText>
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
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#0a7ea4',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
  dropdownButtonText: {
    fontSize: 16,
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
}); 