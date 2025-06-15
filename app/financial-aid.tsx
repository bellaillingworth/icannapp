import { Stack } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function FinancialAidScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Financial Aid' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>💰 ICAN Financial Aid – Quick Guide</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Why It Matters</ThemedText>
            <ThemedText style={styles.text}>
              College is a big investment, but it's also one of the best ways to increase your lifetime earnings. ICAN helps you make smart, affordable choices about how to pay for your education.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📝 Steps to Manage Financial Aid</ThemedText>
            
            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Set a Budget</ThemedText>
              <ThemedText style={styles.text}>
                • Know your career's starting salary{'\n'}
                • Don't borrow more than what you'll earn in your first year{'\n'}
                • Consider savings, scholarships, and costs at different schools
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Understand Aid Types</ThemedText>
              <ThemedText style={styles.text}>
                • Grants: Free money based on need{'\n'}
                • Scholarships: Free money based on merit or need{'\n'}
                • Work-Study: On-campus jobs while attending school{'\n'}
                • Student Loans: Must be paid back with interest after graduation
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Create Your FSA ID</ThemedText>
              <ThemedText style={styles.text}>
                • This is your login to apply for federal aid at StudentAid.gov
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Apply for Financial Aid</ThemedText>
              <ThemedText style={styles.text}>
                • Fill out the FAFSA (Free Application for Federal Student Aid){'\n'}
                • Apply for state and school-based scholarships and grants{'\n'}
                • Look for private scholarships too
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Compare Offers</ThemedText>
              <ThemedText style={styles.text}>
                • Review financial aid packages from different schools{'\n'}
                • Make sure they match your budget and future income
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Ask for Help</ThemedText>
              <ThemedText style={styles.text}>
                • Meet with an ICAN advisor or financial aid officer{'\n'}
                • Ask about options, concerns, and how to fill funding gaps
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => Linking.openURL('https://www.icansucceed.org/financial-aid')}
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