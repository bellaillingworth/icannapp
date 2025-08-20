import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/supabaseClient';
import { GradeLevel } from '@/constants/Checklists';

type UserRole = 'Student' | 'Parent/Guardian' | 'Counselor';
type GraduationYear = '2026' | '2027' | '2028' | '2029' | 'N/A';
type PostHighSchoolPlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship' | 'N/A';



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
  const [postHighSchoolPlan, setPostHighSchoolPlan] = useState<PostHighSchoolPlan>('Not decided');
  const [loading, setLoading] = useState(false);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // First, update the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: selectedRole, class_of: graduationYear, post_high_school_plan: postHighSchoolPlan, grade: selectedGrade, school_name: schoolName })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Check if checklist items already exist to prevent duplicates
      const { data: existingItems, error: checkError } = await supabase
        .from('checklist_items')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (checkError) {
        console.error('Error checking for existing checklist items:', checkError);
        throw checkError;
      }

      // If no items exist, create and insert them
      if (!existingItems || existingItems.length === 0) {


        // Determine plan filter based on user's post-high school plan
        let planFilter = {};
        switch (postHighSchoolPlan) {
          case '4-year college':
            planFilter = { four_year: true };
            break;
          case '2-year college':
            planFilter = { two_year: true };
            break;
          case 'Apprenticeship':
            planFilter = { apprenticeship: true };
            break;
          case 'Not decided':
          case 'N/A':
            planFilter = { undecided: true };
            break;
          default:
            planFilter = {};
        }

        let masterTasks: any[] = [];
        let masterTasksError: any = null;

        // Determine which table to query based on user role
        if (selectedRole === 'Student') {
          // Fetch master tasks for students
          const result = await supabase
            .from('checklist_master_tasks')
            .select('*')
            .eq('grade', selectedGrade)
            .match(planFilter);
          
          masterTasks = result.data || [];
          masterTasksError = result.error;

        } else if (selectedRole === 'Counselor') {
          // Fetch counselor tasks - grade only, no month filtering
          const result = await supabase
            .from('checklist_counselors')
            .select('*')
            .eq('grade', selectedGrade);
          
          masterTasks = result.data || [];
          masterTasksError = result.error;

        } else if (selectedRole === 'Parent/Guardian') {
          // Fetch parent tasks - grade, month, and plan filtering
          let planFilter = {};
          switch (postHighSchoolPlan) {
            case '4-year college':
              planFilter = { four_year: true };
              break;
            case '2-year college':
              planFilter = { two_year: true };
              break;
            case 'Apprenticeship':
              planFilter = { apprenticeship: true };
              break;
            case 'Not decided':
            case 'N/A':
              planFilter = { undecided: true };
              break;
            default:
              planFilter = {};
          }

          const result = await supabase
            .from('checklist_parents')
            .select('*')
            .eq('grade', selectedGrade)
            .match(planFilter);
          
          masterTasks = result.data || [];
          masterTasksError = result.error;

        } else {
  
          return;
        }

        if (masterTasksError) {
          console.error('Error fetching master tasks:', masterTasksError);
          throw masterTasksError;
        }

        if (masterTasks && masterTasks.length > 0) {
          // Create reference records (no need to copy task data)
          const allTasks: any[] = [];
          masterTasks.forEach((masterTask) => {
            allTasks.push({
              user_id: user.id,
              master_task_id: masterTask.id,
              is_completed: false,
            });
          });

          if (allTasks.length > 0) {
            const { error: insertError } = await supabase
              .from('checklist_items')
              .insert(allTasks);

            if (insertError) {
              console.error('Error inserting checklist items:', insertError);
              throw insertError;
            }
    
          }
        } else {
  
        }
      } else {

      }

              router.push('/explore');

    } catch (error: any) {
      console.error('Error in handleSavePreferences:', error);
      Alert.alert('Error', error.message || 'Failed to save preferences');
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
            options={['Student', 'Parent/Guardian', 'Counselor']}
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
            label="Post-High School Plan:"
            value={postHighSchoolPlan}
            options={['2-year college', '4-year college', 'Not decided', 'Apprenticeship', 'N/A']}
            onSelect={(value) => setPostHighSchoolPlan(value as PostHighSchoolPlan)}
          />

          <Pressable
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSavePreferences}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveButtonText}>Save Preferences</ThemedText>
            )}
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
    paddingTop: 50,
  },
  logo: {
    width: '80%',
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 