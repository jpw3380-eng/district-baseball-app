import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

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

function parseDate(dateText: string) {
  const clean = dateText.trim().replace(/^"|"$/g, '');

  const numericMatch = clean.match(
    /^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?$/
  );

  if (numericMatch) {
    const month = Number(numericMatch[1]) - 1;
    const day = Number(numericMatch[2]);
    let year = numericMatch[3]
      ? Number(numericMatch[3])
      : new Date().getFullYear();

    if (year < 100) year += 2000;

    return new Date(year, month, day);
  }

  const parsed = new Date(clean);

  return isNaN(parsed.getTime()) ? null : parsed;
}

function parseTime(timeText: string) {
  const parsed = new Date(`1/1/2026 ${timeText}`);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export default function LeagueScheduleScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);
  const datePositions = useRef<Record<string, number>>({});

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('All');

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
          .filter((game) => game.date && game.away && game.home)
          .sort((a, b) => {
            const dateA = parseDate(a.date)?.getTime() || 0;
            const dateB = parseDate(b.date)?.getTime() || 0;

            if (dateA !== dateB) return dateA - dateB;

            return parseTime(a.time) - parseTime(b.time);
          });

        setGames(parsedGames);
      } catch (error) {
        console.log('Schedule load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const divisionOrder = [
    'All',
    'Majors',
    'AAA',
    'AA',
    'Single A',
    'Coach Pitch',
    'TBall',
  ];

  const divisions = divisionOrder.filter(
    (division) =>
      division === 'All' || games.some((game) => game.division === division)
  );

  const filteredGames =
    selectedDivision === 'All'
      ? games
      : games.filter((game) => game.division === selectedDivision);

  const groupedGames = useMemo(() => {
    const grouped = filteredGames.reduce((acc, game) => {
      if (!acc[game.date]) acc[game.date] = [];
      acc[game.date].push(game);
      return acc;
    }, {} as Record<string, Game[]>);

    return Object.keys(grouped)
      .map((date) => ({
        date,
        dateValue: parseDate(date)?.getTime() || 0,
        games: grouped[date],
      }))
      .sort((a, b) => a.dateValue - b.dateValue);
  }, [filteredGames]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const scrollToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetGroup = groupedGames.find((group) => {
      const groupDate = new Date(group.dateValue);
      groupDate.setHours(0, 0, 0, 0);

      return groupDate.getTime() >= today.getTime();
    });

    if (!targetGroup) return;

    const position = datePositions.current[targetGroup.date];

    if (position !== undefined) {
      scrollRef.current?.scrollTo({
        y: Math.max(position - 6, 0),
        animated: true,
      });
    }
  };

  const changeDivision = (division: string) => {
    setSelectedDivision(division);
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }, 50);
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>{name} Schedule</Text>

      <View style={styles.jumpRow}>
        <TouchableOpacity style={styles.jumpButton} onPress={scrollToToday}>
          <Text style={styles.jumpButtonText}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.jumpButton} onPress={scrollToTop}>
          <Text style={styles.jumpButtonText}>Top</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {divisions.map((division) => (
          <TouchableOpacity
            key={division}
            style={[
              styles.filterButton,
              selectedDivision === division && styles.filterButtonActive,
            ]}
            onPress={() => changeDivision(division)}
          >
            <Text
              style={[
                styles.filterText,
                selectedDivision === division && styles.filterTextActive,
              ]}
            >
              {division}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView ref={scrollRef} style={styles.scheduleScroll}>
        {loading ? (
          <View style={styles.card}>
            <Text>Loading schedule...</Text>
          </View>
        ) : groupedGames.length > 0 ? (
          groupedGames.map((group) => (
            <View
              key={group.date}
              onLayout={(event) => {
                datePositions.current[group.date] = event.nativeEvent.layout.y;
              }}
            >
              <Text style={styles.dateHeader}>{group.date}</Text>

              {group.games.map((game, index) => (
                <View
                  key={`${game.date}-${game.time}-${game.away}-${game.home}-${index}`}
                  style={styles.card}
                >
                  <Text style={styles.division}>{game.division}</Text>

                  {game.status === 'Final' ? (
                    <Text style={styles.score}>
                      {game.away} {game.awayScore} - {game.homeScore}{' '}
                      {game.home}
                    </Text>
                  ) : (
                    <Text style={styles.matchup}>
                      {game.away} @ {game.home}
                    </Text>
                  )}

                  <Text style={styles.details}>{game.time}</Text>
                  <Text style={styles.field}>{game.field}</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text>No games found for this selection.</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    marginBottom: 14,
  },
  jumpRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  jumpButton: {
    backgroundColor: '#0a2a66',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  jumpButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterScroll: {
    maxHeight: 52,
    marginBottom: 14,
  },
  filterContent: {
    alignItems: 'center',
    paddingRight: 20,
  },
  filterButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginRight: 10,
    minHeight: 42,
  },
  filterButtonActive: {
    backgroundColor: '#0a2a66',
  },
  filterText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 15,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  scheduleScroll: {
    flex: 1,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: '#0a2a66',
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