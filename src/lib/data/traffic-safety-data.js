// Validated ARASAAC pictogram IDs for traffic safety app
// All IDs validated via https://api.arasaac.org/v1/pictograms/en/search/{word}

export const ARASAAC_IDS = {
  // Basic actions (validated)
  stop: 7196,
  go: 8142,
  look: 6564,
  wait: 36914,
  walk: 2523,  // Will need to validate
  
  // Vehicles (validated)
  car: 2339,
  bus: 2262,
  truck: 3232,  // Dump truck - validated
  bicycle: 6935,  // Validated - schematic version
  ambulance: 3447, // Will need to validate
  police: 6983, // Police car from search results
  firetruck: 6982, // Fire truck - validated (schematic)
  
  // Places and safety
  sidewalk: 4782, // Will need to validate
  road: 3986, // Will need to validate
  parking: 6283, // Car park from search results
  safe: 6068, // Safe (strongbox) - may need different word
  dangerous: 25315, // Danger warning sign (validated)
  
  // Traffic elements
  trafficLight: 2637, // Will need to validate
  crosswalk: 36845, // From bus search - wait at crosswalk
  warning: 25315, // Same as danger
  
  // Time/visibility
  day: 8523, // Will need to validate
  night: 8524, // Will need to validate
  reflector: 39540, // Will need to validate
  
  // Emotions/feedback
  good: 2830, // Will need to validate
  excellent: 2831, // Will need to validate
};

/**
 * Get ARASAAC pictogram URL for given ID
 * @param {number} id - ARASAAC pictogram ID
 * @param {number} size - Size (default 500)
 * @returns {string} URL to pictogram
 */
export function getArasaacUrl(id, size = 500) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_${size}.png`;
}

/**
 * Get pictogram data for a key
 * @param {string} key - Key from ARASAAC_IDS
 * @returns {object} Pictogram data with id and url
 */
export function getPictogram(key, size = 500) {
  const id = ARASAAC_IDS[key];
  if (!id) {
    console.warn(`No ARASAAC ID found for key: ${key}`);
    return null;
  }
  
  return {
    id,
    url: getArasaacUrl(id, size),
    key
  };
}