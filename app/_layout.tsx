import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import '../config/firebase'; // Initialize Firebase

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const inAuthGroup = segments[0] === '(tabs)';
        const isPublicPage = ['career-planning', 'college-planning', 'financial-aid'].includes(segments[0]);
        const isPreferencesPage = segments[0] === 'preferences';

        if (!userData && inAuthGroup && !isPublicPage) {
          // Redirect to signup if no user data and trying to access protected routes
          router.replace('/signup');
        } else if (userData && !inAuthGroup && !isPublicPage && !isPreferencesPage) {
          // Parse user data to check if preferences are set
          const parsedUserData = JSON.parse(userData);
          const hasPreferences = parsedUserData.grade && parsedUserData.role;

          if (hasPreferences) {
            // Only redirect to explore if preferences are set
            router.replace('/(tabs)/explore');
          } else {
            // Redirect to preferences if they're not set
            router.replace('/preferences');
          }
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      }
    };

    checkUserData();
  }, [segments]);

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
