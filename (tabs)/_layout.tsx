import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="leagues"
        options={{
          title: 'Leagues',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="baseball" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="directoryMenu"
        options={{
          title: 'Directory',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="allStars"
        options={{
          title: 'All Stars',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="fields" options={{ href: null }} />
      <Tabs.Screen name="leagueSchedule" options={{ href: null }} />
      <Tabs.Screen name="leagueStandings" options={{ href: null }} />
      <Tabs.Screen name="resources" options={{ href: null }} />
      <Tabs.Screen name="teamSchedule" options={{ href: null }} />
      <Tabs.Screen name="teamsList" options={{ href: null }} />
      <Tabs.Screen name="resourceViewer" options={{ href: null }} />
      <Tabs.Screen name="events" options={{ href: null }} />
      <Tabs.Screen name="chuckKibby" options={{ href: null }} />
      <Tabs.Screen name="toc" options={{ href: null }} />
      <Tabs.Screen name="archive" options={{ href: null }} />
      <Tabs.Screen name="league" options={{ href: null }} />
      <Tabs.Screen name="directory" options={{ href: null }} />
      <Tabs.Screen name="district-staff" options={{ href: null }} />
    </Tabs>
  );
}