import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>District 30 Little League</Text>

      <Text style={styles.subtitle}>
        Welcome to the official district app
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📣 Announcements</Text>
        <Text>No announcements yet</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Upcoming</Text>
        <Text>Season info coming soon</Text>
      </View>
    </View>
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
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});