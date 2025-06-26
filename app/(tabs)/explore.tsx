import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, View, Linking } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { supabase } from '../../supabaseClient';
import { useFocusEffect } from 'expo-router';
import React from 'react';

export type GradeLevel = '9th' | '10th' | '11th' | '12th' | 'Graduated';

type Task = {
  id: string; // This will now be the task_id from the database
  text: string;
  done: boolean;
};

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
  // Add other links here...
  return null;
}

export default function ChecklistScreen() {
    const [tasksByMonth, setTasksByMonth] = useState<ChecklistData>({});
    const [loading, setLoading] = useState(true);
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('9th');
    const [progress, setProgress] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [userName, setUserName] = useState('');
    const [allTasksCompleted, setAllTasksCompleted] = useState(false);
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
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/signin');
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('grade, full_name')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            setUserName(profile?.full_name || '');
            const grade = profile?.grade || '9th';
            setCurrentGrade(grade);

            const { data, error } = await supabase
                .from('checklist_items')
                .select(`
                    id,
                    is_completed,
                    month,
                    grade,
                    master_task_id,
                    checklist_master_tasks (
                        task_text
                    )
                `)
                .eq('user_id', user.id)
                .eq('grade', grade);

            if (error) {
                throw error;
            }

            const formattedTasks: ChecklistData = {};
            data.forEach(item => {
                const task: Task = {
                    id: item.master_task_id,
                    text: (item.checklist_master_tasks && typeof item.checklist_master_tasks === 'object' && 'task_text' in item.checklist_master_tasks)
                      ? String(item.checklist_master_tasks.task_text)
                      : '',
                    done: item.is_completed,
                };
                if (!formattedTasks[item.month]) {
                    formattedTasks[item.month] = [];
                }
                formattedTasks[item.month].push(task);
            });

            const total = data.length;
            const completed = data.filter(t => t.is_completed).length;

            setTasksByMonth(formattedTasks);
            setTotalTasks(total);
            setCompletedTasks(completed);
            setProgress(total > 0 ? (completed / total) : 0);
            
            checkIfAllTasksCompleted(formattedTasks);

        } catch (error: any) {
            Alert.alert('Error', 'Failed to fetch checklist: ' + error.message);
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

            const { error } = await supabase
                .from('checklist_items')
                .update({ is_completed: newDoneStatus })
                .eq('user_id', user.id)
                .eq('task_id', taskId);

            if (error) {
                throw error;
            }

            // --- Update checklist_progress in profiles table ---
            // Fetch all checklist items for this user and current grade
            const { data: items, error: itemsError } = await supabase
                .from('checklist_items')
                .select('is_completed')
                .eq('user_id', user.id)
                .eq('grade', currentGrade);
            if (itemsError) throw itemsError;
            const total = items.length;
            const completed = items.filter((item: any) => item.is_completed).length;
            const progressString = `${completed}/${total}`;
            const { error: progressError } = await supabase
                .from('profiles')
                .update({ checklist_progress: progressString })
                .eq('id', user.id);
            if (progressError) throw progressError;
            // --- End update checklist_progress ---
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
                <ThemedText>You've completed your high school journey.</ThemedText>
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
                {`${currentGrade} Grade Checklist`}
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
