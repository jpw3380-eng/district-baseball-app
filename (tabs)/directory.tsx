import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Papa from 'papaparse';
import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const DIRECTORY_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=1584674481&single=true&output=csv';

type LeagueDirectoryItem = {
  league: string;
  president: string;
  presidentEmail: string;
  fieldName: string;
  address: string;
  website: string;
  notes: string;
};

export default function DirectoryScreen() {
  const router = useRouter();
  const [leagues, setLeagues] = useState<LeagueDirectoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDirectory = async () => {
    try {
      const response = await fetch(`${DIRECTORY_URL}&t=${Date.now()}`);
      const csvText = await response.text();

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const parsed = (result.data as any[])
        .map((row) => ({
          league: row.League?.trim() || '',
          president: row.President?.trim() || '',
          presidentEmail: row.PresidentEmail?.trim() || '',
          fieldName: row.FieldName?.trim() || '',
          address: row.Address?.trim() || '',
          website: row.Website?.trim() || '',
          notes: row.Notes?.trim() || '',
        }))
        .filter((item) => item.league);

      setLeagues(parsed);
    } catch (error) {
      console.log('Directory load error:', error);
    }
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDirectory();
    setRefreshing(false);
  };

  const openEmail = (email: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  };

  const openWebsite = (website: string) => {
    if (!website) return;

    const url = website.startsWith('http') ? website : `https://${website}`;
    Linking.openURL(url);
  };

  const openDirections = (address: string) => {
    if (!address) return;

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    Linking.openURL(mapUrl);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity onPress={() => router.push('/directoryMenu')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>League Directory</Text>
      <Text style={styles.subtitle}>Presidents, fields, websites, and directions</Text>

      {leagues.length > 0 ? (
        leagues.map((item, index) => (
          <View key={`${item.league}-${index}`} style={styles.card}>
            <Text style={styles.leagueName}>{item.league}</Text>

            {!!item.president && (
              <>
                <Text style={styles.label}>President</Text>
                <Text style={styles.value}>{item.president}</Text>
              </>
            )}

            {!!item.fieldName && (
              <>
                <Text style={styles.label}>Home Field</Text>
                <Text style={styles.value}>{item.fieldName}</Text>
              </>
            )}

            {!!item.address && (
              <>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{item.address}</Text>
              </>
            )}

            {!!item.notes && (
              <>
                <Text style={styles.label}>Notes</Text>
                <Text style={styles.value}>{item.notes}</Text>
              </>
            )}

            <View style={styles.buttonRow}>
              {!!item.presidentEmail && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openEmail(item.presidentEmail)}
                >
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
              )}

              {!!item.website && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openWebsite(item.website)}
                >
                  <Text style={styles.buttonText}>Website</Text>
                </TouchableOpacity>
              )}

              {!!item.address && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openDirections(item.address)}
                >
                  <Text style={styles.buttonText}>Directions</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No league directory entries yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#0f1d40',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  leagueName: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#93c5fd',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 3,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    color: '#d1d5db',
    fontSize: 16,
  },
});