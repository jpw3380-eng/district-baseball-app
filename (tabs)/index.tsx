import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const ANNOUNCEMENTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=1003184179&single=true&output=csv';

export default function HomeScreen() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<string[]>([]);

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

    loadAnnouncements();
  }, []);

  return (
    <View style={styles.container}>
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
          <Text style={styles.eventItem}>
            No announcements yet
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/upcoming')}
      >
        <Text style={styles.cardTitle}>📅 Upcoming</Text>

        <Text style={styles.eventItem}>
          • Tournament of Champions - May 31
        </Text>

        <Text style={styles.eventItem}>
          • All Stars Information Coming Soon
        </Text>

        <Text style={styles.eventItem}>
          • Presidents Meeting - TBD
        </Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 6,
    color: '#ffffff',
    fontSize: 18,
  },
  eventItem: {
    color: '#ffffff',
    marginTop: 6,
    fontSize: 15,
  },
});