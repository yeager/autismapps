import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const dev = process.env.NODE_ENV !== 'production';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),
		paths: {
			base: dev || process.env.TAURI_ENV_PLATFORM ? '' : (process.env.BASE_PATH || '/autismapps')
		}
	}
};

export default config;
