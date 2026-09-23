import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

type Props = { icon: string; name: string; color: string; done: boolean; streak: number; onToggle: () => void };

// Memoized row — FlashList me re-render cost bachata hai (skill: list-performance-item-memo)
export const HabitRow = memo(function HabitRow({ icon, name, color, done, streak, onToggle }: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      style={[styles.card, done && { borderColor: color, backgroundColor: '#14141C' }]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.mid}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>🔥 {streak} day streak</Text>
      </View>
      <View style={[styles.check, done && { backgroundColor: color }]}>
        <Text style={styles.checkText}>{done ? '✓' : '○'}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#101016',
    borderWidth: 1,
    borderColor: '#23232E',
    marginBottom: 10,
  },
  dot: { width: 6, height: 40, borderRadius: 3, marginRight: 10 },
  icon: { fontSize: 26, marginRight: 10 },
  mid: { flex: 1 },
  name: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sub: { color: '#8E8E9A', fontSize: 12, marginTop: 2 },
  check: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#33333F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
