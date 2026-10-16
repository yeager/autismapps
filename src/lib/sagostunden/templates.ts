/**
 * Sagostunden — 25 story templates (sv/en/pt_BR) with placeholders
 * Slots: {DJUR}, {PLATS}, {SAK}, {MAT}, {PERSON}, {VERB}
 * sv: {en_X} (en/ett), {def_X} (definite) · en: {a_X} (a/an), {def_X} (the X)
 * pt_BR: articles, contractions and gender choices — see grammar-pt.ts
 */

export interface StoryTemplate {
  id: string;
  /** Per language, read with pick() (unknown locales fall back to en) */
  title: Record<string, string>;
  titleKey: string;
  paragraphs: Record<string, string[]>;
  slots: string[];
}

export const TEMPLATES: StoryTemplate[] = [
  {
    id: 'adventure-forest',
    title: { sv: 'Äventyret i skogen', en: 'An Adventure in the Forest', pt_BR: 'A aventura na floresta' },
    titleKey: 'sagostunden.story.adventure_forest',
    slots: ['DJUR', 'PLATS', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        'Det var en gång {en_DJUR} som bodde i {en_PLATS}.',
        '{def_DJUR} älskade att {VERB} varje dag.',
        'En dag hittade {def_DJUR} {en_SAK} som glittrade i solen.',
        '"{SAK}! Vilken fantastisk sak!" ropade {def_DJUR} glatt.',
        'Och så levde {def_DJUR} lycklig i alla sina dagar med sin fina {SAK}.'
      ],
      en: [
        'Once upon a time there was {a_DJUR} who lived in {a_PLATS}.',
        '{DJUR} loved to {VERB} every day.',
        'One day {DJUR} found {a_SAK} that glittered in the sun.',
        '"{SAK}! What a wonderful thing!" shouted {DJUR} happily.',
        'And so {DJUR} lived happily ever after with the lovely {SAK}.'
      ],
      pt_BR: [
        'Era uma vez {um_DJUR} que morava em {um_PLATS}.',
        '{o_DJUR} adorava {VERB} todos os dias.',
        'Um dia, {o_DJUR} encontrou {um_SAK} que brilhava ao sol.',
        '"{um_SAK}! Que coisa incrível!", gritou {o_DJUR}, muito feliz.',
        'E {o_DJUR} viveu feliz para sempre com {seu_SAK}.'
      ]
    }
  },
  {
    id: 'hungry-tale',
    title: { sv: 'Den hungriga berättelsen', en: 'The Hungry Story', pt_BR: 'Que fome!' },
    titleKey: 'sagostunden.story.hungry_tale',
    slots: ['DJUR', 'MAT', 'PLATS', 'PERSON'],
    paragraphs: {
      sv: [
        '{en_DJUR} var väldigt hungrig en solig morgon.',
        '{def_DJUR} gick till {en_PLATS} för att leta efter mat.',
        'Där träffade {def_DJUR} {en_PERSON} som hade {en_MAT}.',
        '"Vill du dela med dig?" frågade {def_DJUR} artigt.',
        '{def_PERSON} log och gav {def_DJUR} lite {MAT}. "Tack!" sa {def_DJUR} och blev mätt och glad.'
      ],
      en: [
        '{a_DJUR} was very hungry one sunny morning.',
        '{DJUR} went to {a_PLATS} to look for food.',
        'There {DJUR} met {a_PERSON} who had {a_MAT}.',
        '"Would you like to share?" asked {DJUR} politely.',
        '{PERSON} smiled and gave {DJUR} some {MAT}. "Thank you!" said {DJUR} feeling full and happy.'
      ],
      pt_BR: [
        '{um_DJUR} acordou com muita fome numa manhã de sol.',
        '{o_DJUR} foi até {o_PLATS} procurar comida.',
        'Lá, {o_DJUR} encontrou {um_PERSON} que tinha {um_MAT}.',
        '"Você divide comigo?", perguntou {o_DJUR}, com educação.',
        '{o_PERSON} sorriu e deu um pouco de {MAT} para {o_DJUR}. "{DJUR|Obrigado|Obrigada}!", disse {o_DJUR}, de barriga cheia.'
      ]
    }
  },
  {
    id: 'magic-item',
    title: { sv: 'Den magiska saken', en: 'The Magic Thing', pt_BR: 'O objeto mágico' },
    titleKey: 'sagostunden.story.magic_item',
    slots: ['PERSON', 'SAK', 'DJUR', 'VERB'],
    paragraphs: {
      sv: [
        '{en_PERSON} hittade {en_SAK} som var alldeles magisk.',
        'Varje gång {def_PERSON} rörde vid {def_SAK} började den att lysa.',
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
      ],
      pt_BR: [
        '{um_PERSON} encontrou {um_SAK} que era {SAK|mágico|mágica} de verdade.',
        'Toda vez que {o_PERSON} tocava {no_SAK}, {SAK|ele|ela} começava a brilhar.',
        'De repente, {um_DJUR} apareceu e também quis ver.',
        'Então resolveram {VERB} {PERSON+DJUR|juntos|juntas}.',
        'Foi o melhor dia de todos!'
      ]
    }
  },
  {
    id: 'new-friend',
    title: { sv: 'En ny kompis', en: 'A New Friend', pt_BR: 'Uma nova amizade' },
    titleKey: 'sagostunden.story.new_friend',
    slots: ['DJUR', 'PERSON', 'PLATS', 'VERB'],
    paragraphs: {
      sv: [
        '{en_DJUR} kände sig lite ensam.',
        'En dag gick {def_DJUR} till {en_PLATS} och träffade {en_PERSON}.',
        '"Hej! Vill du {VERB} med mig?" frågade {def_PERSON}.',
        '{def_DJUR} nickade glatt och de började {VERB} tillsammans.',
        'Från den dagen var de allra bästa vänner.'
      ],
      en: [
        '{a_DJUR} was feeling a little lonely.',
        'One day {DJUR} went to {a_PLATS} and met {a_PERSON}.',
        '"Hi! Would you like to {VERB} with me?" asked {PERSON}.',
        '{DJUR} nodded happily and they started to {VERB} together.',
        'From that day on they were the very best of friends.'
      ],
      pt_BR: [
        '{um_DJUR} estava se sentindo {DJUR|sozinho|sozinha}.',
        'Um dia, {o_DJUR} foi {ao_PLATS} e conheceu {um_PERSON}.',
        '"Oi! Quer {VERB} comigo?", perguntou {o_PERSON}.',
        '{o_DJUR} disse que sim, muito feliz, e começaram a {VERB} {DJUR+PERSON|juntos|juntas}.',
        'Desde aquele dia, viraram {DJUR+PERSON|melhores amigos|melhores amigas}.'
      ]
    }
  },
  {
    id: 'birthday-party',
    title: { sv: 'Födelsedagsfesten', en: 'The Birthday Party', pt_BR: 'A festa de aniversário' },
    titleKey: 'sagostunden.story.birthday_party',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        '{en_PERSON} fyllde år och bjöd alla på kalas.',
        '{en_DJUR} kom med {en_SAK} som present.',
        'De åt massor av {def_MAT} och dansade hela dagen.',
        '"{def_SAK} var den bästa presenten jag fått!" sa {def_PERSON}.',
        'Alla kramade varandra och sjöng grattis en sista gång.'
      ],
      en: [
        '{a_PERSON} had a birthday and invited everyone to a party.',
        '{a_DJUR} came with {a_SAK} as a gift.',
        'They ate lots of {MAT} and danced all day long.',
        '"{SAK} is the best gift I have ever received!" said {PERSON}.',
        'Everyone hugged each other and sang happy birthday one last time.'
      ],
      pt_BR: [
        'Era aniversário {do_PERSON}, e todo mundo foi convidado para a festa.',
        '{um_DJUR} chegou com {um_SAK} de presente.',
        'Comeram {MAT|muito|muita} {MAT} e dançaram o dia inteiro.',
        '"{este_SAK} foi o melhor presente que eu já ganhei!", disse {o_PERSON}.',
        'Todos se abraçaram e cantaram "Parabéns pra você" mais uma vez.'
      ]
    }
  },
  {
    id: 'lost-treasure',
    title: { sv: 'Den försvunna skatten', en: 'The Missing Treasure', pt_BR: 'O tesouro perdido' },
    titleKey: 'sagostunden.story.lost_treasure',
    slots: ['PERSON', 'SAK', 'PLATS', 'DJUR'],
    paragraphs: {
      sv: [
        '{en_PERSON} hörde talas om {en_SAK} som var gömd i {en_PLATS}.',
        '{def_PERSON} packade sin väska och gav sig av på äventyr.',
        'På vägen mötte {def_PERSON} {en_DJUR} som ville hjälpa till.',
        'Tillsammans letade de överallt tills de hittade {def_SAK}!',
        '"Vi gjorde det!" jublade {def_PERSON} och kramade {def_DJUR}.'
      ],
      en: [
        '{a_PERSON} heard about {a_SAK} hidden in {a_PLATS}.',
        '{PERSON} packed a bag and set off on an adventure.',
        'Along the way {PERSON} met {a_DJUR} who wanted to help.',
        'Together they searched everywhere until they found the {SAK}!',
        '"We did it!" cheered {PERSON} and hugged {DJUR}.'
      ],
      pt_BR: [
        '{um_PERSON} ouviu falar de {um_SAK} {SAK|escondido|escondida} em {um_PLATS}.',
        '{o_PERSON} arrumou a mochila e partiu em uma aventura.',
        'No caminho, {o_PERSON} encontrou {um_DJUR} que queria ajudar.',
        'Procuraram por toda parte até encontrar {o_SAK}!',
        '"Conseguimos!", comemorou {o_PERSON}, dando um abraço {no_DJUR}.'
      ]
    }
  },
  {
    id: 'rainy-day',
    title: { sv: 'En regnig dag', en: 'A Rainy Day', pt_BR: 'Um dia de chuva' },
    titleKey: 'sagostunden.story.rainy_day',
    slots: ['DJUR', 'SAK', 'VERB', 'PLATS'],
    paragraphs: {
      sv: [
        'Det regnade ute och {en_DJUR} satt hemma och tittade ut genom fönstret.',
        '"Jag vet! Jag kan {VERB}!" sa {def_DJUR} och tog fram {en_SAK}.',
        '{def_DJUR} började {VERB} och hade jätteroligt.',
        'Snart slutade det regna och solen tittade fram.',
        '{def_DJUR} sprang till {en_PLATS} med {def_SAK} under armen.'
      ],
      en: [
        'It was raining outside and {a_DJUR} sat at home looking out the window.',
        '"I know! I can {VERB}!" said {DJUR} and took out {a_SAK}.',
        '{DJUR} started to {VERB} and had a wonderful time.',
        'Soon the rain stopped and the sun came out.',
        '{DJUR} ran to {a_PLATS} with the {SAK} under one arm.'
      ],
      pt_BR: [
        'Estava chovendo lá fora, e {um_DJUR} olhava pela janela de casa.',
        '"Já sei! Vou {VERB}!", disse {o_DJUR}, pegando {um_SAK}.',
        '{o_DJUR} começou a {VERB} e se divertiu muito.',
        'Logo a chuva parou e o sol apareceu.',
        '{o_DJUR} correu até {o_PLATS} levando {o_SAK} debaixo do braço.'
      ]
    }
  },
  {
    id: 'dream-journey',
    title: { sv: 'Drömresan', en: 'The Dream Journey', pt_BR: 'A viagem dos sonhos' },
    titleKey: 'sagostunden.story.dream_journey',
    slots: ['PERSON', 'PLATS', 'DJUR', 'SAK'],
    paragraphs: {
      sv: [
        'En natt drömde {en_PERSON} om {en_PLATS} långt borta.',
        'I drömmen flög {def_PERSON} genom luften ovanför molnen.',
        '{def_PERSON} landade och mötte {en_DJUR} som gav hen {en_SAK}.',
        '"Den här {SAK} har magiska krafter", viskade {def_DJUR}.',
        'När {def_PERSON} vaknade låg {def_SAK} på kudden. Eller var det en dröm?'
      ],
      en: [
        'One night {a_PERSON} dreamed of {a_PLATS} far away.',
        'In the dream {PERSON} flew through the air above the clouds.',
        '{PERSON} landed and met {a_DJUR} who gave them {a_SAK}.',
        '"This {SAK} has magical powers," whispered {DJUR}.',
        'When {PERSON} woke up the {SAK} was on the pillow. Or was it a dream?'
      ],
      pt_BR: [
        'Uma noite, {um_PERSON} sonhou com {um_PLATS} muito distante.',
        'No sonho, {o_PERSON} voava por cima das nuvens.',
        '{o_PERSON} pousou e conheceu {um_DJUR}, que lhe deu {um_SAK}.',
        '"{este_SAK} tem poderes mágicos", cochichou {o_DJUR}.',
        'Quando {o_PERSON} acordou, {o_SAK} estava em cima do travesseiro. Ou será que foi um sonho?'
      ]
    }
  },
  {
    id: 'cooking-together',
    title: { sv: 'Vi lagar mat', en: 'Let’s Cook Together', pt_BR: 'Vamos cozinhar' },
    titleKey: 'sagostunden.story.cooking_together',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        '{en_PERSON} och {en_DJUR} bestämde sig för att laga mat.',
        'De tog fram {en_SAK} och la {def_MAT} i den.',
        '"Vi behöver mer {MAT}!" sa {def_DJUR} och hoppade upp och ner.',
        'Till slut var maten klar och det doftade underbart.',
        'De satte sig ner och åt upp allt. "Mums!" sa de båda.'
      ],
      en: [
        '{a_PERSON} and {a_DJUR} decided to cook some food.',
        'They took out {a_SAK} and put {MAT} in it.',
        '"We need more {MAT}!" said {DJUR} jumping up and down.',
        'Finally the food was ready and it smelled wonderful.',
        'They sat down and ate it all up. "Yummy!" they both said.'
      ],
      pt_BR: [
        '{um_PERSON} e {um_DJUR} resolveram cozinhar.',
        'Pegaram {um_SAK} e colocaram {o_MAT} dentro.',
        '"Precisamos de mais {MAT}!", disse {o_DJUR}, pulando sem parar.',
        'Finalmente a comida ficou pronta, e o cheiro estava maravilhoso.',
        'Sentaram e comeram tudo. "Hummm, que delícia!", {PERSON+DJUR|disseram os dois|disseram as duas}.'
      ]
    }
  },
  {
    id: 'space-adventure',
    title: { sv: 'Rymdäventyret', en: 'The Space Adventure', pt_BR: 'Aventura no espaço' },
    titleKey: 'sagostunden.story.space_adventure',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} byggde en raket av {en_SAK}.',
        '"Ska vi flyga till rymden?" frågade {def_PERSON} sin kompis {en_DJUR}.',
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
      ],
      pt_BR: [
        '{um_PERSON} construiu um foguete com {um_SAK}.',
        '"Vamos voar até o espaço?", perguntou {o_PERSON} para {um_DJUR} {DJUR|amigo|amiga}.',
        'O foguete decolou e passou por estrelas e planetas.',
        'Pousaram em {um_PLATS} onde tudo era de cabeça para baixo.',
        'Depois de uma aventura incrível, voltaram para casa bem na hora do jantar.'
      ]
    }
  },
  {
    id: 'hide-and-seek',
    title: { sv: 'Kurragömma', en: 'Hide-and-Seek', pt_BR: 'Esconde-esconde' },
    titleKey: 'sagostunden.story.hide_and_seek',
    slots: ['DJUR', 'PERSON', 'PLATS', 'SAK'],
    paragraphs: {
      sv: [
        '{en_DJUR} och {en_PERSON} ville leka kurragömma.',
        '{def_DJUR} gömde sig bakom {en_SAK} i {en_PLATS}.',
        '{def_PERSON} letade och letade men hittade inte {def_DJUR}.',
        '"Här är jag!" ropade {def_DJUR} och hoppade fram.',
        'De skrattade och lekte kurragömma hela eftermiddagen.'
      ],
      en: [
        '{a_DJUR} and {a_PERSON} wanted to play hide and seek.',
        '{DJUR} hid behind {a_SAK} in {a_PLATS}.',
        '{PERSON} searched and searched but could not find {DJUR}.',
        '"Here I am!" shouted {DJUR} and jumped out.',
        'They laughed and played hide and seek all afternoon.'
      ],
      pt_BR: [
        '{um_DJUR} e {um_PERSON} queriam brincar de esconde-esconde.',
        '{o_DJUR} se escondeu atrás de {um_SAK}, em {um_PLATS}.',
        '{o_PERSON} procurou, procurou, mas não achou {o_DJUR}.',
        '"Estou aqui!", gritou {o_DJUR}, pulando para fora.',
        'Riram muito e brincaram de esconde-esconde a tarde toda.'
      ]
    }
  },
  {
    id: 'music-show',
    title: { sv: 'Musikshowen', en: 'The Music Show', pt_BR: 'O show de música' },
    titleKey: 'sagostunden.story.music_show',
    slots: ['PERSON', 'DJUR', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        '{en_PERSON} ville spela musik och tog fram {en_SAK}.',
        '{en_DJUR} hörde musiken och kom för att lyssna.',
        '"Kan jag {VERB} med?" frågade {def_DJUR} förhoppningsfullt.',
        'Tillsammans spelade de den vackraste musiken.',
        'Alla som lyssnade började {VERB} och klappa händerna!'
      ],
      en: [
        '{a_PERSON} wanted to play music and took out {a_SAK}.',
        '{a_DJUR} heard the music and came to listen.',
        '"Can I {VERB} too?" asked {DJUR} hopefully.',
        'Together they played the most beautiful music.',
        'Everyone who listened started to {VERB} and clap their hands!'
      ],
      pt_BR: [
        '{um_PERSON} quis tocar música e pegou {um_SAK}.',
        '{um_DJUR} ouviu a música e veio escutar.',
        '"Posso {VERB} também?", perguntou {o_DJUR}, {DJUR|cheio|cheia} de esperança.',
        '{PERSON+DJUR|Juntos|Juntas}, tocaram a música mais bonita do mundo.',
        'Todo mundo que ouvia começou a {VERB} e bater palmas!'
      ]
    }
  },
  {
    id: 'garden-surprise',
    title: { sv: 'Överraskningen i trädgården', en: 'The Garden Surprise', pt_BR: 'Surpresa no jardim' },
    titleKey: 'sagostunden.story.garden_surprise',
    slots: ['PERSON', 'DJUR', 'SAK', 'MAT'],
    paragraphs: {
      sv: [
        '{en_PERSON} gick ut i trädgården och hittade {en_SAK}.',
        'Under {def_SAK} satt {en_DJUR} och åt {def_MAT}.',
        '"Åh, vad söt du är!" sa {def_PERSON} och satte sig bredvid.',
        '{def_DJUR} delade med sig av sin {MAT}.',
        'De satt i solen och njöt av den fina dagen tillsammans.'
      ],
      en: [
        '{a_PERSON} went out into the garden and found {a_SAK}.',
        'Under the {SAK} sat {a_DJUR} eating {MAT}.',
        '"Oh, how cute you are!" said {PERSON} and sat down beside them.',
        '{DJUR} shared some of the {MAT}.',
        'They sat in the sun and enjoyed the lovely day together.'
      ],
      pt_BR: [
        '{um_PERSON} foi ao jardim e encontrou {um_SAK}.',
        'Embaixo {do_SAK} estava {um_DJUR} comendo {MAT}.',
        '"Ah, que fofura!", disse {o_PERSON}, sentando ao lado.',
        '{o_DJUR} dividiu um pouco de {MAT}.',
        'Ficaram ao sol, aproveitando o dia lindo, {PERSON+DJUR|juntos|juntas}.'
      ]
    }
  },
  {
    id: 'winter-fun',
    title: { sv: 'Vinterskoj', en: 'Winter Fun', pt_BR: 'Dia de praia' },
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
      ],
      pt_BR: [
        'Fazia muito calor, e o mar estava azulzinho.',
        '{um_DJUR} e {um_PERSON} correram para a areia.',
        'Fizeram um castelo de areia enorme, com {um_SAK} lá no alto.',
        'Depois começaram a {VERB} na praia até ficarem {DJUR+PERSON|cansados|cansadas}.',
        'No fim do dia, tomaram um sorvete bem gelado. "Praia é a melhor coisa!", disseram.'
      ]
    }
  },
  {
    id: 'rescue-mission',
    title: { sv: 'Räddningsuppdraget', en: 'The Rescue Mission', pt_BR: 'Missão de resgate' },
    titleKey: 'sagostunden.story.rescue_mission',
    slots: ['PERSON', 'DJUR', 'PLATS', 'SAK'],
    paragraphs: {
      sv: [
        '{en_DJUR} hade gått vilse i {en_PLATS} och var rädd.',
        '{en_PERSON} hörde ett ljud och sprang dit.',
        'Med hjälp av {en_SAK} lyckades {def_PERSON} hitta {def_DJUR}.',
        '"Tack för att du räddade mig!" sa {def_DJUR} tacksamt.',
        '{def_PERSON} kramade {def_DJUR} och de gick hem tillsammans.'
      ],
      en: [
        '{a_DJUR} had gotten lost in {a_PLATS} and was scared.',
        '{a_PERSON} heard a sound and ran over.',
        'With the help of {a_SAK} {PERSON} managed to find {DJUR}.',
        '"Thank you for rescuing me!" said {DJUR} gratefully.',
        '{PERSON} hugged {DJUR} and they walked home together.'
      ],
      pt_BR: [
        '{um_DJUR} se perdeu em {um_PLATS} e ficou com medo.',
        '{um_PERSON} ouviu um barulho e correu até lá.',
        'Com a ajuda de {um_SAK}, {o_PERSON} conseguiu encontrar {o_DJUR}.',
        '"{DJUR|Obrigado|Obrigada} por me salvar!", disse {o_DJUR}.',
        '{o_PERSON} abraçou {o_DJUR}, e {PERSON+DJUR|os dois voltaram juntos|as duas voltaram juntas} para casa.'
      ]
    }
  },
  {
    id: 'painting-day',
    title: { sv: 'Målardag', en: 'Painting Day', pt_BR: 'Dia de pintura' },
    titleKey: 'sagostunden.story.painting_day',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} ville måla en tavla av {en_PLATS}.',
        '{en_DJUR} kom och ville hjälpa till.',
        '{def_DJUR} doppade sin svans i färgen och målade med den.',
        'Resultatet blev en härlig tavla med {en_SAK} i mitten.',
        '"Det är konst!" skrattade {def_PERSON} och hängde upp tavlan.'
      ],
      en: [
        '{a_PERSON} wanted to paint a picture of {a_PLATS}.',
        '{a_DJUR} came along and wanted to help.',
        '{DJUR} dipped its tail in the paint and painted with it.',
        'The result was a lovely painting with {a_SAK} in the middle.',
        '"That is art!" laughed {PERSON} and hung the painting on the wall.'
      ],
      pt_BR: [
        '{um_PERSON} queria pintar um quadro de {um_PLATS}.',
        '{um_DJUR} chegou e quis ajudar.',
        '{o_DJUR} molhou o rabo na tinta e pintou com ele.',
        'O resultado foi um quadro lindo, com {um_SAK} bem no meio.',
        '"Isso é arte!", riu {o_PERSON}, pendurando o quadro na parede.'
      ]
    }
  },
  {
    id: 'magic-garden',
    title: { sv: 'Den magiska trädgården', en: 'The Magic Garden', pt_BR: 'O jardim mágico' },
    titleKey: 'sagostunden.story.magic_garden',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        '{en_PERSON} planterade {en_SAK} i trädgården.',
        'Nästa morgon hade det vuxit till ett träd fullt med {def_MAT}!',
        '{en_DJUR} kom flygande och plockade {def_MAT} från trädet.',
        '"Det här är ett magiskt träd!" utbrast {def_PERSON}.',
        'De delade {def_MAT} med alla i byn och alla blev glada.'
      ],
      en: [
        '{a_PERSON} planted {a_SAK} in the garden.',
        'The next morning it had grown into a tree full of {MAT}!',
        '{a_DJUR} came flying in and picked {MAT} from the tree.',
        '"This is a magic tree!" exclaimed {PERSON}.',
        'They shared the {MAT} with everyone in the village and everyone was happy.'
      ],
      pt_BR: [
        '{um_PERSON} plantou {um_SAK} no jardim.',
        'Na manhã seguinte, tinha nascido uma árvore cheia de {MAT}!',
        '{um_DJUR} veio voando e colheu um pouco de {MAT} da árvore.',
        '"Esta é uma árvore mágica!", exclamou {o_PERSON}.',
        'Dividiram {o_MAT} com todo mundo da vila, e todos ficaram felizes.'
      ]
    }
  },
  {
    id: 'bedtime',
    title: { sv: 'Godnatt', en: 'Goodnight', pt_BR: 'Boa noite' },
    titleKey: 'sagostunden.story.bedtime',
    slots: ['DJUR', 'SAK', 'PERSON', 'PLATS'],
    paragraphs: {
      sv: [
        'Det var kväll och {en_DJUR} var trött efter en lång dag.',
        '{def_DJUR} kramade sin {SAK} och kröp ner i sängen.',
        '{en_PERSON} kom och stoppade om {def_DJUR}.',
        '"Godnatt, lilla {def_DJUR}", viskade {def_PERSON} och tände nattlampan.',
        '{def_DJUR} somnade och drömde om {en_PLATS} full av äventyr.'
      ],
      en: [
        'It was evening and {a_DJUR} was tired after a long day.',
        '{DJUR} hugged the {SAK} and crawled into bed.',
        '{a_PERSON} came and tucked {DJUR} in.',
        '"Good night, little {DJUR}," whispered {PERSON} and turned on the night light.',
        '{DJUR} fell asleep and dreamed of {a_PLATS} full of adventures.'
      ],
      pt_BR: [
        'Era noite, e {um_DJUR} estava {DJUR|cansado|cansada} depois de um longo dia.',
        '{o_DJUR} abraçou {seu_SAK} e se deitou na cama.',
        '{um_PERSON} veio e cobriu {o_DJUR} com o cobertor.',
        '"Boa noite, {DJUR} {DJUR|querido|querida}", cochichou {o_PERSON}, apagando a luz.',
        '{o_DJUR} adormeceu e sonhou com {um_PLATS} {PLATS|cheio|cheia} de aventuras.'
      ]
    }
  },
  {
    id: 'circus-show',
    title: { sv: 'Cirkusföreställningen', en: 'The Circus Show', pt_BR: 'O espetáculo do circo' },
    titleKey: 'sagostunden.story.circus_show',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        'Cirkusen kom till stan och {en_DJUR} ville uppträda.',
        '{en_PERSON} hjälpte {def_DJUR} att öva.',
        '{def_DJUR} jonglerade med {en_SAK} och alla jublade.',
        'Till slut fick {def_DJUR} {VERB} på scenen.',
        'Publiken klappade och {def_DJUR} bugade stolt!'
      ],
      en: [
        'The circus came to town and {a_DJUR} wanted to perform.',
        '{a_PERSON} helped {DJUR} practice.',
        '{DJUR} juggled with {a_SAK} and everyone cheered.',
        'In the end {DJUR} got to {VERB} on stage.',
        'The audience clapped and {DJUR} took a proud bow!'
      ],
      pt_BR: [
        'O circo chegou à cidade, e {um_DJUR} queria se apresentar.',
        '{um_PERSON} ajudou {o_DJUR} a ensaiar.',
        '{o_DJUR} fez malabarismo com {um_SAK}, e todos aplaudiram.',
        'No final, {o_DJUR} pôde {VERB} no palco.',
        'A plateia bateu palmas, e {o_DJUR} fez uma reverência, {DJUR|todo orgulhoso|toda orgulhosa}!'
      ]
    }
  },
  {
    id: 'boat-trip',
    title: { sv: 'Båtresan', en: 'The Boat Trip', pt_BR: 'O passeio de barco' },
    titleKey: 'sagostunden.story.boat_trip',
    slots: ['PERSON', 'DJUR', 'PLATS', 'MAT'],
    paragraphs: {
      sv: [
        '{en_PERSON} och {en_DJUR} klev ombord på en stor båt.',
        'De seglade mot {en_PLATS} medan vågorna gungade.',
        'Till lunch åt de {def_MAT} på däck i solskenet.',
        'De såg delfiner hoppa i vattnet runt båten.',
        'När de kom fram till {def_PLATS} var de fyllda av glädje.'
      ],
      en: [
        '{a_PERSON} and {a_DJUR} climbed aboard a big boat.',
        'They sailed towards {a_PLATS} while the waves rocked gently.',
        'For lunch they ate {MAT} on deck in the sunshine.',
        'They saw dolphins jumping in the water around the boat.',
        'When they arrived at the {PLATS} they were filled with joy.'
      ],
      pt_BR: [
        '{um_PERSON} e {um_DJUR} subiram em um barco grande.',
        'Navegaram em direção {ao_PLATS} enquanto as ondas balançavam.',
        'No almoço, comeram {MAT} no convés, debaixo do sol.',
        'Viram golfinhos pulando na água em volta do barco.',
        'Quando chegaram {ao_PLATS}, estavam muito felizes.'
      ]
    }
  },
  {
    id: 'playground',
    title: { sv: 'På lekplatsen', en: 'At the Playground', pt_BR: 'No parquinho' },
    titleKey: 'sagostunden.story.playground',
    slots: ['DJUR', 'PERSON', 'SAK', 'VERB'],
    paragraphs: {
      sv: [
        '{en_DJUR} sprang till lekplatsen en solig eftermiddag.',
        'Där väntade {en_PERSON} med {en_SAK}.',
        '"Ska vi {VERB}?" frågade {def_PERSON} med ett stort leende.',
        'De lekte hela dagen och andra barn ville också vara med.',
        'När solen gick ner lovade de att träffas igen imorgon.'
      ],
      en: [
        '{a_DJUR} ran to the playground on a sunny afternoon.',
        'There {a_PERSON} was waiting with {a_SAK}.',
        '"Shall we {VERB}?" asked {PERSON} with a big smile.',
        'They played all day and other children wanted to join in too.',
        'When the sun went down they promised to meet again tomorrow.'
      ],
      pt_BR: [
        '{um_DJUR} correu para o parquinho numa tarde de sol.',
        'Lá, {um_PERSON} estava esperando com {um_SAK}.',
        '"Vamos {VERB}?", perguntou {o_PERSON}, com um sorrisão.',
        'Brincaram o dia inteiro, e outras crianças quiseram brincar também.',
        'Quando o sol se pôs, combinaram de se encontrar de novo amanhã.'
      ]
    }
  },
  {
    id: 'library-visit',
    title: { sv: 'Besöket på biblioteket', en: 'A Visit to the Library', pt_BR: 'Visita à biblioteca' },
    titleKey: 'sagostunden.story.library_visit',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} gick till biblioteket för att hitta en bok.',
        'Där satt {en_DJUR} och läste om {en_PLATS}.',
        '"Titta! Den här boken har en bild av {en_SAK}!" sa {def_DJUR}.',
        'De läste boken tillsammans och fantiserade om äventyr.',
        'Innan de gick hem lånade de tre böcker var.'
      ],
      en: [
        '{a_PERSON} went to the library to find a book.',
        'There sat {a_DJUR} reading about {a_PLATS}.',
        '"Look! This book has a picture of {a_SAK}!" said {DJUR}.',
        'They read the book together and imagined adventures.',
        'Before going home they each borrowed three books.'
      ],
      pt_BR: [
        '{um_PERSON} foi à biblioteca procurar um livro.',
        'Lá estava {um_DJUR}, lendo sobre {um_PLATS}.',
        '"Olha! Este livro tem uma figura de {um_SAK}!", disse {o_DJUR}.',
        'Leram o livro {PERSON+DJUR|juntos|juntas} e imaginaram mil aventuras.',
        'Antes de ir embora, {PERSON+DJUR|cada um|cada uma} pegou três livros emprestados.'
      ]
    }
  },
  {
    id: 'superhero',
    title: { sv: 'Superhjälten', en: 'The Superhero', pt_BR: 'Superpoderes' },
    titleKey: 'sagostunden.story.superhero',
    slots: ['PERSON', 'SAK', 'DJUR', 'PLATS'],
    paragraphs: {
      sv: [
        '{en_PERSON} hittade {en_SAK} som gav superkrafter!',
        'Nu kunde {def_PERSON} flyga högt ovanför husen.',
        '{en_DJUR} i {en_PLATS} behövde hjälp.',
        '{def_PERSON} flög dit snabbt och räddade {def_DJUR}.',
        '"Du är min hjälte!" sa {def_DJUR} och alla i {def_PLATS} jublade.'
      ],
      en: [
        '{a_PERSON} found {a_SAK} that gave superpowers!',
        'Now {PERSON} could fly high above the houses.',
        '{a_DJUR} in {a_PLATS} needed help.',
        '{PERSON} flew there quickly and rescued {DJUR}.',
        '"You are my hero!" said {DJUR} and everyone in the {PLATS} cheered.'
      ],
      pt_BR: [
        '{um_PERSON} encontrou {um_SAK} que dava superpoderes!',
        'Agora {o_PERSON} conseguia voar bem alto, por cima das casas.',
        '{um_DJUR} em {um_PLATS} precisava de ajuda.',
        '{o_PERSON} voou rapidinho até lá e salvou {o_DJUR}.',
        '"Você é {PERSON|meu herói|minha heroína}!", disse {o_DJUR}, e todo mundo {no_PLATS} comemorou.'
      ]
    }
  },
  {
    id: 'market-day',
    title: { sv: 'Marknadsdagen', en: 'Market Day', pt_BR: 'Dia de feira' },
    titleKey: 'sagostunden.story.market_day',
    slots: ['PERSON', 'DJUR', 'MAT', 'SAK'],
    paragraphs: {
      sv: [
        'Det var marknadsdag och {en_PERSON} gick dit med {en_DJUR}.',
        'Det fanns massor av {def_MAT} i alla färger.',
        '{def_DJUR} ville ha {en_SAK} som glittrade i ett stånd.',
        '{def_PERSON} köpte {def_SAK} åt {def_DJUR} och {def_MAT} att äta.',
        'De gick hem nöjda med sina fynd och magen full.'
      ],
      en: [
        'It was market day and {a_PERSON} went there with {a_DJUR}.',
        'There was lots of {MAT} in every colour.',
        '{DJUR} wanted {a_SAK} that sparkled at a stall.',
        '{PERSON} bought the {SAK} for {DJUR} and some {MAT} to eat.',
        'They went home happy with their finds and full tummies.'
      ],
      pt_BR: [
        'Era dia de feira, e {um_PERSON} foi até lá com {um_DJUR}.',
        'Tinha {MAT} de todas as cores!',
        '{o_DJUR} quis {um_SAK} que brilhava em uma barraca.',
        '{o_PERSON} comprou {o_SAK} para {o_DJUR} e um pouco de {MAT} para comer.',
        'Voltaram para casa felizes com as compras e de barriga cheia.'
      ]
    }
  },
  {
    id: 'night-sky',
    title: { sv: 'Nattens himmel', en: 'The Night Sky', pt_BR: 'O céu à noite' },
    titleKey: 'sagostunden.story.night_sky',
    slots: ['PERSON', 'DJUR', 'SAK', 'PLATS'],
    paragraphs: {
      sv: [
        'En klar natt gick {en_PERSON} och {en_DJUR} ut för att titta på stjärnorna.',
        'De tog med sig {en_SAK} och la sig på gräset.',
        '"Titta! Jag ser en stjärnbild som ser ut som {en_PLATS}!" sa {def_DJUR}.',
        '{def_PERSON} pekade mot en stjärna som blinkade extra starkt.',
        'De önskade sig något fint och gick in och somnade med ett leende.'
      ],
      en: [
        'On a clear night {a_PERSON} and {a_DJUR} went outside to look at the stars.',
        'They brought {a_SAK} and lay down on the grass.',
        '"Look! I can see a constellation that looks like {a_PLATS}!" said {DJUR}.',
        '{PERSON} pointed at a star that twinkled extra brightly.',
        'They each made a wish and went inside and fell asleep with a smile.'
      ],
      pt_BR: [
        'Numa noite estrelada, {um_PERSON} e {um_DJUR} saíram para olhar as estrelas.',
        'Levaram {um_SAK} e se deitaram na grama.',
        '"Olha! Aquelas estrelas parecem {um_PLATS}!", disse {o_DJUR}.',
        '{o_PERSON} apontou para uma estrela que piscava mais forte que as outras.',
        'Fizeram um pedido e foram dormir sorrindo.'
      ]
    }
  },
];
