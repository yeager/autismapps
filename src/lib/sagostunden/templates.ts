/**
 * Sagostunden — 25 bilingual story templates (sv/en) with placeholders
 * Placeholders: {DJUR}, {PLATS}, {SAK}, {MAT}, {PERSON}, {VERB}
 * Article placeholders: {en_X} (sv: en/ett), {a_X} (en: a/an)
 */

export interface StoryTemplate {
  id: string;
  title: string;
  titleKey: string;
  paragraphs: Record<string, string[]>;
  slots: string[];
}

export const TEMPLATES: StoryTemplate[] = [
  {
    id: 'adventure-forest',
    title: 'Äventyret i skogen',
    titleKey: 'sagostunden.story.adventure_forest',
    slots: ['DJUR', 'PLATS', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        'Det var en gång {en_DJUR} som bodde i {en_PLATS}.',
        '{DJUR} älskade att {VERB} varje dag.',
        'En dag hittade {DJUR} {en_SAK} som glittrade i solen.',
        '"{SAK}! Vilken fantastisk sak!" ropade {DJUR} glatt.',
        'Och så levde {DJUR} lycklig i alla sina dagar med sin fina {SAK}.'
      ],
      en: [
        'Once upon a time there was {a_DJUR} who lived in {a_PLATS}.',
        '{DJUR} loved to {VERB} every day.',
        'One day {DJUR} found {a_SAK} that glittered in the sun.',
        '"{SAK}! What a wonderful thing!" shouted {DJUR} happily.',
        'And so {DJUR} lived happily ever after with the lovely {SAK}.'
      ]
    }
  },
  {
    id: 'hungry-tale',
    title: 'Den hungriga berättelsen',
    titleKey: 'sagostunden.story.hungry_tale',
    slots: ['DJUR', 'MAT', 'PLATS', 'PERSON'],
    paragraphs: {
      sv: [
        '{en_DJUR} var väldigt hungrig en solig morgon.',
        '{DJUR} gick till {en_PLATS} för att leta efter mat.',
        'Där träffade {DJUR} {en_PERSON} som hade {en_MAT}.',
        '"Vill du dela med dig?" frågade {DJUR} artigt.',
        '{PERSON} log och gav {DJUR} lite {MAT}. "Tack!" sa {DJUR} och blev mätt och glad.'
      ],
      en: [
        '{a_DJUR} was very hungry one sunny morning.',
        '{DJUR} went to {a_PLATS} to look for food.',
        'There {DJUR} met {a_PERSON} who had {a_MAT}.',
        '"Would you like to share?" asked {DJUR} politely.',
        '{PERSON} smiled and gave {DJUR} some {MAT}. "Thank you!" said {DJUR} feeling full and happy.'
      ]
    }
  },
  {
    id: 'magic-item',
    title: 'Den magiska saken',
    titleKey: 'sagostunden.story.magic_item',
    slots: ['PERSON', 'SAK', 'DJUR', 'VERB'],
    paragraphs: {
      sv: [
        '{en_PERSON} hittade {en_SAK} som var alldeles magisk.',
        'Varje gång {PERSON} rörde vid {SAK} började den att lysa.',
        'Plötsligt kom {en_DJUR} fram och ville också titta.',
        'Tillsammans bestämde de sig för att {VERB}.',
        'Det blev den bästa dagen någonsin!'
      ],
      en: [
        '{a_PERSON} found {a_SAK} that was truly magical.',
        'Every time {PERSON} touched the {SAK} it started to glow.',
        'Suddenly {a_DJUR} appeared and wanted to look too.',
        'Together they decided to {VERB}.',
        'It turned out to be the best day ever!'
      ]
    }
  },
  {
    id: 'new-friend',
    title: 'En ny kompis',
    titleKey: 'sagostunden.story.new_friend',
    slots: ['DJUR', 'PERSON', 'PLATS', 'VERB'],
    paragraphs: {
      sv: [
        '{en_DJUR} kände sig lite ensam.',
        'En dag gick {DJUR} till {en_PLATS} och träffade {en_PERSON}.',
        '"Hej! Vill du {VERB} med mig?" frågade {PERSON}.',
        '{DJUR} nickade glatt och de började {VERB} tillsammans.',
        'Från den dagen var de allra bästa vänner.'
      ],
      en: [
        '{a_DJUR} was feeling a little lonely.',
        'One day {DJUR} went to {a_PLATS} and met {a_PERSON}.',
        '"Hi! Would you like to {VERB} with me?" asked {PERSON}.',
        '{DJUR} nodded happily and they started to {VERB} together.',
        'From that day on they were the very best of friends.'
      ]
    }
  },
  {
    id: 'birthday-party',
    title: 'Födelsedagsfesten',
    titleKey: 'sagostunden.story.birthday_party',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        '{en_PERSON} fyllde år och bjöd alla på kalas.',
        '{en_DJUR} kom med {en_SAK} som present.',
        'De åt massor av {MAT} och dansade hela dagen.',
        '"{SAK} var den bästa presenten jag fått!" sa {PERSON}.',
        'Alla kramade varandra och sjöng grattis en sista gång.'
      ],
      en: [
        '{a_PERSON} had a birthday and invited everyone to a party.',
        '{a_DJUR} came with {a_SAK} as a gift.',
        'They ate lots of {MAT} and danced all day long.',
        '"{SAK} is the best gift I have ever received!" said {PERSON}.',
        'Everyone hugged each other and sang happy birthday one last time.'
      ]
    }
  },
  {
    id: 'lost-treasure',
    title: 'Den försvunna skatten',
    titleKey: 'sagostunden.story.lost_treasure',
    slots: ['PERSON', 'SAK', 'PLATS', 'DJUR'],
    paragraphs: {
      sv: [
        '{en_PERSON} hörde talas om {en_SAK} som var gömd i {en_PLATS}.',
        '{PERSON} packade sin väska och gav sig av på äventyr.',
        'På vägen mötte {PERSON} {en_DJUR} som ville hjälpa till.',
        'Tillsammans letade de överallt tills de hittade {SAK}!',
        '"Vi gjorde det!" jublade {PERSON} och kramade {DJUR}.'
      ],
      en: [
        '{a_PERSON} heard about {a_SAK} hidden in {a_PLATS}.',
        '{PERSON} packed a bag and set off on an adventure.',
        'Along the way {PERSON} met {a_DJUR} who wanted to help.',
        'Together they searched everywhere until they found the {SAK}!',
        '"We did it!" cheered {PERSON} and hugged {DJUR}.'
      ]
    }
  },
  {
    id: 'rainy-day',
    title: 'En regnig dag',
    titleKey: 'sagostunden.story.rainy_day',
    slots: ['DJUR', 'SAK', 'VERB', 'PLATS'],
    paragraphs: {
      sv: [
        'Det regnade ute och {en_DJUR} satt hemma och tittade ut genom fönstret.',
        '"Jag vet! Jag kan {VERB}!" sa {DJUR} och tog fram {en_SAK}.',
        '{DJUR} började {VERB} och hade jätteroligt.',
        'Snart slutade det regna och solen tittade fram.',
        '{DJUR} sprang till {en_PLATS} med {SAK} under armen.'
      ],
      en: [
        'It was raining outside and {a_DJUR} sat at home looking out the window.',
        '"I know! I can {VERB}!" said {DJUR} and took out {a_SAK}.',
        '{DJUR} started to {VERB} and had a wonderful time.',
        'Soon the rain stopped and the sun came out.',
        '{DJUR} ran to {a_PLATS} with the {SAK} under one arm.'
      ]
    }
  },
  {
    id: 'dream-journey',
    title: 'Drömresan',
    titleKey: 'sagostunden.story.dream_journey',
    slots: ['PERSON', 'PLATS', 'DJUR', 'SAK'],
    paragraphs: {
      sv: [
        'En natt drömde {en_PERSON} om {en_PLATS} långt borta.',
        'I drömmen flög {PERSON} genom luften ovanför molnen.',
        '{PERSON} landade och mötte {en_DJUR} som gav hen {en_SAK}.',
        '"Den här {SAK} har magiska krafter", viskade {DJUR}.',
        'När {PERSON} vaknade låg {SAK} på kudden. Eller var det en dröm?'
      ],
      en: [
        'One night {a_PERSON} dreamed of {a_PLATS} far away.',
        'In the dream {PERSON} flew through the air above the clouds.',
        '{PERSON} landed and met {a_DJUR} who gave them {a_SAK}.',
        '"This {SAK} has magical powers," whispered {DJUR}.',
        'When {PERSON} woke up the {SAK} was on the pillow. Or was it a dream?'
      ]
    }
  },
  {
    id: 'cooking-together',
    title: 'Vi lagar mat',
    titleKey: 'sagostunden.story.cooking_together',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        '{en_PERSON} och {en_DJUR} bestämde sig för att laga mat.',
        'De tog fram {en_SAK} och la {MAT} i den.',
        '"Vi behöver mer {MAT}!" sa {DJUR} och hoppade upp och ner.',
        'Till slut var maten klar och det doftade underbart.',
        'De satte sig ner och åt upp allt. "Mums!" sa de båda.'
      ],
      en: [
        '{a_PERSON} and {a_DJUR} decided to cook some food.',
        'They took out {a_SAK} and put {MAT} in it.',
        '"We need more {MAT}!" said {DJUR} jumping up and down.',
        'Finally the food was ready and it smelled wonderful.',
        'They sat down and ate it all up. "Yummy!" they both said.'
      ]
    }
  },
  {
    id: 'space-adventure',
    title: 'Rymdäventyret',
    titleKey: 'sagostunden.story.space_adventure',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} byggde en raket av {en_SAK}.',
        '"Ska vi flyga till rymden?" frågade {PERSON} sin kompis {en_DJUR}.',
        'Raketen lyfte och de flög förbi stjärnor och planeter.',
        'De landade på {en_PLATS} där allt var uppochner.',
        'Efter ett fantastiskt äventyr flög de tillbaka hem lagom till middag.'
      ],
      en: [
        '{a_PERSON} built a rocket out of {a_SAK}.',
        '"Shall we fly to space?" asked {PERSON} their friend {a_DJUR}.',
        'The rocket lifted off and they flew past stars and planets.',
        'They landed on {a_PLATS} where everything was upside down.',
        'After a fantastic adventure they flew back home just in time for dinner.'
      ]
    }
  },
  {
    id: 'hide-and-seek',
    title: 'Kurragömma',
    titleKey: 'sagostunden.story.hide_and_seek',
    slots: ['DJUR', 'PERSON', 'PLATS', 'SAK'],
    paragraphs: {
      sv: [
        '{en_DJUR} och {en_PERSON} ville leka kurragömma.',
        '{DJUR} gömde sig bakom {en_SAK} i {en_PLATS}.',
        '{PERSON} letade och letade men hittade inte {DJUR}.',
        '"Här är jag!" ropade {DJUR} och hoppade fram.',
        'De skrattade och lekte kurragömma hela eftermiddagen.'
      ],
      en: [
        '{a_DJUR} and {a_PERSON} wanted to play hide and seek.',
        '{DJUR} hid behind {a_SAK} in {a_PLATS}.',
        '{PERSON} searched and searched but could not find {DJUR}.',
        '"Here I am!" shouted {DJUR} and jumped out.',
        'They laughed and played hide and seek all afternoon.'
      ]
    }
  },
  {
    id: 'music-show',
    title: 'Musikshowen',
    titleKey: 'sagostunden.story.music_show',
    slots: ['PERSON', 'DJUR', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        '{en_PERSON} ville spela musik och tog fram {en_SAK}.',
        '{en_DJUR} hörde musiken och kom för att lyssna.',
        '"Kan jag {VERB} med?" frågade {DJUR} förhoppningsfullt.',
        'Tillsammans spelade de den vackraste musiken.',
        'Alla som lyssnade började {VERB} och klappa händerna!'
      ],
      en: [
        '{a_PERSON} wanted to play music and took out {a_SAK}.',
        '{a_DJUR} heard the music and came to listen.',
        '"Can I {VERB} too?" asked {DJUR} hopefully.',
        'Together they played the most beautiful music.',
        'Everyone who listened started to {VERB} and clap their hands!'
      ]
    }
  },
  {
    id: 'garden-surprise',
    title: 'Överraskningen i trädgården',
    titleKey: 'sagostunden.story.garden_surprise',
    slots: ['PERSON', 'DJUR', 'SAK', 'MAT'],
    paragraphs: {
      sv: [
        '{en_PERSON} gick ut i trädgården och hittade {en_SAK}.',
        'Under {SAK} satt {en_DJUR} och åt {MAT}.',
        '"Åh, vad söt du är!" sa {PERSON} och satte sig bredvid.',
        '{DJUR} delade med sig av sin {MAT}.',
        'De satt i solen och njöt av den fina dagen tillsammans.'
      ],
      en: [
        '{a_PERSON} went out into the garden and found {a_SAK}.',
        'Under the {SAK} sat {a_DJUR} eating {MAT}.',
        '"Oh, how cute you are!" said {PERSON} and sat down beside them.',
        '{DJUR} shared some of the {MAT}.',
        'They sat in the sun and enjoyed the lovely day together.'
      ]
    }
  },
  {
    id: 'winter-fun',
    title: 'Vinterskoj',
    titleKey: 'sagostunden.story.winter_fun',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        'Det hade snöat hela natten och allt var vitt.',
        '{en_DJUR} och {en_PERSON} sprang ut i snön.',
        'De byggde en stor snögubbe med {en_SAK} som näsa.',
        'Sedan började de {VERB} i snön tills de blev trötta.',
        'De gick in och drack varm choklad. "Vinter är bäst!" sa de.'
      ],
      en: [
        'It had snowed all night and everything was white.',
        '{a_DJUR} and {a_PERSON} ran out into the snow.',
        'They built a big snowman with {a_SAK} for a nose.',
        'Then they started to {VERB} in the snow until they got tired.',
        'They went inside and drank hot chocolate. "Winter is the best!" they said.'
      ]
    }
  },
  {
    id: 'rescue-mission',
    title: 'Räddningsuppdraget',
    titleKey: 'sagostunden.story.rescue_mission',
    slots: ['PERSON', 'DJUR', 'PLATS', 'SAK'],
    paragraphs: {
      sv: [
        '{en_DJUR} hade gått vilse i {en_PLATS} och var rädd.',
        '{en_PERSON} hörde ett ljud och sprang dit.',
        'Med hjälp av {en_SAK} lyckades {PERSON} hitta {DJUR}.',
        '"Tack för att du räddade mig!" sa {DJUR} tacksamt.',
        '{PERSON} kramade {DJUR} och de gick hem tillsammans.'
      ],
      en: [
        '{a_DJUR} had gotten lost in {a_PLATS} and was scared.',
        '{a_PERSON} heard a sound and ran over.',
        'With the help of {a_SAK} {PERSON} managed to find {DJUR}.',
        '"Thank you for rescuing me!" said {DJUR} gratefully.',
        '{PERSON} hugged {DJUR} and they walked home together.'
      ]
    }
  },
  {
    id: 'painting-day',
    title: 'Målardag',
    titleKey: 'sagostunden.story.painting_day',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} ville måla en tavla av {en_PLATS}.',
        '{en_DJUR} kom och ville hjälpa till.',
        '{DJUR} doppade sin svans i färgen och målade med den.',
        'Resultatet blev en härlig tavla med {en_SAK} i mitten.',
        '"Det är konst!" skrattade {PERSON} och hängde upp tavlan.'
      ],
      en: [
        '{a_PERSON} wanted to paint a picture of {a_PLATS}.',
        '{a_DJUR} came along and wanted to help.',
        '{DJUR} dipped its tail in the paint and painted with it.',
        'The result was a lovely painting with {a_SAK} in the middle.',
        '"That is art!" laughed {PERSON} and hung the painting on the wall.'
      ]
    }
  },
  {
    id: 'magic-garden',
    title: 'Den magiska trädgården',
    titleKey: 'sagostunden.story.magic_garden',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        '{en_PERSON} planterade {en_SAK} i trädgården.',
        'Nästa morgon hade det vuxit till ett träd fullt med {MAT}!',
        '{en_DJUR} kom flygande och plockade {MAT} från trädet.',
        '"Det här är ett magiskt träd!" utbrast {PERSON}.',
        'De delade {MAT} med alla i byn och alla blev glada.'
      ],
      en: [
        '{a_PERSON} planted {a_SAK} in the garden.',
        'The next morning it had grown into a tree full of {MAT}!',
        '{a_DJUR} came flying in and picked {MAT} from the tree.',
        '"This is a magic tree!" exclaimed {PERSON}.',
        'They shared the {MAT} with everyone in the village and everyone was happy.'
      ]
    }
  },
  {
    id: 'bedtime',
    title: 'Godnatt',
    titleKey: 'sagostunden.story.bedtime',
    slots: ['DJUR', 'SAK', 'PERSON', 'PLATS'],
    paragraphs: {
      sv: [
        'Det var kväll och {en_DJUR} var trött efter en lång dag.',
        '{DJUR} kramade sin {SAK} och kröp ner i sängen.',
        '{en_PERSON} kom och stoppade om {DJUR}.',
        '"Godnatt, lilla {DJUR}", viskade {PERSON} och tände nattlampan.',
        '{DJUR} somnade och drömde om {en_PLATS} full av äventyr.'
      ],
      en: [
        'It was evening and {a_DJUR} was tired after a long day.',
        '{DJUR} hugged the {SAK} and crawled into bed.',
        '{a_PERSON} came and tucked {DJUR} in.',
        '"Good night, little {DJUR}," whispered {PERSON} and turned on the night light.',
        '{DJUR} fell asleep and dreamed of {a_PLATS} full of adventures.'
      ]
    }
  },
  {
    id: 'circus-show',
    title: 'Cirkusföreställningen',
    titleKey: 'sagostunden.story.circus_show',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        'Cirkusen kom till stan och {en_DJUR} ville uppträda.',
        '{en_PERSON} hjälpte {DJUR} att öva.',
        '{DJUR} jonglerade med {en_SAK} och alla jublade.',
        'Till slut fick {DJUR} {VERB} på scenen.',
        'Publiken klappade och {DJUR} bugade stolt!'
      ],
      en: [
        'The circus came to town and {a_DJUR} wanted to perform.',
        '{a_PERSON} helped {DJUR} practice.',
        '{DJUR} juggled with {a_SAK} and everyone cheered.',
        'In the end {DJUR} got to {VERB} on stage.',
        'The audience clapped and {DJUR} took a proud bow!'
      ]
    }
  },
  {
    id: 'boat-trip',
    title: 'Båtresan',
    titleKey: 'sagostunden.story.boat_trip',
    slots: ['PERSON', 'DJUR', 'PLATS', 'MAT'],
    paragraphs: {
      sv: [
        '{en_PERSON} och {en_DJUR} klev ombord på en stor båt.',
        'De seglade mot {en_PLATS} medan vågorna gungade.',
        'Till lunch åt de {MAT} på däck i solskenet.',
        'De såg delfiner hoppa i vattnet runt båten.',
        'När de kom fram till {PLATS} var de fyllda av glädje.'
      ],
      en: [
        '{a_PERSON} and {a_DJUR} climbed aboard a big boat.',
        'They sailed towards {a_PLATS} while the waves rocked gently.',
        'For lunch they ate {MAT} on deck in the sunshine.',
        'They saw dolphins jumping in the water around the boat.',
        'When they arrived at the {PLATS} they were filled with joy.'
      ]
    }
  },
  {
    id: 'playground',
    title: 'På lekplatsen',
    titleKey: 'sagostunden.story.playground',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        '{en_DJUR} sprang till lekplatsen en solig eftermiddag.',
        'Där väntade {en_PERSON} med {en_SAK}.',
        '"Ska vi {VERB}?" frågade {PERSON} med ett stort leende.',
        'De lekte hela dagen och andra barn ville också vara med.',
        'När solen gick ner lovade de att träffas igen imorgon.'
      ],
      en: [
        '{a_DJUR} ran to the playground on a sunny afternoon.',
        'There {a_PERSON} was waiting with {a_SAK}.',
        '"Shall we {VERB}?" asked {PERSON} with a big smile.',
        'They played all day and other children wanted to join in too.',
        'When the sun went down they promised to meet again tomorrow.'
      ]
    }
  },
  {
    id: 'library-visit',
    title: 'Besöket på biblioteket',
    titleKey: 'sagostunden.story.library_visit',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} gick till biblioteket för att hitta en bok.',
        'Där satt {en_DJUR} och läste om {en_PLATS}.',
        '"Titta! Den här boken har en bild av {en_SAK}!" sa {DJUR}.',
        'De läste boken tillsammans och fantiserade om äventyr.',
        'Innan de gick hem lånade de tre böcker var.'
      ],
      en: [
        '{a_PERSON} went to the library to find a book.',
        'There sat {a_DJUR} reading about {a_PLATS}.',
        '"Look! This book has a picture of {a_SAK}!" said {DJUR}.',
        'They read the book together and imagined adventures.',
        'Before going home they each borrowed three books.'
      ]
    }
  },
  {
    id: 'superhero',
    title: 'Superhjälten',
    titleKey: 'sagostunden.story.superhero',
    slots: ['PERSON', 'SAK', 'DJUR', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} hittade {en_SAK} som gav superkrafter!',
        'Nu kunde {PERSON} flyga högt ovanför husen.',
        '{en_DJUR} i {en_PLATS} behövde hjälp.',
        '{PERSON} flög dit snabbt och räddade {DJUR}.',
        '"Du är min hjälte!" sa {DJUR} och alla i {PLATS} jublade.'
      ],
      en: [
        '{a_PERSON} found {a_SAK} that gave superpowers!',
        'Now {PERSON} could fly high above the houses.',
        '{a_DJUR} in {a_PLATS} needed help.',
        '{PERSON} flew there quickly and rescued {DJUR}.',
        '"You are my hero!" said {DJUR} and everyone in the {PLATS} cheered.'
      ]
    }
  },
  {
    id: 'market-day',
    title: 'Marknadsdagen',
    titleKey: 'sagostunden.story.market_day',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        'Det var marknadsdag och {en_PERSON} gick dit med {en_DJUR}.',
        'Det fanns massor av {MAT} i alla färger.',
        '{DJUR} ville ha {en_SAK} som glittrade i ett stånd.',
        '{PERSON} köpte {SAK} åt {DJUR} och {MAT} att äta.',
        'De gick hem nöjda med sina fynd och magen full.'
      ],
      en: [
        'It was market day and {a_PERSON} went there with {a_DJUR}.',
        'There was lots of {MAT} in every colour.',
        '{DJUR} wanted {a_SAK} that sparkled at a stall.',
        '{PERSON} bought the {SAK} for {DJUR} and some {MAT} to eat.',
        'They went home happy with their finds and full tummies.'
      ]
    }
  },
  {
    id: 'night-sky',
    title: 'Nattens himmel',
    titleKey: 'sagostunden.story.night_sky',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        'En klar natt gick {en_PERSON} och {en_DJUR} ut för att titta på stjärnorna.',
        'De tog med sig {en_SAK} och la sig på gräset.',
        '"Titta! Jag ser en stjärnbild som ser ut som {en_PLATS}!" sa {DJUR}.',
        '{PERSON} pekade mot en stjärna som blinkade extra starkt.',
        'De önskade sig något fint och gick in och somnade med ett leende.'
      ],
      en: [
        'On a clear night {a_PERSON} and {a_DJUR} went outside to look at the stars.',
        'They brought {a_SAK} and lay down on the grass.',
        '"Look! I can see a constellation that looks like {a_PLATS}!" said {DJUR}.',
        '{PERSON} pointed at a star that twinkled extra brightly.',
        'They each made a wish and went inside and fell asleep with a smile.'
      ]
    }
  },
];
