// XP / levels / shields — Finch kindness by default, Habitica hardcore optional.
export const xpForCheckin = (streakAfter: number) => 10 + Math.min(streakAfter, 30);

export function levelForXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export type RewardEvent =
  | { type: 'checkin'; xp: number; leveledUp: boolean; newLevel: number }
  | { type: 'shield_used' }
  | { type: 'shield_earned' };

export function applyCheckinRewards(profile: { xp: number; level: number; shields: number }, streakAfter: number) {
  const xp = xpForCheckin(streakAfter);
  const total = profile.xp + xp;
  const newLevel = levelForXp(total);
  const leveledUp = newLevel > profile.level;
  // every 5 levels earn a shield (streak freeze)
  const shields = leveledUp && newLevel % 5 === 0 ? profile.shields + 1 : profile.shields;
  return { total, newLevel, shields, gained: xp, leveledUp };
}

// Savage-caring dialogue bank (offline fallback). AI API enhances, never required.
const SAVAGE_OK = [
  'Dekh, bahaane banana bhi ek habit hai — tu bas use tod raha hai. Good.',
  'Aaj ka rep done. Kal wala tu khud ko thanks bolega.',
  'Discipline > motivation. Tu proof hai.',
];
const SAVAGE_MISS = [
  'Ek miss = data. Do miss = naya bad habit. Aaj 2-min version kar, baat khatm.',
  'Streak toota nahi, bas pause hua hai. Shield hai to tension kaisa? Uth.',
  'Comfort zone tujhe miss call de raha hai. Block kar de.',
];
const SAVAGE_SOS = [
  'Craving 3-5 min ki mehmaan hai. Paani pi, 4-7-8 breathe kar, timer laga. Nikal jayegi.',
  'Tu urge se bada hai. Apna WHY card khol aur 5 min ruk — jeet teri.',
  'Dopamine sasta wala mat le. Walk kar, cold water maar, wapas aa.',
];

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

export function localCoachLine(ctx: 'done' | 'miss' | 'sos' | 'slip'): string {
  if (ctx === 'done') return pick(SAVAGE_OK);
  if (ctx === 'miss') return pick(SAVAGE_MISS);
  return pick(SAVAGE_SOS);
}
