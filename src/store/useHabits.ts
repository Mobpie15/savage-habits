import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { levelForXp, xpForCheckin } from '../lib/rewards';

export type HabitKind = 'build' | 'quit';

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  kind: HabitKind;
  targetPerWeek: number; // 1..7
  createdAt: number;
};

export type NewHabit = Omit<Habit, 'id' | 'createdAt'>;

// habitId -> { 'YYYY-MM-DD': 1 }
export type CheckinMap = Record<string, Record<string, number>>;

type State = {
  habits: Habit[];
  checkins: CheckinMap;
  slips: Record<string, string[]>; // quit habitId -> slip dateKeys
  xp: number;
  shields: number;
  hasSeeded: boolean;
  addHabit: (h: NewHabit) => string;
  updateHabit: (id: string, patch: Partial<NewHabit>) => void;
  deleteHabit: (id: string) => void;
  toggleToday: (id: string, dateKey: string) => void;
  logSlip: (id: string, dateKey: string) => void;
  seed: () => void;
};

export const uid = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const starter: NewHabit[] = [
  { name: 'Subah jaldi uthna', icon: '🌅', color: '#FFB020', kind: 'build', targetPerWeek: 6 },
  { name: 'Smoking ZERO', icon: '🚭', color: '#FF5C5C', kind: 'quit', targetPerWeek: 7 },
  { name: '2L Paani', icon: '💧', color: '#38BDF8', kind: 'build', targetPerWeek: 7 },
  { name: '30 min walk', icon: '🚶', color: '#4ADE80', kind: 'build', targetPerWeek: 5 },
];

export const useHabits = create<State>()(
  persist(
    (set) => ({
      habits: [],
      checkins: {},
      slips: {},
      xp: 0,
      shields: 2,
      hasSeeded: false,

      addHabit: (h) => {
        const id = uid();
        set((s) => ({
          habits: [...s.habits, { ...h, id, createdAt: Date.now() }],
        }));
        return id;
      },

      updateHabit: (id, patch) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      deleteHabit: (id) =>
        set((s) => {
          const checkins = { ...s.checkins };
          delete checkins[id];
          const slips = { ...s.slips };
          delete slips[id];
          return { habits: s.habits.filter((h) => h.id !== id), checkins, slips };
        }),

      toggleToday: (id, dateKey) =>
        set((s) => {
          const days = { ...(s.checkins[id] ?? {}) };
          const wasDone = !!days[dateKey];
          if (wasDone) delete days[dateKey];
          else days[dateKey] = 1;
          // XP + shield earning on new checkin
          let xp = s.xp;
          let shields = s.shields;
          if (!wasDone) {
            xp += xpForCheckin(1);
            const newLevel = levelForXp(xp);
            if (newLevel % 5 === 0 && levelForXp(s.xp) !== newLevel) shields += 1;
          }
          return { checkins: { ...s.checkins, [id]: days }, xp, shields };
        }),

      logSlip: (id, dateKey) =>
        set((s) => ({
          slips: { ...s.slips, [id]: [...(s.slips[id] ?? []), dateKey] },
        })),

      seed: () =>
        set((s) => {
          if (s.hasSeeded || s.habits.length > 0) return s;
          return {
            habits: starter.map((h) => ({ ...h, id: uid(), createdAt: Date.now() })),
            hasSeeded: true,
          };
        }),
    }),
    { name: 'savage-habits-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export const doneDates = (checkins: CheckinMap, habitId: string): Set<string> =>
  new Set(Object.keys(checkins[habitId] ?? {}));

export const isDone = (checkins: CheckinMap, habitId: string, dateKey: string): boolean =>
  !!checkins[habitId]?.[dateKey];
