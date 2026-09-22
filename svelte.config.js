import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // emits .svelte-kit/cloudflare-workers/
      // with index.js and an assets/ directory
    }),
  },
};
