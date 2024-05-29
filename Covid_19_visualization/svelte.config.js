import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
			strict: false
		}),
		prerender: {
			entries: ['*'] // Add dynamic routes here
		},
		paths: {
			base: '',
			assets: ''
		}
	},
	preprocess: preprocess()
};

export default config;
