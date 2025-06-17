import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';

import { useColorScheme } from '@/hooks/useColorScheme';
import '../config/firebase'; // Initialize Firebase

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    const inAuthGroup = segments[0] === '(tabs)';
    const isPublicPage = ['career-planning', 'college-planning', 'financial-aid'].includes(segments[0]);
    const isPreferencesPage = segments[0] === 'preferences';

    if (!user && inAuthGroup && !isPublicPage) {
      router.replace('/signin');
    } else if (user && !inAuthGroup && !isPublicPage && !isPreferencesPage) {
      // You can add logic here to check for preferences in Firestore if needed
      router.replace('/(tabs)/explore');
    }
  }, [segments, user, authChecked]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="preferences" options={{ headerShown: false }} />
        <Stack.Screen name="career-planning" options={{ headerShown: true }} />
        <Stack.Screen name="college-planning" options={{ headerShown: true }} />
        <Stack.Screen name="financial-aid" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
