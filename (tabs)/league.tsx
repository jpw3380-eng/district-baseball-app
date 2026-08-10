import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LeagueDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const isVillaPark = name === 'Villa Park Little League';

  const instagramLinks: Record<string, string> = {
    'Villa Park Little League':
      'https://www.instagram.com/villa_park_little_league/',
    'Anaheim Hills Little League':
      'https://www.instagram.com/anaheimhillsll/',
    'Orange Little League':
      'https://www.instagram.com/oll_baseball/',
    'Santiago Little League':
      'https://www.instagram.com/santiago_little_league/',
    'South Sunrise Little League':
      'https://www.instagram.com/southsunrise/',
    'Tustin Eastern Little League':
      'https://www.instagram.com/tellbaseball/',
    'Tustin Western Little League':
      'https://www.instagram.com/tustinwestern/',
  };

  const instagramUrl = name ? instagramLinks[name] : undefined;

  const openVPLLApp = async () => {
    const appUrl = 'vpllstorev2://';
    const appStoreUrl =
      'https://apps.apple.com/us/app/villa-park-little-league/id6772785452';

    try {
      await Linking.openURL(appUrl);
    } catch {
      await Linking.openURL(appStoreUrl);
    }
  };

  const openInstagram = () => {
    if (instagramUrl) {
      Linking.openURL(instagramUrl);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/leagues')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      {isVillaPark && (
        <Image
          source={require('../assets/images/vpll_logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      <Text style={styles.title}>{name}</Text>

      {isVillaPark && (
        <TouchableOpacity style={styles.appButton} onPress={openVPLLApp}>
          <Text style={styles.appButtonText}>Open VPLL App</Text>
        </TouchableOpacity>
      )}

      {instagramUrl && (
        <TouchableOpacity
          style={styles.instagramButton}
          onPress={openInstagram}
        >
          <Text style={styles.instagramButtonText}>
            📸 Follow on Instagram
          </Text>
        </TouchableOpacity>
      )}

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
    marginBottom: 16,
    textAlign: 'center',
  },
  appButton: {
    backgroundColor: '#0a2a66',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  appButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  instagramButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  instagramButtonText: {
    color: '#0a2a66',
    fontWeight: 'bold',
    fontSize: 16,
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