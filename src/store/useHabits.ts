import { create } from 'zustand';
import type { Habit } from '../lib/analytics';

type State = {
  habits: Habit[];
  doneToday: Record<string, boolean>; // habitId -> done
  xp: number;
  level: number;
  shields: number;
  toggleDone: (id: string) => void;
  seed: () => void;
};

const uid = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

export const useHabits = create<State>((set) => ({
  habits: [],
  doneToday: {},
  xp: 0,
  level: 1,
  shields: 2,
  toggleDone: (id) =>
    set((s) => ({
      doneToday: { ...s.doneToday, [id]: !s.doneToday[id] },
      xp: !s.doneToday[id] ? s.xp + 12 : s.xp,
    })),
  seed: () =>
    set(() => ({
      habits: [
        { id: uid(), name: 'Subah 6 baje uthna', icon: '🌅', color: '#FFB020', kind: 'build', targetPerWeek: 6, weekdays: [1,2,3,4,5,6], goalValue: null, createdAt: Date.now() },
        { id: uid(), name: 'Smoking / Gutka ZERO', icon: '🚭', color: '#FF5C5C', kind: 'quit', targetPerWeek: 7, weekdays: [1,2,3,4,5,6,7], goalValue: null, createdAt: Date.now() },
        { id: uid(), name: '2L Paani', icon: '💧', color: '#38BDF8', kind: 'build', targetPerWeek: 7, weekdays: [1,2,3,4,5,6,7], goalValue: 2000, goalUnit: 'ml', createdAt: Date.now() },
        { id: uid(), name: '30 min Workout', icon: '🏋️', color: '#A78BFA', kind: 'build', targetPerWeek: 5, weekdays: [1,2,3,4,5], goalValue: 30, goalUnit: 'min', createdAt: Date.now() },
      ],
    })),
}));
