import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { resolve } from 'path';

// (optionel) Ce plugin permet de lancer un refresh de la page lors de la modification d'un fichier twig
const twigRefreshPlugin = {
  name: 'twig-refresh',
  configureServer({ watcher, ws }) {
    watcher.add(resolve('./../templates/**/*.twig'));
    watcher.on('change', function (path) {
      if (path.endsWith('.twig')) {
        ws.send({
          type: 'full-reload',
        });
      }
    });
  },
};
// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [twigRefreshPlugin],
  root: './',
  base: './',
  server: {
    watch: {
      disableGlobbing: false // nécessaire pour le plugin twig
    }
  },
  build: {
    assetsDir: './',
    outDir: command === 'serve' ? './' : './build',
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        manualChunks: undefined, // On ne veut pas créer un fichier vendors, car on n'a ici qu'un point d'entré
      },
      input: {
        main: 'main.js',
      },
    },
  },
}))
