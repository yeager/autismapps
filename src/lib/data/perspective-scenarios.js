/**
 * Perspective-Taking Scenarios
 * Theory of Mind training for children with autism.
 *
 * ARASAAC IDs validated via https://api.arasaac.org/v1/pictograms/en/search/{word}
 *
 * Levels:
 *   1 = Simple emotions (ages 4-6)
 *   2 = Complex emotions (ages 6-8)
 *   3 = False beliefs (ages 7-10)
 *   4 = Second-order beliefs (ages 9+)
 */

/** @typedef {'happy'|'sad'|'angry'|'scared'|'surprised'|'confused'|'embarrassed'|'proud'|'jealous'|'worried'|'disappointed'|'excited'} Emotion */

/**
 * ARASAAC pictogram IDs — all validated via API.
 */
export const PICTO_IDS = {
  iceCream: 3348,
  present: 25381,
  toy: 9813,
  cry: 7147,
  ball: 3241,
  basket: 3012,
  box: 24749,
  dog: 7202,
  cat: 7114,
  playground: 33064,
  friend: 25790,
  school: 32446,
  birthday: 37363,
  cake: 2502,
  drawing: 11238,
  painting: 2360,
  scared: 35535,
  happy: 35533,
  sad: 35545,
  angry: 35539,
  surprised: 35529,
  confused: 2352,
  embarrassed: 6922,
  proud: 31408,
  jealous: 30630,
  think: 38796,
  hide: 6493,
  look: 6564,
  move: 7167,
  chocolate: 25940,
  cookie: 8312,
  book: 25191,
  teddyBear: 4945,
  rain: 7148,
  drop: 6215,
  fall: 39440,
  sandwich: 2281,
  share: 38900,
  competition: 37313,
  win: 7218,
  lose: 24760,
  stage: 8106,
  bicycle: 6935,
  build: 2713,
  tower: 6232,
  break_: 6604,
  secret: 35883,
  hat: 2572,
  backpack: 2475,
  shoes: 2775,
  umbrella: 2500,
};

/**
 * Get ARASAAC pictogram URL for a given ID
 */
export function getPictoUrl(id) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
}

/**
 * Level 1: Simple emotions (ages 4-6)
 * Focus: happy, sad, scared, angry
 */
export const LEVEL_1_SCENARIOS = [
  {
    id: 'l1_present',
    pictoId: PICTO_IDS.present,
    scenarioKey: 'pt.l1.present.scenario',
    emotionQuestion: 'pt.l1.present.emotion_q',
    correctEmotion: 'happy',
    emotionChoices: ['happy', 'sad', 'angry'],
    thinkQuestion: 'pt.l1.present.think_q',
    thinkChoices: ['pt.think.love_it', 'pt.think.dont_want', 'pt.think.scared'],
    correctThink: 'pt.think.love_it',
    doQuestion: 'pt.l1.present.do_q',
    doChoices: ['pt.do.say_thanks', 'pt.do.throw_away', 'pt.do.cry'],
    correctDo: 'pt.do.say_thanks',
  },
  {
    id: 'l1_ice_cream',
    pictoId: PICTO_IDS.iceCream,
    scenarioKey: 'pt.l1.ice_cream.scenario',
    emotionQuestion: 'pt.l1.ice_cream.emotion_q',
    correctEmotion: 'sad',
    emotionChoices: ['happy', 'sad', 'angry'],
    thinkQuestion: 'pt.l1.ice_cream.think_q',
    thinkChoices: ['pt.think.want_new', 'pt.think.fun', 'pt.think.dont_care'],
    correctThink: 'pt.think.want_new',
    doQuestion: 'pt.l1.ice_cream.do_q',
    doChoices: ['pt.do.comfort', 'pt.do.laugh', 'pt.do.walk_away'],
    correctDo: 'pt.do.comfort',
  },
  {
    id: 'l1_dog',
    pictoId: PICTO_IDS.dog,
    scenarioKey: 'pt.l1.dog.scenario',
    emotionQuestion: 'pt.l1.dog.emotion_q',
    correctEmotion: 'scared',
    emotionChoices: ['happy', 'scared', 'angry'],
    thinkQuestion: 'pt.l1.dog.think_q',
    thinkChoices: ['pt.think.dog_scary', 'pt.think.fun', 'pt.think.hungry'],
    correctThink: 'pt.think.dog_scary',
    doQuestion: 'pt.l1.dog.do_q',
    doChoices: ['pt.do.help_away', 'pt.do.push_dog', 'pt.do.laugh'],
    correctDo: 'pt.do.help_away',
  },
  {
    id: 'l1_toy_broken',
    pictoId: PICTO_IDS.toy,
    scenarioKey: 'pt.l1.toy_broken.scenario',
    emotionQuestion: 'pt.l1.toy_broken.emotion_q',
    correctEmotion: 'sad',
    emotionChoices: ['happy', 'sad', 'surprised'],
    thinkQuestion: 'pt.l1.toy_broken.think_q',
    thinkChoices: ['pt.think.want_fix', 'pt.think.fun', 'pt.think.dont_care'],
    correctThink: 'pt.think.want_fix',
    doQuestion: 'pt.l1.toy_broken.do_q',
    doChoices: ['pt.do.help_fix', 'pt.do.take_toy', 'pt.do.walk_away'],
    correctDo: 'pt.do.help_fix',
  },
  {
    id: 'l1_birthday',
    pictoId: PICTO_IDS.birthday,
    scenarioKey: 'pt.l1.birthday.scenario',
    emotionQuestion: 'pt.l1.birthday.emotion_q',
    correctEmotion: 'happy',
    emotionChoices: ['sad', 'happy', 'scared'],
    thinkQuestion: 'pt.l1.birthday.think_q',
    thinkChoices: ['pt.think.best_day', 'pt.think.boring', 'pt.think.scared'],
    correctThink: 'pt.think.best_day',
    doQuestion: 'pt.l1.birthday.do_q',
    doChoices: ['pt.do.sing_together', 'pt.do.walk_away', 'pt.do.cry'],
    correctDo: 'pt.do.sing_together',
  },
  {
    id: 'l1_friend_crying',
    pictoId: PICTO_IDS.cry,
    scenarioKey: 'pt.l1.friend_crying.scenario',
    emotionQuestion: 'pt.l1.friend_crying.emotion_q',
    correctEmotion: 'sad',
    emotionChoices: ['happy', 'sad', 'angry'],
    thinkQuestion: 'pt.l1.friend_crying.think_q',
    thinkChoices: ['pt.think.need_help', 'pt.think.fun', 'pt.think.hungry'],
    correctThink: 'pt.think.need_help',
    doQuestion: 'pt.l1.friend_crying.do_q',
    doChoices: ['pt.do.ask_whats_wrong', 'pt.do.laugh', 'pt.do.walk_away'],
    correctDo: 'pt.do.ask_whats_wrong',
  },
];

/**
 * Level 2: Complex emotions (ages 6-8)
 * Focus: embarrassed, proud, jealous, worried, disappointed, excited
 */
export const LEVEL_2_SCENARIOS = [
  {
    id: 'l2_stage',
    pictoId: PICTO_IDS.stage,
    scenarioKey: 'pt.l2.stage.scenario',
    emotionQuestion: 'pt.l2.stage.emotion_q',
    correctEmotion: 'embarrassed',
    emotionChoices: ['embarrassed', 'happy', 'angry', 'proud'],
    thinkQuestion: 'pt.l2.stage.think_q',
    thinkChoices: ['pt.think.everyone_laughs', 'pt.think.fun', 'pt.think.hungry', 'pt.think.want_play'],
    correctThink: 'pt.think.everyone_laughs',
    doQuestion: 'pt.l2.stage.do_q',
    doChoices: ['pt.do.encourage', 'pt.do.laugh', 'pt.do.walk_away', 'pt.do.shout'],
    correctDo: 'pt.do.encourage',
  },
  {
    id: 'l2_drawing',
    pictoId: PICTO_IDS.drawing,
    scenarioKey: 'pt.l2.drawing.scenario',
    emotionQuestion: 'pt.l2.drawing.emotion_q',
    correctEmotion: 'proud',
    emotionChoices: ['sad', 'proud', 'scared', 'angry'],
    thinkQuestion: 'pt.l2.drawing.think_q',
    thinkChoices: ['pt.think.did_great', 'pt.think.dont_care', 'pt.think.scared', 'pt.think.boring'],
    correctThink: 'pt.think.did_great',
    doQuestion: 'pt.l2.drawing.do_q',
    doChoices: ['pt.do.say_nice', 'pt.do.take_drawing', 'pt.do.walk_away', 'pt.do.laugh'],
    correctDo: 'pt.do.say_nice',
  },
  {
    id: 'l2_new_toy',
    pictoId: PICTO_IDS.toy,
    scenarioKey: 'pt.l2.new_toy.scenario',
    emotionQuestion: 'pt.l2.new_toy.emotion_q',
    correctEmotion: 'jealous',
    emotionChoices: ['happy', 'jealous', 'scared', 'proud'],
    thinkQuestion: 'pt.l2.new_toy.think_q',
    thinkChoices: ['pt.think.want_same', 'pt.think.dont_care', 'pt.think.fun', 'pt.think.scared'],
    correctThink: 'pt.think.want_same',
    doQuestion: 'pt.l2.new_toy.do_q',
    doChoices: ['pt.do.ask_play_together', 'pt.do.take_toy', 'pt.do.cry', 'pt.do.push'],
    correctDo: 'pt.do.ask_play_together',
  },
  {
    id: 'l2_race',
    pictoId: PICTO_IDS.competition,
    scenarioKey: 'pt.l2.race.scenario',
    emotionQuestion: 'pt.l2.race.emotion_q',
    correctEmotion: 'disappointed',
    emotionChoices: ['happy', 'disappointed', 'angry', 'embarrassed'],
    thinkQuestion: 'pt.l2.race.think_q',
    thinkChoices: ['pt.think.wanted_win', 'pt.think.fun', 'pt.think.dont_care', 'pt.think.hungry'],
    correctThink: 'pt.think.wanted_win',
    doQuestion: 'pt.l2.race.do_q',
    doChoices: ['pt.do.say_good_job', 'pt.do.shout', 'pt.do.walk_away', 'pt.do.push'],
    correctDo: 'pt.do.say_good_job',
  },
  {
    id: 'l2_secret',
    pictoId: PICTO_IDS.secret,
    scenarioKey: 'pt.l2.secret.scenario',
    emotionQuestion: 'pt.l2.secret.emotion_q',
    correctEmotion: 'worried',
    emotionChoices: ['happy', 'worried', 'proud', 'angry'],
    thinkQuestion: 'pt.l2.secret.think_q',
    thinkChoices: ['pt.think.friend_mad', 'pt.think.fun', 'pt.think.dont_care', 'pt.think.hungry'],
    correctThink: 'pt.think.friend_mad',
    doQuestion: 'pt.l2.secret.do_q',
    doChoices: ['pt.do.say_sorry', 'pt.do.laugh', 'pt.do.walk_away', 'pt.do.shout'],
    correctDo: 'pt.do.say_sorry',
  },
  {
    id: 'l2_surprise_party',
    pictoId: PICTO_IDS.cake,
    scenarioKey: 'pt.l2.surprise_party.scenario',
    emotionQuestion: 'pt.l2.surprise_party.emotion_q',
    correctEmotion: 'excited',
    emotionChoices: ['scared', 'excited', 'angry', 'sad'],
    thinkQuestion: 'pt.l2.surprise_party.think_q',
    thinkChoices: ['pt.think.best_day', 'pt.think.scary', 'pt.think.boring', 'pt.think.dont_care'],
    correctThink: 'pt.think.best_day',
    doQuestion: 'pt.l2.surprise_party.do_q',
    doChoices: ['pt.do.celebrate', 'pt.do.walk_away', 'pt.do.cry', 'pt.do.shout'],
    correctDo: 'pt.do.celebrate',
  },
];

/**
 * Level 3: False belief tasks (ages 7-10)
 * Sally-Anne style — tests understanding that others can have wrong beliefs
 */
export const LEVEL_3_SCENARIOS = [
  {
    id: 'l3_ball_basket',
    type: 'false-belief',
    pictoId: PICTO_IDS.ball,
    storyKeys: [
      'pt.l3.ball.step1', // Sara lägger sin boll i korgen
      'pt.l3.ball.step2', // Sara går ut
      'pt.l3.ball.step3', // Anna flyttar bollen till lådan
      'pt.l3.ball.step4', // Sara kommer tillbaka
    ],
    questionKey: 'pt.l3.ball.question', // Var tror Sara att bollen är?
    correctAnswer: 'pt.l3.ball.answer_basket', // I korgen
    answerChoices: ['pt.l3.ball.answer_basket', 'pt.l3.ball.answer_box'],
    explanationKey: 'pt.l3.ball.explanation',
    objectPictos: { basket: PICTO_IDS.basket, box: PICTO_IDS.box },
  },
  {
    id: 'l3_chocolate',
    type: 'false-belief',
    pictoId: PICTO_IDS.chocolate,
    storyKeys: [
      'pt.l3.choc.step1', // Mamma lägger chokladen i skåpet
      'pt.l3.choc.step2', // Mamma går till affären
      'pt.l3.choc.step3', // Pappa flyttar chokladen till lådan
      'pt.l3.choc.step4', // Mamma kommer hem
    ],
    questionKey: 'pt.l3.choc.question',
    correctAnswer: 'pt.l3.choc.answer_cupboard',
    answerChoices: ['pt.l3.choc.answer_cupboard', 'pt.l3.choc.answer_drawer'],
    explanationKey: 'pt.l3.choc.explanation',
  },
  {
    id: 'l3_teddy',
    type: 'false-belief',
    pictoId: PICTO_IDS.teddyBear,
    storyKeys: [
      'pt.l3.teddy.step1', // Erik lägger sin nalle under kudden
      'pt.l3.teddy.step2', // Erik går och borstar tänderna
      'pt.l3.teddy.step3', // Lillebror tar nallen och lägger den i garderoben
      'pt.l3.teddy.step4', // Erik kommer tillbaka
    ],
    questionKey: 'pt.l3.teddy.question',
    correctAnswer: 'pt.l3.teddy.answer_pillow',
    answerChoices: ['pt.l3.teddy.answer_pillow', 'pt.l3.teddy.answer_closet'],
    explanationKey: 'pt.l3.teddy.explanation',
  },
  {
    id: 'l3_cookie',
    type: 'false-belief',
    pictoId: PICTO_IDS.cookie,
    storyKeys: [
      'pt.l3.cookie.step1', // Lisa lägger kakorna på bordet
      'pt.l3.cookie.step2', // Lisa går ut och leker
      'pt.l3.cookie.step3', // Pappa flyttar kakorna till burken
      'pt.l3.cookie.step4', // Lisa kommer in igen
    ],
    questionKey: 'pt.l3.cookie.question',
    correctAnswer: 'pt.l3.cookie.answer_table',
    answerChoices: ['pt.l3.cookie.answer_table', 'pt.l3.cookie.answer_jar'],
    explanationKey: 'pt.l3.cookie.explanation',
  },
  {
    id: 'l3_book',
    type: 'false-belief',
    pictoId: PICTO_IDS.book,
    storyKeys: [
      'pt.l3.book.step1', // Alma lägger sin bok på soffan
      'pt.l3.book.step2', // Alma går till köket
      'pt.l3.book.step3', // Storebror flyttar boken till hyllan
      'pt.l3.book.step4', // Alma kommer tillbaka
    ],
    questionKey: 'pt.l3.book.question',
    correctAnswer: 'pt.l3.book.answer_sofa',
    answerChoices: ['pt.l3.book.answer_sofa', 'pt.l3.book.answer_shelf'],
    explanationKey: 'pt.l3.book.explanation',
  },
];

/**
 * Level 4: Second-order beliefs (ages 9+)
 * "What does A think that B thinks?"
 */
export const LEVEL_4_SCENARIOS = [
  {
    id: 'l4_surprise',
    type: 'second-order',
    pictoId: PICTO_IDS.present,
    storyKeys: [
      'pt.l4.surprise.step1', // Anna köper en present till Erik i hemlighet
      'pt.l4.surprise.step2', // Erik ser Anna i leksaksaffären genom fönstret
      'pt.l4.surprise.step3', // Anna vet inte att Erik såg henne
    ],
    question1Key: 'pt.l4.surprise.q1', // Vad tror Anna att Erik vet?
    answer1Choices: ['pt.l4.surprise.a1_nothing', 'pt.l4.surprise.a1_knows'],
    correctAnswer1: 'pt.l4.surprise.a1_nothing',
    question2Key: 'pt.l4.surprise.q2', // Kommer Erik bli förvånad?
    answer2Choices: ['pt.l4.surprise.a2_yes', 'pt.l4.surprise.a2_no'],
    correctAnswer2: 'pt.l4.surprise.a2_no',
    explanationKey: 'pt.l4.surprise.explanation',
  },
  {
    id: 'l4_ice_cream_truck',
    type: 'second-order',
    pictoId: PICTO_IDS.iceCream,
    storyKeys: [
      'pt.l4.ice_cream.step1', // Glassbilen är i parken. Lisa och Olle vet det.
      'pt.l4.ice_cream.step2', // Lisa går hem. Glassbilen kör till torget.
      'pt.l4.ice_cream.step3', // Olle ser att glassbilen kör till torget.
      'pt.l4.ice_cream.step4', // Lisa vet inte att glassbilen flyttade.
    ],
    question1Key: 'pt.l4.ice_cream.q1', // Var tror Lisa att glassbilen är?
    answer1Choices: ['pt.l4.ice_cream.a1_park', 'pt.l4.ice_cream.a1_square'],
    correctAnswer1: 'pt.l4.ice_cream.a1_park',
    question2Key: 'pt.l4.ice_cream.q2', // Var tror Olle att Lisa kommer leta efter glassbilen?
    answer2Choices: ['pt.l4.ice_cream.a2_park', 'pt.l4.ice_cream.a2_square'],
    correctAnswer2: 'pt.l4.ice_cream.a2_park',
    explanationKey: 'pt.l4.ice_cream.explanation',
  },
  {
    id: 'l4_hat',
    type: 'second-order',
    pictoId: PICTO_IDS.hat,
    storyKeys: [
      'pt.l4.hat.step1', // Maja lägger sin mössa i ryggsäcken
      'pt.l4.hat.step2', // Axel ser Maja lägga mössan där
      'pt.l4.hat.step3', // Axel flyttar mössan till jackfickan (Maja ser inte)
      'pt.l4.hat.step4', // Maja kommer tillbaka
    ],
    question1Key: 'pt.l4.hat.q1', // Var tror Maja att mössan är?
    answer1Choices: ['pt.l4.hat.a1_backpack', 'pt.l4.hat.a1_pocket'],
    correctAnswer1: 'pt.l4.hat.a1_backpack',
    question2Key: 'pt.l4.hat.q2', // Var tror Axel att Maja kommer leta?
    answer2Choices: ['pt.l4.hat.a2_backpack', 'pt.l4.hat.a2_pocket'],
    correctAnswer2: 'pt.l4.hat.a2_backpack',
    explanationKey: 'pt.l4.hat.explanation',
  },
  {
    id: 'l4_birthday_cake',
    type: 'second-order',
    pictoId: PICTO_IDS.cake,
    storyKeys: [
      'pt.l4.cake.step1', // Mamma bakar en tårta till Alice i hemlighet
      'pt.l4.cake.step2', // Pappa vet om tårtan
      'pt.l4.cake.step3', // Alice frågar pappa: "Vet du om mamma planerar något?"
      'pt.l4.cake.step4', // Pappa säger: "Nej, jag vet ingenting"
    ],
    question1Key: 'pt.l4.cake.q1', // Vet pappa om tårtan?
    answer1Choices: ['pt.l4.cake.a1_yes', 'pt.l4.cake.a1_no'],
    correctAnswer1: 'pt.l4.cake.a1_yes',
    question2Key: 'pt.l4.cake.q2', // Varför ljuger pappa?
    answer2Choices: ['pt.l4.cake.a2_surprise', 'pt.l4.cake.a2_mean'],
    correctAnswer2: 'pt.l4.cake.a2_surprise',
    explanationKey: 'pt.l4.cake.explanation',
  },
  {
    id: 'l4_rain_umbrella',
    type: 'second-order',
    pictoId: PICTO_IDS.umbrella,
    storyKeys: [
      'pt.l4.rain.step1', // Det regnar ute. Viktor har ett paraply i skåpet.
      'pt.l4.rain.step2', // Elsa ser att det regnar och tänker på Viktor.
      'pt.l4.rain.step3', // Elsa vet inte att Viktor redan har tagit paraplyet.
    ],
    question1Key: 'pt.l4.rain.q1', // Vad tror Elsa att Viktor behöver?
    answer1Choices: ['pt.l4.rain.a1_umbrella', 'pt.l4.rain.a1_nothing'],
    correctAnswer1: 'pt.l4.rain.a1_umbrella',
    question2Key: 'pt.l4.rain.q2', // Behöver Viktor verkligen hjälp?
    answer2Choices: ['pt.l4.rain.a2_no', 'pt.l4.rain.a2_yes'],
    correctAnswer2: 'pt.l4.rain.a2_no',
    explanationKey: 'pt.l4.rain.explanation',
  },
];

/**
 * All levels for easy access
 */
export const ALL_LEVELS = [
  { level: 1, labelKey: 'pt.level1.label', descKey: 'pt.level1.desc', emoji: '😊', color: '#27AE60', ageRange: '4-6', scenarios: LEVEL_1_SCENARIOS },
  { level: 2, labelKey: 'pt.level2.label', descKey: 'pt.level2.desc', emoji: '🎭', color: '#3498DB', ageRange: '6-8', scenarios: LEVEL_2_SCENARIOS },
  { level: 3, labelKey: 'pt.level3.label', descKey: 'pt.level3.desc', emoji: '🧩', color: '#E67E22', ageRange: '7-10', scenarios: LEVEL_3_SCENARIOS },
  { level: 4, labelKey: 'pt.level4.label', descKey: 'pt.level4.desc', emoji: '🧠', color: '#9B59B6', ageRange: '9+', scenarios: LEVEL_4_SCENARIOS },
];
