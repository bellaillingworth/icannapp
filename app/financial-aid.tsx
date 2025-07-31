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
          <ThemedText type="title" style={styles.title}>💰 Financial Aid</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>An Investment in Yourself</ThemedText>
            <ThemedText style={styles.text}>
              A college education is a big committement, but it's also an investment in your future. Studies show that adults with a bachelor's degreee earn an $1.2 million more than the average high school diploma holder. {'\n'}
              {'\n'}
              ICAN can help you make informed decisions about how to reach your career goals and cover the costs to get there.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📝 The Financial Aid Process</ThemedText>
            
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
                • <ThemedText style={{ fontWeight: 'bold', color: '#007dc3' }}>Grants:</ThemedText> Free money based on need{'\n'}
                • <ThemedText style={{ fontWeight: 'bold', color: '#007dc3' }}>Scholarships:</ThemedText> Free money based on merit or need{'\n'}
                • <ThemedText style={{ fontWeight: 'bold', color: '#007dc3' }}>Work-Study:</ThemedText> Free On-campus jobs while attending school{'\n'}
                • <ThemedText style={{ fontWeight: 'bold', color: '#007dc3' }}>Student Loans:</ThemedText>Free Must be paid back with interest after graduationn
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Create Your StudentAid.gov Account</ThemedText>
              <ThemedText style={styles.text}>
                • Also known as the FSA ID, this is your login to apply for federal aid on the FAFSA{'\n'}
                • Setup your account at{' '}
                <ThemedText
                  style={{ color: '#9b5ba4', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://studentaid.gov/fsa-id/create-account/launch')}
                >
                  studentaid.gov
                                  </ThemedText>
                {' '} {'\n'}
                 • View a video and learn about the entire process at{" "}
                <ThemedText
                  style={{ color: '#9b5ba4', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://www.icansucceed.org/studentaidaccount')}
                >
                  ICANsucceed.org/studentaidaccount
                </ThemedText>
                {' '} {'\n'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.step}>
              <ThemedText type="subtitle" style={styles.stepTitle}>Apply for Financial Aid</ThemedText>
              <ThemedText style={styles.text}>
                • Fill out the FAFSA (Free Application for Federal Student Aid) {' '}
                <ThemedText
                  style={{ color: '#9b5ba4', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://www.icansucceed.org/apt')}
                >
                  Schedule a Free FAFSA appointment, virtually or in-person with ICAN
                </ThemedText>
                {' '} {'\n'}
                • {' '}
                <ThemedText
                  style={{ color: '#9b5ba4', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://educate.iowa.gov/higher-ed/financial-aid/ifaa')}
                >
                  Apply for state of Iowa aid
                </ThemedText>
                {' '} {'\n'}
                • Apply for school-based scholarships and grants{'\n'}
                • Search for private scholarships in the {' '}
                <ThemedText
                  style={{ color: '#9b5ba4', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://www.step1scholarships.org/')}
                >
                  ICAN Scholarship Database
                </ThemedText>
                {' '} {'\n'}
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
                • Meet with an ICAN advisor - {' '}
                <ThemedText
                  style={{ color: '#9b5ba4', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL('https://www.icansucceed.org/apt')}
                >
                  Click here to schedule
                </ThemedText>
                {' '} {'\n'}
                • Ask about options, concerns, and how to fill funding gaps
                {' '} {'\n'}
                • You can also speak to your school's financial aid office
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
    color: '#007dc3',
  },
  step: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stepTitle: {
    marginBottom: 8,
    color: '#007dc3',
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
    backgroundColor: '#9b5ba4',
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