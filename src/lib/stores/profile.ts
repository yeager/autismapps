import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { isWebApp } from '$lib/platform';
import type { Profile } from '$lib/storage';

/**
 * Default profile ID used for web builds where no login/profile selection exists.
 * All progress and rewards are stored under this ID.
 */
const WEB_DEFAULT_PROFILE_ID = 1;

const stored = browser ? localStorage.getItem('active-profile-id') : null;

// On web: always use the default profile ID (no profile selection)
// On native: use stored profile or null (requires profile selection)
const initialId = isWebApp
  ? WEB_DEFAULT_PROFILE_ID
  : (stored ? Number(stored) : null);

export const activeProfileId = writable<number | null>(initialId);

const defaultWebProfile: Profile = {
  id: WEB_DEFAULT_PROFILE_ID,
  name: 'Användare',
  avatar: '😊',
  settings: {},
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const activeProfile = writable<Profile | null>(isWebApp ? defaultWebProfile : null);

if (browser) {
  activeProfileId.subscribe((id) => {
    if (id !== null) localStorage.setItem('active-profile-id', String(id));
    else localStorage.removeItem('active-profile-id');
  });

  // On web, ensure the default profile exists in IndexedDB for rewards/progress
  if (isWebApp) {
    import('$lib/storage').then(({ db }) => {
      db.profiles.get(WEB_DEFAULT_PROFILE_ID).then(existing => {
        if (!existing) {
          db.profiles.put(defaultWebProfile);
        }
      });
    });
  }
}
