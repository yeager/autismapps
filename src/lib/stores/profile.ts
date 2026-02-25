import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Profile } from '$lib/storage';

const stored = browser ? localStorage.getItem('active-profile-id') : null;

export const activeProfileId = writable<number | null>(stored ? Number(stored) : null);
export const activeProfile = writable<Profile | null>(null);

if (browser) {
  activeProfileId.subscribe((id) => {
    if (id !== null) localStorage.setItem('active-profile-id', String(id));
    else localStorage.removeItem('active-profile-id');
  });
}
