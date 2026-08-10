import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Field = {
  name: string;
  address: string;
};

const leagueFields: Record<string, Field[]> = {
  'Villa Park Little League': [
    {
      name: 'Cerro Villa Middle School',
      address: '17852 Serrano Ave, Villa Park, CA 92861',
    },
  ],

  'Orange Little League': [
    {
      name: 'Portola Middle School',
      address: '300 N Elm St, Orange, CA 92868',
    },
  ],

  'Tustin Western Little League': [
    {
      name: 'Hewes Middle School',
      address: '19061 Foothill Blvd, Santa Ana, CA 92705',
    },
  ],

  'Tustin Eastern Little League': [
    {
      name: 'C.E. Utt Middle School',
      address: '13601 Browning Ave, Tustin, CA 92780',
    },
  ],

  'North Sunrise Little League': [
    {
      name: 'Handy Park',
      address: '2100 E Oakmont Ave, Orange, CA 92867',
    },
  ],

  'South Sunrise Little League': [
    {
      name: 'McPherson Athletic Facility',
      address: '391 S Prospect St, Orange, CA 92869',
    },
  ],

  'Anaheim Hills Little League': [
    {
      name: 'Crescent Elementary School',
      address: '5001 Gerda Dr, Anaheim, CA 92807',
    },
  ],

  'Memorial Park Little League': [
    {
      name: 'Memorial Park',
      address: '2100 S Flower St, Santa Ana, CA 92707',
    },
  ],

  'North East Santa Ana Little League': [
    {
      name: 'NESALL',
      address: '2100 N Grand Ave, Santa Ana, CA 92705',
    },
  ],

  'Santiago Little League': [
    {
      name: 'El Salvador Park',
      address: '1825 W Civic Center Dr, Santa Ana, CA 92703',
    },
  ],
};

export default function FieldsScreen() {
  const params = useLocalSearchParams<{ name?: string | string[] }>();
  const router = useRouter();

  const leagueName = Array.isArray(params.name)
    ? params.name[0]
    : params.name || '';

  const fields = leagueFields[leagueName] || [];

  const openMap = async (field: Field) => {
    const fullLocation = `${field.name}, ${field.address}`;
    const encodedLocation = encodeURIComponent(fullLocation);

    const mapUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?q=${encodedLocation}`
        : `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

    try {
      const supported = await Linking.canOpenURL(mapUrl);

      if (!supported) {
        Alert.alert(
          'Unable to Open Maps',
          'A maps application could not be opened on this device.'
        );
        return;
      }

      await Linking.openURL(mapUrl);
    } catch (error) {
      console.error('Error opening map:', error);

      Alert.alert(
        'Unable to Open Maps',
        'There was a problem opening directions.'
      );
    }
  };

  const goBack = () => {
    router.push({
      pathname: '/league',
      params: { name: leagueName },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {leagueName ? `${leagueName} Fields` : 'League Fields'}
      </Text>

      {fields.length > 0 ? (
        fields.map((field) => (
          <TouchableOpacity
            key={`${leagueName}-${field.name}`}
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => openMap(field)}
          >
            <Text style={styles.fieldName}>🏟️ {field.name}</Text>

            <Text style={styles.address}>{field.address}</Text>

            <Text style={styles.mapLink}>📍 Get Directions</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.card}>
          <Text style={styles.noFields}>
            No field information is available for this league.
          </Text>
        </View>
      )}
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  address: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 10,
  },
  mapLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0a2a66',
  },
  noFields: {
    color: '#666666',
    fontSize: 15,
  },
});