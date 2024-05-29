import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Covid-visualization/', // Set the base path for GitHub Pages deployment
  plugins: [svelte()],
});
