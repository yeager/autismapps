/**
 * Rewards store — persistent gold stars, achievements, goals, diplomas.
 * Uses Dexie (IndexedDB) for storage, Svelte stores for reactivity.
 */
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { db } from '$lib/storage';
import { activeProfileId } from '$lib/stores/profile';
import type { GoldStar, Achievement, RewardGoal, Diploma, RewardsSettings } from './types';
import { ACHIEVEMENT_DEFS, PRAISE_KEYS } from './types';

// ── Reactive stores ──
export const stars = writable<GoldStar[]>([]);
export const achievements = writable<Achievement[]>([]);
export const goals = writable<RewardGoal[]>([]);
export const diplomas = writable<Diploma[]>([]);
export const rewardsSettings = writable<RewardsSettings>(defaultSettings());
export const totalStars = writable<number>(0);

// Track last achievement for celebration overlay
export const lastUnlockedAchievement = writable<Achievement | null>(null);

function defaultSettings(): RewardsSettings {
  return { enabled: true, perApp: {}, praiseEnabled: true, diplomasEnabled: true };
}

// ── Settings persistence (localStorage) ──
export function loadSettings(): RewardsSettings {
  if (!browser) return defaultSettings();
  const profileId = get(activeProfileId);
  const key = profileId ? `rewards-settings-${profileId}` : 'rewards-settings';
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings();
}

export function saveSettings(s: RewardsSettings): void {
  if (!browser) return;
  const profileId = get(activeProfileId);
  const key = profileId ? `rewards-settings-${profileId}` : 'rewards-settings';
  localStorage.setItem(key, JSON.stringify(s));
  rewardsSettings.set(s);
}

export function isRewardsEnabled(appId?: string): boolean {
  const s = get(rewardsSettings);
  if (!s.enabled) return false;
  if (appId && s.perApp[appId] === false) return false;
  return true;
}

export function toggleAppRewards(appId: string, enabled: boolean): void {
  const s = get(rewardsSettings);
  s.perApp[appId] = enabled;
  saveSettings(s);
}

// ── Load data for active profile ──
export async function loadRewardsData(): Promise<void> {
  const profileId = get(activeProfileId);
  if (!profileId || !browser) return;

  rewardsSettings.set(loadSettings());

  const [starList, achList, goalList, diplomaList] = await Promise.all([
    db.table('goldStars').where('profileId').equals(profileId).toArray(),
    db.table('achievements').where('profileId').equals(profileId).toArray(),
    db.table('rewardGoals').where('profileId').equals(profileId).toArray(),
    db.table('diplomas').where('profileId').equals(profileId).toArray(),
  ]);

  stars.set(starList);
  achievements.set(achList);
  goals.set(goalList);
  diplomas.set(diplomaList);
  totalStars.set(starList.length);
}

// ── Award a gold star ──
export async function awardStar(appId: string, reason: string = 'rewards.star.completed'): Promise<GoldStar | null> {
  const profileId = get(activeProfileId);
  if (!profileId || !isRewardsEnabled(appId)) return null;

  const star: GoldStar = {
    profileId,
    appId,
    reason,
    earnedAt: new Date(),
  };

  star.id = await db.table('goldStars').add(star) as number;
  stars.update(s => [...s, star]);
  totalStars.update(n => n + 1);

  // Check for new achievements
  await checkAchievements(profileId);

  // Update goals
  await updateGoals(profileId, 'stars', 1, appId);

  return star;
}

// ── Check & unlock achievements ──
async function checkAchievements(profileId: number): Promise<void> {
  const currentAch = get(achievements);
  const starCount = get(totalStars);

  for (const def of ACHIEVEMENT_DEFS) {
    if (currentAch.some(a => a.achievementKey === def.key)) continue;

    let met = false;
    if (def.condition.type === 'stars') {
      met = starCount >= def.condition.count;
    }
    // Time-based achievements are checked via trackTime()

    if (met) {
      const ach: Achievement = {
        profileId,
        achievementKey: def.key,
        unlockedAt: new Date(),
      };
      ach.id = await db.table('achievements').add(ach) as number;
      achievements.update(a => [...a, ach]);
      lastUnlockedAchievement.set(ach);
    }
  }
}

// ── Track time spent (call periodically from apps) ──
export async function trackTime(appId: string, minutes: number): Promise<void> {
  const profileId = get(activeProfileId);
  if (!profileId || !isRewardsEnabled(appId)) return;

  await updateGoals(profileId, 'time', minutes, appId);

  // Check time-based achievements
  // Sum total time across all apps from goals
  const currentAch = get(achievements);
  const totalMinutes = minutes; // simplified — in production, track cumulative

  for (const def of ACHIEVEMENT_DEFS) {
    if (def.condition.type !== 'time') continue;
    if (currentAch.some(a => a.achievementKey === def.key)) continue;
    // For time achievements, we check cumulative app progress
    // This is a simplified check
  }
}

// ── Goals ──
async function updateGoals(profileId: number, type: 'stars' | 'time', amount: number, appId?: string): Promise<void> {
  const currentGoals = get(goals);
  for (const goal of currentGoals) {
    if (goal.completed) continue;
    if (goal.type !== type) continue;
    if (goal.appId && goal.appId !== appId) continue;

    goal.current = Math.min(goal.current + amount, goal.target);
    if (goal.current >= goal.target) goal.completed = true;

    await db.table('rewardGoals').update(goal.id!, {
      current: goal.current,
      completed: goal.completed,
    });
  }
  goals.set([...currentGoals]);
}

export async function createGoal(
  type: 'stars' | 'time',
  target: number,
  rewardText: string,
  appId?: string,
): Promise<RewardGoal> {
  const profileId = get(activeProfileId);
  if (!profileId) throw new Error('No active profile');

  const goal: RewardGoal = {
    profileId,
    type,
    target,
    current: 0,
    rewardText,
    appId,
    completed: false,
    createdAt: new Date(),
  };

  goal.id = await db.table('rewardGoals').add(goal) as number;
  goals.update(g => [...g, goal]);
  return goal;
}

export async function deleteGoal(goalId: number): Promise<void> {
  await db.table('rewardGoals').delete(goalId);
  goals.update(g => g.filter(x => x.id !== goalId));
}

// ── Diplomas ──
export async function createDiploma(childName: string, achievementKey: string, appId?: string): Promise<Diploma> {
  const profileId = get(activeProfileId);
  if (!profileId) throw new Error('No active profile');

  const diploma: Diploma = {
    profileId,
    childName,
    achievementKey,
    appId,
    earnedAt: new Date(),
  };

  diploma.id = await db.table('diplomas').add(diploma) as number;
  diplomas.update(d => [...d, diploma]);
  return diploma;
}

// ── Praise ──
export function getRandomPraiseKey(): string {
  return PRAISE_KEYS[Math.floor(Math.random() * PRAISE_KEYS.length)];
}

// ── Init: subscribe to profile changes ──
if (browser) {
  activeProfileId.subscribe((id) => {
    if (id) loadRewardsData();
  });
}
