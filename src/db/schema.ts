// Offline-first SQLite schema. Run once on app boot via initDb().
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🔥',
  color TEXT NOT NULL DEFAULT '#FF6B6B',
  kind TEXT NOT NULL DEFAULT 'build', -- 'build' | 'quit'
  frequency TEXT NOT NULL DEFAULT 'daily', -- daily | xweek | weekdays | interval | counter
  target_per_week INTEGER NOT NULL DEFAULT 7,
  weekdays TEXT NOT NULL DEFAULT '1,2,3,4,5,6,7',
  goal_value REAL, -- e.g. 2000ml water, null = checkbox
  goal_unit TEXT,
  reminder_time TEXT,
  created_at INTEGER NOT NULL,
  archived INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS checkins (
  id TEXT PRIMARY KEY NOT NULL,
  habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- YYYY-MM-DD local
  value REAL NOT NULL DEFAULT 1,
  note TEXT,
  mood INTEGER, -- 1..5 optional correlation
  created_at INTEGER NOT NULL,
  UNIQUE(habit_id, date)
);
CREATE TABLE IF NOT EXISTS slips (
  id TEXT PRIMARY KEY NOT NULL,
  habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  trigger_tag TEXT,
  mood INTEGER,
  intensity INTEGER, -- 1..10 craving intensity
  note TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 0,
  shields INTEGER NOT NULL DEFAULT 2,
  groq_key TEXT,
  coach_mode TEXT NOT NULL DEFAULT 'savage_caring'
);
CREATE INDEX IF NOT EXISTS idx_checkins_habit_date ON checkins(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_slips_habit_date ON slips(habit_id, date);
`;
