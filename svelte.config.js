import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		prerender: {
			handleHttpError: ({ error, event }) => {
				// Ignore 404 errors for favicon and other assets during prerender
				if (error.status === 404 && (event.url.pathname.includes('favicon') || event.url.pathname.includes('.png') || event.url.pathname.includes('.ico'))) {
					return {
						status: 200,
						body: ''
					};
				}
				throw error;
			}
		}
	}
};

export default config;

