import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits, type HabitKind } from '../src/store/useHabits';
import { COLORS, F, T } from '../src/components/theme';
import { HABIT_ICONS } from '../src/components/icons';

export default function AddHabitScreen() {
  const router = useRouter();
  const addHabit = useHabits((s) => s.addHabit);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>('fire');
  const [color, setColor] = useState(COLORS[0]);
  const [kind, setKind] = useState<HabitKind>('build');
  const [target, setTarget] = useState(7);

  const save = () => {
    const clean = name.trim();
    if (!clean) {
      Alert.alert('Naam to likho', 'Habit ka naam khaali nahi ho sakta.');
      return;
    }
    addHabit({ name: clean, icon, color, kind, targetPerWeek: target });
    router.back();
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.pad}>
      <Text style={s.label}>Habit ka naam</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="jaise: Cigarette ZERO, Gym, Kitaab..."
        placeholderTextColor={T.faint}
        style={s.input}
        maxLength={40}
      />

      <Text style={s.label}>Type</Text>
      <View style={s.row}>
        <Pressable style={[s.chip, kind === 'build' && s.chipOn]} onPress={() => setKind('build')}>
          <MaterialCommunityIcons name="sprout" size={18} color={kind === 'build' ? T.accent : T.dim} />
          <Text style={[s.chipT, kind === 'build' && s.chipTOn]}>Good habit banana</Text>
        </Pressable>
        <Pressable style={[s.chip, kind === 'quit' && s.chipOn]} onPress={() => setKind('quit')}>
          <MaterialCommunityIcons name="smoking-off" size={18} color={kind === 'quit' ? T.accent : T.dim} />
          <Text style={[s.chipT, kind === 'quit' && s.chipTOn]}>Bad habit chhodna</Text>
        </Pressable>
      </View>

      <Text style={s.label}>Icon</Text>
      <View style={s.grid}>
        {HABIT_ICONS.map((e) => (
          <Pressable key={e.key} style={[s.cell, icon === e.key && s.cellOn]} onPress={() => setIcon(e.key)}>
            <MaterialCommunityIcons name={e.mc as any} size={24} color={icon === e.key ? T.accent : T.dim} />
          </Pressable>
        ))}
      </View>

      <Text style={s.label}>Color</Text>
      <View style={s.grid}>
        {COLORS.map((c) => (
          <Pressable key={c} style={[s.dot, { backgroundColor: c }, color === c && s.dotOn]} onPress={() => setColor(c)} />
        ))}
      </View>

      <Text style={s.label}>Hafte me kitne din? ({target}x)</Text>
      <View style={s.row}>
        {[3, 5, 6, 7].map((t) => (
          <Pressable key={t} style={[s.chip, target === t && s.chipOn]} onPress={() => setTarget(t)}>
            <Text style={[s.chipT, target === t && s.chipTOn]}>{t}x/week</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={s.save} onPress={save}>
        <Text style={s.saveT}>Habit Pakki</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  pad: { padding: 18, paddingBottom: 40 },
  label: { color: T.dim, fontSize: 13, fontFamily: F.bold, marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 14, padding: 14, color: T.text, fontSize: 16, fontFamily: F.medium },
  row: { flexDirection: 'row', gap: 10 },
  chip: { flex: 1, flexDirection: 'row', gap: 6, backgroundColor: T.card, borderColor: T.border, borderWidth: 1, borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center' },
  chipOn: { borderColor: T.accent, backgroundColor: '#2A2113' },
  chipT: { color: T.dim, fontFamily: F.bold, fontSize: 13 },
  chipTOn: { color: T.accent },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { width: 52, height: 52, borderRadius: 14, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  cellOn: { borderColor: T.accent },
  dot: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'transparent' },
  dotOn: { borderColor: '#fff' },
  save: { backgroundColor: T.accent, borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 26 },
  saveT: { color: '#0A0A0F', fontSize: 17, fontFamily: F.extra },
});
