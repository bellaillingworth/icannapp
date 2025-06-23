import { supabase } from '../supabaseClient';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

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
        const { data: { session } } = await supabase.auth.getSession();
        const inAuthGroup = segments[0] === '(tabs)';
        const isPublicPage = ['career-planning', 'college-planning', 'financial-aid'].includes(segments[0]);
        const isPreferencesPage = segments[0] === 'preferences';

        if (!session && inAuthGroup && !isPublicPage) {
          // Redirect to signup if not logged in and trying to access protected routes
          router.replace('/signup');
        } else if (session && !inAuthGroup && !isPublicPage && !isPreferencesPage) {
          // You can fetch user metadata here if needed
          // For now, just redirect to explore
          router.replace('/(tabs)/explore');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
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
