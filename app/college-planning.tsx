import { Stack } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CollegePlanningScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'College Planning' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>🎓 ICAN College Planning – Quick Guide</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Why It Matters</ThemedText>
            <ThemedText style={styles.text}>
              If your future career requires college, it's important to plan ahead. College is more than just classes—it's a pathway to your goals, and ICAN is here to support you every step of the way.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🗺️ What You Should Plan For</ThemedText>
            
            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Academic Planning</ThemedText>
              <ThemedText style={styles.text}>
                • Choose high school classes that prepare you for your college and career goals.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Explore Colleges</ThemedText>
              <ThemedText style={styles.text}>
                • Research schools that fit your interests, values, and budget.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Apply to College</ThemedText>
              <ThemedText style={styles.text}>
                • Stay on track with deadlines and requirements.{'\n'}
                • ICAN can help with applications.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Pay for College</ThemedText>
              <ThemedText style={styles.text}>
                • Learn about scholarships, grants, loans, and budgeting wisely.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Life on Campus</ThemedText>
              <ThemedText style={styles.text}>
                • Prepare for living independently{'\n'}
                • Managing time{'\n'}
                • Joining campus activities
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🌱 Other Resources</ThemedText>
            <ThemedText style={styles.text}>
              • Planning help for elementary and middle school students{'\n'}
              • Tips for parents and returning adult students{'\n'}
              • Guidance on graduate school{'\n'}
              • Social media safety tips for protecting your future
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => Linking.openURL('https://www.icansucceed.org/college-planning')}
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