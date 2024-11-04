import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// see https://stackoverflow.com/questions/74763160/how-to-make-vite-ignore-docs-blocks
const vueDocsPlugin = {
  name: 'vue-docs',
  transform(_code, id) {
    if (!/vue&type=docs/.test(id)) return
    return `export default ''`
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/jse-eval-vue/',
  plugins: [
    vue(), vueDocsPlugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // see https://github.com/twbs/bootstrap/issues/40962
  // TODO: check that this issue is resolved in bootstrap 5.4 when its released
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'legacy-js-api']
      },
    }
  }
})
