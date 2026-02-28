/**
 * Platform detection for gating features between web and native builds.
 *
 * The web PWA version runs without profiles/login.
 * Native builds (Electron, Tauri, etc.) can enable profiles.
 *
 * Set VITE_NATIVE_APP=true in native build environments to enable profiles.
 */

import { browser } from '$app/environment';

/** True when running as a native desktop app (Electron/Tauri) */
export const isNativeApp: boolean = browser
  ? (import.meta.env.VITE_NATIVE_APP === 'true' ||
     typeof (window as Record<string, unknown>).__TAURI__ !== 'undefined' ||
     typeof (window as Record<string, unknown>).electronAPI !== 'undefined')
  : false;

/** True when running as a web PWA — no profiles needed */
export const isWebApp: boolean = !isNativeApp;
