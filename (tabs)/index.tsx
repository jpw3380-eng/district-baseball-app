import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ANNOUNCEMENTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=1003184179&single=true&output=csv';

const UPCOMING_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=154225636&single=true&output=csv';

type UpcomingItem = {
  title: string;
  subtitle: string;
  route: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItem[]>([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch(ANNOUNCEMENTS_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const parsed = rows
          .map((row) => row.split(',')[0]?.trim())
          .filter(Boolean);

        setAnnouncements(parsed);
      } catch (error) {
        console.log('Announcements load error:', error);
      }
    };

    const loadUpcoming = async () => {
      try {
        const response = await fetch(UPCOMING_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const parsed = rows
          .map((row) => {
            const columns = row.split(',');

            return {
              title: columns[0]?.trim() || '',
              subtitle: columns[1]?.trim() || '',
              route: columns[2]?.trim() || '/upcoming',
            };
          })
          .filter((item) => item.title);

        setUpcomingItems(parsed);
      } catch (error) {
        console.log('Upcoming load error:', error);
      }
    };

    loadAnnouncements();
    loadUpcoming();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../assets/district_logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>District 30 Little League</Text>

      <Text style={styles.subtitle}>
        Welcome to the official district app
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📣 Announcements</Text>

        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <Text key={index} style={styles.eventItem}>
              • {announcement}
            </Text>
          ))
        ) : (
          <Text style={styles.eventItem}>No announcements yet</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Upcoming</Text>

        {upcomingItems.length > 0 ? (
          upcomingItems.map((item, index) => (
            <TouchableOpacity
              key={`${item.title}-${index}`}
              style={styles.upcomingButton}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.upcomingTitle}>{item.title}</Text>
              <Text style={styles.upcomingSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.eventItem}>No upcoming events yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#d1d5db',
  },
  card: {
    backgroundColor: '#111827',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
    fontSize: 18,
  },
  eventItem: {
    color: '#ffffff',
    marginTop: 6,
    fontSize: 15,
  },
  upcomingButton: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  upcomingTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  upcomingSubtitle: {
    color: '#d1d5db',
    marginTop: 4,
    fontSize: 14,
  },
});