import { useRouter } from 'expo-router';
import {
  View,
  Text,
 StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function UpcomingScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Upcoming Events</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // future TOC page
        }}
      >
        <Text style={styles.cardTitle}>
          🏆 Tournament of Champions
        </Text>

        <Text style={styles.cardText}>
          View tournament schedules and brackets
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/chuckKibby')}
      >
        <Text style={styles.cardTitle}>
          ⚾ Chuck Kibby Tournament
        </Text>

        <Text style={styles.cardText}>
          Tournament schedules and information
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // future All Stars page
        }}
      >
        <Text style={styles.cardTitle}>
          ⭐ All Stars
        </Text>

        <Text style={styles.cardText}>
          Schedules and information coming soon
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // future Presidents page
        }}
      >
        <Text style={styles.cardTitle}>
          📅 Presidents Meeting
        </Text>

        <Text style={styles.cardText}>
          Meeting information and updates
        </Text>
      </TouchableOpacity>
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
});