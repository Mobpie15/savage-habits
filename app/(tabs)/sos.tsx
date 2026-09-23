import { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { todayKey } from '../../src/lib/analytics';
import { localCoachLine } from '../../src/lib/rewards';
import { useHabits } from '../../src/store/useHabits';
import { F, T } from '../../src/components/theme';

const TOTAL = 5 * 60;

const fmt = (s: number) => `${Math.floor(s / 60)}:${`${s % 60}`.padStart(2, '0')}`;

export default function SosScreen() {
  const { habits, logSlip } = useHabits();
  const quits = habits.filter((h) => h.kind === 'quit');
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [line, setLine] = useState(localCoachLine('sos'));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const start = () => {
    if (running) return;
    setRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    timer.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          if (timer.current) clearInterval(timer.current);
          setRunning(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setLine('5 minute nikal gaye — craving haar gayi. Tum jeet gaye.');
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    setLeft(TOTAL);
    setLine(localCoachLine('sos'));
  };

  const phase = left > TOTAL - 16 ? 'Saans andar lo — 4 second' : left % 2 === 0 ? 'Roke rakho' : 'Dheere chhodo';

  return (
    <SafeAreaView style={s.root}>
      <View style={s.head}>
        <MaterialCommunityIcons name="lifebuoy" size={26} color={T.red} />
        <Text style={s.title}>SOS Toolkit</Text>
      </View>
      <Text style={s.sub}>Craving sirf 3-5 minute ki mehmaan hai. Timer lagao, ruk jao.</Text>

      <View style={s.timer}>
        <Text style={s.clock}>{fmt(left)}</Text>
        <Text style={s.phase}>{running ? phase : 'Taiyaar? Start dabakar ladai shuru karo.'}</Text>
        <View style={s.row}>
          <Pressable style={[s.btn, s.go]} onPress={start} disabled={running}>
            <Text style={s.btnT}>{left === 0 ? 'Fir se' : running ? 'Chal raha...' : 'START'}</Text>
          </Pressable>
          <Pressable style={s.btn} onPress={reset}>
            <Text style={s.btnT}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.line}>{line}</Text>
        <Pressable style={s.mini} onPress={() => setLine(localCoachLine('sos'))}>
          <Text style={s.miniT}>Ek aur line sunao</Text>
        </Pressable>
      </View>

      {quits.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardT}>Slip ho gaya? Shame nahi — data likho:</Text>
          {quits.map((q) => (
            <Pressable key={q.id} style={s.slip} onPress={() => { logSlip(q.id, todayKey()); setLine('Slip note ho gaya. Streak wapas banegi — abhi 2 minute ka achha kaam karo.'); }}>
              <Text style={s.slipT}>{q.name} — slip log karo</Text>
            </Pressable>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg, padding: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: T.red, fontSize: 22, fontFamily: F.extra },
  sub: { color: T.dim, marginTop: 4, marginBottom: 12, fontFamily: F.medium },
  timer: { backgroundColor: T.card, borderColor: T.red, borderWidth: 1.5, borderRadius: 20, padding: 20, alignItems: 'center' },
  clock: { color: T.text, fontSize: 52, fontFamily: F.extra, fontVariant: ['tabular-nums'] },
  phase: { color: T.dim, marginTop: 6, fontFamily: F.medium },
  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, backgroundColor: T.card2, borderRadius: 12, padding: 13, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  go: { backgroundColor: T.red, borderColor: T.red },
  btnT: { color: '#fff', fontFamily: F.extra },
  card: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12 },
  line: { color: T.text, fontSize: 15, lineHeight: 22, fontFamily: F.medium },
  mini: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: T.card2, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  miniT: { color: T.accent, fontFamily: F.bold, fontSize: 13 },
  cardT: { color: T.text, fontFamily: F.extra, marginBottom: 8 },
  slip: { backgroundColor: T.card2, borderRadius: 10, padding: 12, marginTop: 8 },
  slipT: { color: T.dim, fontFamily: F.bold },
});
