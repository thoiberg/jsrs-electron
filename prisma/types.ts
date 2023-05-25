import type { Prisma } from '@prisma/client'

export type CardWithEverything = Prisma.CardGetPayload<{
  include: {
    englishCardSide: {
      include: {
        englishAnswers: true
      }
    }
    japaneseCardSide: {
      include: {
        japaneseAnswers: true
      }
    }
  }
}>

export default {}
