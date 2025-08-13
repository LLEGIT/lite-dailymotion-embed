import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LiteDailymotionEmbed',
      fileName: 'lite-dailymotion-embed.umd',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        dir: 'dist/umd',
        globals: {}
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
