import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { completionRate, strengthScore, weekdayBreakdown, weeklyInsight } from '../../src/lib/analytics';
import { useHabits } from '../../src/store/useHabits';

export default function AnalyticsScreen() {
  const { habits } = useHabits();
  // demo set — real app me SQLite checkins se banega
  const demo = new Set(['2026-09-20', '2026-09-21', '2026-09-22']);
  const rate = completionRate(demo, 30);
  const strength = strengthScore(demo, 90);
  const wd = weekdayBreakdown(demo, 60);
  const weakest = wd.indexOf(Math.min(...wd));

  return (
    <SafeAreaView style={s.root}>
      <Text style={s.title}>Deep Analytics 📊</Text>
      <View style={s.grid}>
        <View style={s.card}><Text style={s.big}>{rate}%</Text><Text style={s.lbl}>30-day completion</Text></View>
        <View style={s.card}><Text style={s.big}>{strength}</Text><Text style={s.lbl}>Strength (0-100)</Text></View>
      </View>
      <View style={s.card}>
        <Text style={s.lbl}>Habits tracked: {habits.length}</Text>
        <Text style={s.insight}>{weeklyInsight({ name: 'Overall', rate30: rate, streak: 3, best: 12, weakestWeekday: weakest })}</Text>
        <Text style={s.lbl}>Weekday %: {wd.join(' • ')}</Text>
      </View>
      <Text style={s.hint}>Heatmap + mood correlation + money-saved next iteration me SQLite se live hoga.</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0F', padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  card: { flex: 1, backgroundColor: '#101016', borderColor: '#23232E', borderWidth: 1, borderRadius: 16, padding: 14 },
  big: { color: '#FFB020', fontSize: 28, fontWeight: '800' },
  lbl: { color: '#8E8E9A', marginTop: 4 },
  insight: { color: '#fff', marginTop: 8, lineHeight: 20 },
  hint: { color: '#55555F', marginTop: 12 },
});
