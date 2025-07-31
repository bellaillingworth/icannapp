import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Pressable, Linking, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface Announcement {
  id: number;
  content: string;
  created_at?: string;
  category?: string;
  link?: string;
}

export default function NotificationScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, content, created_at, category, link')
        .order('created_at', { ascending: false });
      if (!error && data) setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  const renderNotification = ({ item }: { item: Announcement }) => (
    <ThemedView style={styles.notificationCard}>
      <View style={styles.row}>
        <Image
          source={require('@/assets/images/icanlogo.png')}
          style={styles.icanIcon}
          contentFit="contain"
        />
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.notificationContent}>{item.content}</ThemedText>
          {item.link && (
            <Pressable
              style={styles.linkContainer}
              onPress={() => Linking.openURL(item.link!)}
            >
              <ThemedText style={styles.linkText}>Schedule Now</ThemedText>
              <Ionicons name="open-outline" size={16} color="#007BFF" />
            </Pressable>
          )}
          {item.created_at && (
            <ThemedText style={styles.notificationDate}>
              {new Date(item.created_at).toLocaleString()}
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Notifications</ThemedText>
      <FlatList
        data={announcements}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNotification}
        ListEmptyComponent={<ThemedText>No notifications yet.</ThemedText>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    marginTop: 45,
    marginBottom: 12,
    color: '#0a7ea4',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'left',
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icanIcon: {
    width: 36,
    height: 36,
    marginRight: 14,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  notificationContent: {
    color: '#222',
    fontSize: 16,
    marginBottom: 6,
  },
  notificationDate: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 8,
  },
  linkText: {
    color: '#9b5ba4',
    marginRight: 5,
    fontSize: 15,
    fontWeight: '600',
  },
}); 