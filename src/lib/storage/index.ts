import Dexie, { type EntityTable } from 'dexie';

export interface Board {
  id?: number;
  name: string;
  category: string;
  gridSize: number;
  cells: BoardCell[];
  centerTitle?: string;
  centerIconId?: number;
  categoryColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardCell {
  index: number;
  pictogramId?: number;
  pictogramUrl?: string;
  label: string;
  color?: string;
  isEmpty: boolean;
}

export interface Schedule {
  id?: number;
  name: string;
  date: string;
  items: ScheduleItem[];
  createdAt: Date;
}

export interface ScheduleItem {
  index: number;
  pictogramId?: number;
  pictogramUrl?: string;
  label: string;
  time?: string;
  duration?: number;
  completed: boolean;
  section: 'morning' | 'afternoon' | 'evening';
}

export interface UserSettings {
  id?: number;
  key: string;
  value: string;
}

export interface Profile {
  id?: number;
  name: string;
  avatar: string;       // emoji or icon key
  pinHash?: string;     // SHA-256 of PIN for advanced settings
  settings: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppProgress {
  id?: number;
  profileId: number;
  appId: string;
  data: Record<string, unknown>;  // app-specific progress
  updatedAt: Date;
}

const db = new Dexie('AutismApps') as Dexie & {
  boards: EntityTable<Board, 'id'>;
  schedules: EntityTable<Schedule, 'id'>;
  settings: EntityTable<UserSettings, 'id'>;
  profiles: EntityTable<Profile, 'id'>;
  appProgress: EntityTable<AppProgress, 'id'>;
  goldStars: EntityTable<{ id?: number; profileId: number; appId: string; reason: string; earnedAt: Date }, 'id'>;
  achievements: EntityTable<{ id?: number; profileId: number; achievementKey: string; appId?: string; unlockedAt: Date }, 'id'>;
  rewardGoals: EntityTable<{ id?: number; profileId: number; type: string; target: number; current: number; rewardText: string; appId?: string; completed: boolean; createdAt: Date }, 'id'>;
  diplomas: EntityTable<{ id?: number; profileId: number; childName: string; achievementKey: string; appId?: string; earnedAt: Date }, 'id'>;
};

db.version(3).stores({
  boards: "++id, name, category, createdAt",
  schedules: "++id, name, date, createdAt",
  settings: "++id, &key",
  profiles: "++id, name, createdAt",
  appProgress: "++id, profileId, appId, [profileId+appId]",
  goldStars: "++id, profileId, appId, earnedAt",
  achievements: "++id, profileId, achievementKey",
  rewardGoals: "++id, profileId, type, completed",
  diplomas: "++id, profileId, achievementKey, earnedAt"
});

db.version(1).stores({
  boards: '++id, name, category, createdAt',
  schedules: '++id, name, date, createdAt',
  settings: '++id, &key'
});

db.version(2).stores({
  boards: '++id, name, category, createdAt',
  schedules: '++id, name, date, createdAt',
  settings: '++id, &key',
  profiles: '++id, name, createdAt',
  appProgress: '++id, profileId, appId, [profileId+appId]'
});

export { db };

export async function saveBoard(board: Board): Promise<number> {
  board.updatedAt = new Date();
  if (!board.createdAt) board.createdAt = new Date();
  const id = await db.boards.put(board);
  return id!;
}

export async function getBoards(): Promise<Board[]> {
  return await db.boards.orderBy('updatedAt').reverse().toArray();
}

export async function getBoard(id: number): Promise<Board | undefined> {
  return await db.boards.get(id);
}

export async function deleteBoard(id: number): Promise<void> {
  await db.boards.delete(id);
}

export async function saveSchedule(schedule: Schedule): Promise<number> {
  if (!schedule.createdAt) schedule.createdAt = new Date();
  const id = await db.schedules.put(schedule);
  return id!;
}

export async function getSchedules(): Promise<Schedule[]> {
  return await db.schedules.orderBy('createdAt').reverse().toArray();
}

export async function deleteSchedule(id: number): Promise<void> {
  await db.schedules.delete(id);
}

// --- Profiles ---

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createProfile(name: string, avatar: string, pin?: string): Promise<number> {
  const now = new Date();
  const profile: Profile = {
    name,
    avatar,
    pinHash: pin ? await hashPin(pin) : undefined,
    settings: {},
    createdAt: now,
    updatedAt: now
  };
  const id = await db.profiles.put(profile);
  return id!;
}

export async function getProfiles(): Promise<Profile[]> {
  return await db.profiles.orderBy('name').toArray();
}

export async function getProfile(id: number): Promise<Profile | undefined> {
  return await db.profiles.get(id);
}

export async function updateProfile(id: number, updates: Partial<Profile>): Promise<void> {
  await db.profiles.update(id, { ...updates, updatedAt: new Date() });
}

export async function deleteProfile(id: number): Promise<void> {
  await db.profiles.delete(id);
  await db.appProgress.where('profileId').equals(id).delete();
}

export async function verifyPin(profileId: number, pin: string): Promise<boolean> {
  const profile = await db.profiles.get(profileId);
  if (!profile?.pinHash) return true; // no pin set = always OK
  return profile.pinHash === await hashPin(pin);
}

// --- App Progress ---

export async function getAppProgress(profileId: number, appId: string): Promise<Record<string, unknown> | null> {
  const entry = await db.appProgress.where('[profileId+appId]').equals([profileId, appId]).first();
  return entry?.data ?? null;
}

export async function saveAppProgress(profileId: number, appId: string, data: Record<string, unknown>): Promise<void> {
  const existing = await db.appProgress.where('[profileId+appId]').equals([profileId, appId]).first();
  if (existing) {
    await db.appProgress.update(existing.id!, { data, updatedAt: new Date() });
  } else {
    await db.appProgress.put({ profileId, appId, data, updatedAt: new Date() });
  }
}
