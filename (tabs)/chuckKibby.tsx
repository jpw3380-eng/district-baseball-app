import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const chuckKibbyResources = [
  {
    title: 'Majors Red Bracket',
    url:
      'https://docs.google.com/gview?embedded=true&url=' +
      encodeURIComponent(
        'https://raw.githubusercontent.com/jpw3380-eng/district-baseball-app/main/assets/ck_majorsRed_bracket.pdf'
      ),
  },
];

export default function ChuckKibbyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/upcoming')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chuck Kibby Tournament</Text>

      {chuckKibbyResources.map((resource) => (
        <TouchableOpacity
          key={resource.title}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: '/resourceViewer',
              params: {
                title: resource.title,
                url: resource.url,
                previousPage: '/chuckKibby',
              },
            })
          }
        >
          <Text style={styles.cardTitle}>{resource.title}</Text>
          <Text style={styles.cardText}>Tap to open bracket</Text>
        </TouchableOpacity>
      ))}
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