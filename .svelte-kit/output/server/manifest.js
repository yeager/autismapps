export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["arasaac-sv.json","favicon.svg","icons/anger-manager.svg","icons/board-builder.svg","icons/break-check.svg","icons/calm-room.svg","icons/chooser.svg","icons/clock-teacher.svg","icons/clothes-chooser.svg","icons/conversation-aid.svg","icons/cooking-helper.svg","icons/counting.svg","icons/day-planner.svg","icons/diary.svg","icons/emotion-map.svg","icons/energy-meter.svg","icons/focus-buddy.svg","icons/hero.svg","icons/letter-journey.svg","icons/math-aid.svg","icons/memory-game.svg","icons/money-check.svg","icons/my-schedule.svg","icons/pecs-board.svg","icons/pecs-trainer.svg","icons/phrase-builder.svg","icons/picture-dictionary.svg","icons/picture-schedule.svg","icons/point-talk.svg","icons/practice-board.svg","icons/reward-chart.svg","icons/routine-buddy.svg","icons/school-day.svg","icons/sentence-builder.svg","icons/sign-dictionary.svg","icons/situation-cards.svg","icons/social-stories.svg","icons/sound-library.svg","icons/step-guide.svg","icons/talk-board.svg","icons/talking-mat.svg","icons/time-tracker.svg","icons/visual-support.svg","icons/visual-timer.svg","icons/word-builder.svg","manifest.json","robots.txt","service-worker.js"]),
	mimeTypes: {".json":"application/json",".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.B0a7WbbY.js",app:"_app/immutable/entry/app.Cv9QXkiP.js",imports:["_app/immutable/entry/start.B0a7WbbY.js","_app/immutable/chunks/BAFRKenw.js","_app/immutable/chunks/Bu7XKhG-.js","_app/immutable/chunks/CX6mkEWP.js","_app/immutable/entry/app.Cv9QXkiP.js","_app/immutable/chunks/Cvp8QKtV.js","_app/immutable/chunks/Bu7XKhG-.js","_app/immutable/chunks/5jrULABA.js","_app/immutable/chunks/CX6mkEWP.js","_app/immutable/chunks/64S6HLbC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/apps/board-builder",
				pattern: /^\/apps\/board-builder\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/apps/break-check",
				pattern: /^\/apps\/break-check\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/apps/calm-room",
				pattern: /^\/apps\/calm-room\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/apps/chooser",
				pattern: /^\/apps\/chooser\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/apps/clock-teacher",
				pattern: /^\/apps\/clock-teacher\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/apps/clothes-chooser",
				pattern: /^\/apps\/clothes-chooser\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/apps/cooking-helper",
				pattern: /^\/apps\/cooking-helper\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/apps/counting",
				pattern: /^\/apps\/counting\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/apps/diary",
				pattern: /^\/apps\/diary\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/apps/emotion-map",
				pattern: /^\/apps\/emotion-map\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/apps/energy-meter",
				pattern: /^\/apps\/energy-meter\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/apps/focus-buddy",
				pattern: /^\/apps\/focus-buddy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/apps/letter-journey",
				pattern: /^\/apps\/letter-journey\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/apps/money-check",
				pattern: /^\/apps\/money-check\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/apps/pecs-trainer",
				pattern: /^\/apps\/pecs-trainer\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/apps/phrase-builder",
				pattern: /^\/apps\/phrase-builder\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/apps/picture-dictionary",
				pattern: /^\/apps\/picture-dictionary\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/apps/picture-schedule",
				pattern: /^\/apps\/picture-schedule\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/apps/point-talk",
				pattern: /^\/apps\/point-talk\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/apps/practice-board",
				pattern: /^\/apps\/practice-board\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/apps/sign-dictionary",
				pattern: /^\/apps\/sign-dictionary\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/apps/situation-cards",
				pattern: /^\/apps\/situation-cards\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/apps/step-guide",
				pattern: /^\/apps\/step-guide\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/apps/talk-board",
				pattern: /^\/apps\/talk-board\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/apps/talking-mat",
				pattern: /^\/apps\/talking-mat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/apps/visual-support",
				pattern: /^\/apps\/visual-support\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/apps/visual-timer",
				pattern: /^\/apps\/visual-timer\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/profiles",
				pattern: /^\/profiles\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 31 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
