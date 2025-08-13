import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LiteDailymotionEmbed',
      fileName: 'lite-dailymotion-embed.esm',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        dir: 'dist/esm'
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
