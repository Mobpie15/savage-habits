import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const icon = (name: any) => ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name={name} size={size} color={color} />
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0A0A0F', borderTopColor: '#23232E' },
        tabBarActiveTintColor: '#FFB020',
        tabBarInactiveTintColor: '#5B5B66',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Habits', tabBarIcon: icon('home-variant') }} />
      <Tabs.Screen name="analytics" options={{ title: 'Stats', tabBarIcon: icon('chart-bar') }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards', tabBarIcon: icon('trophy') }} />
      <Tabs.Screen name="coach" options={{ title: 'Coach', tabBarIcon: icon('robot') }} />
      <Tabs.Screen name="sos" options={{ title: 'SOS', tabBarIcon: icon('lifebuoy') }} />
    </Tabs>
  );
}
