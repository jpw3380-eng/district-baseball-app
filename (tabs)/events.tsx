import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Papa from 'papaparse';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const EVENTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=154225636&single=true&output=csv';

type EventItem = {
  title: string;
  subtitle: string;
  route: string;
  showOnHome: string;
  details: string;
  location: string;
  date: string;
  time: string;
  link: string;
};

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`${EVENTS_URL}&t=${Date.now()}`);
        const csvText = await response.text();

        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const parsed = (result.data as any[])
          .map((row) => ({
            title: row.Title?.trim() || '',
            subtitle: row.Subtitle?.trim() || '',
            route: row.Route?.trim() || '/events',
            showOnHome: row.ShowOnHome?.trim() || '',
            details: row.Details?.trim() || '',
            location: row.Location?.trim() || '',
            date: row.Date?.trim() || '',
            time: row.Time?.trim() || '',
            link: row.Link?.trim() || '',
          }))
          .filter((item) => item.title && item.title !== 'Events');

        setEvents(parsed);
      } catch (error) {
        console.log('Events load error:', error);
      }
    };

    loadEvents();
  }, []);

  const handleEventPress = (item: EventItem) => {
    const hasExtraInfo =
      item.details || item.location || item.date || item.time || item.link;

    if (hasExtraInfo) {
      setSelectedEvent(item);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Events</Text>

        {events.length > 0 ? (
          events.map((item, index) => (
            <TouchableOpacity
              key={`${item.title}-${index}`}
              style={styles.card}
              onPress={() => handleEventPress(item)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>

              {!!item.subtitle && (
                <Text style={styles.cardText}>{item.subtitle}</Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No events available.</Text>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedEvent}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>

            {!!selectedEvent?.date && (
              <Text style={styles.modalInfo}>📅 {selectedEvent.date}</Text>
            )}

            {!!selectedEvent?.time && (
              <Text style={styles.modalInfo}>⏰ {selectedEvent.time}</Text>
            )}

            {!!selectedEvent?.location && (
              <Text style={styles.modalInfo}>📍 {selectedEvent.location}</Text>
            )}

            {!!selectedEvent?.details && (
              <Text style={styles.modalDetails}>{selectedEvent.details}</Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedEvent(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#0f1d40',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  emptyText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInfo: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 8,
  },
  modalDetails: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  closeButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});