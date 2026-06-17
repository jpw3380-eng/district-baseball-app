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

const DISTRICT_STAFF_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=325225635&single=true&output=csv';

type StaffItem = {
  name: string;
  title: string;
  email: string;
  phone: string;
  notes: string;
};

export default function DistrictStaffScreen() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadStaff = async () => {
    try {
      const response = await fetch(`${DISTRICT_STAFF_URL}&t=${Date.now()}`);
      const csvText = await response.text();

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const parsed = (result.data as any[])
        .map((row) => ({
          name: row.Name?.trim() || '',
          title: row.Title?.trim() || '',
          email: row.Email?.trim() || '',
          phone: row.Phone?.trim() || '',
          notes: row.Notes?.trim() || '',
        }))
        .filter((item) => item.name || item.title);

      setStaff(parsed);
    } catch (error) {
      console.log('District staff load error:', error);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStaff();
    setRefreshing(false);
  };

  const openEmail = (email: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  };

  const callPhone = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
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

      <Text style={styles.title}>District Staff</Text>
      <Text style={styles.subtitle}>District 30 contacts and leadership</Text>

      {staff.length > 0 ? (
        staff.map((item, index) => (
          <View key={`${item.name}-${index}`} style={styles.card}>
            {!!item.name && <Text style={styles.staffName}>{item.name}</Text>}

            {!!item.title && <Text style={styles.staffTitle}>{item.title}</Text>}

            {!!item.email && (
              <>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{item.email}</Text>
              </>
            )}

            {!!item.phone && (
              <>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{item.phone}</Text>
              </>
            )}

            {!!item.notes && (
              <>
                <Text style={styles.label}>Notes</Text>
                <Text style={styles.value}>{item.notes}</Text>
              </>
            )}

            <View style={styles.buttonRow}>
              {!!item.email && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openEmail(item.email)}
                >
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
              )}

              {!!item.phone && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => callPhone(item.phone)}
                >
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No district staff entries yet.</Text>
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
  staffName: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  staffTitle: {
    color: '#93c5fd',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
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