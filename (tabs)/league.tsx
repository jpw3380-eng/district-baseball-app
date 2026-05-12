import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function LeagueDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/leagues')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      {name === 'Villa Park Little League' && (
        <Image
          source={require('../assets/images/vpll_logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      <Text style={styles.title}>{name}</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/leagueSchedule',
            params: { name },
          })
        }
      >
        <Text style={styles.cardTitle}>Schedule</Text>
        <Text>Tap to view schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/leagueStandings',
            params: { name },
          })
        }
      >
        <Text style={styles.cardTitle}>Standings</Text>
        <Text>Tap to view standings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/fields',
            params: { name },
          })
        }
      >
        <Text style={styles.cardTitle}>Fields</Text>
        <Text>Tap to view fields</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/resources',
            params: { name },
          })
        }
      >
        <Text style={styles.cardTitle}>Resources</Text>
        <Text>Tap to view resources</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#0a2a66',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});