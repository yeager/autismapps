import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const dev = process.env.NODE_ENV !== 'production';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html'
		}),
		paths: {
			base: dev || process.env.TAURI_ENV_PLATFORM ? '' : '/autismapps'
		}
	}
};

export default config;
