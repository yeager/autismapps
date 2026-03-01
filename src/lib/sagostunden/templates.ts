/**
 * Sagostunden — 25 story templates with placeholders
 * Placeholders: {DJUR}, {PLATS}, {SAK}, {MAT}, {PERSON}, {VERB}
 */

export interface StoryTemplate {
  id: string;
  title: string;
  titleKey: string;
  paragraphs: string[];
  slots: string[];  // which placeholder types are needed
}

export const TEMPLATES: StoryTemplate[] = [
  {
    id: 'adventure-forest',
    title: 'Äventyret i skogen',
    titleKey: 'sagostunden.story.adventure_forest',
    slots: ['DJUR', 'PLATS', 'SAK', 'VERB'],
    paragraphs: [
      'Det var en gång {en_DJUR} som bodde i {en_PLATS}.',
      '{DJUR} älskade att {VERB} varje dag.',
      'En dag hittade {DJUR} {en_SAK} som glittrade i solen.',
      '"{SAK}! Vilken fantastisk sak!" ropade {DJUR} glatt.',
      'Och så levde {DJUR} lycklig i alla sina dagar med sin fina {SAK}.'
    ]
  },
  {
    id: 'hungry-tale',
    title: 'Den hungriga berättelsen',
    titleKey: 'sagostunden.story.hungry_tale',
    slots: ['DJUR', 'MAT', 'PLATS', 'PERSON'],
    paragraphs: [
      '{en_DJUR} var väldigt hungrig en solig morgon.',
      '{DJUR} gick till {en_PLATS} för att leta efter mat.',
      'Där träffade {DJUR} {en_PERSON} som hade {en_MAT}.',
      '"Vill du dela med dig?" frågade {DJUR} artigt.',
      '{PERSON} log och gav {DJUR} lite {MAT}. "Tack!" sa {DJUR} och blev mätt och glad.'
    ]
  },
  {
    id: 'magic-item',
    title: 'Den magiska saken',
    titleKey: 'sagostunden.story.magic_item',
    slots: ['PERSON', 'SAK', 'DJUR', 'VERB'],
    paragraphs: [
      '{en_PERSON} hittade {en_SAK} som var alldeles magisk.',
      'Varje gång {PERSON} rörde vid {SAK} började den att lysa.',
      'Plötsligt kom {en_DJUR} fram och ville också titta.',
      'Tillsammans bestämde de sig för att {VERB}.',
      'Det blev den bästa dagen någonsin!'
    ]
  },
  {
    id: 'new-friend',
    title: 'En ny kompis',
    titleKey: 'sagostunden.story.new_friend',
    slots: ['DJUR', 'PERSON', 'PLATS', 'VERB'],
    paragraphs: [
      '{en_DJUR} kände sig lite ensam.',
      'En dag gick {DJUR} till {en_PLATS} och träffade {en_PERSON}.',
      '"Hej! Vill du {VERB} med mig?" frågade {PERSON}.',
      '{DJUR} nickade glatt och de började {VERB} tillsammans.',
      'Från den dagen var de allra bästa vänner.'
    ]
  },
  {
    id: 'birthday-party',
    title: 'Födelsedagsfesten',
    titleKey: 'sagostunden.story.birthday_party',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: [
      '{en_PERSON} fyllde år och bjöd alla på kalas.',
      '{en_DJUR} kom med {en_SAK} som present.',
      'De åt massor av {MAT} och dansade hela dagen.',
      '"{SAK} var den bästa presenten jag fått!" sa {PERSON}.',
      'Alla kramade varandra och sjöng grattis en sista gång.'
    ]
  },
  {
    id: 'lost-treasure',
    title: 'Den försvunna skatten',
    titleKey: 'sagostunden.story.lost_treasure',
    slots: ['PERSON', 'SAK', 'PLATS', 'DJUR'],
    paragraphs: [
      '{en_PERSON} hörde talas om {en_SAK} som var gömd i {en_PLATS}.',
      '{PERSON} packade sin väska och gav sig av på äventyr.',
      'På vägen mötte {PERSON} {en_DJUR} som ville hjälpa till.',
      'Tillsammans letade de överallt tills de hittade {SAK}!',
      '"Vi gjorde det!" jublade {PERSON} och kramade {DJUR}.'
    ]
  },
  {
    id: 'rainy-day',
    title: 'En regnig dag',
    titleKey: 'sagostunden.story.rainy_day',
    slots: ['DJUR', 'SAK', 'VERB', 'PLATS'],
    paragraphs: [
      'Det regnade ute och {en_DJUR} satt hemma och tittade ut genom fönstret.',
      '"Jag vet! Jag kan {VERB}!" sa {DJUR} och tog fram {en_SAK}.',
      '{DJUR} började {VERB} och hade jätteroligt.',
      'Snart slutade det regna och solen tittade fram.',
      '{DJUR} sprang till {en_PLATS} med {SAK} under armen.'
    ]
  },
  {
    id: 'dream-journey',
    title: 'Drömresan',
    titleKey: 'sagostunden.story.dream_journey',
    slots: ['PERSON', 'PLATS', 'DJUR', 'SAK'],
    paragraphs: [
      'En natt drömde {en_PERSON} om {en_PLATS} långt borta.',
      'I drömmen flög {PERSON} genom luften ovanför molnen.',
      '{PERSON} landade och mötte {en_DJUR} som gav hen {en_SAK}.',
      '"Den här {SAK} har magiska krafter", viskade {DJUR}.',
      'När {PERSON} vaknade låg {SAK} på kudden. Eller var det en dröm?'
    ]
  },
  {
    id: 'cooking-together',
    title: 'Vi lagar mat',
    titleKey: 'sagostunden.story.cooking_together',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: [
      '{en_PERSON} och {en_DJUR} bestämde sig för att laga mat.',
      'De tog fram {en_SAK} och la {MAT} i den.',
      '"Vi behöver mer {MAT}!" sa {DJUR} och hoppade upp och ner.',
      'Till slut var maten klar och det doftade underbart.',
      'De satte sig ner och åt upp allt. "Mums!" sa de båda.'
    ]
  },
  {
    id: 'space-adventure',
    title: 'Rymdäventyret',
    titleKey: 'sagostunden.story.space_adventure',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: [
      '{en_PERSON} byggde en raket av {en_SAK}.',
      '"Ska vi flyga till rymden?" frågade {PERSON} sin kompis {en_DJUR}.',
      'Raketen lyfte och de flög förbi stjärnor och planeter.',
      'De landade på {en_PLATS} där allt var uppochner.',
      'Efter ett fantastiskt äventyr flög de tillbaka hem lagom till middag.'
    ]
  },
  {
    id: 'hide-and-seek',
    title: 'Kurragömma',
    titleKey: 'sagostunden.story.hide_and_seek',
    slots: ['DJUR', 'PERSON', 'PLATS', 'SAK'],
    paragraphs: [
      '{en_DJUR} och {en_PERSON} ville leka kurragömma.',
      '{DJUR} gömde sig bakom {en_SAK} i {en_PLATS}.',
      '{PERSON} letade och letade men hittade inte {DJUR}.',
      '"Här är jag!" ropade {DJUR} och hoppade fram.',
      'De skrattade och lekte kurragömma hela eftermiddagen.'
    ]
  },
  {
    id: 'music-show',
    title: 'Musikshowen',
    titleKey: 'sagostunden.story.music_show',
    slots: ['PERSON', 'DJUR', 'SAK', 'VERB'],
    paragraphs: [
      '{en_PERSON} ville spela musik och tog fram {en_SAK}.',
      '{en_DJUR} hörde musiken och kom för att lyssna.',
      '"Kan jag {VERB} med?" frågade {DJUR} förhoppningsfullt.',
      'Tillsammans spelade de den vackraste musiken.',
      'Alla som lyssnade började {VERB} och klappa händerna!'
    ]
  },
  {
    id: 'garden-surprise',
    title: 'Överraskningen i trädgården',
    titleKey: 'sagostunden.story.garden_surprise',
    slots: ['PERSON', 'DJUR', 'SAK', 'MAT'],
    paragraphs: [
      '{en_PERSON} gick ut i trädgården och hittade {en_SAK}.',
      'Under {SAK} satt {en_DJUR} och åt {MAT}.',
      '"Åh, vad söt du är!" sa {PERSON} och satte sig bredvid.',
      '{DJUR} delade med sig av sin {MAT}.',
      'De satt i solen och njöt av den fina dagen tillsammans.'
    ]
  },
  {
    id: 'winter-fun',
    title: 'Vinterskoj',
    titleKey: 'sagostunden.story.winter_fun',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: [
      'Det hade snöat hela natten och allt var vitt.',
      '{en_DJUR} och {en_PERSON} sprang ut i snön.',
      'De byggde en stor snögubbe med {en_SAK} som näsa.',
      'Sedan började de {VERB} i snön tills de blev trötta.',
      'De gick in och drack varm choklad. "Vinter är bäst!" sa de.'
    ]
  },
  {
    id: 'rescue-mission',
    title: 'Räddningsuppdraget',
    titleKey: 'sagostunden.story.rescue_mission',
    slots: ['PERSON', 'DJUR', 'PLATS', 'SAK'],
    paragraphs: [
      '{en_DJUR} hade gått vilse i {en_PLATS} och var rädd.',
      '{en_PERSON} hörde ett ljud och sprang dit.',
      'Med hjälp av {en_SAK} lyckades {PERSON} hitta {DJUR}.',
      '"Tack för att du räddade mig!" sa {DJUR} tacksamt.',
      '{PERSON} kramade {DJUR} och de gick hem tillsammans.'
    ]
  },
  {
    id: 'painting-day',
    title: 'Målardag',
    titleKey: 'sagostunden.story.painting_day',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: [
      '{en_PERSON} ville måla en tavla av {en_PLATS}.',
      '{en_DJUR} kom och ville hjälpa till.',
      '{DJUR} doppade sin svans i färgen och målade med den.',
      'Resultatet blev en härlig tavla med {en_SAK} i mitten.',
      '"Det är konst!" skrattade {PERSON} och hängde upp tavlan.'
    ]
  },
  {
    id: 'magic-garden',
    title: 'Den magiska trädgården',
    titleKey: 'sagostunden.story.magic_garden',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: [
      '{en_PERSON} planterade {en_SAK} i trädgården.',
      'Nästa morgon hade det vuxit till ett träd fullt med {MAT}!',
      '{en_DJUR} kom flygande och plockade {MAT} från trädet.',
      '"Det här är ett magiskt träd!" utbrast {PERSON}.',
      'De delade {MAT} med alla i byn och alla blev glada.'
    ]
  },
  {
    id: 'bedtime',
    title: 'Godnatt',
    titleKey: 'sagostunden.story.bedtime',
    slots: ['DJUR', 'SAK', 'PERSON', 'PLATS'],
    paragraphs: [
      'Det var kväll och {en_DJUR} var trött efter en lång dag.',
      '{DJUR} kramade sin {SAK} och kröp ner i sängen.',
      '{en_PERSON} kom och stoppade om {DJUR}.',
      '"Godnatt, lilla {DJUR}", viskade {PERSON} och tände nattlampan.',
      '{DJUR} somnade och drömde om {en_PLATS} full av äventyr.'
    ]
  },
  {
    id: 'circus-show',
    title: 'Cirkusföreställningen',
    titleKey: 'sagostunden.story.circus_show',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: [
      'Cirkusen kom till stan och {en_DJUR} ville uppträda.',
      '{en_PERSON} hjälpte {DJUR} att öva.',
      '{DJUR} jonglerade med {en_SAK} och alla jublade.',
      'Till slut fick {DJUR} {VERB} på scenen.',
      'Publiken klappade och {DJUR} bugade stolt!'
    ]
  },
  {
    id: 'boat-trip',
    title: 'Båtresan',
    titleKey: 'sagostunden.story.boat_trip',
    slots: ['PERSON', 'DJUR', 'PLATS', 'MAT'],
    paragraphs: [
      '{en_PERSON} och {en_DJUR} klev ombord på en stor båt.',
      'De seglade mot {en_PLATS} medan vågorna gungade.',
      'Till lunch åt de {MAT} på däck i solskenet.',
      'De såg delfiner hoppa i vattnet runt båten.',
      'När de kom fram till {PLATS} var de fyllda av glädje.'
    ]
  },
  {
    id: 'playground',
    title: 'På lekplatsen',
    titleKey: 'sagostunden.story.playground',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: [
      '{en_DJUR} sprang till lekplatsen en solig eftermiddag.',
      'Där väntade {en_PERSON} med {en_SAK}.',
      '"Ska vi {VERB}?" frågade {PERSON} med ett stort leende.',
      'De lekte hela dagen och andra barn ville också vara med.',
      'När solen gick ner lovade de att träffas igen imorgon.'
    ]
  },
  {
    id: 'library-visit',
    title: 'Besöket på biblioteket',
    titleKey: 'sagostunden.story.library_visit',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: [
      '{en_PERSON} gick till biblioteket för att hitta en bok.',
      'Där satt {en_DJUR} och läste om {en_PLATS}.',
      '"Titta! Den här boken har en bild av {en_SAK}!" sa {DJUR}.',
      'De läste boken tillsammans och fantiserade om äventyr.',
      'Innan de gick hem lånade de tre böcker var.'
    ]
  },
  {
    id: 'superhero',
    title: 'Superhjälten',
    titleKey: 'sagostunden.story.superhero',
    slots: ['PERSON', 'SAK', 'DJUR', 'PLATS'],
    paragraphs: [
      '{en_PERSON} hittade {en_SAK} som gav superkrafter!',
      'Nu kunde {PERSON} flyga högt ovanför husen.',
      '{en_DJUR} i {en_PLATS} behövde hjälp.',
      '{PERSON} flög dit snabbt och räddade {DJUR}.',
      '"Du är min hjälte!" sa {DJUR} och alla i {PLATS} jublade.'
    ]
  },
  {
    id: 'market-day',
    title: 'Marknadsdagen',
    titleKey: 'sagostunden.story.market_day',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: [
      'Det var marknadsdag och {en_PERSON} gick dit med {en_DJUR}.',
      'Det fanns massor av {MAT} i alla färger.',
      '{DJUR} ville ha {en_SAK} som glittrade i ett stånd.',
      '{PERSON} köpte {SAK} åt {DJUR} och {MAT} att äta.',
      'De gick hem nöjda med sina fynd och magen full.'
    ]
  },
  {
    id: 'night-sky',
    title: 'Nattens himmel',
    titleKey: 'sagostunden.story.night_sky',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: [
      'En klar natt gick {en_PERSON} och {en_DJUR} ut för att titta på stjärnorna.',
      'De tog med sig {en_SAK} och la sig på gräset.',
      '"Titta! Jag ser en stjärnbild som ser ut som {en_PLATS}!" sa {DJUR}.',
      '{PERSON} pekade mot en stjärna som blinkar extra starkt.',
      'De önskade sig något fint och gick in och somnade med ett leende.'
    ]
  },
];

/**
 * Fill a template with selected words.
 * {DJUR} → word.sv, {en_DJUR} → "en katt" / "ett lejon"
 */
export function fillTemplate(
  template: StoryTemplate,
  wordMap: Record<string, { sv: string; gender: string }>
): string[] {
  return template.paragraphs.map(p => {
    let text = p;
    for (const [key, word] of Object.entries(wordMap)) {
      const article = word.gender === 'ett' ? 'ett' : 'en';
      text = text.replace(new RegExp(`\\{en_${key}\\}`, 'g'), `${article} ${word.sv}`);
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), word.sv);
    }
    return text;
  });
}
