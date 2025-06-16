import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export type GradeLevel = '9th' | '10th' | '11th' | '12th';

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
      { id: '2', text: 'Learn about college fairs/events', done: false },
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
      { id: '2', text: 'Schedule visits to colleges/apprenticeships', done: false },
      { id: '3', text: 'Register for May SAT', done: false },
    ],
    'April': [
      { id: '1', text: 'Consider summer college courses', done: false },
      { id: '2', text: 'Plan for AP exams', done: false },
      { id: '3', text: 'Compare/rank colleges', done: false },
      { id: '4', text: 'Register for June ACT/SAT', done: false },
      { id: '5', text: 'Update activities resume', done: false },
    ],
    'May': [
      { id: '1', text: 'Narrow top college/apprenticeship choices', done: false },
      { id: '2', text: 'Take AP exams', done: false },
      { id: '3', text: 'Get a career-related summer job', done: false },
      { id: '4', text: 'Update resume/portfolio', done: false },
    ],
    'June': [
      { id: '1', text: 'Schedule final campus visits', done: false },
      { id: '2', text: 'Start private scholarship applications', done: false },
      { id: '3', text: 'Save money for college', done: false },
      { id: '4', text: 'Review athletic requirements (if applicable)', done: false },
    ],
    'July': [
      { id: '1', text: 'Review admission applications', done: false },
      { id: '2', text: 'Choose recommendation writers', done: false },
      { id: '3', text: 'Create a spending plan with parents', done: false },
    ],
  },
  '12th': {
    'August': [
      { id: '1', text: 'Sign up for ICAN Senior Alerts', done: false },
      { id: '2', text: 'Gather info on admissions, scholarships, aid', done: false },
      { id: '3', text: 'Talk to admissions reps about retesting SAT/ACT', done: false },
      { id: '4', text: 'Register for tests', done: false },
    ],
    'September': [
      { id: '1', text: 'Create a StudentAid.gov account', done: false },
      { id: '2', text: 'Schedule ICAN college/career planning session', done: false },
      { id: '3', text: 'Begin application essays and recommendation requests', done: false },
      { id: '4', text: 'Update activities resume', done: false },
    ],
    'October': [
      { id: '1', text: 'Review FAFSA priority dates', done: false },
      { id: '2', text: 'Schedule FAFSA completion appointment', done: false },
      { id: '3', text: 'Submit admissions and scholarship apps by Nov 1', done: false },
      { id: '4', text: 'Research military benefits', done: false },
    ],
    'November': [
      { id: '1', text: 'Finalize and submit applications', done: false },
      { id: '2', text: 'Start free scholarship searches', done: false },
      { id: '3', text: 'Set up StudentAid.gov account (if not done)', done: false },
      { id: '4', text: 'Register for December ACT', done: false },
    ],
    'December': [
      { id: '1', text: 'Save copies of submitted forms', done: false },
      { id: '2', text: 'Check with counselor on local/state scholarships', done: false },
      { id: '3', text: 'Monitor for acceptance letters', done: false },
      { id: '4', text: 'Submit FAFSA before earliest deadline', done: false },
    ],
    'January': [
      { id: '1', text: 'Review FAFSA submission and aid plans with ICAN', done: false },
      { id: '2', text: 'Maintain strong grades', done: false },
      { id: '3', text: 'Verify if additional aid forms are needed', done: false },
      { id: '4', text: 'Send updated transcript and housing apps', done: false },
    ],
    'February': [
      { id: '1', text: 'Review FAFSA Summary', done: false },
      { id: '2', text: 'Submit missing financial forms', done: false },
      { id: '3', text: 'Meet with ICAN advisor to compare aid packages', done: false },
      { id: '4', text: 'Review college budget with family', done: false },
    ],
    'March': [
      { id: '1', text: 'Use College Funding Forecaster', done: false },
      { id: '2', text: 'Prepare for May 1 Decision Day', done: false },
      { id: '3', text: 'Notify other colleges if not attending', done: false },
      { id: '4', text: 'Complete loan paperwork', done: false },
    ],
    'April': [
      { id: '1', text: 'Take AP/CLEP exams', done: false },
      { id: '2', text: 'Finalize summer job', done: false },
      { id: '3', text: 'Submit final transcript', done: false },
      { id: '4', text: 'Return all documents to your college', done: false },
      { id: '5', text: 'Notify college of scholarships', done: false },
    ],
    'May': [
      { id: '1', text: 'Confirm tools/certifications for apprenticeships', done: false },
      { id: '2', text: 'Create/review budget with parents', done: false },
      { id: '3', text: 'Attend orientation', done: false },
    ],
    'June': [
      { id: '1', text: 'Use ICAN\'s Packing List', done: false },
      { id: '2', text: 'Coordinate with roommate', done: false },
      { id: '3', text: 'Thank your support network', done: false },
    ],
    'July': [
      { id: '1', text: 'Renew FAFSA for following year', done: false },
    ],
  },
};

export default function ChecklistScreen() {
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('9th');
  const [userName, setUserName] = useState<string>('');
  const [completedCount, setCompletedCount] = useState(0);
  const [tasksByMonth, setTasksByMonth] = useState<{ [key: string]: Task[] }>(checklists['9th']);
  const [isLoading, setIsLoading] = useState(true);
  const confettiRef = useRef<ConfettiCannon>(null);
  const [completedMonths, setCompletedMonths] = useState<Set<string>>(new Set());

  // Get ordered months in school year order (August through July)
  const getOrderedMonths = () => {
    return ['August', 'September', 'October', 'November', 'December', 
            'January', 'February', 'March', 'April', 'May', 'June', 'July'];
  };

  // Load saved progress
  const loadSavedProgress = async (grade: GradeLevel) => {
    try {
      setIsLoading(true);
      const savedProgress = await AsyncStorage.getItem(`checklist_progress_${grade}`);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress) as { [key: string]: Task[] };
        // Ensure all months have data
        const months = getOrderedMonths();
        const validatedProgress = months.reduce((acc, month) => {
          acc[month] = parsedProgress[month] || [];
          return acc;
        }, {} as { [key: string]: Task[] });
        
        setTasksByMonth(validatedProgress);
        
        // Calculate completed count from saved progress
        const allTasks = Object.values(validatedProgress).flat();
        setCompletedCount(allTasks.filter(task => task.done).length);
      } else {
        // If no saved progress, initialize with default tasks
        const defaultTasks = checklists[grade] || checklists['9th']; // Fallback to 9th grade if grade not found
        setTasksByMonth(defaultTasks);
        setCompletedCount(0);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
      // Fallback to default tasks if there's an error
      const defaultTasks = checklists[grade] || checklists['9th'];
      setTasksByMonth(defaultTasks);
      setCompletedCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Save progress
  const saveProgress = async (grade: GradeLevel, tasks: { [key: string]: Task[] }) => {
    try {
      await AsyncStorage.setItem(`checklist_progress_${grade}`, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setCurrentGrade(userData.grade);
          setUserName(userData.name);
          // Load saved progress for the user's grade
          await loadSavedProgress(userData.grade);
        } else {
          router.replace('/signup');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        router.replace('/signup');
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    // Load saved progress when grade changes
    loadSavedProgress(currentGrade);
  }, [currentGrade]);

  // Add function to check if all tasks in a month are completed
  const checkMonthCompletion = (month: string, tasks: Task[]) => {
    const allCompleted = tasks.every(task => task.done);
    const monthKey = `${currentGrade}-${month}`;
    
    if (allCompleted && !completedMonths.has(monthKey)) {
      // Add to completed months
      setCompletedMonths(prev => new Set([...prev, monthKey]));
      // Trigger confetti
      confettiRef.current?.start();
      // Show celebration message
      Alert.alert(
        'Congratulations! 🎉',
        `You've completed all tasks for ${month}!`,
        [{ text: 'Keep going!' }]
      );
    }
  };

  // Modify the toggleTask function to check completion
  const toggleTask = async (month: string, taskIndex: number) => {
    try {
      const updatedTasks = [...tasksByMonth[month]];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        done: !updatedTasks[taskIndex].done,
      };

      const updatedTasksByMonth = {
        ...tasksByMonth,
        [month]: updatedTasks,
      };

      setTasksByMonth(updatedTasksByMonth);
      await AsyncStorage.setItem(
        `checklist_progress_${currentGrade}`,
        JSON.stringify(updatedTasksByMonth)
      );

      // Check if all tasks in the month are completed
      checkMonthCompletion(month, updatedTasks);
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut={true}
        fallSpeed={3000}
        colors={['#0a7ea4', '#4caf50', '#ff9800', '#e91e63', '#9c27b0']}
      />
      <Image
        source={require('@/assets/images/icanlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {userName && (
        <ThemedText style={styles.welcomeText}>
          Welcome, {userName}!
        </ThemedText>
      )}

      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Yearly Checklist
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {currentGrade} Grade
        </ThemedText>
        {!isLoading && (
          <ThemedView style={styles.progressContainer}>
            <ThemedText style={styles.progressText}>
              {completedCount} of {Object.values(tasksByMonth).flat().length} tasks completed
            </ThemedText>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(completedCount / Object.values(tasksByMonth).flat().length) * 100}%` }
                ]} 
              />
            </View>
          </ThemedView>
        )}
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
        </ThemedView>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={getOrderedMonths()}
          keyExtractor={(month) => month}
          renderItem={({ item: month }) => (
            <ThemedView style={styles.monthContainer}>
              <ThemedText type="defaultSemiBold" style={styles.monthTitle}>
                {month}
              </ThemedText>
              {(tasksByMonth[month] || []).map((task, index) => (
                <Pressable
                  key={task.id}
                  onPress={() => toggleTask(month, index)}
                  style={[
                    styles.taskContainer,
                    task.done && styles.taskDone,
                  ]}
                >
                  <View style={styles.checkboxContainer}>
                    <Ionicons
                      name={task.done ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={task.done ? '#4caf50' : '#aaa'}
                    />
                  </View>
                  <ThemedText
                    style={[styles.taskText, task.done && styles.textDone]}
                    numberOfLines={0}
                  >
                    {task.text}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  logo: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  monthContainer: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 20,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  taskDone: {
    backgroundColor: '#f8f9fa',
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
