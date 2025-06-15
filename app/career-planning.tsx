import { Stack } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CareerPlanningScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Career Planning' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>📘 ICAN Career Planning – Quick Guide</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Why It Matters</ThemedText>
            <ThemedText style={styles.text}>
              Iowa ranks high in opportunity and offers many career paths. ICAN helps students match their interests with careers, plan education, and budget wisely.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🎯 Four Steps to Plan Your Future</ThemedText>
            
            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Explore Careers</ThemedText>
              <ThemedText style={styles.text}>
                • Take assessments (like MyACT or RIASEC) to learn what careers fit your interests.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Find Your Path</ThemedText>
              <ThemedText style={styles.text}>
                • Use results to explore career clusters (healthcare, tech, trades, etc.) and the training needed.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Know Your Options</ThemedText>
              <ThemedText style={styles.text}>
                College isn't just 4 years. You can choose:{'\n'}
                • Apprenticeships{'\n'}
                • Certificates or 2-year degrees{'\n'}
                • 4-year college{'\n'}
                • Military or trade schools
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Budget Smart</ThemedText>
              <ThemedText style={styles.text}>
                • Learn your starting salary.{'\n'}
                • Don't borrow more than that.{'\n'}
                • Plan your education around what you can afford.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => Linking.openURL('https://www.icansucceed.org/career-planning')}
            >
              <ThemedText style={styles.buttonText}>Learn More on ICAN Website</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 24,
    color: '#0a7ea4',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#0a7ea4',
  },
  step: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stepTitle: {
    marginBottom: 8,
    color: '#0a7ea4',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 