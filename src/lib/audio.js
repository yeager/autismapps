/** @type {AudioContext | null} */
let ctx = null;

/**
 * The app-wide AudioContext. Every open context keeps its own audio rendering thread running, so creating
 * one per sound (and never closing it) piles them up while navigating — audio starts crackling and sounding
 * robotic. Always reuse this one; it is created lazily (needs a user gesture to start) and resumed on use.
 * @returns {AudioContext | null}
 */
export function getAudioContext() {
  if (typeof AudioContext === 'undefined') return null;
  if (!ctx || ctx.state === 'closed') ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** @param {number} freq @param {number} duration @param {OscillatorType} [type] */
function beep(freq, duration, type = 'sine') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0.3;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

export function playSuccessSound() { beep(523, 0.15); setTimeout(() => beep(659, 0.15), 150); setTimeout(() => beep(784, 0.3), 300); }
export function playErrorSound() { beep(200, 0.3, 'square'); }
/** @param {'car'|'bus'|'truck'|'bicycle'|'ambulance'|'police'|'firetruck'} type */
export function playVehicleSound(type) {
  const sounds = { car: [200, 0.5], bus: [120, 0.6], truck: [100, 0.7], bicycle: [800, 0.2], ambulance: [600, 0.3], police: [500, 0.3], firetruck: [400, 0.4] };
  const [freq, dur] = sounds[type] || [300, 0.3];
  beep(freq, dur);
}
