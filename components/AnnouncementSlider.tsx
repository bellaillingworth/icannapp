import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { supabase } from '@/supabaseClient';

const EXAMPLE_ANNOUNCEMENTS = [
  'Welcome to ICAN!',
  'Check out our new college planning resources.',
  'Book a free session with an ICAN advisor today!',
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const BASE_SPEED = 60; // pixels per second

export default function AnnouncementSlider() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase.from('announcements').select('content');
      if (!error && data && data.length > 0) {
        setAnnouncements(data.map((a: any) => a.content));
      } else {
        setAnnouncements(EXAMPLE_ANNOUNCEMENTS);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length === 0 || textWidth === 0) return;
    translateX.setValue(SCREEN_WIDTH);
    const distance = SCREEN_WIDTH + textWidth;
    const duration = (distance / BASE_SPEED) * 1000; // ms
    Animated.timing(translateX, {
      toValue: -textWidth,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }
    });
    return () => translateX.stopAnimation();
  }, [announcements, currentIndex, textWidth]);

  if (announcements.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.marqueeWrapper}>
        <Animated.Text
          style={[styles.announcementText, { transform: [{ translateX }] }]}
          onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
        >
          {announcements[currentIndex]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffe066',
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  marqueeWrapper: {
    width: '100%',
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  announcementText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 