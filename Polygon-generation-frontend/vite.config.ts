import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to the Node backend during development so the
    // browser never has to deal with CORS on localhost.
    proxy: {
      '/api': {
        target:      'http://localhost:8021',
        changeOrigin: true,
      },
    },
  },
});
