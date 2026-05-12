import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const villaParkFields = [
  {
    name: 'Villa Park Little League',
    address: '17852 Santiago Blvd, Villa Park, CA 92861',
  },
];

export default function FieldsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const openMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    Linking.openURL(url);
  };

  const isVillaPark = name === 'Villa Park Little League';

  return (
    <View style={styles.container}>
      <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: '/league',
      params: { name },
    })
  }
>
  <Text style={styles.backButton}>← Back</Text>
</TouchableOpacity>

      <Text style={styles.title}>{name} Fields</Text>

      {isVillaPark ? (
        villaParkFields.map((field) => (
          <TouchableOpacity
            key={field.name}
            style={styles.card}
            onPress={() => openMap(field.address)}
          >
            <Text style={styles.fieldName}>
              {field.name}
            </Text>

            <Text style={styles.address}>
              {field.address}
            </Text>

            <Text style={styles.mapLink}>
              📍 Get Directions
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.card}>
          <Text>Field info coming soon</Text>
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  address: {
    marginTop: 6,
    color: '#666',
  },
  mapLink: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#0a2a66',
  },
});