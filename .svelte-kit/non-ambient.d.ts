
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/apps" | "/apps/board-builder" | "/apps/break-check" | "/apps/calm-room" | "/apps/chooser" | "/apps/clock-teacher" | "/apps/clothes-chooser" | "/apps/cooking-helper" | "/apps/counting" | "/apps/diary" | "/apps/emotion-map" | "/apps/energy-meter" | "/apps/focus-buddy" | "/apps/letter-journey" | "/apps/money-check" | "/apps/pecs-trainer" | "/apps/phrase-builder" | "/apps/picture-dictionary" | "/apps/picture-schedule" | "/apps/point-talk" | "/apps/practice-board" | "/apps/sign-dictionary" | "/apps/situation-cards" | "/apps/step-guide" | "/apps/talk-board" | "/apps/talking-mat" | "/apps/visual-support" | "/apps/visual-timer" | "/profiles" | "/settings";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/apps": Record<string, never>;
			"/apps/board-builder": Record<string, never>;
			"/apps/break-check": Record<string, never>;
			"/apps/calm-room": Record<string, never>;
			"/apps/chooser": Record<string, never>;
			"/apps/clock-teacher": Record<string, never>;
			"/apps/clothes-chooser": Record<string, never>;
			"/apps/cooking-helper": Record<string, never>;
			"/apps/counting": Record<string, never>;
			"/apps/diary": Record<string, never>;
			"/apps/emotion-map": Record<string, never>;
			"/apps/energy-meter": Record<string, never>;
			"/apps/focus-buddy": Record<string, never>;
			"/apps/letter-journey": Record<string, never>;
			"/apps/money-check": Record<string, never>;
			"/apps/pecs-trainer": Record<string, never>;
			"/apps/phrase-builder": Record<string, never>;
			"/apps/picture-dictionary": Record<string, never>;
			"/apps/picture-schedule": Record<string, never>;
			"/apps/point-talk": Record<string, never>;
			"/apps/practice-board": Record<string, never>;
			"/apps/sign-dictionary": Record<string, never>;
			"/apps/situation-cards": Record<string, never>;
			"/apps/step-guide": Record<string, never>;
			"/apps/talk-board": Record<string, never>;
			"/apps/talking-mat": Record<string, never>;
			"/apps/visual-support": Record<string, never>;
			"/apps/visual-timer": Record<string, never>;
			"/profiles": Record<string, never>;
			"/settings": Record<string, never>
		};
		Pathname(): "/" | "/apps/board-builder" | "/apps/break-check" | "/apps/calm-room" | "/apps/chooser" | "/apps/clock-teacher" | "/apps/clothes-chooser" | "/apps/cooking-helper" | "/apps/counting" | "/apps/diary" | "/apps/emotion-map" | "/apps/energy-meter" | "/apps/focus-buddy" | "/apps/letter-journey" | "/apps/money-check" | "/apps/pecs-trainer" | "/apps/phrase-builder" | "/apps/picture-dictionary" | "/apps/picture-schedule" | "/apps/point-talk" | "/apps/practice-board" | "/apps/sign-dictionary" | "/apps/situation-cards" | "/apps/step-guide" | "/apps/talk-board" | "/apps/talking-mat" | "/apps/visual-support" | "/apps/visual-timer" | "/profiles" | "/settings";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/arasaac-sv.json" | "/favicon.svg" | "/icons/anger-manager.svg" | "/icons/board-builder.svg" | "/icons/break-check.svg" | "/icons/calm-room.svg" | "/icons/chooser.svg" | "/icons/clock-teacher.svg" | "/icons/clothes-chooser.svg" | "/icons/conversation-aid.svg" | "/icons/cooking-helper.svg" | "/icons/counting.svg" | "/icons/day-planner.svg" | "/icons/diary.svg" | "/icons/emotion-map.svg" | "/icons/energy-meter.svg" | "/icons/focus-buddy.svg" | "/icons/hero.svg" | "/icons/letter-journey.svg" | "/icons/math-aid.svg" | "/icons/memory-game.svg" | "/icons/money-check.svg" | "/icons/my-schedule.svg" | "/icons/pecs-board.svg" | "/icons/pecs-trainer.svg" | "/icons/phrase-builder.svg" | "/icons/picture-dictionary.svg" | "/icons/picture-schedule.svg" | "/icons/point-talk.svg" | "/icons/practice-board.svg" | "/icons/reward-chart.svg" | "/icons/routine-buddy.svg" | "/icons/school-day.svg" | "/icons/sentence-builder.svg" | "/icons/sign-dictionary.svg" | "/icons/situation-cards.svg" | "/icons/social-stories.svg" | "/icons/sound-library.svg" | "/icons/step-guide.svg" | "/icons/talk-board.svg" | "/icons/talking-mat.svg" | "/icons/time-tracker.svg" | "/icons/visual-support.svg" | "/icons/visual-timer.svg" | "/icons/word-builder.svg" | "/manifest.json" | "/robots.txt" | string & {};
	}
}