import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const VILLA_PARK_SCHEDULE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?output=csv';

const VPLL_TEAMS = [
  'Blue Jays',
  'Cardinals',
  "A's",
  'Pirates',
  'Cubs',
  'Mariners',
  'Dodgers',
  'Nationals',
  'Tigers',
  'Angels',
  'Rockies',
  'Padres',
  'Braves',
  'Marlins',
  'Orioles',
  'Diamondbacks',
  'Royals',
];

type Game = {
  division: string;
  away: string;
  home: string;
  awayScore: string;
  homeScore: string;
  status: string;
  gameType: string;
};

type Standing = {
  team: string;
  wins: number;
  losses: number;
  ties: number;
  runsFor: number;
  runsAgainst: number;
};

export default function LeagueStandingsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const [standings, setStandings] = useState<Record<string, Standing[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const response = await fetch(VILLA_PARK_SCHEDULE_URL);
        const csvText = await response.text();

        const rows = csvText.trim().split('\n').slice(1);

        const games: Game[] = rows.map((row) => {
          const columns = row.split(',');

          return {
            division: columns[2]?.trim() || '',
            away: columns[3]?.trim() || '',
            home: columns[4]?.trim() || '',
            awayScore: columns[6]?.trim() || '',
            homeScore: columns[7]?.trim() || '',
            status: columns[8]?.trim() || '',
            gameType: columns[9]?.trim() || '',
          };
        });

        const finalGames = games.filter(
          (game) =>
            game.status === 'Final' &&
            game.gameType === 'Regular Season' &&
            game.away &&
            game.home &&
            game.awayScore !== '' &&
            game.homeScore !== ''
        );

        const standingsByDivision: Record<string, Record<string, Standing>> = {};

        finalGames.forEach((game) => {
          const division = game.division;
          const awayScore = Number(game.awayScore);
          const homeScore = Number(game.homeScore);

          const awayIsVPLL = VPLL_TEAMS.includes(game.away);
          const homeIsVPLL = VPLL_TEAMS.includes(game.home);

          if (!awayIsVPLL && !homeIsVPLL) return;

          if (!standingsByDivision[division]) {
            standingsByDivision[division] = {};
          }

          const addTeamIfNeeded = (teamName: string) => {
            if (!standingsByDivision[division][teamName]) {
              standingsByDivision[division][teamName] = {
                team: teamName,
                wins: 0,
                losses: 0,
                ties: 0,
                runsFor: 0,
                runsAgainst: 0,
              };
            }
          };

          if (awayIsVPLL) addTeamIfNeeded(game.away);
          if (homeIsVPLL) addTeamIfNeeded(game.home);

          if (awayIsVPLL) {
            standingsByDivision[division][game.away].runsFor += awayScore;
            standingsByDivision[division][game.away].runsAgainst += homeScore;
          }

          if (homeIsVPLL) {
            standingsByDivision[division][game.home].runsFor += homeScore;
            standingsByDivision[division][game.home].runsAgainst += awayScore;
          }

          if (awayScore > homeScore) {
            if (awayIsVPLL) standingsByDivision[division][game.away].wins += 1;
            if (homeIsVPLL) standingsByDivision[division][game.home].losses += 1;
          } else if (homeScore > awayScore) {
            if (homeIsVPLL) standingsByDivision[division][game.home].wins += 1;
            if (awayIsVPLL) standingsByDivision[division][game.away].losses += 1;
          } else {
            if (awayIsVPLL) standingsByDivision[division][game.away].ties += 1;
            if (homeIsVPLL) standingsByDivision[division][game.home].ties += 1;
          }
        });

        const sortedStandings: Record<string, Standing[]> = {};

        Object.keys(standingsByDivision).forEach((division) => {
          sortedStandings[division] = Object.values(standingsByDivision[division]).sort(
            (a, b) => {
              const gamesA = a.wins + a.losses + a.ties;
              const gamesB = b.wins + b.losses + b.ties;

              const winPctA = gamesA === 0 ? 0 : (a.wins + a.ties * 0.5) / gamesA;
              const winPctB = gamesB === 0 ? 0 : (b.wins + b.ties * 0.5) / gamesB;

              if (winPctB !== winPctA) return winPctB - winPctA;

              const diffA = a.runsFor - a.runsAgainst;
              const diffB = b.runsFor - b.runsAgainst;

              return diffB - diffA;
            }
          );
        });

        setStandings(sortedStandings);
      } catch (error) {
        console.log('Standings error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (name === 'Villa Park Little League') {
      loadStandings();
    } else {
      setLoading(false);
    }
  }, [name]);

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

      <Text style={styles.title}>{name} Standings</Text>

      {loading ? (
        <View style={styles.card}>
          <Text>Loading standings...</Text>
        </View>
      ) : Object.keys(standings).length > 0 ? (
        Object.keys(standings).map((division) => (
          <View key={division}>
            <Text style={styles.divisionTitle}>{division}</Text>

            {standings[division].map((team) => {
              const diff = team.runsFor - team.runsAgainst;

              return (
                <View key={team.team} style={styles.row}>
                  <View>
                    <Text style={styles.team}>{team.team}</Text>
                    <Text style={styles.sub}>
                      RF: {team.runsFor} | RA: {team.runsAgainst} | DIFF: {diff}
                    </Text>
                  </View>

                  <Text style={styles.record}>
                    {team.wins}-{team.losses}
                    {team.ties > 0 ? `-${team.ties}` : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        ))
      ) : (
        <View style={styles.card}>
          <Text>No regular season final scores yet</Text>
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
    marginBottom: 16,
  },
  divisionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: '#0a2a66',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
  },
  row: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  team: {
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  record: {
    fontWeight: 'bold',
  },
});