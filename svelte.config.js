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
			base: dev || process.env.TAURI_ENV_PLATFORM ? '' : ('BASE_PATH' in process.env ? process.env.BASE_PATH : '/autismapps')
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore board-builder which is referenced but not yet implemented
				if (path.includes('board-builder')) return;
				console.warn(`Prerender warning: ${message}`);
			}
		}
	}
};

export default config;
