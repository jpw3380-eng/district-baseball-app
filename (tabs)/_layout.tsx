import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="leagues"
        options={{
          title: 'Leagues',
        }}
      />
<Tabs.Screen
  name="fields"
  options={{
    href: null,
  }}
/>
<Tabs.Screen
  name="leagueSchedule"
  options={{
    href: null,
  }}
/>
<Tabs.Screen
  name="leagueStandings"
  options={{
    href: null,
  }}
/>
<Tabs.Screen
  name="resources"
  options={{
    href: null,
  }}
/>
<Tabs.Screen
  name="teamSchedule"
  options={{
    href: null,
  }}
/>
<Tabs.Screen
  name="teamsList"
  options={{
    href: null,
  }}
/>
      <Tabs.Screen
        name="league"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}