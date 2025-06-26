import { supabase } from '../supabaseClient';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loaded) return;
        const inAuthGroup = segments[0] === '(tabs)';
    const currentRoute = segments.join('/');
    // Only redirect after sign-in, sign-up, or root
    const shouldRedirect =
      !session && inAuthGroup
        ? true
        : session &&
          ["signin", "signup", "", undefined].includes(currentRoute);
    if (!session && inAuthGroup) {
      router.replace('/signin');
    } else if (session && shouldRedirect) {
      supabase
        .from('profiles')
        .select('class_of')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          }
          if (!data || !data.class_of) {
            router.replace('/preferences');
          } else {
            router.replace('/(tabs)/explore');
        }
        });
      }
  }, [session, segments, loaded]);

  if (!loaded) {
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
