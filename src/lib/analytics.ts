export type HabitKind = 'build' | 'quit';
export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  kind: HabitKind;
  targetPerWeek: number;
  weekdays: number[];
  goalValue: number | null;
  goalUnit?: string;
  reminderTime?: string;
  createdAt: number;
};

export type Checkin = { habitId: string; date: string; value: number; mood?: number };
export type Slip = { habitId: string; date: string; triggerTag?: string; mood?: number; intensity?: number };

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const lastNDates = (n: number, end = new Date()): string[] => {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    out.push(todayKey(d));
  }
  return out;
};

// Forgiving streak: consecutive days counting Skip as kept, Miss breaks only after shield logic handled by caller.
export function currentStreak(doneSet: Set<string>, skips = new Set<string>): number {
  let s = 0;
  const d = new Date();
  // if today not done/skipped, start counting from yesterday (still alive)
  let cursor = new Date(d);
  const t = todayKey(cursor);
  if (!doneSet.has(t) && !skips.has(t)) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const k = todayKey(cursor);
    if (doneSet.has(k) || skips.has(k)) {
      s++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return s;
}

export function bestStreak(doneSet: Set<string>): number {
  const days = [...doneSet].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of days) {
    if (!prev) run = 1;
    else {
      const a = new Date(prev);
      a.setDate(a.getDate() + 1);
      run = todayKey(a) === k ? run + 1 : 1;
    }
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

// Loop-style Habit Strength 0..100: recent checkins weigh more, miss decays slowly (no 0-reset trauma).
export function strengthScore(doneSet: Set<string>, windowDays = 90): number {
  const dates = lastNDates(windowDays);
  let num = 0;
  let den = 0;
  dates.forEach((k, i) => {
    const w = (i + 1) / dates.length; // linear recency weight
    den += w;
    if (doneSet.has(k)) num += w;
  });
  return den === 0 ? 0 : Math.round((num / den) * 100);
}

export function completionRate(doneSet: Set<string>, windowDays = 30): number {
  const dates = lastNDates(windowDays);
  const done = dates.filter((k) => doneSet.has(k)).length;
  return Math.round((done / windowDays) * 100);
}

// Weekday weakness: 0=Sun..6=Sat -> completion %
export function weekdayBreakdown(doneSet: Set<string>, windowDays = 60): number[] {
  const buckets = Array.from({ length: 7 }, () => ({ done: 0, total: 0 }));
  lastNDates(windowDays).forEach((k) => {
    const wd = new Date(k + 'T12:00:00').getDay();
    buckets[wd].total++;
    if (doneSet.has(k)) buckets[wd].done++;
  });
  return buckets.map((b) => (b.total === 0 ? 0 : Math.round((b.done / b.total) * 100)));
}

// Simple correlation: avg mood on done days vs missed days
export function moodCorrelation(
  doneSet: Set<string>,
  moods: Record<string, number>,
): { onDone: number | null; onMiss: number | null; insight: string } {
  const doneMoods: number[] = [];
  const missMoods: number[] = [];
  Object.entries(moods).forEach(([date, m]) => {
    if (doneSet.has(date)) doneMoods.push(m);
    else missMoods.push(m);
  });
  const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const onDone = avg(doneMoods);
  const onMiss = avg(missMoods);
  let insight = 'Mood log kar — 7 din baad pattern dikhega.';
  if (onDone !== null && onMiss !== null && doneMoods.length >= 3) {
    const diff = onDone - onMiss;
    insight =
      diff >= 0.5
        ? `Done wale din mood ${(diff).toFixed(1)}★ better hai. Mood low ho to chhota version kar.`
        : diff <= -0.5
          ? 'Interesting — low mood wale din bhi kar raha hai. Beast mode.'
          : 'Mood se zyada routine matter kar rahi hai. Good sign.';
  }
  return { onDone, onMiss, insight };
}

export function weeklyInsight(input: {
  name: string;
  rate30: number;
  streak: number;
  best: number;
  weakestWeekday: number;
}): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (input.rate30 >= 85) return `${input.name}: 91% club. Ab target badha ya naya habit stack kar.`;
  if (input.streak === 0) return `${input.name}: Never-miss-twice rule — aaj 2-min version kar, streak wapas.`;
  return `${input.name}: ${days[input.weakestWeekday]} weakest hai. Us din reminder + easy mode laga.`;
}
