import { useEffect, useMemo } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { doneDates, isDone, useHabits } from '../../src/store/useHabits';
import { completionRate, currentStreak, todayKey } from '../../src/lib/analytics';
import { levelForXp } from '../../src/lib/rewards';
import { HabitCard } from '../../src/components/HabitCard';
import { T } from '../../src/components/theme';

const greet = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Jaag raha hai? 🌙';
  if (h < 12) return 'Good morning, Sher ☀️';
  if (h < 17) return 'Good afternoon ⚡';
  if (h < 21) return 'Good evening 🌆';
  return 'Raatt wala focus 🌙';
};

export default function HabitsScreen() {
  const router = useRouter();
  const { habits, checkins, toggleToday, deleteHabit, seed, xp, shields } = useHabits();
  const today = todayKey();
  const level = levelForXp(xp);

  useEffect(() => {
    seed();
  }, [seed]);

  const rows = useMemo(
    () =>
      habits.map((h) => {
        const set = doneDates(checkins, h.id);
        return { h, done: isDone(checkins, h.id, today), streak: currentStreak(set), rate: completionRate(set, 30) };
      }),
    [habits, checkins, today],
  );

  const doneCount = rows.filter((r) => r.done).length;
  const pct = habits.length === 0 ? 0 : Math.round((doneCount / habits.length) * 100);

  const confirmDelete = (id: string, name: string) =>
    Alert.alert('Delete?', `"${name}" aur uska poora history ud jayega.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(id) },
    ]);

  return (
    <SafeAreaView style={s.root}>
      <View style={s.head}>
        <View>
          <Text style={s.greet}>{greet()}</Text>
          <Text style={s.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
        </View>
        <View style={s.lvl}>
          <Text style={s.lvlT}>Lv {level}</Text>
          <Text style={s.xp}>{xp} XP 🛡️{shields}</Text>
        </View>
      </View>

      <View style={s.hero}>
        <View style={s.heroMid}>
          <Text style={s.heroPct}>{pct}%</Text>
          <Text style={s.heroSub}>aaj complete • {doneCount}/{habits.length}</Text>
        </View>
        <View style={s.heroBar}>
          <View style={[s.heroFill, { width: `${pct}%` }]} />
        </View>
        <Text style={s.heroLine}>
          {pct === 100 ? 'Full day conquer! Kal fir. 🔥' : pct >= 50 ? 'Aadhi jung jeet li, baki bhi kar. ⚔️' : 'Shuruwat kar — pehla tick sabse mushkil hota hai. 👊'}
        </Text>
      </View>

      <FlashList
        data={rows}
        keyExtractor={(r) => r.h.id}
        estimatedItemSize={96}
        ListEmptyComponent={<Text style={s.empty}>Koi habit nahi — neeche + dabake pehla habit add kar. 👇</Text>}
        renderItem={({ item }) => (
          <HabitCard
            habit={item.h}
            done={item.done}
            streak={item.streak}
            rate={item.rate}
            onToggle={() => toggleToday(item.h.id, today)}
            onLongPress={() => confirmDelete(item.h.id, item.h.name)}
          />
        )}
      />

      <Pressable style={s.fab} onPress={() => router.push('/add')}>
        <Text style={s.fabT}>+</Text>
      </Pressable>
      <Text style={s.hint}>Tip: habit dabao = done • lamba dabao = delete</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg, padding: 16 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greet: { color: T.text, fontSize: 21, fontWeight: '800' },
  date: { color: T.dim, fontSize: 13, marginTop: 2 },
  lvl: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  lvlT: { color: T.accent, fontWeight: '800', fontSize: 15 },
  xp: { color: T.dim, fontSize: 11, marginTop: 2 },
  hero: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 },
  heroMid: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  heroPct: { color: T.text, fontSize: 34, fontWeight: '800' },
  heroSub: { color: T.dim, fontSize: 13 },
  heroBar: { height: 8, borderRadius: 4, backgroundColor: T.card2, marginTop: 10, overflow: 'hidden' },
  heroFill: { height: 8, borderRadius: 4, backgroundColor: T.accent },
  heroLine: { color: T.text, marginTop: 10, fontSize: 13, lineHeight: 18 },
  empty: { color: T.faint, textAlign: 'center', marginTop: 30, lineHeight: 22 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 44,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabT: { color: '#0A0A0F', fontSize: 32, fontWeight: '800', marginTop: -3 },
  hint: { color: T.faint, fontSize: 11, textAlign: 'center', marginTop: 6 },
});
