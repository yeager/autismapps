/**
 * PROMPT Touch Point Database
 * Prompts for Restructuring Oral Muscular Phonetic Targets
 *
 * Each entry maps a Swedish speech sound to:
 * - Touch zone on the face/jaw
 * - Direction and amount of pressure
 * - Step-by-step tactile cues
 * - ARASAAC pictogram for example word
 *
 * Touch zones reference the FaceDiagram SVG regions.
 * ARASAAC URL: https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */

/** @typedef {'jaw'|'lips'|'tongue-tip'|'back'|'combined'} SoundCategory */
/** @typedef {'light'|'medium'|'firm'} Pressure */
/** @typedef {'brief'|'hold'|'sustained'} Duration */
/** @typedef {'up'|'down'|'forward'|'back'|'inward'|'lateral'|'none'} Direction */

/**
 * @typedef {Object} TouchZoneCoords
 * @property {number} cx - Center X on face SVG (0-200 viewBox)
 * @property {number} cy - Center Y on face SVG (0-260 viewBox)
 * @property {number} r  - Radius of touch zone
 */

/**
 * Touch zone positions on the face SVG (viewBox 0 0 200 260)
 * These map to specific anatomical landmarks.
 */
export const TOUCH_ZONES = {
  'under-chin':      { cx: 100, cy: 230, r: 18 },
  'lower-lip':       { cx: 100, cy: 175, r: 14 },
  'upper-lip':       { cx: 100, cy: 155, r: 14 },
  'lip-corners':     { cx: 100, cy: 165, r: 20 },
  'chin-front':      { cx: 100, cy: 200, r: 16 },
  'jaw-side-left':   { cx: 55,  cy: 185, r: 14 },
  'jaw-side-right':  { cx: 145, cy: 185, r: 14 },
  'cheek-left':      { cx: 50,  cy: 155, r: 16 },
  'cheek-right':     { cx: 150, cy: 155, r: 16 },
  'nose-side':       { cx: 100, cy: 135, r: 12 },
  'philtrum':        { cx: 100, cy: 148, r: 10 },
  'jaw-angle-left':  { cx: 45,  cy: 200, r: 14 },
  'jaw-angle-right': { cx: 155, cy: 200, r: 14 },
};

/**
 * Categories of speech sounds with i18n keys
 */
export const CATEGORIES = [
  { id: 'jaw',        labelKey: 'promptGuide.cat.jaw',       icon: '🦴', color: '#E74C3C' },
  { id: 'lips',       labelKey: 'promptGuide.cat.lips',      icon: '👄', color: '#E67E22' },
  { id: 'tongue-tip', labelKey: 'promptGuide.cat.tongueTip', icon: '👅', color: '#3498DB' },
  { id: 'back',       labelKey: 'promptGuide.cat.back',      icon: '🔙', color: '#27AE60' },
  { id: 'combined',   labelKey: 'promptGuide.cat.combined',  icon: '🇸🇪', color: '#9B59B6' },
];

/**
 * Pressure level metadata
 */
export const PRESSURE_LEVELS = {
  light:  { labelKey: 'promptGuide.pressure.light',  icon: '○',   color: '#27AE60', bars: 1 },
  medium: { labelKey: 'promptGuide.pressure.medium', icon: '◐',   color: '#F39C12', bars: 2 },
  firm:   { labelKey: 'promptGuide.pressure.firm',   icon: '●',   color: '#E74C3C', bars: 3 },
};

/**
 * Duration metadata
 */
export const DURATION_TYPES = {
  brief:     { labelKey: 'promptGuide.duration.brief',     icon: '⚡', ms: 300  },
  hold:      { labelKey: 'promptGuide.duration.hold',      icon: '✋', ms: 1000 },
  sustained: { labelKey: 'promptGuide.duration.sustained', icon: '⏳', ms: 2000 },
};

/**
 * Direction arrow angles (degrees, 0 = right, 90 = down) for SVG rotation
 */
export const DIRECTION_ANGLES = {
  up:       -90,
  down:      90,
  forward:    0,
  back:     180,
  inward:    90,   // toward midline
  lateral:    0,   // outward
  none:       0,
};

/**
 * Get ARASAAC pictogram URL
 * @param {number} id
 * @returns {string}
 */
export function getArasaacUrl(id) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
}

/**
 * Get sounds filtered by category
 * @param {string} categoryId
 * @returns {PromptSound[]}
 */
export function getSoundsByCategory(categoryId) {
  return promptData.filter(s => s.category === categoryId);
}

/**
 * Main PROMPT data — one entry per sound
 * @type {Array<{
 *   sound: string, ipa: string, category: SoundCategory,
 *   touchZone: string, touchZoneSecondary?: string,
 *   direction: Direction, pressure: Pressure, duration: Duration,
 *   description_sv: string, description_en: string,
 *   steps_sv: string[], steps_en: string[],
 *   exampleWord: string, arasaacId: number,
 *   videoPlaceholder?: boolean
 * }>}
 */
export const promptData = [
  // ═══════════════════════════════════════
  // JAW CONTROL SOUNDS (m, b, p)
  // ═══════════════════════════════════════
  {
    sound: 'm',
    ipa: 'm',
    category: 'jaw',
    touchZone: 'under-chin',
    direction: 'up',
    pressure: 'medium',
    duration: 'sustained',
    description_sv: 'Placera pekfingret under hakan. Tryck försiktigt uppåt för att hjälpa käken att stänga. Håll kvar medan /m/ produceras med stängda läppar.',
    description_en: 'Place index finger under chin. Gently press upward to help jaw close. Maintain contact while /m/ is produced with closed lips.',
    steps_sv: [
      'Placera pekfingret under barnets haka',
      'Tryck försiktigt uppåt för att stänga käken',
      'Håll läpparna ihop — säg "mmm" tillsammans',
      'Håll kvar tills ljudet avslutas'
    ],
    steps_en: [
      'Place index finger under the child\'s chin',
      'Press gently upward to close the jaw',
      'Keep lips together — say "mmm" together',
      'Hold until the sound finishes'
    ],
    exampleWord: 'mamma',
    arasaacId: 2458,
    videoPlaceholder: true,
  },
  {
    sound: 'b',
    ipa: 'b',
    category: 'jaw',
    touchZone: 'under-chin',
    direction: 'up',
    pressure: 'medium',
    duration: 'brief',
    description_sv: 'Placera pekfingret under hakan. Tryck uppåt för att hjälpa till att stänga käken för /b/.',
    description_en: 'Place index finger under chin. Apply upward pressure to help close jaw for /b/.',
    steps_sv: [
      'Placera handen under barnets haka',
      'Tryck försiktigt uppåt',
      'Säg "b" tillsammans medan du trycker',
      'Släpp när ljudet produceras'
    ],
    steps_en: [
      'Position hand under child\'s chin',
      'Apply gentle upward pressure',
      'Say "b" together as you press',
      'Release when sound is produced'
    ],
    exampleWord: 'boll',
    arasaacId: 3241,
    videoPlaceholder: true,
  },
  {
    sound: 'p',
    ipa: 'p',
    category: 'jaw',
    touchZone: 'under-chin',
    direction: 'up',
    pressure: 'medium',
    duration: 'brief',
    description_sv: 'Samma grepp som för /b/ — pekfinger under hakan, tryck uppåt. /p/ kräver mer lufttryck (aspiration).',
    description_en: 'Same grip as /b/ — index finger under chin, press up. /p/ requires more air pressure (aspiration).',
    steps_sv: [
      'Placera pekfingret under hakan',
      'Tryck försiktigt uppåt för käkstängning',
      'Uppmuntra ett "puff" av luft — säg "p"',
      'Släpp snabbt efter ljudet'
    ],
    steps_en: [
      'Place index finger under chin',
      'Press gently upward for jaw closure',
      'Encourage a puff of air — say "p"',
      'Release quickly after the sound'
    ],
    exampleWord: 'pappa',
    arasaacId: 31146,
    videoPlaceholder: true,
  },

  // ═══════════════════════════════════════
  // LIP SOUNDS (f, v)
  // ═══════════════════════════════════════
  {
    sound: 'f',
    ipa: 'f',
    category: 'lips',
    touchZone: 'lower-lip',
    direction: 'up',
    pressure: 'light',
    duration: 'sustained',
    description_sv: 'Tryck försiktigt underläppen uppåt mot överkäkens tänder. Luft ska strömma genom springan.',
    description_en: 'Gently press lower lip upward toward upper teeth. Air should flow through the gap.',
    steps_sv: [
      'Placera fingret under barnets underläpp',
      'Lyft läppen försiktigt uppåt mot tänderna',
      'Uppmuntra barnet att blåsa luft — "ffff"',
      'Håll positionen medan luften strömmar'
    ],
    steps_en: [
      'Place finger under child\'s lower lip',
      'Lift lip gently upward toward teeth',
      'Encourage child to blow air — "ffff"',
      'Hold position while air flows'
    ],
    exampleWord: 'fisk',
    arasaacId: 2520,
    videoPlaceholder: true,
  },
  {
    sound: 'v',
    ipa: 'v',
    category: 'lips',
    touchZone: 'lower-lip',
    direction: 'up',
    pressure: 'light',
    duration: 'sustained',
    description_sv: 'Samma som /f/ men med röst (vibration). Underläppen mot övre tänderna. Känn vibrationen!',
    description_en: 'Same as /f/ but voiced (vibration). Lower lip against upper teeth. Feel the vibration!',
    steps_sv: [
      'Lyft underläppen mot övre tänderna (som /f/)',
      'Lägg andra handen på halsen för att känna vibrationen',
      'Säg "vvvv" — känn att det vibrerar',
      'Håll kvar tills vibrationen är tydlig'
    ],
    steps_en: [
      'Lift lower lip to upper teeth (like /f/)',
      'Place other hand on throat to feel vibration',
      'Say "vvvv" — feel the vibration',
      'Hold until vibration is clear'
    ],
    exampleWord: 'vatten',
    arasaacId: 32464,
    videoPlaceholder: true,
  },

  // ═══════════════════════════════════════
  // TONGUE TIP SOUNDS (t, d, n, l, s)
  // ═══════════════════════════════════════
  {
    sound: 't',
    ipa: 't',
    category: 'tongue-tip',
    touchZone: 'chin-front',
    direction: 'up',
    pressure: 'light',
    duration: 'brief',
    description_sv: 'Stöd under hakan/hakspetsen. Rikta lätt tryck uppåt och framåt för att uppmuntra tungan att nå tandvallen.',
    description_en: 'Support under chin/chin tip. Direct light pressure up and forward to encourage tongue to reach alveolar ridge.',
    steps_sv: [
      'Placera tummen under hakspetsen',
      'Tryck lätt uppåt och framåt',
      'Uppmuntra barnet att säga "t" med tungspetsen uppe',
      'Släpp direkt efter ljudet'
    ],
    steps_en: [
      'Place thumb under chin tip',
      'Press lightly up and forward',
      'Encourage saying "t" with tongue tip up',
      'Release right after the sound'
    ],
    exampleWord: 'tak',
    arasaacId: 2584,
    videoPlaceholder: true,
  },
  {
    sound: 'd',
    ipa: 'd',
    category: 'tongue-tip',
    touchZone: 'chin-front',
    direction: 'up',
    pressure: 'light',
    duration: 'brief',
    description_sv: 'Samma som /t/ men med röst. Stöd under hakan, tryck uppåt. Känn vibrationen.',
    description_en: 'Same as /t/ but voiced. Support under chin, press up. Feel vibration.',
    steps_sv: [
      'Placera tummen under hakspetsen',
      'Tryck lätt uppåt (som /t/)',
      'Säg "d" — känn vibrationen i halsen',
      'Släpp efter ljudet'
    ],
    steps_en: [
      'Place thumb under chin tip',
      'Press lightly upward (like /t/)',
      'Say "d" — feel vibration in throat',
      'Release after the sound'
    ],
    exampleWord: 'dörr',
    arasaacId: 3244,
    videoPlaceholder: true,
  },
  {
    sound: 'n',
    ipa: 'n',
    category: 'tongue-tip',
    touchZone: 'nose-side',
    touchZoneSecondary: 'chin-front',
    direction: 'up',
    pressure: 'light',
    duration: 'hold',
    description_sv: 'Berör sidan av näsan för att visa nasalitet, stöd under hakan för tungposition. Luften ska komma genom näsan.',
    description_en: 'Touch side of nose to show nasality, support under chin for tongue position. Air should come through nose.',
    steps_sv: [
      'Lägg fingret lätt mot sidan av näsan',
      'Stöd under hakan med andra handen',
      'Säg "nnn" — känn luften genom näsan',
      'Håll positionen tills nasalt ljud hörs'
    ],
    steps_en: [
      'Place finger gently on side of nose',
      'Support under chin with other hand',
      'Say "nnn" — feel air through nose',
      'Hold position until nasal sound is heard'
    ],
    exampleWord: 'näsa',
    arasaacId: 2887,
    videoPlaceholder: true,
  },
  {
    sound: 'l',
    ipa: 'l',
    category: 'tongue-tip',
    touchZone: 'chin-front',
    direction: 'up',
    pressure: 'medium',
    duration: 'hold',
    description_sv: 'Stöd under hakan, tryck uppåt för att lyfta tungan. Tungspetsen ska vila mot tandvallen medan luften passerar vid sidorna.',
    description_en: 'Support under chin, press up to lift tongue. Tongue tip should rest against alveolar ridge while air passes at sides.',
    steps_sv: [
      'Placera tummen under hakspetsen',
      'Tryck uppåt för att lyfta tungan',
      'Uppmuntra "lll" — tungan stannar uppe',
      'Håll kvar medan luften passerar vid sidorna'
    ],
    steps_en: [
      'Place thumb under chin tip',
      'Press upward to lift tongue',
      'Encourage "lll" — tongue stays up',
      'Hold while air passes at the sides'
    ],
    exampleWord: 'lampa',
    arasaacId: 4936,
    videoPlaceholder: true,
  },
  {
    sound: 's',
    ipa: 's',
    category: 'tongue-tip',
    touchZone: 'chin-front',
    direction: 'forward',
    pressure: 'light',
    duration: 'sustained',
    description_sv: 'Lätt stöd under hakan, rikta framåt. Tungspetsen nära (men inte mot) tandvallen. Luft ska strömma genom en smal springa.',
    description_en: 'Light support under chin, direct forward. Tongue tip near (not touching) alveolar ridge. Air flows through narrow gap.',
    steps_sv: [
      'Placera fingret under hakspetsen',
      'Rikta lätt tryck framåt',
      'Uppmuntra "ssss" — tänderna nästan ihop',
      'Håll kvar medan luften väser'
    ],
    steps_en: [
      'Place finger under chin tip',
      'Direct light pressure forward',
      'Encourage "ssss" — teeth almost together',
      'Hold while air hisses'
    ],
    exampleWord: 'sol',
    arasaacId: 7252,
    videoPlaceholder: true,
  },

  // ═══════════════════════════════════════
  // BACK SOUNDS (k, g, ng)
  // ═══════════════════════════════════════
  {
    sound: 'k',
    ipa: 'k',
    category: 'back',
    touchZone: 'jaw-angle-left',
    touchZoneSecondary: 'jaw-angle-right',
    direction: 'up',
    pressure: 'medium',
    duration: 'brief',
    description_sv: 'Tryck under käkvinkeln (båda sidor) för att uppmuntra bakre tungkontakt med gommen. Extern beröring — du rör inte tungan direkt.',
    description_en: 'Press under jaw angle (both sides) to encourage back tongue contact with palate. External touch — you don\'t touch the tongue directly.',
    steps_sv: [
      'Placera fingrarna under käkvinkeln (båda sidor)',
      'Tryck försiktigt uppåt',
      'Säg "k" — bakre delen av tungan lyfts',
      'Släpp snabbt efter ljudet'
    ],
    steps_en: [
      'Place fingers under jaw angle (both sides)',
      'Press gently upward',
      'Say "k" — back of tongue lifts',
      'Release quickly after the sound'
    ],
    exampleWord: 'katt',
    arasaacId: 7114,
    videoPlaceholder: true,
  },
  {
    sound: 'g',
    ipa: 'ɡ',
    category: 'back',
    touchZone: 'jaw-angle-left',
    touchZoneSecondary: 'jaw-angle-right',
    direction: 'up',
    pressure: 'medium',
    duration: 'brief',
    description_sv: 'Samma som /k/ men med röst. Tryck under käkvinkeln för att stödja bakre tungkontakt.',
    description_en: 'Same as /k/ but voiced. Press under jaw angle to support back tongue contact.',
    steps_sv: [
      'Placera fingrarna under käkvinkeln (båda sidor)',
      'Tryck försiktigt uppåt (som /k/)',
      'Säg "g" — känn vibrationen',
      'Släpp snabbt'
    ],
    steps_en: [
      'Place fingers under jaw angle (both sides)',
      'Press gently upward (like /k/)',
      'Say "g" — feel the vibration',
      'Release quickly'
    ],
    exampleWord: 'gris',
    arasaacId: 24972,
    videoPlaceholder: true,
  },
  {
    sound: 'ng',
    ipa: 'ŋ',
    category: 'back',
    touchZone: 'jaw-angle-left',
    touchZoneSecondary: 'jaw-angle-right',
    direction: 'up',
    pressure: 'light',
    duration: 'sustained',
    description_sv: 'Tryck under käkvinkeln plus berör sidan av näsan för nasalitet. Luften ska gå genom näsan.',
    description_en: 'Press under jaw angle plus touch side of nose for nasality. Air should go through nose.',
    steps_sv: [
      'Placera fingrarna under käkvinkeln',
      'Lägg ett finger mot sidan av näsan',
      'Säg "ng" (som i "ring") — känn nasalt ljud',
      'Håll kvar tills nasaliteten är tydlig'
    ],
    steps_en: [
      'Place fingers under jaw angle',
      'Put one finger on side of nose',
      'Say "ng" (as in "ring") — feel nasal sound',
      'Hold until nasality is clear'
    ],
    exampleWord: 'ring',
    arasaacId: 6900,
    videoPlaceholder: true,
  },

  // ═══════════════════════════════════════
  // COMBINED / SWEDISH-SPECIFIC SOUNDS
  // ═══════════════════════════════════════
  {
    sound: 'sj',
    ipa: 'ɧ',
    category: 'combined',
    touchZone: 'cheek-left',
    touchZoneSecondary: 'cheek-right',
    direction: 'inward',
    pressure: 'light',
    duration: 'sustained',
    description_sv: 'Lätta tryck på kinderna (inåt) för att runda munnen. Svenskt sj-ljud är unikt — rundade läppar, luft genom bred springa.',
    description_en: 'Light pressure on cheeks (inward) to round the mouth. Swedish sj-sound is unique — rounded lips, air through wide gap.',
    steps_sv: [
      'Placera fingrarna på båda kinderna',
      'Tryck lätt inåt för att runda munnen',
      'Uppmuntra barnet att runda läpparna — "sjjj"',
      'Håll kvar medan luften strömmar'
    ],
    steps_en: [
      'Place fingers on both cheeks',
      'Press lightly inward to round the mouth',
      'Encourage child to round lips — "sjjj"',
      'Hold while air flows'
    ],
    exampleWord: 'sjö',
    arasaacId: 6022,
    videoPlaceholder: true,
  },
  {
    sound: 'tj',
    ipa: 'ɕ',
    category: 'combined',
    touchZone: 'lip-corners',
    direction: 'lateral',
    pressure: 'light',
    duration: 'sustained',
    description_sv: 'Stöd vid mungiporna, dra lätt utåt (bred mun). Tungan ska ligga brett bakom tänderna.',
    description_en: 'Support at lip corners, pull lightly outward (wide mouth). Tongue should lie flat behind teeth.',
    steps_sv: [
      'Placera fingrarna vid mungiporna',
      'Dra lätt utåt för bred munform',
      'Säg "tj" (som i "tjugo") med bred tunga',
      'Håll kvar medan ljudet produceras'
    ],
    steps_en: [
      'Place fingers at lip corners',
      'Pull lightly outward for wide mouth shape',
      'Say "tj" (as in "tjugo") with flat tongue',
      'Hold while sound is produced'
    ],
    exampleWord: 'tjugo',
    arasaacId: 29550,
    videoPlaceholder: true,
  },
  {
    sound: 'r',
    ipa: 'r',
    category: 'combined',
    touchZone: 'chin-front',
    direction: 'up',
    pressure: 'medium',
    duration: 'hold',
    description_sv: 'Stöd under hakan, tryck uppåt för tunglyft. Tungan ska vibrera lätt mot tandvallen. Svårt ljud — kräver ofta lång träning.',
    description_en: 'Support under chin, press up for tongue lift. Tongue should vibrate lightly against alveolar ridge. Difficult sound — often requires extended practice.',
    steps_sv: [
      'Placera tummen under hakspetsen',
      'Tryck uppåt för att lyfta tungan',
      'Uppmuntra "rrr" — tungspetsen ska vibrera',
      'Håll kvar och upprepa — detta tar tid!'
    ],
    steps_en: [
      'Place thumb under chin tip',
      'Press upward to lift tongue',
      'Encourage "rrr" — tongue tip should vibrate',
      'Hold and repeat — this takes time!'
    ],
    exampleWord: 'resa',
    arasaacId: 28173,
    videoPlaceholder: true,
  },
  {
    sound: 'rd',
    ipa: 'ɖ',
    category: 'combined',
    touchZone: 'chin-front',
    direction: 'up',
    pressure: 'medium',
    duration: 'brief',
    description_sv: 'Retroflex — tungan böjs bakåt. Stöd under hakan, tryck uppåt. Tungan ska toucha gommen längre bak än vanligt /d/.',
    description_en: 'Retroflex — tongue curls back. Support under chin, press up. Tongue should touch palate further back than normal /d/.',
    steps_sv: [
      'Placera tummen under hakan',
      'Tryck uppåt och lätt bakåt',
      'Uppmuntra "rd" (som i "bord") — tungan bakåtböjd',
      'Släpp efter ljudet'
    ],
    steps_en: [
      'Place thumb under chin',
      'Press up and slightly back',
      'Encourage "rd" (as in "bord") — tongue curled back',
      'Release after the sound'
    ],
    exampleWord: 'bord',
    arasaacId: 3129,
    videoPlaceholder: true,
  },
  {
    sound: 'rt',
    ipa: 'ʈ',
    category: 'combined',
    touchZone: 'chin-front',
    direction: 'up',
    pressure: 'medium',
    duration: 'brief',
    description_sv: 'Retroflex /t/. Samma som /rd/ men tonlös. Stöd under hakan.',
    description_en: 'Retroflex /t/. Same as /rd/ but voiceless. Support under chin.',
    steps_sv: [
      'Placera tummen under hakan',
      'Tryck uppåt och lätt bakåt',
      'Säg "rt" (som i "kort") — tonlöst, tungan bakåtböjd',
      'Släpp snabbt'
    ],
    steps_en: [
      'Place thumb under chin',
      'Press up and slightly back',
      'Say "rt" (as in "kort") — voiceless, tongue curled back',
      'Release quickly'
    ],
    exampleWord: 'kort',
    arasaacId: 17208,
    videoPlaceholder: true,
  },
];
