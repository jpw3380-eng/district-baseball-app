import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Papa from 'papaparse';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BRACKETS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=588167950&single=true&output=csv';

const ALL_STARS_GAMES_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTldb_YdOdt9VxKl96n2qS9N0xnFPF8VwBYPUrsGGnNituw1xtYQ4SbSsGPFkmmvFsUHuhkK5LdD5XT/pub?gid=960020019&single=true&output=csv';

type BracketItem = {
  tournament: string;
  title: string;
  pdfUrl: string;
  version: string;
};

type AllStarGame = {
  round: string;
  division: string;
  format: string;
  date: string;
  time: string;
  field: string;
  team1: string;
  team2: string;
  team1Score: string;
  team2Score: string;
  status: string;
  pool: string;
  notes: string;
};

type StandingRow = {
  team: string;
  wins: number;
  losses: number;
  ties: number;
  runsFor: number;
  runsAgainst: number;
  runDiff: number;
};

export default function AllStarsScreen() {
  const router = useRouter();

  const [brackets, setBrackets] = useState<BracketItem[]>([]);
  const [games, setGames] = useState<AllStarGame[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRound, setSelectedRound] = useState('All');
  const [selectedDivision, setSelectedDivision] = useState('All');

  const loadBrackets = async () => {
    try {
      const response = await fetch(`${BRACKETS_URL}&t=${Date.now()}`);
      const csvText = await response.text();

      const rows = csvText.trim().split('\n').slice(1);

      const parsed = rows
        .map((row) => {
          const columns = row.split(',');

          return {
            tournament: columns[0]?.trim() || '',
            title: columns[1]?.trim() || '',
            pdfUrl: columns[2]?.trim() || '',
            version: columns[3]?.trim() || '1',
          };
        })
        .filter(
          (item) =>
            item.tournament === 'All Stars' &&
            item.title &&
            item.pdfUrl
        );

      setBrackets(parsed);
    } catch (error) {
      console.log('All Stars brackets load error:', error);
    }
  };

  const loadGames = async () => {
    try {
      const response = await fetch(`${ALL_STARS_GAMES_URL}&t=${Date.now()}`);
      const csvText = await response.text();

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const parsed = (result.data as any[])
        .map((row) => ({
          round: row.Round?.trim() || '',
          division: row.Division?.trim() || '',
          format: row.Format?.trim() || '',
          date: row.Date?.trim() || '',
          time: row.Time?.trim() || '',
          field: row.Field?.trim() || '',
          team1: row.Team1?.trim() || '',
          team2: row.Team2?.trim() || '',
          team1Score: row.Team1Score?.trim() || '',
          team2Score: row.Team2Score?.trim() || '',
          status: row.Status?.trim() || '',
          pool: row.Pool?.trim() || '',
          notes: row.Notes?.trim() || '',
        }))
        .filter((item) => item.round || item.division || item.team1 || item.team2);

      setGames(parsed);
    } catch (error) {
      console.log('All Stars games load error:', error);
    }
  };

  const loadAllStarsData = async () => {
    await Promise.all([loadBrackets(), loadGames()]);
  };

  useEffect(() => {
    loadAllStarsData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllStarsData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllStarsData();
    setRefreshing(false);
  };

  const rounds = useMemo(() => {
    const unique = Array.from(new Set(games.map((g) => g.round).filter(Boolean)));
    return ['All', ...unique];
  }, [games]);

  const divisions = useMemo(() => {
    const unique = Array.from(
      new Set(games.map((g) => g.division).filter(Boolean))
    );
    return ['All', ...unique];
  }, [games]);

  const filteredGames = games.filter((game) => {
    const roundMatch = selectedRound === 'All' || game.round === selectedRound;
    const divisionMatch =
      selectedDivision === 'All' || game.division === selectedDivision;

    return roundMatch && divisionMatch;
  });

  const hasScore = (game: AllStarGame) =>
    game.team1Score !== '' && game.team2Score !== '';

  const isDoubleElimination = (game: AllStarGame) =>
    game.format.toLowerCase().includes('double');

  const standingsByPool = useMemo(() => {
    const pools: Record<string, Record<string, StandingRow>> = {};

    filteredGames
      .filter((game) => hasScore(game))
      .filter((game) => !isDoubleElimination(game))
      .forEach((game) => {
        const team1Score = Number(game.team1Score);
        const team2Score = Number(game.team2Score);
        const poolName = game.pool || 'Standings';

        if (
          !game.team1 ||
          !game.team2 ||
          Number.isNaN(team1Score) ||
          Number.isNaN(team2Score)
        ) {
          return;
        }

        if (!pools[poolName]) {
          pools[poolName] = {};
        }

        if (!pools[poolName][game.team1]) {
          pools[poolName][game.team1] = {
            team: game.team1,
            wins: 0,
            losses: 0,
            ties: 0,
            runsFor: 0,
            runsAgainst: 0,
            runDiff: 0,
          };
        }

        if (!pools[poolName][game.team2]) {
          pools[poolName][game.team2] = {
            team: game.team2,
            wins: 0,
            losses: 0,
            ties: 0,
            runsFor: 0,
            runsAgainst: 0,
            runDiff: 0,
          };
        }

        pools[poolName][game.team1].runsFor += team1Score;
        pools[poolName][game.team1].runsAgainst += team2Score;

        pools[poolName][game.team2].runsFor += team2Score;
        pools[poolName][game.team2].runsAgainst += team1Score;

        if (team1Score > team2Score) {
          pools[poolName][game.team1].wins += 1;
          pools[poolName][game.team2].losses += 1;
        } else if (team2Score > team1Score) {
          pools[poolName][game.team2].wins += 1;
          pools[poolName][game.team1].losses += 1;
        } else {
          pools[poolName][game.team1].ties += 1;
          pools[poolName][game.team2].ties += 1;
        }
      });

    return Object.entries(pools).map(([pool, teams]) => ({
      pool,
      teams: Object.values(teams)
        .map((team) => ({
          ...team,
          runDiff: team.runsFor - team.runsAgainst,
        }))
        .sort((a, b) => {
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (a.runsAgainst !== b.runsAgainst)
            return a.runsAgainst - b.runsAgainst;
          if (b.runsFor !== a.runsFor) return b.runsFor - a.runsFor;
          return a.team.localeCompare(b.team);
        }),
    }));
  }, [filteredGames]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>⭐ All Stars</Text>
      <Text style={styles.subtitle}>Brackets, schedules, scores, and standings</Text>

      <Text style={styles.sectionTitle}>🏆 Brackets</Text>

      {brackets.length > 0 ? (
        brackets.map((bracket, index) => {
          const viewerUrl =
            'https://docs.google.com/gview?embedded=true&url=' +
            encodeURIComponent(bracket.pdfUrl) +
            `&v=${bracket.version}`;

          return (
            <TouchableOpacity
              key={`${bracket.title}-${index}`}
              style={styles.bracketCard}
              onPress={() =>
                router.push({
                  pathname: '/resourceViewer',
                  params: {
                    title: bracket.title,
                    url: viewerUrl,
                    previousPage: '/allStars',
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
        <Text style={styles.emptyText}>No All Stars brackets available yet.</Text>
      )}

      <Text style={styles.sectionTitle}>📅 Games</Text>

      <Text style={styles.filterLabel}>Round</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {rounds.map((round) => (
          <TouchableOpacity
            key={round}
            style={[
              styles.filterButton,
              selectedRound === round && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedRound(round)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedRound === round && styles.filterButtonTextActive,
              ]}
            >
              {round}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.filterLabel}>Division</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {divisions.map((division) => (
          <TouchableOpacity
            key={division}
            style={[
              styles.filterButton,
              selectedDivision === division && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDivision(division)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDivision === division && styles.filterButtonTextActive,
              ]}
            >
              {division}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>📊 Pool Standings</Text>

      {selectedRound === 'All' || selectedDivision === 'All' ? (
        <Text style={styles.emptyText}>
          Select a specific round and division to view standings.
        </Text>
      ) : standingsByPool.length > 0 ? (
        standingsByPool.map((group) => (
          <View key={group.pool} style={styles.standingsCard}>
            <Text style={styles.poolTitle}>{group.pool} Standings</Text>

            <View style={styles.standingsHeader}>
              <Text style={[styles.standingsCellTeam, styles.standingsHeaderText]}>
                Team
              </Text>
              <Text style={styles.standingsHeaderText}>W</Text>
              <Text style={styles.standingsHeaderText}>L</Text>
              <Text style={styles.standingsHeaderText}>T</Text>
              <Text style={styles.standingsHeaderText}>RA</Text>
            </View>

            {group.teams.map((team) => (
              <View key={`${group.pool}-${team.team}`} style={styles.standingsRow}>
                <Text style={styles.standingsCellTeam}>{team.team}</Text>
                <Text style={styles.standingsCell}>{team.wins}</Text>
                <Text style={styles.standingsCell}>{team.losses}</Text>
                <Text style={styles.standingsCell}>{team.ties}</Text>
                <Text style={styles.standingsCell}>{team.runsAgainst}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>
          No completed pool play games for this round/division yet.
        </Text>
      )}

      <Text style={styles.gameCount}>{filteredGames.length} games listed</Text>

      {filteredGames.length > 0 ? (
        filteredGames.map((game, index) => (
          <View key={`${game.round}-${game.division}-${index}`} style={styles.gameCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.roundText}>{game.round || 'All Stars'}</Text>

              {!!game.status && (
                <Text
                  style={[
                    styles.statusBadge,
                    game.status.toLowerCase() === 'final' && styles.finalBadge,
                  ]}
                >
                  {game.status}
                </Text>
              )}
            </View>

            {!!game.division && (
              <Text style={styles.divisionText}>
                {game.division}
                {game.pool ? ` • ${game.pool}` : ''}
              </Text>
            )}

            <View style={styles.matchupRow}>
              <Text style={styles.teamText}>{game.team1 || 'TBD'}</Text>
              {hasScore(game) && (
                <Text style={styles.scoreText}>{game.team1Score}</Text>
              )}
            </View>

            <View style={styles.matchupRow}>
              <Text style={styles.teamText}>{game.team2 || 'TBD'}</Text>
              {hasScore(game) && (
                <Text style={styles.scoreText}>{game.team2Score}</Text>
              )}
            </View>

            <Text style={styles.gameDetails}>
              {[game.date, game.time, game.field].filter(Boolean).join(' • ')}
            </Text>

            {!!game.notes && <Text style={styles.notes}>{game.notes}</Text>}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No games match these filters.</Text>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ffffff',
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  bracketCard: {
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
  filterLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  filterButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 12,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    color: '#d1d5db',
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  standingsCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  poolTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  standingsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 8,
    marginBottom: 8,
  },
  standingsRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  standingsCellTeam: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  standingsCell: {
    width: 32,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  standingsHeaderText: {
    width: 32,
    color: '#93c5fd',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameCount: {
    color: '#d1d5db',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  gameCard: {
    backgroundColor: '#0f1d40',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundText: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    color: '#ffffff',
    backgroundColor: '#374151',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  finalBadge: {
    backgroundColor: '#166534',
  },
  divisionText: {
    color: '#d1d5db',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 14,
  },
  matchupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  gameDetails: {
    color: '#d1d5db',
    fontSize: 14,
    marginTop: 10,
  },
  notes: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  emptyText: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 12,
  },
});