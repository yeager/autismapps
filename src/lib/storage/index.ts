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

const db = new Dexie('AutismApps') as Dexie & {
  boards: EntityTable<Board, 'id'>;
  schedules: EntityTable<Schedule, 'id'>;
  settings: EntityTable<UserSettings, 'id'>;
};

db.version(1).stores({
  boards: '++id, name, category, createdAt',
  schedules: '++id, name, date, createdAt',
  settings: '++id, &key'
});

export { db };

export async function saveBoard(board: Board): Promise<number> {
  board.updatedAt = new Date();
  if (!board.createdAt) board.createdAt = new Date();
  return await db.boards.put(board);
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
  return await db.schedules.put(schedule);
}

export async function getSchedules(): Promise<Schedule[]> {
  return await db.schedules.orderBy('createdAt').reverse().toArray();
}

export async function deleteSchedule(id: number): Promise<void> {
  await db.schedules.delete(id);
}
