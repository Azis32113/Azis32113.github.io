import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative assets work on both:
  // - https://<user>.github.io/<repo>/
  // - https://<user>.github.io/
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
