import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Habit } from '../store/useHabits';
import { HabitGlyph } from './icons';
import { F, T } from './theme';

type Props = {
  habit: Habit;
  done: boolean;
  streak: number;
  rate: number; // 0..100 last-30d
  onToggle: () => void;
  onLongPress: () => void;
};

// Memoized card for FlashList (skill: list-performance-item-memo)
export const HabitCard = memo(function HabitCard({ habit, done, streak, rate, onToggle, onLongPress }: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onToggle();
      }}
      onLongPress={onLongPress}
      style={[styles.card, done && { borderColor: habit.color }]}
    >
      <View style={[styles.iconBox, { backgroundColor: habit.color + '22' }]}>
        <HabitGlyph iconKey={habit.icon} color={habit.color} size={26} />
      </View>
      <View style={styles.mid}>
        <Text style={styles.name} numberOfLines={1}>
          {habit.name}
        </Text>
        <Text style={styles.sub}>
          {habit.kind === 'quit' ? 'Quit' : 'Build'}  ·  {streak}-day streak  ·  {rate}%
        </Text>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${rate}%`, backgroundColor: habit.color }]} />
        </View>
      </View>
      <View style={[styles.check, done && { backgroundColor: habit.color, borderColor: habit.color }]}>
        {done && <MaterialCommunityIcons name="check" size={20} color="#0A0A0F" />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: T.card,
    borderWidth: 1.5,
    borderColor: T.border,
    marginBottom: 12,
  },
  iconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mid: { flex: 1, marginRight: 10 },
  name: { color: T.text, fontSize: 16, fontFamily: F.bold },
  sub: { color: T.dim, fontSize: 12, marginTop: 3, fontFamily: F.medium },
  bar: { height: 5, borderRadius: 3, backgroundColor: T.card2, marginTop: 8, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: T.faint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
