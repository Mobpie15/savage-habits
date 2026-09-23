import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { levelForXp } from '../../src/lib/rewards';
import { useHabits } from '../../src/store/useHabits';

const LEVELS = [
  { l: 1, t: 'Naya Sher 🐣' },
  { l: 3, t: 'Routine Warrior ⚔️' },
  { l: 5, t: 'Dopamine King 👑' },
  { l: 10, t: 'Savage Monk 🧘‍♂️🔥' },
];

export default function RewardsScreen() {
  const { xp, shields } = useHabits();
  const level = levelForXp(xp);
  return (
    <SafeAreaView style={s.root}>
      <Text style={s.title}>Rewards 🏆</Text>
      <View style={s.card}>
        <Text style={s.big}>Lv {level}</Text>
        <Text style={s.lbl}>{xp} XP • 🛡️ {shields} shields (streak freeze)</Text>
        {LEVELS.map((r) => (
          <Text key={r.l} style={[s.lbl, level >= r.l && { color: '#FFB020' }]}>
            {level >= r.l ? '✅' : '🔒'} Lv {r.l} — {r.t}
          </Text>
        ))}
      </View>
      <Text style={s.hint}>Har 5 level pe +1 shield. Miss pe shield auto-use hoga — streak 0 nahi hoga (Loop + Duolingo system).</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0F', padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  card: { backgroundColor: '#101016', borderColor: '#23232E', borderWidth: 1, borderRadius: 16, padding: 16 },
  big: { color: '#FFB020', fontSize: 30, fontWeight: '800' },
  lbl: { color: '#8E8E9A', marginTop: 6, lineHeight: 20 },
  hint: { color: '#55555F', marginTop: 12, lineHeight: 20 },
});
