import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';

const villaParkResources = [
  {
    section: 'Playoff Brackets',
    items: [
      {
        title: 'Majors Playoff Bracket',
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pubhtml?gid=1166131430&single=true',
      },
      {
        title: 'AAA Playoff Bracket',
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pubhtml?gid=419235169&single=true',
      },
      {
        title: 'AA Playoff Bracket',
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pubhtml?gid=564773458&single=true',
      },
    ],
  },
  {
    section: 'League Information',
    items: [
      {
        title: 'League Rules',
        url: 'https://drive.google.com/file/d/1wvsYZAQFq12d5MLccYPavrj4WrV30Mop/preview',
      },
    ],
  },
];

export default function ResourcesScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const isVillaPark = name === 'Villa Park Little League';

  const openResource = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
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

      <Text style={styles.title}>{name} Resources</Text>

      {isVillaPark ? (
        <>
          <TouchableOpacity
            style={styles.mainCard}
            onPress={() =>
              router.push({
                pathname: '/teamsList',
                params: { name },
              })
            }
          >
            <Text style={styles.mainTitle}>Teams</Text>
            <Text style={styles.openText}>Tap to view team schedules</Text>
          </TouchableOpacity>

          {villaParkResources.map((section) => (
            <View key={section.section}>
              <Text style={styles.sectionTitle}>{section.section}</Text>

              {section.items.map((resource) => (
                <TouchableOpacity
                  key={resource.title}
                  style={styles.card}
                  onPress={() => openResource(resource.url)}
                >
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.openText}>Tap to Open</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </>
      ) : (
        <View style={styles.card}>
          <Text>Resources coming soon</Text>
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
    marginBottom: 20,
  },
  mainCard: {
    backgroundColor: '#0a2a66',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#0a2a66',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  openText: {
    marginTop: 8,
    color: '#0a2a66',
    fontWeight: 'bold',
  },
});