import { defineConfig } from 'astro/config';
// SITE_URL: dominio final. Em previas, o padrao abaixo so afeta canonical/OG/sitemap.
export default defineConfig({
  site: process.env.SITE_URL || 'https://integrasolucoesinteligentes.com',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
