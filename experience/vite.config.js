import { defineConfig } from 'vite';
export default defineConfig({
  // Relative URLs allow both project-scoped GitHub Pages and root-level static hosting.
  base: './',
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: { target: 'es2022', rollupOptions: { output: { manualChunks: { 'three-core': ['three'], 'react': ['react', 'react-dom'] } } } },
});
