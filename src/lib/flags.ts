// SVG flag icons — emoji flags don't render on Windows
// Simple inline SVGs that work everywhere

export const FLAGS: Record<string, string> = {
  '🇸🇪': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="20" fill="#006AA7"/><rect x="9" width="4" height="20" fill="#FECC02"/><rect y="8" width="32" height="4" fill="#FECC02"/></svg>`,
  '🇬🇧': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="20" fill="#012169"/><path d="M0,0 L32,20 M32,0 L0,20" stroke="#fff" stroke-width="3"/><path d="M0,0 L32,20 M32,0 L0,20" stroke="#C8102E" stroke-width="1.5"/><rect x="13" width="6" height="20" fill="#fff"/><rect y="7.5" width="32" height="5" fill="#fff"/><rect x="14" width="4" height="20" fill="#C8102E"/><rect y="8.5" width="32" height="3" fill="#C8102E"/></svg>`,
  '🇩🇰': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="20" fill="#C8102E"/><rect x="9" width="4" height="20" fill="#fff"/><rect y="8" width="32" height="4" fill="#fff"/></svg>`,
  '🇩🇪': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="6.67" fill="#000"/><rect y="6.67" width="32" height="6.67" fill="#DD0000"/><rect y="13.33" width="32" height="6.67" fill="#FFCC00"/></svg>`,
  '🇪🇸': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="5" fill="#AA151B"/><rect y="5" width="32" height="10" fill="#F1BF00"/><rect y="15" width="32" height="5" fill="#AA151B"/></svg>`,
  '🇫🇮': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="20" fill="#fff"/><rect x="8" width="4" height="20" fill="#003580"/><rect y="8" width="32" height="4" fill="#003580"/></svg>`,
  '🇫🇷': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="10.67" height="20" fill="#002395"/><rect x="10.67" width="10.67" height="20" fill="#fff"/><rect x="21.33" width="10.67" height="20" fill="#ED2939"/></svg>`,
  '🇮🇹': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="10.67" height="20" fill="#009246"/><rect x="10.67" width="10.67" height="20" fill="#fff"/><rect x="21.33" width="10.67" height="20" fill="#CE2B37"/></svg>`,
  '🇳🇴': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="20" fill="#BA0C2F"/><rect x="8" width="6" height="20" fill="#fff"/><rect y="7" width="32" height="6" fill="#fff"/><rect x="9" width="4" height="20" fill="#00205B"/><rect y="8" width="32" height="4" fill="#00205B"/></svg>`,
  '🇳🇱': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="6.67" fill="#AE1C28"/><rect y="6.67" width="32" height="6.67" fill="#fff"/><rect y="13.33" width="32" height="6.67" fill="#21468B"/></svg>`,
  '🇵🇱': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="10" fill="#fff"/><rect y="10" width="32" height="10" fill="#DC143C"/></svg>`,
  '🇧🇷': `<svg viewBox="0 0 32 20" width="24" height="15" style="border-radius:2px;vertical-align:middle"><rect width="32" height="20" fill="#009B3A"/><path d="M16 2 L30 10 L16 18 L2 10 Z" fill="#FEDF00"/><circle cx="16" cy="10" r="4" fill="#002776"/></svg>`,
};

/** Convert emoji flag to inline SVG, or return the emoji as fallback */
export function flagSvg(emoji: string): string {
  return FLAGS[emoji] ?? emoji;
}
