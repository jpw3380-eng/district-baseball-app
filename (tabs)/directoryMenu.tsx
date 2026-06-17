import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DirectoryMenuScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Directory</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/district-staff')}
      >
        <Text style={styles.cardTitle}>District Staff</Text>
        <Text style={styles.cardText}>
          District leadership and contact information
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/directory')}
      >
        <Text style={styles.cardTitle}>League Directory</Text>
        <Text style={styles.cardText}>
          Presidents, fields, websites, and directions
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#0f1d40',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: '#d1d5db',
    fontSize: 15,
  },
});