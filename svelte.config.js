import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const dev = process.env.NODE_ENV !== 'production';
const outputDirectory = process.env.BUILD_OUTPUT_DIR || 'build';

const config = {
	kit: {
		version: {
			// Keep production builds reproducible; override this when a cache reset is needed.
			name: process.env.SVELTEKIT_APP_VERSION || process.env.npm_package_version || '0.3.0'
		},
		adapter: adapter({
			pages: outputDirectory,
			assets: outputDirectory,
			fallback: 'fallback.html'
		}),
		paths: {
			base: dev || process.env.TAURI_ENV_PLATFORM ? '' : ('BASE_PATH' in process.env ? process.env.BASE_PATH : '/autismapps'),
			relative: false
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
