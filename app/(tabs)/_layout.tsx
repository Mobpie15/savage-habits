import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#0A0A0F', borderTopColor: '#23232E' }, tabBarActiveTintColor: '#FFB020' }}>
      <Tabs.Screen name="index" options={{ title: 'Habits' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} />
      <Tabs.Screen name="sos" options={{ title: 'SOS' }} />
    </Tabs>
  );
}
