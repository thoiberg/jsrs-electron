import { fileURLToPath } from 'url'

export default {
  resolve: {
    alias: {
      prisma: fileURLToPath(new URL('./prisma', import.meta.url)),
    },
  },
}
