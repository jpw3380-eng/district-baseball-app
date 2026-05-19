import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const VILLA_PARK_SCHEDULE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?output=csv';

type TeamItem = {
  division: string;
  team: string;
  label: string;
};

export default function TeamsListScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetch(VILLA_PARK_SCHEDULE_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const allTeams: TeamItem[] = [];

        rows.forEach((row) => {
          const columns = row.split(',');

          const division = columns[2]?.trim();
          const away = columns[3]?.trim();
          const home = columns[4]?.trim();
          const gameType = columns[9]?.trim();

          // ONLY regular season games
          if (gameType === 'Playoff') return;

          // Skip playoff placeholder teams and interleague teams
if (
  away?.startsWith('#') ||
  home?.startsWith('#') ||
  away?.startsWith('AH') ||
  home?.startsWith('AH') ||
  away?.startsWith('NS') ||
  home?.startsWith('NS')
) return;

          if (division && away) {
            allTeams.push({
              division,
              team: away,
              label: `${division} ${away}`,
            });
          }

          if (division && home) {
            allTeams.push({
              division,
              team: home,
              label: `${division} ${home}`,
            });
          }
        });

        const uniqueTeams = Array.from(
          new Map(
            allTeams.map((team) => [
              `${team.division}-${team.team}`,
              team,
            ])
          ).values()
        ).sort((a, b) => a.label.localeCompare(b.label));

        setTeams(uniqueTeams);
      } catch (error) {
        console.log('Teams load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

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

      <Text style={styles.title}>Teams</Text>

      {loading ? (
        <View style={styles.card}>
          <Text>Loading teams...</Text>
        </View>
      ) : (
        teams.map((team) => (
          <TouchableOpacity
            key={team.label}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/teamSchedule',
                params: {
                  name,
                  team: team.team,
                  division: team.division,
                },
              })
            }
          >
            <Text style={styles.teamName}>
              {team.label}
            </Text>

            <Text style={styles.openText}>
              Tap to view schedule
            </Text>
          </TouchableOpacity>
        ))
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  openText: {
    marginTop: 8,
    color: '#0a2a66',
    fontWeight: 'bold',
  },
});