export type AppCategory = 'communication' | 'daily' | 'time' | 'emotions' | 'learning' | 'play' | 'speech';

export interface AppDef {
  id: string;
  name: string;           // i18n key
  description: string;    // i18n key
  category: AppCategory;
  icon: string;           // path to SVG
  route: string;
  ready: boolean;
}

export const CATEGORY_META: Record<AppCategory, { color: string; label: string; emoji: string }> = {
  communication: { color: '#E67E22', label: 'app.category.communication', emoji: '💬' },
  daily:         { color: '#3498DB', label: 'app.category.daily', emoji: '🏠' },
  time:          { color: '#27AE60', label: 'app.category.time', emoji: '⏰' },
  emotions:      { color: '#9B59B6', label: 'app.category.emotions', emoji: '💜' },
  learning:      { color: '#F1C40F', label: 'app.category.learning', emoji: '📚' },
  play:          { color: '#E74C3C', label: 'app.category.play', emoji: '🎮' },
  speech:        { color: '#E91E63', label: 'app.category.speech', emoji: '🗣️' }
};

export const ALL_APPS: AppDef[] = [
  // Communication (AAC)
  { id: 'board-builder', name: 'app.board_builder', description: 'app.board_builder.desc', category: 'communication', icon: '/icons/board-builder.svg', route: '/apps/board-builder', ready: true },
  { id: 'talk-board', name: 'app.talk_board', description: 'app.talk_board.desc', category: 'communication', icon: '/icons/talk-board.svg', route: '/apps/talk-board', ready: true },
  { id: 'situation-cards', name: 'app.situation_cards', description: 'app.situation_cards.desc', category: 'communication', icon: '/icons/situation-cards.svg', route: '/apps/situation-cards', ready: true },
  { id: 'talking-mat', name: 'app.talking_mat', description: 'app.talking_mat.desc', category: 'communication', icon: '/icons/talking-mat.svg', route: '/apps/talking-mat', ready: true },
  { id: 'pecs-trainer', name: 'app.pecs_trainer', description: 'app.pecs_trainer.desc', category: 'communication', icon: '/icons/pecs-trainer.svg', route: '/apps/pecs-trainer', ready: true },
  { id: 'point-talk', name: 'app.point_talk', description: 'app.point_talk.desc', category: 'communication', icon: '/icons/point-talk.svg', route: '/apps/point-talk', ready: true },
  { id: 'phrase-builder', name: 'app.phrase_builder', description: 'app.phrase_builder.desc', category: 'communication', icon: '/icons/phrase-builder.svg', route: '/apps/phrase-builder', ready: true },
  { id: 'pecs-board', name: 'app.pecs_board', description: 'app.pecs_board.desc', category: 'communication', icon: '/icons/pecs-board.svg', route: '/apps/pecs-board', ready: true },
  { id: 'sentence-strip', name: 'app.sentence_strip', description: 'app.sentence_strip.desc', category: 'communication', icon: '/icons/sentence-strip.svg', route: '/apps/sentence-strip', ready: true },
  { id: 'symbol-text', name: 'app.symbol_text', description: 'app.symbol_text.desc', category: 'communication', icon: '/icons/symbol-text.svg', route: '/apps/symbol-text', ready: true },
  { id: 'comm-book', name: 'app.comm_book', description: 'app.comm_book.desc', category: 'communication', icon: '/icons/comm-book.svg', route: '/apps/comm-book', ready: true },
  { id: 'conversation-aid', name: 'app.conversation_aid', description: 'app.conversation_aid.desc', category: 'communication', icon: '/icons/conversation-aid.svg', route: '/apps/conversation-aid', ready: true },
  { id: 'social-stories', name: 'app.social_stories', description: 'app.social_stories.desc', category: 'communication', icon: '/icons/social-stories.svg', route: '/apps/social-stories', ready: true },

  // Daily Routines
  { id: 'day-planner', name: 'app.day_planner', description: 'app.day_planner.desc', category: 'daily', icon: '/icons/day-planner.svg', route: '/apps/day-planner', ready: true },
  { id: 'picture-schedule', name: 'app.picture_schedule', description: 'app.picture_schedule.desc', category: 'daily', icon: '/icons/picture-schedule.svg', route: '/apps/picture-schedule', ready: true },
  { id: 'my-schedule', name: 'app.my_schedule', description: 'app.my_schedule.desc', category: 'daily', icon: '/icons/my-schedule.svg', route: '/apps/my-schedule', ready: true },
  { id: 'routine-buddy', name: 'app.routine_buddy', description: 'app.routine_buddy.desc', category: 'daily', icon: '/icons/routine-buddy.svg', route: '/apps/routine-buddy', ready: true },
  { id: 'step-guide', name: 'app.step_guide', description: 'app.step_guide.desc', category: 'daily', icon: '/icons/step-guide.svg', route: '/apps/step-guide', ready: true },
  { id: 'visual-support', name: 'app.visual_support', description: 'app.visual_support.desc', category: 'daily', icon: '/icons/visual-support.svg', route: '/apps/visual-support', ready: true },
  { id: 'clothes-chooser', name: 'app.clothes_chooser', description: 'app.clothes_chooser.desc', category: 'daily', icon: '/icons/clothes-chooser.svg', route: '/apps/clothes-chooser', ready: true },
  { id: 'cooking-helper', name: 'app.cooking_helper', description: 'app.cooking_helper.desc', category: 'daily', icon: '/icons/cooking-helper.svg', route: '/apps/cooking-helper', ready: true },

  // Time & Planning
  { id: 'visual-timer', name: 'app.visual_timer', description: 'app.visual_timer.desc', category: 'time', icon: '/icons/visual-timer.svg', route: '/apps/visual-timer', ready: true },
  { id: 'time-tracker', name: 'app.time_tracker', description: 'app.time_tracker.desc', category: 'time', icon: '/icons/time-tracker.svg', route: '/apps/time-tracker', ready: true },
  { id: 'clock-teacher', name: 'app.clock_teacher', description: 'app.clock_teacher.desc', category: 'time', icon: '/icons/clock-teacher.svg', route: '/apps/clock-teacher', ready: true },
  { id: 'break-check', name: 'app.break_check', description: 'app.break_check.desc', category: 'time', icon: '/icons/break-check.svg', route: '/apps/break-check', ready: true },
  { id: 'practice-board', name: 'app.practice_board', description: 'app.practice_board.desc', category: 'time', icon: '/icons/practice-board.svg', route: '/apps/practice-board', ready: true },
  { id: 'sign-dictionary', name: 'app.sign_dictionary', description: 'app.sign_dictionary.desc', category: 'communication', icon: '/icons/sign-dictionary.svg', route: '/apps/sign-dictionary', ready: true },
  { id: 'school-day', name: 'app.school_day', description: 'app.school_day.desc', category: 'time', icon: '/icons/school-day.svg', route: '/apps/school-day', ready: true },

  // Emotions & Calm
  { id: 'emotion-map', name: 'app.emotion_map', description: 'app.emotion_map.desc', category: 'emotions', icon: '/icons/emotion-map.svg', route: '/apps/emotion-map', ready: true },
  { id: 'calm-room', name: 'app.calm_room', description: 'app.calm_room.desc', category: 'emotions', icon: '/icons/calm-room.svg', route: '/apps/calm-room', ready: true },
  { id: 'focus-buddy', name: 'app.focus_buddy', description: 'app.focus_buddy.desc', category: 'emotions', icon: '/icons/focus-buddy.svg', route: '/apps/focus-buddy', ready: true },
  { id: 'energy-meter', name: 'app.energy_meter', description: 'app.energy_meter.desc', category: 'emotions', icon: '/icons/energy-meter.svg', route: '/apps/energy-meter', ready: true },
  { id: 'anger-manager', name: 'app.anger_manager', description: 'app.anger_manager.desc', category: 'emotions', icon: '/icons/anger-manager.svg', route: '/apps/anger-manager', ready: true },
  { id: 'reward-chart', name: 'app.reward_chart', description: 'app.reward_chart.desc', category: 'emotions', icon: '/icons/reward-chart.svg', route: '/apps/reward-chart', ready: true },

  // Learning
  { id: 'word-builder', name: 'app.word_builder', description: 'app.word_builder.desc', category: 'learning', icon: '/icons/word-builder.svg', route: '/apps/word-builder', ready: true },
  { id: 'sentence-builder', name: 'app.sentence_builder', description: 'app.sentence_builder.desc', category: 'learning', icon: '/icons/sentence-builder.svg', route: '/apps/sentence-builder', ready: true },
  { id: 'letter-journey', name: 'app.letter_journey', description: 'app.letter_journey.desc', category: 'learning', icon: '/icons/letter-journey.svg', route: '/apps/letter-journey', ready: true },
  { id: 'oral-motor', name: 'app.oral_motor', description: 'app.oral_motor.desc', category: 'learning', icon: '/icons/oral-motor.svg', route: '/apps/oral-motor', ready: true },
  { id: 'sound-chain', name: 'app.sound_chain', description: 'app.sound_chain.desc', category: 'learning', icon: '/icons/sound-chain.svg', route: '/apps/sound-chain', ready: true },
  { id: 'speech-practice', name: 'app.speech_practice', description: 'app.speech_practice.desc', category: 'learning', icon: '/icons/speech-practice.svg', route: '/apps/speech-practice', ready: true },
  { id: 'syllable-jump', name: 'app.syllable_jump', description: 'app.syllable_jump.desc', category: 'learning', icon: '/icons/syllable-jump.svg', route: '/apps/syllable-jump', ready: true },
  { id: 'picture-dictionary', name: 'app.picture_dictionary', description: 'app.picture_dictionary.desc', category: 'learning', icon: '/icons/picture-dictionary.svg', route: '/apps/picture-dictionary', ready: true },
  { id: 'focus-buddy', name: 'app.focus_buddy', description: 'app.focus_buddy.desc', category: 'time', icon: '/icons/focus-buddy.svg', route: '/apps/focus-buddy', ready: true },
  { id: 'math-aid', name: 'app.math_aid', description: 'app.math_aid.desc', category: 'learning', icon: '/icons/math-aid.svg', route: '/apps/math-aid', ready: true },
  { id: 'counting', name: 'app.counting', description: 'app.counting.desc', category: 'learning', icon: '/icons/counting.svg', route: '/apps/counting', ready: true },
  { id: 'money-check', name: 'app.money_check', description: 'app.money_check.desc', category: 'learning', icon: '/icons/money-check.svg', route: '/apps/money-check', ready: true },

  // Memory & Play
  { id: 'memory-game', name: 'app.memory_game', description: 'app.memory_game.desc', category: 'play', icon: '/icons/memory-game.svg', route: '/apps/memory-game', ready: true },
  { id: 'sound-library', name: 'app.sound_library', description: 'app.sound_library.desc', category: 'play', icon: '/icons/sound-library.svg', route: '/apps/sound-library', ready: true },
  { id: 'diary', name: 'app.diary', description: 'app.diary.desc', category: 'emotions', icon: '/icons/diary.svg', route: '/apps/diary', ready: true },
  { id: 'chooser', name: 'app.chooser', description: 'app.chooser.desc', category: 'play', icon: '/icons/chooser.svg', route: '/apps/chooser', ready: true }
];
