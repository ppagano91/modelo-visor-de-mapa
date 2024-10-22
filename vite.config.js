import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./source/styles/styles.scss";`,
      },
    },
  },
  server: {
    proxy: {
      '/geoserver': {
        target: 'https://geoserver.buenosaires.gob.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, '')
      }
    }
  },
  build: {
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  }
});
