import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const leagues = [
  'Villa Park Little League',
  'Orange Little League',
  'Tustin Western Little League',
  'Tustin Eastern Little League',
  'North Sunrise Little League',
  'South Sunrise Little League',
  'Anaheim Hills Little League',
  'Memorial Park Little League',
  'North East Santa Ana Little League',
  'Santiago Little League',
];

export default function LeaguesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leagues</Text>

      <Text style={styles.subtitle}>
        Select a district league to view schedules, standings, fields, and resources.
      </Text>

      {leagues.map((league) => (
        <TouchableOpacity
          key={league}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: '/league',
              params: { name: league },
            })
          }
        >
          <Text style={styles.leagueName}>{league}</Text>

          <Text style={styles.cardText}>
            Tap to view league info
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    marginTop: 4,
    color: '#666',
  },
});