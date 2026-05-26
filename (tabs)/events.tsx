import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const EVENTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=154225636&single=true&output=csv';

type EventItem = {
  title: string;
  subtitle: string;
  route: string;
};

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`${EVENTS_URL}&t=${Date.now()}`);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const parsed = rows
          .map((row) => {
            const columns = row.split(',');

           return {
  title: columns[0]?.trim() || '',
  subtitle: columns[1]?.trim() || '',
  route: columns[2]?.trim() || '/events',
};
          })
          .filter((item) => item.title && item.title !== 'Events');

        setEvents(parsed);
      } catch (error) {
        console.log('Events load error:', error);
      }
    };

    loadEvents();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Events</Text>

      {events.length > 0 ? (
        events.map((item, index) => (
          <TouchableOpacity
            key={`${item.title}-${index}`}
            style={styles.card}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>No events yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#d1d5db',
    fontSize: 15,
  },
  emptyText: {
    color: '#d1d5db',
    fontSize: 16,
  },
});