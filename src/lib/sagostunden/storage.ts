/**
 * Sagostunden — IndexedDB storage via Dexie for saved stories
 */

import Dexie, { type Table } from 'dexie';

export interface SavedStory {
  id?: number;
  storyId: string;
  title: string;
  paragraphs: string[];
  wordIds: Record<string, string>;  // slot → word id
  templateId: string;
  createdAt: number;
  favorite: boolean;
}

class SagostundenDB extends Dexie {
  stories!: Table<SavedStory>;

  constructor() {
    super('sagostunden');
    this.version(1).stores({
      stories: '++id, storyId, templateId, createdAt, favorite'
    });
  }
}

const db = new SagostundenDB();

export async function saveStory(story: SavedStory): Promise<number> {
  return await db.stories.add(story);
}

export async function getAllStories(): Promise<SavedStory[]> {
  return await db.stories.orderBy('createdAt').reverse().toArray();
}

export async function deleteStory(id: number): Promise<void> {
  await db.stories.delete(id);
}

export async function toggleFavorite(id: number): Promise<void> {
  const story = await db.stories.get(id);
  if (story) {
    await db.stories.update(id, { favorite: !story.favorite });
  }
}

export async function getFavorites(): Promise<SavedStory[]> {
  return await db.stories.where('favorite').equals(1).reverse().sortBy('createdAt');
}

export async function getStoryCount(): Promise<number> {
  return await db.stories.count();
}
