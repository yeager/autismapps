import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/apps/board-builder" | "/apps/break-check" | "/apps/calm-room" | "/apps/chooser" | "/apps/clock-teacher" | "/apps/clothes-chooser" | "/apps/cooking-helper" | "/apps/counting" | "/apps/diary" | "/apps/emotion-map" | "/apps/energy-meter" | "/apps/focus-buddy" | "/apps/letter-journey" | "/apps/money-check" | "/apps/pecs-trainer" | "/apps/phrase-builder" | "/apps/picture-dictionary" | "/apps/picture-schedule" | "/apps/point-talk" | "/apps/practice-board" | "/apps/sign-dictionary" | "/apps/situation-cards" | "/apps/step-guide" | "/apps/talk-board" | "/apps/talking-mat" | "/apps/visual-support" | "/apps/visual-timer" | "/profiles" | "/settings" | null
type LayoutParams = RouteParams & {  }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type PageProps = { params: RouteParams; data: PageData }
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }