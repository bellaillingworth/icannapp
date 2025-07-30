import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, TextInput, View, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { supabase } from '../../supabaseClient';
import { getCurrentGrade } from './explore';
import { GradeLevel } from '@/constants/Checklists';

type UserRole = 'Student' | 'Parent/Guardian' | 'Counselor';
type PostHighSchoolPlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship' | 'N/A';

type UserData = {
  fullName: string;
  role: UserRole;
  classOf: string;
  collegePlan: PostHighSchoolPlan;
  grade?: string;
  schoolName?: string;
};

function Dropdown({ label, value, options, onSelect, disabled = false }: { label: string; value: string; options: string[]; onSelect: (value: any) => void; disabled?: boolean; }) {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (label === 'Grade') {
      console.log('Dropdown for Grade: disabled =', disabled);
    }
  }, [disabled, label]);

  return (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        style={[styles.input, disabled ? { backgroundColor: '#f0f0f0' } : { backgroundColor: '#fff', borderWidth: 1, borderColor: '#0a7ea4' }]}
        onPress={() => !disabled && setIsOpen(true)}
      >
        <ThemedText style={disabled && { color: '#888' }}>{value}</ThemedText>
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

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    role: 'Student',
    classOf: '',
    collegePlan: 'Not decided',
  });
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/signin');
          return;
        }
        
        setEmail(user.email || 'No email provided');

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, role, class_of, post_high_school_plan, grade, school_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
        setUserData({
            fullName: data.full_name || '',
          role: data.role || 'Student',
            classOf: data.class_of || 'N/A',
            collegePlan: data.post_high_school_plan || 'Not decided',
            grade: data.grade || '',
            schoolName: data.school_name || '',
        });
          setGrade(data.grade || '');
      }
      } catch (error: any) {
        Alert.alert('Error', 'Failed to load profile: ' + error.message);
      } finally {
        setLoading(false);
    }
  };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Fetch the current profile to compare the previous grade
      const { data: currentProfile, error: fetchProfileError } = await supabase
        .from('profiles')
        .select('grade')
        .eq('id', user.id)
        .single();
      if (fetchProfileError) throw fetchProfileError;
      const previousGrade = currentProfile?.grade;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          role: userData.role,
          class_of: userData.classOf,
          post_high_school_plan: userData.collegePlan,
          grade: grade,
          school_name: userData.schoolName
        })
        .eq('id', user.id);
      
      if (error) throw error;

      // If the grade changed, create new checklist items for the new grade
      let progressString = '';
      if (previousGrade !== grade) {
        // First, delete existing checklist items for the old grade
        const { error: deleteError } = await supabase
          .from('checklist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('grade', previousGrade);
        if (deleteError) throw deleteError;

        // Determine plan filter based on user's college plan
        let planFilter = {};
        switch (userData.collegePlan) {
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

        // Fetch master tasks for the new grade from Supabase
        const { data: masterTasks, error: masterTasksError } = await supabase
          .from('checklist_master_tasks')
          .select('*')
          .eq('grade', grade)
          .match(planFilter);

        if (masterTasksError) {
          console.error('Error fetching master tasks:', masterTasksError);
          throw masterTasksError;
        }

        if (masterTasks && masterTasks.length > 0) {
          // Create reference records for the new grade
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
            if (insertError) throw insertError;
          }

          progressString = `0/${allTasks.length}`;
        } else {
          progressString = '0/0'; // No master tasks found for the new grade
        }
      } else {
        // If grade didn't change, recalculate as before
        const { data: items, error: itemsError } = await supabase
          .from('checklist_items')
          .select('is_completed')
          .eq('user_id', user.id)
          .eq('grade', grade);
        if (itemsError) throw itemsError;
        const total = items.length;
        const completed = items.filter((item: any) => item.is_completed).length;
        progressString = `${completed}/${total}`;
      }
      // Update checklist_progress in profiles
      const { error: progressError } = await supabase
        .from('profiles')
        .update({ checklist_progress: progressString })
        .eq('id', user.id);
      if (progressError) throw progressError;

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error logging out', error.message);
    }
    // The onAuthStateChange listener in _layout.tsx will handle the redirect.
  };
  
  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('@/assets/images/icanlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

      <ThemedText type="title" style={styles.title}>Your Profile</ThemedText>

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput style={styles.input} value={email} editable={false} />
      </View>
      
      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>Full Name</ThemedText>
          <TextInput
          style={isEditing ? styles.inputEditable : styles.input} 
          value={userData.fullName}
          onChangeText={(text) => setUserData({...userData, fullName: text})}
            editable={isEditing}
          />
      </View>

          <Dropdown
        label="Role"
        value={userData.role}
        options={['Student', 'Parent/Guardian', 'Counselor']}
        onSelect={(value) => setUserData({ ...userData, role: value })}
            disabled={!isEditing}
          />
      
      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>School/Organization</ThemedText>
        <TextInput
          style={isEditing ? styles.inputEditable : styles.input}
          value={userData.schoolName}
          onChangeText={(text) => setUserData({ ...userData, schoolName: text })}
          editable={isEditing}
        />
      </View>

      <View style={styles.fieldContainer}>
          <Dropdown
          label="Grade"
          value={grade}
          options={['9th', '10th', '11th', '12th']}
          onSelect={setGrade}
            disabled={!isEditing}
          />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>Class of</ThemedText>
        <TextInput
          style={isEditing ? styles.inputEditable : styles.input}
          value={userData.classOf}
          onChangeText={(text) => setUserData({ ...userData, classOf: text })}
          editable={isEditing}
        />
      </View>

          <Dropdown
        label="Post-High School Plan"
        value={userData.collegePlan}
            options={['2-year college', '4-year college', 'Not decided', 'Apprenticeship', 'N/A']}
        onSelect={(value) => setUserData({ ...userData, collegePlan: value })}
            disabled={!isEditing}
          />

      <View style={styles.buttonContainer}>
            {isEditing ? (
          <Pressable style={styles.saveButton} onPress={handleUpdate}>
                  <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
                </Pressable>
            ) : (
              <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
                <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
              </Pressable>
            )}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
          </Pressable>
      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: 80,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333'
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#888',
  },
  inputEditable: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginTop: 30,
  },
  editButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles for Dropdown
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