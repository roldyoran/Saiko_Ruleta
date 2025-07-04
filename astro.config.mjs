import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import vue from '@astrojs/vue';


// console.log('Estamos en modo de desarrollo');

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});