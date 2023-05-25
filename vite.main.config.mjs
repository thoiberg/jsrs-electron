import { defineConfig } from 'vite'
import sharedConfig from './vite.shared.config.mjs'

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    ...sharedConfig.resolve,
  },
})
