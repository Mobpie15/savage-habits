import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { doneDates, useHabits } from '../../src/store/useHabits';
import { bestStreak, completionRate, currentStreak, strengthScore, weekdayBreakdown, weeklyInsight } from '../../src/lib/analytics';
import { Heatmap } from '../../src/components/Heatmap';
import { T } from '../../src/components/theme';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AnalyticsScreen() {
  const { habits, checkins } = useHabits();
  const [sel, setSel] = useState<string>('__all__');

  const merged = useMemo(() => {
    const s = new Set<string>();
    habits.forEach((h) => doneDates(checkins, h.id).forEach((d) => s.add(`${h.id}:${d}`)));
    return s;
  }, [habits, checkins]);

  const active = useMemo(() => {
    if (sel === '__all__') {
      const days = new Set<string>();
      habits.forEach((h) => doneDates(checkins, h.id).forEach((d) => days.add(d)));
      return { set: days, color: T.accent, name: 'Overall' };
    }
    const h = habits.find((x) => x.id === sel);
    if (!h) return { set: new Set<string>(), color: T.accent, name: '' };
    return { set: doneDates(checkins, h.id), color: h.color, name: h.name };
  }, [sel, habits, checkins, merged]);

  const rate = completionRate(active.set, 30);
  const strength = strengthScore(active.set, 90);
  const streak = currentStreak(active.set);
  const best = bestStreak(active.set);
  const wd = weekdayBreakdown(active.set, 60);
  const weakest = wd.indexOf(Math.min(...wd));
  const maxWd = Math.max(...wd, 1);

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.title}>Analytics 📊</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}>
          <Pressable style={[s.chip, sel === '__all__' && s.chipOn]} onPress={() => setSel('__all__')}>
            <Text style={[s.chipT, sel === '__all__' && s.chipTOn]}>All</Text>
          </Pressable>
          {habits.map((h) => (
            <Pressable key={h.id} style={[s.chip, sel === h.id && { borderColor: h.color }]} onPress={() => setSel(h.id)}>
              <Text style={s.chipT}>{h.icon} {h.name.slice(0, 12)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={s.grid}>
          <View style={s.stat}><Text style={s.big}>{rate}%</Text><Text style={s.lbl}>30-day</Text></View>
          <View style={s.stat}><Text style={s.big}>{strength}</Text><Text style={s.lbl}>Strength</Text></View>
          <View style={s.stat}><Text style={s.big}>🔥{streak}</Text><Text style={s.lbl}>Streak</Text></View>
          <View style={s.stat}><Text style={s.big}>🏆{best}</Text><Text style={s.lbl}>Best</Text></View>
        </View>

        <View style={s.card}>
          <Heatmap doneSet={active.set} color={active.color} />
        </View>

        <View style={s.card}>
          <Text style={s.cardT}>Weekday pattern</Text>
          <View style={s.bars}>
            {wd.map((v, i) => (
              <View key={i} style={s.barCol}>
                <View style={s.barBg}>
                  <View style={[s.barFill, { height: `${Math.round((v / maxWd) * 100)}%`, backgroundColor: i === weakest ? T.red : T.green }]} />
                </View>
                <Text style={s.barLbl}>{DAYS[i]}</Text>
                <Text style={s.barV}>{v}%</Text>
              </View>
            ))}
          </View>
          <Text style={s.insight}>{weeklyInsight({ name: active.name || 'Overall', rate30: rate, streak, best, weakestWeekday: weakest })}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  pad: { padding: 16, paddingBottom: 30 },
  title: { color: T.text, fontSize: 22, fontWeight: '800', marginBottom: 10 },
  chips: { marginBottom: 12 },
  chip: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  chipOn: { borderColor: T.accent },
  chipT: { color: T.dim, fontSize: 13, fontWeight: '700' },
  chipTOn: { color: T.accent },
  grid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  stat: { flex: 1, backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 14, padding: 10, alignItems: 'center' },
  big: { color: T.text, fontSize: 17, fontWeight: '800' },
  lbl: { color: T.faint, fontSize: 11, marginTop: 2 },
  card: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  cardT: { color: T.text, fontWeight: '800', marginBottom: 10 },
  bars: { flexDirection: 'row', justifyContent: 'space-between' },
  barCol: { alignItems: 'center', flex: 1 },
  barBg: { height: 70, width: 22, borderRadius: 6, backgroundColor: T.card2, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: 22, borderRadius: 6 },
  barLbl: { color: T.dim, fontSize: 11, marginTop: 4 },
  barV: { color: T.faint, fontSize: 10 },
  insight: { color: T.accent, marginTop: 12, fontSize: 13, lineHeight: 19, fontWeight: '600' },
});
