import { MaterialCommunityIcons } from '@expo/vector-icons';

// Single source of truth for habit icons — vector only, no emoji.
export const HABIT_ICONS = [
  { key: 'fire', label: 'Fire', mc: 'fire' },
  { key: 'water', label: 'Water', mc: 'water' },
  { key: 'gym', label: 'Workout', mc: 'dumbbell' },
  { key: 'book', label: 'Read', mc: 'book-open-variant' },
  { key: 'calm', label: 'Meditate', mc: 'meditation' },
  { key: 'nosmoke', label: 'No smoke', mc: 'smoking-off' },
  { key: 'food', label: 'Food', mc: 'food-apple' },
  { key: 'phone', label: 'Phone', mc: 'cellphone-off' },
  { key: 'sleep', label: 'Sleep', mc: 'sleep' },
  { key: 'run', label: 'Run', mc: 'run' },
  { key: 'target', label: 'Goal', mc: 'target' },
  { key: 'money', label: 'Money', mc: 'cash' },
  { key: 'walk', label: 'Walk', mc: 'walk' },
  { key: 'sunrise', label: 'Morning', mc: 'weather-sunset-up' },
  { key: 'note', label: 'Journal', mc: 'notebook-edit' },
  { key: 'game', label: 'Game', mc: 'gamepad-variant' },
  { key: 'coffee', label: 'Coffee', mc: 'coffee' },
  { key: 'star', label: 'Star', mc: 'star' },
] as const;

export type HabitIconKey = (typeof HABIT_ICONS)[number]['key'];

const MC_BY_KEY: Record<string, string> = Object.fromEntries(HABIT_ICONS.map((i) => [i.key, i.mc]));

// v1.1 stored emoji — migrate to vector keys on load
const EMOJI_TO_KEY: Record<string, HabitIconKey> = {
  '🔥': 'fire', '💧': 'water', '🏋️': 'gym', '📚': 'book', '🧘': 'calm',
  '🚭': 'nosmoke', '🍔': 'food', '📱': 'phone', '💤': 'sleep', '🏃': 'run',
  '🎯': 'target', '💰': 'money', '🚶': 'walk', '🌅': 'sunrise', '📝': 'note',
  '🎮': 'game', '🚬': 'nosmoke', '☕': 'coffee',
};

export const normalizeIcon = (icon: string): HabitIconKey =>
  (MC_BY_KEY[icon] ? icon : (EMOJI_TO_KEY[icon] ?? 'fire')) as HabitIconKey;

export function HabitGlyph({ iconKey, color, size = 26 }: { iconKey: string; color: string; size?: number }) {
  return <MaterialCommunityIcons name={(MC_BY_KEY[iconKey] ?? 'fire') as any} size={size} color={color} />;
}
