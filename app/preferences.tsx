import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/supabaseClient';
import { Session } from '@supabase/supabase-js';

type GradeLevel = '9th' | '10th' | '11th' | '12th';
type UserRole = 'Student' | 'Parent/Guardian';
type GraduationYear = '2026' | '2027' | '2028' | '2029' | 'N/A';
type CollegePlan = '2-year college' | '4-year college' | 'Not decided' | 'Apprenticeship';


type Task = {
  id: string;
  text: string;
  done: boolean;
};

type ChecklistData = {
  [key in GradeLevel]: {
    [key: string]: Task[]; // key is month name
  };
};

export const checklists: ChecklistData = {
  '9th': {
    'August': [
      { id: '1', text: 'Schedule a planning session with ICAN', done: false },
      { id: '2', text: 'Attend Freshman Transition event', done: false },
      { id: '3', text: 'Sign up for ICAN Tip of the Week', done: false },
      { id: '4', text: 'Use a planner', done: false },
      { id: '5', text: 'Talk to adults about their careers', done: false },
    ],
    'September': [
      { id: '1', text: 'Join extracurriculars and track them with an activities resume', done: false },
      { id: '2', text: 'Attend the Golden Circle College & Career Fair', done: false },
      { id: '3', text: 'Explore career assessments', done: false },
    ],
    'October': [
      { id: '1', text: 'Explore education and training options (CollegeRaptor, CTE programs, apprenticeships)', done: false },
      { id: '2', text: 'Research career pathways', done: false },
    ],
    'November': [
      { id: '1', text: 'Talk with parents about future plans', done: false },
      { id: '2', text: 'Meet with counselor about course selection', done: false },
      { id: '3', text: 'Read regularly', done: false },
      { id: '4', text: 'Volunteer', done: false },
    ],
    'December': [
      { id: '1', text: 'Learn computer applications (Word, Excel, etc.)', done: false },
      { id: '2', text: 'Research 3 careers and related training programs', done: false },
      { id: '3', text: 'Learn about financial aid options', done: false },
    ],
    'January': [
      { id: '1', text: 'Explore skill-building at ICAN\'s career planning site', done: false },
      { id: '2', text: 'Talk to parents about a college savings plan', done: false },
    ],
    'February': [
      { id: '1', text: 'Research high-growth jobs and their required training', done: false },
      { id: '2', text: 'Choose 10th-grade classes with counselor', done: false },
      { id: '3', text: 'Identify job shadow options', done: false },
    ],
    'March': [
      { id: '1', text: 'Find summer camps in your area of interest', done: false },
      { id: '2', text: 'Keep GPA strong', done: false },
      { id: '3', text: 'Attend the Future Ready Career & College Fair', done: false },
    ],
    'April': [
      { id: '1', text: 'Talk to seniors about their planning process', done: false },
      { id: '2', text: 'Visit a college campus or take a virtual tour', done: false },
      { id: '3', text: 'Build relationships for future recommendations', done: false },
    ],
    'May': [
      { id: '1', text: 'Job shadow, volunteer, or intern', done: false },
      { id: '2', text: 'Start a summer reading list', done: false },
      { id: '3', text: 'Learn about athletic requirements if you want to play sports', done: false },
    ],
    'June': [
      { id: '1', text: 'Attend a summer camp on a college campus (if applicable)', done: false },
      { id: '2', text: 'Create an activities resume', done: false },
      { id: '3', text: 'Talk to adults about their career choices', done: false },
    ],
    'July': [
      { id: '1', text: 'Review career assessment and explore matching colleges', done: false },
      { id: '2', text: 'Join hobbies tied to career interests', done: false },
      { id: '3', text: 'Stay open to changing goals', done: false },
    ],
  },
  '10th': {
    'August': [
      { id: '1', text: 'Visit ICAN Center for career/college planning', done: false },
      { id: '2', text: 'Sign up for ICAN Tip of the Week', done: false },
      { id: '3', text: 'Find a mentor', done: false },
      { id: '4', text: 'Attend career planning events', done: false },
    ],
    'September': [
      { id: '1', text: 'Attend Golden Circle Fair', done: false },
      { id: '2', text: 'Register for PreACT or PSAT/NMSQT', done: false },
      { id: '3', text: 'Sign up for job shadows', done: false },
      { id: '4', text: 'Join school/community activities', done: false },
    ],
    'October': [
      { id: '1', text: 'Compare careers and research job characteristics', done: false },
      { id: '2', text: 'Attend a college fair', done: false },
      { id: '3', text: 'Take/update career assessment', done: false },
    ],
    'November': [
      { id: '1', text: 'Discuss admission requirements with counselor', done: false },
      { id: '2', text: 'Explore tuition and financial aid options', done: false },
      { id: '3', text: 'Talk to adults about their careers', done: false },
    ],
    'December': [
      { id: '1', text: 'Meet college reps/career speakers', done: false },
      { id: '2', text: 'Schedule advising with ICAN', done: false },
      { id: '3', text: 'Learn about alternate education options', done: false },
      { id: '4', text: 'Volunteer over winter break', done: false },
    ],
    'January': [
      { id: '1', text: 'Keep track of extracurriculars in your activities resume', done: false },
      { id: '2', text: 'Review types of financial aid', done: false },
      { id: '3', text: 'Review financial plan for post-high school', done: false },
    ],
    'February': [
      { id: '1', text: 'Attend ICAN planning nights', done: false },
      { id: '2', text: 'Confirm junior year classes align with your career path', done: false },
      { id: '3', text: 'Explore career pathways using MyACT', done: false },
    ],
    'March': [
      { id: '1', text: 'Consider AP classes', done: false },
      { id: '2', text: 'Attend ICAN Future Ready Fair', done: false },
      { id: '3', text: 'Talk to professionals in your field of interest', done: false },
      { id: '4', text: 'Tour colleges if on vacation', done: false },
    ],
    'April': [
      { id: '1', text: 'Review college financial plan', done: false },
      { id: '2', text: 'Explore scholarships and savings strategies', done: false },
      { id: '3', text: 'Gain experience via job shadowing or internships', done: false },
      { id: '4', text: 'Use ROCI Tool to compare career ROI', done: false },
    ],
    'May': [
      { id: '1', text: 'Check status of savings plans', done: false },
      { id: '2', text: 'Ask counselor about summer programs', done: false },
      { id: '3', text: 'Look for summer jobs related to your interests', done: false },
    ],
    'June': [
      { id: '1', text: 'Keep reading over the summer', done: false },
      { id: '2', text: 'Join hobbies that develop career interests', done: false },
      { id: '3', text: 'Learn about athletic eligibility', done: false },
    ],
    'July': [
      { id: '1', text: 'Tour college campuses during camp visits', done: false },
      { id: '2', text: 'Talk to parents about cost planning', done: false },
      { id: '3', text: 'Maintain connections for future recommendations', done: false },
    ],
  },
  '11th': {
    'August': [
      { id: '1', text: 'Sign up for ICAN Tip of the Week', done: false },
      { id: '2', text: 'Learn about college fairs/events!!', done: false },
      { id: '3', text: 'Keep GPA up', done: false },
      { id: '4', text: 'Review/start a savings plan', done: false },
      { id: '5', text: 'Take a career assessment', done: false },
      { id: '6', text: 'Talk to parents about careers', done: false },
    ],
    'September': [
      { id: '1', text: 'Attend the Golden Circle College & Career Fair', done: false },
      { id: '2', text: 'Register for the PSAT/NMSQT', done: false },
      { id: '3', text: 'Explore military and apprenticeship options', done: false },
      { id: '4', text: 'Schedule ICAN planning session', done: false },
    ],
    'October': [
      { id: '1', text: 'Attend college/career fairs', done: false },
      { id: '2', text: 'Explore Iowa colleges', done: false },
      { id: '3', text: 'Talk with your counselor about admission readiness', done: false },
    ],
    'November': [
      { id: '1', text: 'Review college brochures', done: false },
      { id: '2', text: 'Make a list of 10–15 colleges', done: false },
      { id: '3', text: 'Download the College Checklist', done: false },
      { id: '4', text: 'Start SAT/ACT planning', done: false },
      { id: '5', text: 'Research scholarships', done: false },
    ],
    'December': [
      { id: '1', text: 'Register for January SAT or February ACT', done: false },
      { id: '2', text: 'Meet with college reps/career speakers', done: false },
      { id: '3', text: 'Use CollegeRaptor.com to compare colleges', done: false },
      { id: '4', text: 'Schedule planning with ICAN', done: false },
    ],
    'January': [
      { id: '1', text: 'Register for March SAT', done: false },
      { id: '2', text: 'Attend a financial aid seminar', done: false },
      { id: '3', text: 'Plan campus visits based on \'No School\' days', done: false },
    ],
    'February': [
      { id: '1', text: 'Create an education/training budget (use ROCI tool)', done: false },
      { id: '2', text: 'Choose senior classes aligned with your career path', done: false },
      { id: '3', text: 'Register for April ACT', done: false },
      { id: '4', text: 'Talk about AP/CLEP/honors courses', done: false },
    ],
    'March': [
      { id: '1', text: 'Attend the ICAN Future Ready Fair', done: false },
      { id: '2', text: 'Visit college campuses', done: false },
      { id: '3', text: 'Ask for letters of recommendation', done: false },
      { id: '4', text: 'Use Scholarship Finder', done: false },
    ],
    'April': [
      { id: '1', text: 'Register for May SAT', done: false },
      { id: '2', text: 'Explore majors/careers', done: false },
      { id: '3', text: 'Use CollegeRaptor.com', done: false },
      { id: '4', text: 'Review college savings', done: false },
    ],
    'May': [
      { id: '1', text: 'Register for June ACT/SAT', done: false },
      { id: '2', text: 'Narrow college list', done: false },
      { id: '3', text: 'Plan a productive summer', done: false },
    ],
    'June': [
      { id: '1', text: 'Review college list', done: false },
      { id: '2', text: 'Begin college essays', done: false },
      { id: '3', text: 'Update activities resume', done: false },
    ],
    'July': [
      { id: '1', text: 'Register for September ACT', done: false },
      { id: '2', text: 'Visit college campuses', done: false },
      { id: '3', text: 'Use Scholarship Finder', done: false },
    ],
  },
  '12th': {
    'August': [
      { id: '1', text: 'Create a calendar for admission tasks', done: false },
      { id: '2', text: 'Register for ACT/SAT if needed', done: false },
      { id: '3', text: 'Review and narrow your college list', done: false },
      { id: '4', text: 'Prepare for college applications', done: false },
      { id: '5', text: 'Work on your activity resume', done: false },
    ],
    'September': [
      { id: '1', text: 'Attend the Golden Circle College Fair', done: false },
      { id: '2', text: 'Finalize college essays', done: false },
      { id: '3', text: 'Request letters of recommendation', done: false },
      { id: '4', text: 'Send transcripts to colleges', done: false },
      { id: '5', text: 'Register for your FSA ID', done: false },
    ],
    'October': [
      { id: '1', text: 'Complete the FAFSA', done: false },
      { id: '2', text: 'Submit college applications', done: false },
      { id: '3', text: 'Request transcripts be sent', done: false },
      { id: '4', text: 'Send ACT/SAT scores', done: false },
    ],
    'November': [
      { id: '1', text: 'Continue applying for scholarships', done: false },
      { id: '2', text: 'Verify application submission', done: false },
    ],
    'December': [
      { id: '1', text: 'Apply for scholarships', done: false },
      { id: '2', text: 'Review financial aid offers', done: false },
      { id: '3', text: 'Update your profile for admissions portals', done: false },
    ],
    'January': [
      { id: '1', text: 'Complete any remaining applications', done: false },
      { id: '2', text: 'Review Student Aid Reports (SAR)', done: false },
      { id: '3', text: 'Send mid-year grade reports', done: false },
    ],
    'February': [
      { id: '1', text: 'Compare financial aid packages', done: false },
      { id: '2', text: 'Continue scholarship search', done: false },
      { id: '3', text: 'Verify FAFSA if selected', done: false },
    ],
    'March': [
      { id: '1', text: 'Visit your top-choice colleges again', done: false },
      { id: '2', text: 'Make your final college decision', done: false },
    ],
    'April': [
      { id: '1', text: 'Notify colleges of your decision by May 1', done: false },
      { id: '2', text: 'Submit your deposit', done: false },
      { id: '3', text: 'Decline other admission offers', done: false },
    ],
    'May': [
      { id: '1', text: 'Take AP exams', done: false },
      { id: '2', text: 'Request final transcripts be sent to your chosen college', done: false },
    ],
    'June': [
      { id: '1', text: 'Attend orientation', done: false },
      { id: '2', text: 'Register for classes', done: false },
      { id: '3', text: 'Thank your recommenders', done: false },
    ],
    'July': [
      { id: '1', text: 'Plan for move-in day', done: false },
      { id: '2', text: 'Review your budget', done: false },
      { id: '3', text: 'Get ready for college!', done: false },
    ],
  }
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
  const [loading, setLoading] = useState(false);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // First, update the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: selectedRole, class_of: graduationYear, college_plan: collegePlan, grade: selectedGrade, school_name: schoolName })
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
        console.log('No existing checklist items found. Populating now...');
        const allTasks: any[] = [];
        for (const grade in checklists) {
          for (const month in checklists[grade as GradeLevel]) {
            checklists[grade as GradeLevel][month].forEach(task => {
              allTasks.push({
                user_id: user.id,
                task_id: `${grade}-${month}-${task.id}`,
                task_text: task.text,
                grade: grade,
                month: month,
                is_completed: false,
              });
            });
          }
        }

        if (allTasks.length > 0) {
          const { error: insertError } = await supabase
            .from('checklist_items')
            .insert(allTasks);

          if (insertError) {
            console.error('Error inserting checklist items:', insertError);
            throw insertError;
          }
          console.log('Successfully inserted checklist items.');
        }
      } else {
        console.log('Checklist items already exist for this user.');
      }

      router.push('/(tabs)/explore');

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

          <Pressable style={styles.saveButton} onPress={handleSavePreferences} disabled={loading}>
            <ThemedText style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Continue'}
            </ThemedText>
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