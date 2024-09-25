import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import mdx from "@astrojs/mdx";



const SERVER_PORT = 4321;
// the url to access your blog during local development
const LOCALHOST_URL = `http://localhost:${SERVER_PORT}`;
// the url to access your blog after deploying it somewhere (Eg. Netlify)
const LIVE_URL = "https://roldyoran.github.io";
// this is the astro command your npm script runs
const SCRIPT = process.env.npm_lifecycle_script || "";
const isBuild = SCRIPT.includes("astro build");
let BASE_URL = LOCALHOST_URL;
let BASE_HREF = '';
// When you're building your site in local or in CI, you could just set your URL manually
// Configuración de redirección
let redirects_list = {};
redirects_list = {
  '/Saiko_Ruleta/galeria': '/galeria',
  '/Saiko_Ruleta/animes_vistos': '/animes_vistos',
  '/Saiko_Ruleta/index': '/',
};
if (isBuild) {
  BASE_URL = LIVE_URL;
  BASE_HREF = 'Saiko_Ruleta';
  redirects_list = {};
}


// console.log('Estamos en modo de desarrollo');

// https://astro.build/config
export default defineConfig({
  server: { port: SERVER_PORT },
  redirects: redirects_list,
  site: BASE_URL,
  base: BASE_HREF,
  // trailingSlash: "never",
  integrations: [tailwind(), react(), mdx()]
});