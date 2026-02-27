/**
 * Rewards & Achievements system types.
 * Designed for gentle positive reinforcement — warm and encouraging,
 * not gamified or addictive. For children with NPF/IF.
 */

export interface GoldStar {
  id?: number;
  profileId: number;
  appId: string;
  reason: string;
  earnedAt: Date;
}

export interface Achievement {
  id?: number;
  profileId: number;
  achievementKey: string;
  appId?: string;
  unlockedAt: Date;
}

export interface RewardGoal {
  id?: number;
  profileId: number;
  type: 'stars' | 'time';
  target: number;
  current: number;
  rewardText: string;
  appId?: string;
  completed: boolean;
  createdAt: Date;
}

export interface Diploma {
  id?: number;
  profileId: number;
  childName: string;
  achievementKey: string;
  appId?: string;
  earnedAt: Date;
}

export interface RewardsSettings {
  enabled: boolean;
  perApp: Record<string, boolean>;
  praiseEnabled: boolean;
  diplomasEnabled: boolean;
}

export interface AchievementDef {
  key: string;
  labelKey: string;
  descKey: string;
  icon: string;
  condition: {
    type: 'stars' | 'time' | 'sessions';
    count: number;
    appId?: string;
  };
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { key: 'first_star', labelKey: 'rewards.achievement.first_star', descKey: 'rewards.achievement.first_star.desc', icon: '⭐', condition: { type: 'stars', count: 1 } },
  { key: 'five_stars', labelKey: 'rewards.achievement.five_stars', descKey: 'rewards.achievement.five_stars.desc', icon: '🌟', condition: { type: 'stars', count: 5 } },
  { key: 'ten_stars', labelKey: 'rewards.achievement.ten_stars', descKey: 'rewards.achievement.ten_stars.desc', icon: '✨', condition: { type: 'stars', count: 10 } },
  { key: 'twenty_five_stars', labelKey: 'rewards.achievement.twenty_five_stars', descKey: 'rewards.achievement.twenty_five_stars.desc', icon: '💫', condition: { type: 'stars', count: 25 } },
  { key: 'fifty_stars', labelKey: 'rewards.achievement.fifty_stars', descKey: 'rewards.achievement.fifty_stars.desc', icon: '🏆', condition: { type: 'stars', count: 50 } },
  { key: 'five_minutes', labelKey: 'rewards.achievement.five_minutes', descKey: 'rewards.achievement.five_minutes.desc', icon: '⏰', condition: { type: 'time', count: 5 } },
  { key: 'fifteen_minutes', labelKey: 'rewards.achievement.fifteen_minutes', descKey: 'rewards.achievement.fifteen_minutes.desc', icon: '🕐', condition: { type: 'time', count: 15 } },
  { key: 'thirty_minutes', labelKey: 'rewards.achievement.thirty_minutes', descKey: 'rewards.achievement.thirty_minutes.desc', icon: '🎯', condition: { type: 'time', count: 30 } },
];

export const PRAISE_KEYS = [
  'rewards.praise.bra_jobbat',
  'rewards.praise.fantastiskt',
  'rewards.praise.du_ar_duktig',
  'rewards.praise.snyggt',
  'rewards.praise.jattebra',
  'rewards.praise.wow',
  'rewards.praise.kanon',
  'rewards.praise.toppen',
];
