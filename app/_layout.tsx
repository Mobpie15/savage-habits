import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0F' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: true, title: 'Naya Habit', headerStyle: { backgroundColor: '#0A0A0F' }, headerTintColor: '#fff' }} />
    </Stack>
  );
}
