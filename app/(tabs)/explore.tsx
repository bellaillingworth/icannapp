import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, View, Linking, RefreshControl } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { supabase } from '../../supabaseClient';
import { useFocusEffect } from 'expo-router';
import { GradeLevel, Task } from '@/constants/Checklists';

type ChecklistData = {
    [key: string]: Task[]; // key is month name
};

// This function calculates the current grade based on graduation year
export const getCurrentGrade = (classOf: string | null): GradeLevel => {
    if (!classOf || isNaN(parseInt(classOf))) {
        return '9th'; // Default or if classOf is not set
    }
    const gradYear = parseInt(classOf);
    const currentMonth = new Date().getMonth(); // 0-11
    const currentYear = new Date().getFullYear();

    // Assuming school year starts in August (month 7)
    const schoolYearEndYear = currentMonth >= 7 ? currentYear + 1 : currentYear;

    const yearsUntilGraduation = gradYear - schoolYearEndYear;

    if (yearsUntilGraduation < 0) return 'Graduated';
    if (yearsUntilGraduation === 0) return '12th';
    if (yearsUntilGraduation === 1) return '11th';
    if (yearsUntilGraduation === 2) return '10th';
    return '9th';
};


// Helper function to get the link
function getICANLink(text: string): string | null {
  if (text.toLowerCase().includes('ican tip of the week')) {
    return 'https://www.icansucceed.org/tip-of-the-week';
    }
  if (text.toLowerCase().includes('golden circle')) {
    return 'https://www.goldencirclecollegefair.com/';
    }
  if (text.toLowerCase().includes('technical and two-year programs')) {
    return 'https://www.icansucceed.org/CTEoptions';
    }
  if (text.toLowerCase().includes('learn about apprenticeship programs')) {
      return 'https://www.icansucceed.org/careertraining';
    }
  if (text.toLowerCase().includes('compare career pathways')) {
      return 'https://www.icansucceed.org/career-planning';
    }
  if (text.toLowerCase().includes('learn about types of fincancial aid')) {
      return 'https://www.icansucceed.org/payforcollege';
    }
  if (text.toLowerCase().includes('create an activites resume')) {
      return 'https://www.icansucceed.org/activitiesresume';
    }
  if (text.toLowerCase().includes('sign up for ican tip of the week')) {
      return 'https://www.icansucceed.org/signup';
    }
  if (text.toLowerCase().includes('learn about college fairs')) {
      return 'https://www.icansucceed.org/collegefairs';
    }
  if (text.toLowerCase().includes('take a career')) {
      return 'https://www.icansucceed.org/career-planning';
    }
  if (text.toLowerCase().includes('schedule ican advising session')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('explore military and apprenticeship options')) {
      return 'https://www.icansucceed.org/militaryoptions';
    }
  if (text.toLowerCase().includes('attend the golden circle')) {
      return 'https://www.icansucceed.org/goldencircle';
    }
  if (text.toLowerCase().includes('download the college checklist')) {
      return 'https://www.icansucceed.org/materials';
    }
  if (text.toLowerCase().includes('use collegeraptor.com')) {
      return 'https://www.CollegeRaptor.com';
    }
  if (text.toLowerCase().includes('schedule planning with ican')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('create an aeducation')) {
      return 'https://www.studentloan.org/ROCITool';
    }
  if (text.toLowerCase().includes('attend a financial aid seminar')) {
      return 'https://www.icansucceed.org/events';
    }
  if (text.toLowerCase().includes('attend the ican future ready fair')) {
      return 'https://www.icansucceed.org/futurereadyfair';
    }
  if (text.toLowerCase().includes('go on campus visits')) {
      return 'https://www.icansucceed.org/materials';
    }
  if (text.toLowerCase().includes('start private scholarship applications')) {
      return 'https://www.icansucceed.org/scholarships';
    }
  if (text.toLowerCase().includes('sign up for ican senior alerts')) {
      return 'https://www.icansucceed.org/signup';
    }
  if (text.toLowerCase().includes('gather needed documents for fafsa completion')) {
      return 'https://www.icansucceed.org/whattobring';
    }
  if (text.toLowerCase().includes('schedule your fafsa appointment')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('update activites resume')) {
      return 'https://www.icansucceed.org/activitiesresume';
    }
  if (text.toLowerCase().includes('schedule ican college/career planning')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('submit your fafsa')) {
      return 'https://www.icansucceed.org/priority';
    }
  if (text.toLowerCase().includes('schedule fafsa completion appointment')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('research military benefits')) {
      return 'https://www.icansucceed.org/militaryoptions';
    }
  if (text.toLowerCase().includes('find fafsa assistance events')) {
      return 'https://www.icansucceed.org/FAFSAreadyiaevents';
    }
  if (text.toLowerCase().includes('set up studentaid.gov')) {
      return 'https://www.studentaid.gov';
    }
  if (text.toLowerCase().includes('start free scholarship searches')) {
      return 'https://www.icansucceed.org/scholarships';
    }
  if (text.toLowerCase().includes('create a plan to')) {
      return 'https://www.studentloan.org/gameplan';
    }
  if (text.toLowerCase().includes('schedule a financial aid')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('continue applying for scholarships')) {
      return 'https://www.icansucceed.org/scholarships';
    }
  if (text.toLowerCase().includes('heading to an apprenticeship')) {
      return 'https://www.icansucceed.org/career-training';
    }
  if (text.toLowerCase().includes('meet with ican to')) {
      return 'https://www.icansucceed.org/apt';
    }
  if (text.toLowerCase().includes('packing list')) {
      return 'https://www.icansucceed.org/materials';
    }
  else{
    return null;
  }
  
}

export default function ChecklistScreen() {
    const [tasksByMonth, setTasksByMonth] = useState<ChecklistData>({});
    const [loading, setLoading] = useState(true);
      const [currentGrade, setCurrentGrade] = useState<GradeLevel>('9th');
    const [userRole, setUserRole] = useState<string>('Student');
    const [progress, setProgress] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [userName] = useState('');
        const [allTasksCompleted, setAllTasksCompleted] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const confettiRef = useRef<ConfettiCannon>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchChecklistProgress();

      // Subscribe to real-time changes for checklist_items
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (!userId) return;
      const channel = supabase
        .channel('realtime_checklist_items')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'checklist_items',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            fetchChecklistProgress();
          }
        )
        .subscribe();
      subscriptionRef.current = channel;

      return () => {
        if (subscriptionRef.current) {
          supabase.removeChannel(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    }, [currentGrade, userId])
  );



    const getOrderedMonths = (tasks: ChecklistData) => {
        const monthOrder = [
            'August', 'September', 'October', 'November', 'December',
            'January', 'February', 'March', 'April', 'May', 'June', 'July'
        ];
        return Object.keys(tasks).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    };

    const fetchChecklistProgress = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            // Get user's current grade, plan, and role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('grade, post_high_school_plan, role')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            const currentGrade = profile.grade as GradeLevel;
            const userRole = profile.role;
            setCurrentGrade(currentGrade);
            setUserRole(userRole);



            let masterTasks: any[] = [];
            let masterTasksError: any = null;

            // Determine which table to query based on user role
            if (userRole === 'Student') {
                // Determine plan filter based on user's post-high school plan
                let planFilter = {};
                switch (profile.post_high_school_plan) {
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

                // Get master tasks for students
                const result = await supabase
                    .from('checklist_master_tasks')
                    .select('*')
                    .eq('grade', currentGrade)
                    .match(planFilter);
                
                masterTasks = result.data || [];
                masterTasksError = result.error;

            } else if (userRole === 'Counselor') {
                // Get counselor tasks - grade only, no month filtering
                const result = await supabase
                    .from('checklist_counselors')
                    .select('*')
                    .eq('grade', currentGrade);
                
                masterTasks = result.data || [];
                masterTasksError = result.error;

            } else if (userRole === 'Parent/Guardian') {
                // Get parent tasks - grade, month, and plan filtering
                let planFilter = {};
                switch (profile.post_high_school_plan) {
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
                    .eq('grade', currentGrade)
                    .match(planFilter);
                
                masterTasks = result.data || [];
                masterTasksError = result.error;

            } else {
    
                setTasksByMonth({});
                setProgress(0);
                setTotalTasks(0);
                setCompletedTasks(0);
                setLoading(false);
                return;
            }

            if (masterTasksError) throw masterTasksError;



            if (masterTasks && masterTasks.length > 0) {
                // Get user's completion status for these tasks
                const { data: userCompletions, error: completionsError } = await supabase
                    .from('checklist_items')
                    .select('master_task_id, is_completed')
                    .eq('user_id', user.id)
                    .in('master_task_id', masterTasks.map(task => task.id));

                if (completionsError) throw completionsError;

                // Create a map of completion status
                const completionMap = new Map();
                userCompletions?.forEach(item => {
                    completionMap.set(item.master_task_id, item.is_completed);
                });

                // Group tasks by month using master task data
                const tasksByMonth: ChecklistData = {};
                
                if (userRole === 'Counselor') {
                    // For counselors, group all tasks under a single "General" month
                    tasksByMonth['General'] = [];
                    
                    masterTasks.forEach(masterTask => {
                        // Check if user has a completion record for this task
                        const isCompleted = completionMap.has(masterTask.id) 
                            ? completionMap.get(masterTask.id) 
                            : false;

                        tasksByMonth['General'].push({
                            id: masterTask.id,
                            text: masterTask.task_text,
                            done: isCompleted,
                        });
                    });
                } else {
                    // For students and parents, group by month
                    masterTasks.forEach(masterTask => {
                        const month = masterTask.month;
                        if (!tasksByMonth[month]) {
                            tasksByMonth[month] = [];
                        }
                        
                        // Check if user has a completion record for this task
                        const isCompleted = completionMap.has(masterTask.id) 
                            ? completionMap.get(masterTask.id) 
                            : false;

                        tasksByMonth[month].push({
                            id: masterTask.id,
                            text: masterTask.task_text,
                            done: isCompleted,
                        });
                    });
                }

                setTasksByMonth(tasksByMonth);
                
                // Calculate progress
                const totalTasks = masterTasks.length;
                const completedTasks = Array.from(completionMap.values()).filter(Boolean).length;
                const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                
                setProgress(progressPercentage);
                setTotalTasks(totalTasks);
                setCompletedTasks(completedTasks);
                
                // Check if all tasks are completed
                checkIfAllTasksCompleted(tasksByMonth);
            } else {

                
                // Fallback: Try to get all tasks for this grade without plan filtering (for students and parents)
                if (userRole === 'Student' || userRole === 'Parent/Guardian') {

                    let fallbackTasks: any[] = [];
                    let fallbackError: any = null;

                    if (userRole === 'Student') {
                        const result = await supabase
                            .from('checklist_master_tasks')
                            .select('*')
                            .eq('grade', currentGrade);
                        fallbackTasks = result.data || [];
                        fallbackError = result.error;
                    } else if (userRole === 'Parent/Guardian') {
                        const result = await supabase
                            .from('checklist_parents')
                            .select('*')
                            .eq('grade', currentGrade);
                        fallbackTasks = result.data || [];
                        fallbackError = result.error;
                    }

                    if (fallbackError) {
                        console.error('Fallback query error:', fallbackError);
                        setTasksByMonth({});
                        setProgress(0);
                        setTotalTasks(0);
                        setCompletedTasks(0);
                        return;
                    }

                    if (fallbackTasks && fallbackTasks.length > 0) {

                        
                        // Get user's completion status for these tasks
                        const { data: userCompletions, error: completionsError } = await supabase
                            .from('checklist_items')
                            .select('master_task_id, is_completed')
                            .eq('user_id', user.id)
                            .in('master_task_id', fallbackTasks.map(task => task.id));

                        if (completionsError) throw completionsError;

                        // Create a map of completion status
                        const completionMap = new Map();
                        userCompletions?.forEach(item => {
                            completionMap.set(item.master_task_id, item.is_completed);
                        });

                        // Group tasks by month using master task data
                        const tasksByMonth: ChecklistData = {};
                        
                        fallbackTasks.forEach(masterTask => {
                            const month = masterTask.month;
                            if (!tasksByMonth[month]) {
                                tasksByMonth[month] = [];
                            }
                            
                            // Check if user has a completion record for this task
                            const isCompleted = completionMap.has(masterTask.id) 
                                ? completionMap.get(masterTask.id) 
                                : false;

                            tasksByMonth[month].push({
                                id: masterTask.id,
                                text: masterTask.task_text,
                                done: isCompleted,
                            });
                        });

                        setTasksByMonth(tasksByMonth);
                        
                        // Calculate progress
                        const totalTasks = fallbackTasks.length;
                        const completedTasks = Array.from(completionMap.values()).filter(Boolean).length;
                        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                        
                        setProgress(progressPercentage);
                        setTotalTasks(totalTasks);
                        setCompletedTasks(completedTasks);
                        
                        // Check if all tasks are completed
                        checkIfAllTasksCompleted(tasksByMonth);
                    } else {
        
                        setTasksByMonth({});
                        setProgress(0);
                        setTotalTasks(0);
                        setCompletedTasks(0);
                    }
                } else {
                    // For counselors and parents, no fallback needed
                    setTasksByMonth({});
                    setProgress(0);
                    setTotalTasks(0);
                    setCompletedTasks(0);
                }
            }
        } catch (error: any) {
            console.error('Error fetching checklist progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfAllTasksCompleted = (currentTasks: ChecklistData) => {
        const allDone = Object.values(currentTasks).every(monthTasks =>
            monthTasks.every(task => task.done)
        );
        if (allDone && Object.keys(currentTasks).length > 0) {
            setAllTasksCompleted(true);
            confettiRef.current?.start();
        } else {
            setAllTasksCompleted(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchChecklistProgress();
        setRefreshing(false);
    };

    // Auto-refresh every 30 seconds to get latest task text changes from master_tasks
    useEffect(() => {
        const interval = setInterval(() => {
            fetchChecklistProgress();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const toggleTask = async (month: string, taskId: string) => {
        const updatedTasksByMonth = { ...tasksByMonth };
        const taskIndex = updatedTasksByMonth[month].findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const task = updatedTasksByMonth[month][taskIndex];
        const newDoneStatus = !task.done;
        updatedTasksByMonth[month][taskIndex] = { ...task, done: newDoneStatus };

        const newCompletedCount = newDoneStatus ? completedTasks + 1 : completedTasks - 1;
        setCompletedTasks(newCompletedCount);
        setProgress(totalTasks > 0 ? (newCompletedCount / totalTasks) : 0);

        setTasksByMonth(updatedTasksByMonth);
        checkIfAllTasksCompleted(updatedTasksByMonth);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if user already has a completion record for this task
            const { data: existingRecord, error: checkError } = await supabase
                .from('checklist_items')
                .select('id')
                .eq('user_id', user.id)
                .eq('master_task_id', taskId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw checkError;
            }

            if (existingRecord) {
                // Update existing record
                const { error } = await supabase
                    .from('checklist_items')
                    .update({ is_completed: newDoneStatus })
                    .eq('id', existingRecord.id);

                if (error) throw error;
            } else {
                // Create new completion record
                const { error } = await supabase
                    .from('checklist_items')
                    .insert({
                        user_id: user.id,
                        master_task_id: taskId,
                        is_completed: newDoneStatus,
                    });

                if (error) throw error;
            }

            // Update checklist_progress in profiles table
            const progressString = `${newCompletedCount}/${totalTasks}`;
            const { error: progressError } = await supabase
                .from('profiles')
                .update({ checklist_progress: progressString })
                .eq('id', user.id);
            if (progressError) throw progressError;

        } catch (error: any) {
            // Revert UI on failure
            updatedTasksByMonth[month][taskIndex] = { ...task, done: !newDoneStatus };
            setTasksByMonth(updatedTasksByMonth);
            const revertedCompletedCount = !newDoneStatus ? completedTasks + 1 : completedTasks - 1;
            setCompletedTasks(revertedCompletedCount);
            setProgress(totalTasks > 0 ? (revertedCompletedCount / totalTasks) : 0);
            Alert.alert('Error', 'Failed to update task: ' + error.message);
        }
    };

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
                <ThemedText>Loading your checklist...</ThemedText>
            </ThemedView>
        );
    }
    
    if (currentGrade === 'Graduated') {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText type="title">Congratulations, Graduate!</ThemedText>
                <ThemedText>You&apos;ve completed your high school journey.</ThemedText>
            </ThemedView>
        );
    }

    if (Object.keys(tasksByMonth).length === 0) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText type="title">No tasks found for this year.</ThemedText>
                <ThemedText>Your checklist might be set up next year.</ThemedText>
            </ThemedView>
        );
    }
    

    const renderTask = ({ item, month }: { item: Task; month: string }) => {
        const link = getICANLink(item.text);
        return (
            <Pressable
                style={styles.taskContainer}
                onPress={() => toggleTask(month, item.id)}
            >
                <Ionicons
                    name={item.done ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={item.done ? '#4CAF50' : '#ccc'}
                    style={styles.checkbox}
                />
                <View style={{ flex: 1 }}>
                    <ThemedText style={[styles.taskText, item.done && styles.taskTextDone]}>
                        {item.text}
                    </ThemedText>
                    {link && (
                         <Pressable onPress={() => Linking.openURL(link)} style={styles.linkContainer}>
                             <ThemedText style={styles.linkText}>Visit Link</ThemedText>
                             <Ionicons name="open-outline" size={16} color="#007BFF" />
                         </Pressable>
                     )}
                </View>
            </Pressable>
        );
    };

    const orderedMonths = getOrderedMonths(tasksByMonth);

  return (
    <ThemedView style={styles.container}>
      <Image
                source={require('../../assets/images/icanlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
        {userName ? (
        <ThemedText style={styles.welcomeText}>
                {`Welcome, ${userName}!`}
        </ThemedText>
        ) : null}
                <ThemedText type="title" style={styles.title}>
            {userRole === 'Counselor' 
                ? `${currentGrade} Grade Counselor Checklist`
                : userRole === 'Parent/Guardian'
                ? `${currentGrade} Grade Parent Checklist`
                : `${currentGrade} Grade Checklist`
            }
        </ThemedText>
            <View style={styles.progressContainer}>
                <ThemedText style={styles.progressText}>
                    {`Progress: ${completedTasks}/${totalTasks}`}
                </ThemedText>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
            </View>
        <FlatList
                data={orderedMonths}
          keyExtractor={(month) => month}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0a7ea4']}
              tintColor="#0a7ea4"
            />
          }
          renderItem={({ item: month }) => (
                    <View style={styles.monthContainer}>
                        <ThemedText type="subtitle" style={styles.monthHeader}>{month}</ThemedText>
                        {tasksByMonth[month].map(task => (
                            <View key={task.id}>
                                {renderTask({ item: task, month })}
                            </View>
                        ))}
                    </View>
                )}
                contentContainerStyle={styles.listContentContainer}
            />
            {allTasksCompleted && (
                 <ConfettiCannon
                    count={200}
                    origin={{ x: -10, y: 0 }}
                    autoStart={false}
                    ref={confettiRef}
                    fadeOut
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
        paddingTop: 50,
        paddingBottom: 100,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
  },
  logo: {
        width: '80%',
        height: 80,
    alignSelf: 'center',
        marginBottom: 20,
  },
        title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
        textAlign: 'right',
        marginBottom: 5,
    fontSize: 14,
    color: '#666',
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    overflow: 'hidden',
  },
    progressBarFill: {
    height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
  },
    listContentContainer: {
    paddingHorizontal: 20,
  },
  monthContainer: {
        marginBottom: 20,
  },
    monthHeader: {
    fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
  },
  taskContainer: {
    flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    checkbox: {
        marginRight: 15,
  },
  taskText: {
    fontSize: 16,
  },
    taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
    linkContainer: {
        flexDirection: 'row',
    alignItems: 'center',
        marginTop: 5,
  },
  linkText: {
        color: '#007BFF',
        marginRight: 5,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
  },
});
