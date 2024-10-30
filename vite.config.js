import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@datatables-css': fileURLToPath(new URL('./node_modules/datatables.net-dt/css', import.meta.url)),
      '@datatables-buttons-css': fileURLToPath(new URL('./node_modules/datatables.net-buttons-dt/css', import.meta.url)),
      '@datatables-responsive-css': fileURLToPath(new URL('./node_modules/datatables.net-responsive-dt/css', import.meta.url))
    }
  }
});
