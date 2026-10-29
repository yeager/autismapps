import { base } from '$app/paths';
import { dictionaryPictogramFiles } from './dictionary-files';
import { sharedPictogramFiles } from './shared-pictogram-files';
import { trafficSafetyPictogramUrl } from '$lib/data/pictogram-cache.js';

/**
 * Stable paths for the subset of shared Piktali pictograms used by the picture
 * dictionary. The complete manifest remains in static/piktali-pictograms for
 * applications that need the full catalog and its review metadata.
 */
export function piktaliPictogramUrl(symbol: string): string | null {
  const file = dictionaryPictogramFiles[symbol] ?? sharedPictogramFiles[symbol];
  return file ? `${base}/piktali-pictograms/${file}` : null;
}

export function piktaliDictionaryPictogramUrl(englishWord: string): string | null {
  return piktaliPictogramUrl(englishWord);
}

/** Shared Piktali assets for the traffic-safety activity cards. */
export function piktaliTrafficPictogramUrl(symbol: string): string | null {
  const files: Record<string, string> = {
    // The deployment URL is versioned so Loopia caches cannot keep old artwork.
    trafficlight: 'assets/trafficlight-fd91ed3bdb7e-v2.svg',
    crosswalk: 'assets/crosswalk-9302fa0c66df.webp',
    danger: 'assets/danger-4bc28024e9b4.webp',
    safeplace: 'assets/safeplace-59c8550bf6e0-v2.svg',
    reflector: 'assets/reflector-vest-ce860b12f9aa-v2.svg',
    car: 'assets/car-a54a1ff80372.webp',
    sidewalk: 'assets/sidewalk.svg',
    street: 'assets/street.svg',
    parkinglot: 'assets/parkinglot.svg',
    playground: 'assets/playground.webp',
    highway: 'assets/street.svg',
    school: 'assets/school.webp',
    roadworks: 'assets/roadworks.svg',
    stop: 'assets/stop.webp',
    wait: 'assets/wait.webp',
    go: 'assets/go.webp',
    look: 'assets/look.webp',
    walk: 'assets/walk.webp',
    person: 'assets/persongeneral.webp',
    sun: 'assets/sun.webp',
    moon: 'assets/moon.webp',
    bus: 'assets/bus.webp',
    truck: 'assets/truck.webp',
    bicycle: 'assets/bicycle.webp',
    ambulance: 'assets/ambulance.webp',
    'police-car': 'assets/police-car.webp',
    'fire-engine': 'assets/fire-engine.webp',
    hat: 'assets/hat.webp',
    backpack: 'assets/backpack.webp',
    shoes: 'assets/shoes.webp',
    helmet: 'assets/helmet.webp'
  };
  const file = files[symbol];
  return file
    ? trafficSafetyPictogramUrl(base, file, import.meta.env.VITE_PIKTALI_ASSET_URL_MODE === 'path')
    : null;
}
