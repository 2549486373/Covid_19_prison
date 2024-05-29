import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: 'index.html' // This allows fallback for SPA routing
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/Covid_19_prison' : ''
    }
  }
};

export default config;
