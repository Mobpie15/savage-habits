import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { levelForXp } from '../../src/lib/rewards';
import { useHabits } from '../../src/store/useHabits';
import { F, T } from '../../src/components/theme';

const LEVELS = [
  { l: 1, t: 'Naya Sher', d: 'Pehla kadam utha liya' },
  { l: 3, t: 'Routine Warrior', d: 'Roz ka discipline' },
  { l: 5, t: 'Dopamine King', d: '+1 shield milta hai' },
  { l: 8, t: 'Craving Slayer', d: 'Urge ab darti hai' },
  { l: 10, t: 'Savage Monk', d: 'Legend status' },
  { l: 15, t: 'Habit God', d: 'Dusro ko sikha ab' },
];

export default function RewardsScreen() {
  const { xp, shields, checkins } = useHabits();
  const level = levelForXp(xp);
  const totalTicks = Object.values(checkins).reduce((n, d) => n + Object.keys(d).length, 0);
  const nextAt = (level + 1) * (level + 1) * 100;
  const curAt = level * level * 100;
  const pct = Math.min(100, Math.round(((xp - curAt) / Math.max(1, nextAt - curAt)) * 100));

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.title}>Rewards</Text>
        <View style={s.hero}>
          <MaterialCommunityIcons name="trophy" size={34} color={T.accent} />
          <Text style={s.big}>Level {level}</Text>
          <Text style={s.lbl}>{xp} XP · {totalTicks} total check-ins · {shields} shields</Text>
          <View style={s.bar}><View style={[s.fill, { width: `${pct}%` }]} /></View>
          <Text style={s.lbl}>Next level: {nextAt - xp} XP baaki</Text>
        </View>
        <View style={s.card}>
          <View style={s.cardHead}>
            <MaterialCommunityIcons name="shield-check" size={18} color={T.accent} />
            <Text style={s.cardT}>Shield = streak freeze</Text>
          </View>
          <Text style={s.lbl}>Miss wale din shield bacha lega. Har 5th level par +1 shield milta hai. Chhutti ya bimaari me tension-free.</Text>
        </View>
        {LEVELS.map((r) => {
          const got = level >= r.l;
          return (
            <View key={r.l} style={[s.rank, got && s.rankOn]}>
              <MaterialCommunityIcons name={got ? 'check-circle' : 'lock'} size={24} color={got ? T.accent : T.faint} />
              <View style={s.rankMid}>
                <Text style={[s.rankT, got && { color: T.accent }]}>Lv {r.l} — {r.t}</Text>
                <Text style={s.lbl}>{r.d}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  pad: { padding: 16, paddingBottom: 30 },
  title: { color: T.text, fontSize: 22, fontFamily: F.extra, marginBottom: 12 },
  hero: { backgroundColor: T.card, borderColor: T.accent, borderWidth: 1.5, borderRadius: 18, padding: 18, alignItems: 'center' },
  big: { color: T.accent, fontSize: 30, fontFamily: F.extra, marginTop: 6 },
  lbl: { color: T.dim, marginTop: 4, fontSize: 13, lineHeight: 18, fontFamily: F.medium },
  bar: { height: 8, width: '100%', borderRadius: 4, backgroundColor: T.card2, marginTop: 12, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: T.accent },
  card: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardT: { color: T.text, fontFamily: F.extra },
  rank: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 10 },
  rankOn: { borderColor: T.accent },
  rankMid: { flex: 1 },
  rankT: { color: T.text, fontFamily: F.extra, fontSize: 15 },
});
