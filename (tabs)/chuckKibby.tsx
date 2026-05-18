import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const BRACKETS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=588167950&single=true&output=csv';

type BracketItem = {
  tournament: string;
  title: string;
  pdfUrl: string;
};

export default function ChuckKibbyScreen() {
  const router = useRouter();
  const [brackets, setBrackets] = useState<BracketItem[]>([]);

  useEffect(() => {
    const loadBrackets = async () => {
      try {
        const response = await fetch(BRACKETS_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const parsed = rows
          .map((row) => {
            const columns = row.split(',');

            return {
              tournament: columns[0]?.trim() || '',
              title: columns[1]?.trim() || '',
              pdfUrl: columns[2]?.trim() || '',
            };
          })
          .filter(
            (item) =>
              item.tournament === 'Chuck Kibby Tournament' &&
              item.title &&
              item.pdfUrl
          );

        setBrackets(parsed);
      } catch (error) {
        console.log('Chuck Kibby brackets load error:', error);
      }
    };

    loadBrackets();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/upcoming')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chuck Kibby Tournament</Text>

      {brackets.length > 0 ? (
        brackets.map((bracket, index) => {
          const viewerUrl =
            'https://docs.google.com/gview?embedded=true&url=' +
            encodeURIComponent(bracket.pdfUrl);

          return (
            <TouchableOpacity
              key={`${bracket.title}-${index}`}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/resourceViewer',
                  params: {
                    title: bracket.title,
                    url: viewerUrl,
                    previousPage: '/chuckKibby',
                  },
                })
              }
            >
              <Text style={styles.cardTitle}>{bracket.title}</Text>
              <Text style={styles.cardText}>Tap to open bracket</Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No brackets available yet.</Text>
      )}
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
  emptyText: {
    color: '#d1d5db',
    fontSize: 16,
  },
});