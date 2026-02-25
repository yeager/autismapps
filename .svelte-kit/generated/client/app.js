export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/apps/board-builder": [3],
		"/apps/break-check": [4],
		"/apps/calm-room": [5],
		"/apps/chooser": [6],
		"/apps/clock-teacher": [7],
		"/apps/clothes-chooser": [8],
		"/apps/cooking-helper": [9],
		"/apps/counting": [10],
		"/apps/diary": [11],
		"/apps/emotion-map": [12],
		"/apps/energy-meter": [13],
		"/apps/focus-buddy": [14],
		"/apps/letter-journey": [15],
		"/apps/money-check": [16],
		"/apps/pecs-trainer": [17],
		"/apps/phrase-builder": [18],
		"/apps/picture-dictionary": [19],
		"/apps/picture-schedule": [20],
		"/apps/point-talk": [21],
		"/apps/practice-board": [22],
		"/apps/sign-dictionary": [23],
		"/apps/situation-cards": [24],
		"/apps/step-guide": [25],
		"/apps/talk-board": [26],
		"/apps/talking-mat": [27],
		"/apps/visual-support": [28],
		"/apps/visual-timer": [29],
		"/profiles": [30],
		"/settings": [31]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';