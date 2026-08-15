import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

/* يبني كل شي (JS + CSS + الصور) داخل ملف HTML واحد يشتغل بالنقر المزدوج
   من file:// بدون خادم. الناتج: dist-single/index.html */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist-single',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
