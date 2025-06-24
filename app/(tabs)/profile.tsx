import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, TextInput, View, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { supabase } from '../../supabaseClient';

type UserRole = 'Student' | 'Parent/Guardian';
type CollegePlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship';

type UserData = {
  fullName: string;
  role: UserRole;
  classOf: string;
  collegePlan: CollegePlan;
};

function Dropdown({ label, value, options, onSelect, disabled = false }: { label: string; value: string; options: string[]; onSelect: (value: any) => void; disabled?: boolean; }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        style={[styles.input, disabled && { backgroundColor: '#f0f0f0' }]}
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
          .select('full_name, role, class_of, college_plan')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData({
            fullName: data.full_name || '',
            role: data.role || 'Student',
            classOf: data.class_of || 'N/A',
            collegePlan: data.college_plan || 'Not decided',
          });
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

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          role: userData.role,
          college_plan: userData.collegePlan,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
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
        options={['Student', 'Parent/Guardian']}
        onSelect={(value) => setUserData({ ...userData, role: value })}
        disabled={!isEditing}
      />

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>Class of</ThemedText>
        <TextInput style={styles.input} value={userData.classOf} editable={false} />
      </View>

      <Dropdown
        label="College Plan"
        value={userData.collegePlan}
        options={['2-year college', '4-year college', 'Not decided', 'Apprenticeship']}
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