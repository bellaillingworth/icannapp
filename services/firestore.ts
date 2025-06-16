import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// Types
export interface UserData {
  id: string;
  name: string;
  email: string;
  grade?: string;
  tasks?: {
    [key: string]: {
      [key: string]: {
        id: string;
        text: string;
        done: boolean;
      }[];
    };
  };
}

// User operations
export const createUser = async (userData: UserData) => {
  try {
    await setDoc(doc(db, 'users', userData.id), userData);
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, data: Partial<UserData>) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// Task operations
export const updateTask = async (userId: string, grade: string, month: string, taskId: string, done: boolean) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      const tasks = userData.tasks || {};
      const gradeTasks = tasks[grade] || {};
      const monthTasks = gradeTasks[month] || [];
      
      const updatedTasks = monthTasks.map(task => 
        task.id === taskId ? { ...task, done } : task
      );
      
      const updatedData = {
        tasks: {
          ...tasks,
          [grade]: {
            ...gradeTasks,
            [month]: updatedTasks
          }
        }
      };
      
      await updateDoc(userRef, updatedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

// Resource operations
export const getResources = async (type: 'career' | 'college' | 'financial') => {
  try {
    const resourcesRef = collection(db, 'resources');
    const q = query(resourcesRef, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    
    const resources = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return resources;
  } catch (error) {
    console.error('Error getting resources:', error);
    return [];
  }
}; 