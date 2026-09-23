import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useHabits } from '../../src/store/useHabits';
import { HabitRow } from '../../src/components/HabitRow';

export default function HabitsScreen() {
  const { habits, doneToday, toggleDone, seed, xp, shields } = useHabits();

  useEffect(() => {
    if (habits.length === 0) seed();
  }, [habits.length, seed]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.head}>
        <Text style={styles.title}>Savage Habits 🔥</Text>
        <Text style={styles.meta}>XP {xp} • 🛡️ {shields}</Text>
      </View>
      <FlashList
        data={habits}
        keyExtractor={(h) => h.id}
        estimatedItemSize={76}
        renderItem={({ item }) => (
          <HabitRow
            icon={item.icon}
            name={item.name}
            color={item.color}
            done={!!doneToday[item.id]}
            streak={3}
            onToggle={() => toggleDone(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0F', padding: 16 },
  head: { marginBottom: 12 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  meta: { color: '#8E8E9A', marginTop: 4 },
});
