import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const VILLA_PARK_SCHEDULE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?output=csv';

type Game = {
  date: string;
  time: string;
  division: string;
  away: string;
  home: string;
  field: string;
  awayScore?: string;
  homeScore?: string;
  status?: string;
};

export default function TeamScheduleScreen() {
  const { name, team, division } = useLocalSearchParams<{
    name: string;
    team: string;
    division: string;
  }>();

  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await fetch(VILLA_PARK_SCHEDULE_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const parsedGames = rows
          .map((row) => {
            const columns = row.split(',');

            return {
              date: columns[0]?.trim() || '',
              time: columns[1]?.trim() || '',
              division: columns[2]?.trim() || '',
              away: columns[3]?.trim() || '',
              home: columns[4]?.trim() || '',
              field: columns[5]?.trim() || '',
              awayScore: columns[6]?.trim() || '',
              homeScore: columns[7]?.trim() || '',
              status: columns[8]?.trim() || '',
            };
          })
          .filter(
            (game) =>
              game.date &&
              game.away &&
              game.home &&
              game.division === division &&
              (game.away === team || game.home === team)
          );

        setGames(parsedGames);
      } catch (error) {
        console.log('Team schedule load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [team, division]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/resources',
            params: { name },
          })
        }
      >
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{division} {team}</Text>
      <Text style={styles.subtitle}>Team Schedule</Text>

      {loading ? (
        <View style={styles.card}>
          <Text>Loading schedule...</Text>
        </View>
      ) : games.length > 0 ? (
        games.map((game, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.division}>{game.division}</Text>

            {game.status === 'Final' ? (
              <Text style={styles.score}>
                {game.away} {game.awayScore} - {game.homeScore} {game.home}
              </Text>
            ) : (
              <Text style={styles.matchup}>
                {game.away} @ {game.home}
              </Text>
            )}

            <Text style={styles.details}>
              {game.date} • {game.time}
            </Text>

            <Text style={styles.field}>{game.field}</Text>
          </View>
        ))
      ) : (
        <View style={styles.card}>
          <Text>No games found for this team.</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  division: {
    fontWeight: 'bold',
    color: '#0a2a66',
    marginBottom: 4,
  },
  matchup: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 6,
    color: '#555',
  },
  field: {
    marginTop: 4,
    color: '#777',
  },
});