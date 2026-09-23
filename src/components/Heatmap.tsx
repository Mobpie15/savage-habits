import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { lastNDates } from '../lib/analytics';
import { T } from './theme';

// GitHub-style 12-week heatmap for one habit (or merged all habits)
export const Heatmap = memo(function Heatmap({ doneSet, color, weeks = 12 }: { doneSet: Set<string>; color: string; weeks?: number }) {
  const days = useMemo(() => lastNDates(weeks * 7), [weeks]);
  const cols: string[][] = useMemo(() => {
    const out: string[][] = [];
    for (let w = 0; w < weeks; w++) out.push(days.slice(w * 7, w * 7 + 7));
    return out;
  }, [days, weeks]);

  return (
    <View>
      <View style={styles.grid}>
        {cols.map((col, wi) => (
          <View key={wi} style={styles.col}>
            {col.map((d) => (
              <View key={d} style={[styles.cell, doneSet.has(d) && { backgroundColor: color }]} />
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.cap}>Pichle {weeks} hafte • bhara = done</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { gap: 4 },
  cell: { width: 14, height: 14, borderRadius: 4, backgroundColor: T.card2, marginBottom: 4 },
  cap: { color: T.faint, fontSize: 11, marginTop: 6 },
});
