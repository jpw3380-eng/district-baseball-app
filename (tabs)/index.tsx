import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const ANNOUNCEMENTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=1003184179&single=true&output=csv';

const UPCOMING_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=154225636&single=true&output=csv';

const PUSH_TOKEN_URL =
  'https://script.google.com/macros/s/AKfycbyh3Fym0_8NNEwxofPuMno_gFqvEBFQ_GySTqwWK8A5GJlppdBjpwPWwGNtW56iGWg1/exec';

type UpcomingItem = {
  title: string;
  subtitle: string;
  route: string;
  showOnHome: boolean;
};

async function savePushTokenToSheet(token: string) {
  try {
    await fetch(PUSH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        token,
        device: Device.deviceName || Device.modelName || 'Unknown Device',
      }),
    });

    console.log('Push token saved to sheet.');
  } catch (error) {
    console.log('Push token save error:', error);
  }
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device.');
    return;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission was not granted.');
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log('No EAS project ID found for push notifications.');
    return;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  console.log('EXPO PUSH TOKEN:', token);

  await savePushTokenToSheet(token);

  return token;
}

export default function HomeScreen() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch(`${ANNOUNCEMENTS_URL}&t=${Date.now()}`);
      const csvText = await response.text();

      const rows = csvText.trim().split('\n').slice(1);

      const parsed = rows
        .map((row) => row.split(',')[0]?.trim())
        .filter(Boolean);

      setAnnouncements(parsed);
    } catch (error) {
      console.log('Announcements load error:', error);
    }
  };

  const loadUpcoming = async () => {
    try {
      const response = await fetch(`${UPCOMING_URL}&t=${Date.now()}`);
      const csvText = await response.text();

      const rows = csvText.trim().split('\n').slice(1);

      const parsed = rows
        .map((row) => {
          const columns = row.split(',');

          return {
            title: columns[0]?.trim() || '',
            subtitle: columns[1]?.trim() || '',
            route: columns[2]?.trim() || '/events',
            showOnHome: columns[3]?.trim()?.toLowerCase() === 'yes',
          };
        })
        .filter((item) => item.title && item.showOnHome);

      setUpcomingItems(parsed);
    } catch (error) {
      console.log('Upcoming load error:', error);
    }
  };

  const loadHomeData = async () => {
    await Promise.all([loadAnnouncements(), loadUpcoming()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadHomeData();
    registerForPushNotificationsAsync();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image
        source={require('../assets/district_logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>District 30 Little League</Text>

      <Text style={styles.subtitle}>Welcome to the official district app</Text>

      <TouchableOpacity
        style={styles.websiteButton}
        onPress={() =>
          Linking.openURL(
            'https://tshq.bluesombrero.com/Default.aspx?tabid=1515770'
          )
        }
      >
        <Text style={styles.websiteButtonText}>🌐 Visit District 30 Website</Text>
      </TouchableOpacity>

      <ScrollView style={styles.card}>
        <Text style={styles.cardTitle}>📣 Announcements</Text>

        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <Text key={index} style={styles.eventItem}>
              • {announcement}
            </Text>
          ))
        ) : (
          <Text style={styles.eventItem}>No announcements yet</Text>
        )}
      </ScrollView>

      <ScrollView style={styles.card}>
        <Text style={styles.cardTitle}>📅 Events</Text>

        {upcomingItems.length > 0 ? (
          upcomingItems.map((item, index) => (
            <TouchableOpacity
              key={`${item.title}-${index}`}
              style={styles.upcomingButton}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.upcomingTitle}>{item.title}</Text>
              <Text style={styles.upcomingSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.eventItem}>No events yet</Text>
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 14,
    textAlign: 'center',
    color: '#d1d5db',
  },
  websiteButton: {
    backgroundColor: '#0a2a66',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  websiteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#111827',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 8,
  },
  eventItem: {
    color: '#ffffff',
    marginTop: 6,
    fontSize: 15,
  },
  upcomingButton: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  upcomingTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  upcomingSubtitle: {
    color: '#d1d5db',
    marginTop: 4,
    fontSize: 14,
  },
});