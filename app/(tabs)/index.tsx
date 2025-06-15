import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type RouteType = '/career-planning' | '/college-planning' | '/financial-aid';

const ResourceCard = ({ title, description, icon, route }: { title: string; description: string; icon: string; route: RouteType }) => {
  const router = useRouter();
  
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(route)}
    >
      <Ionicons name={icon as any} size={32} color="#0a7ea4" style={styles.cardIcon} />
      <ThemedView style={styles.cardContent}>
        <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{description}</ThemedText>
      </ThemedView>
      <Ionicons name="chevron-forward" size={24} color="#0a7ea4" />
    </Pressable>
  );
};

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/icanlogo.png')}
          style={styles.image}
          contentFit='contain'
        />
      }>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Career Planning</ThemedText>
        <ResourceCard
          title="Career Planning Guide"
          description="Explore career pathways, assessment tools, and resources to help you plan your future career."
          icon="briefcase-outline"
          route="/career-planning"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>College Planning</ThemedText>
        <ResourceCard
          title="College Planning Guide"
          description="Comprehensive resources to help you navigate the college planning process."
          icon="school-outline"
          route="/college-planning"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Financial Aid</ThemedText>
        <ResourceCard
          title="Financial Aid Guide"
          description="Learn about scholarships, grants, loans, and other financial aid options to fund your education."
          icon="cash-outline"
          route="/financial-aid"
        />
      </ThemedView>

      <ThemedView style={styles.contactSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Need Help?</ThemedText>
        <ThemedText style={styles.contactText}>
          Schedule a FREE planning session with an ICAN Advisor at ICANsucceed.org/apt
        </ThemedText>
        <Pressable
          style={styles.contactButton}
          onPress={() => Linking.openURL('https://www.icansucceed.org/apt')}
        >
          <ThemedText style={styles.contactButtonText}>Schedule Appointment</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  image: {
    height: 280,
    width: 300,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#0a7ea4',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  contactSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
