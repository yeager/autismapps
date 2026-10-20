// ARASAAC pictograms used in the traffic safety app. These IDs were checked
// against the catalog keyword metadata; null means there is no safe match.
import { base } from '$app/paths';
import { TRAFFIC_SAFETY_PICTOGRAM_REVISION } from './pictogram-cache.js';

/** @type {Record<string, number | null>} */
export const ARASAAC_IDS = {
  // Basic actions (validated)
  stop: 7196,
  go: 8142,
  look: 6564,
  wait: 36914,
  walk: 29951,
  
  // Vehicles (validated)
  car: 2339,
  bus: 2262,
  truck: 3232,  // Dump truck - validated
  bicycle: 6935,  // Validated - schematic version
  ambulance: 6899,
  police: 6983, // Police car from search results
  firetruck: 6982, // Fire truck - validated (schematic)
  
  // Places and safety
  sidewalk: 2247,
  road: 2302,
  parking: 24755,
  safePlace: 6964, // House as a familiar safe-place cue; do not use lookup "safe" (strongbox)
  dangerous: 25315, // Danger warning sign (validated)
  
  // Traffic elements
  trafficLight: 2567, // Full traffic light with red, yellow, and green lamps
  crosswalk: 3430,
  warning: 25315, // Same as danger
  
  // Time/visibility
  day: 26799,
  night: 26997,
  
  // Emotions/feedback
  good: null,
  excellent: null,
};

/**
 * Get the locally bundled, visually verified ARASAAC pictogram for an ID.
 * @param {number} id - ARASAAC pictogram ID
 * @returns {string} URL to pictogram
 */
export function getArasaacUrl(id) {
  return `${base}/pictograms/traffic-safety/${id}.png?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`;
}

/**
 * Get pictogram data for a key
 * @param {string} key - Key from ARASAAC_IDS
 * @returns {{ id: number, url: string, key: string } | null} Pictogram data, or null if no icon exists
 */
export function getPictogram(key) {
  const id = ARASAAC_IDS[key];
  if (id == null) {
    console.warn(`No ARASAAC ID found for key: ${key}`);
    return null;
  }
  
  return {
    id,
    url: getArasaacUrl(id),
    key
  };
}
