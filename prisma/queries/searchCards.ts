import { prisma } from '../prisma'
import type { SearchCardsRequest } from 'electron/types'
import type { Prisma } from '@prisma/client'
import { CardStatus } from '../card'

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

export const includeAllCardRelationships = {
  englishCardSide: {
    include: {
      englishAnswers: true,
    },
  },
  japaneseCardSide: {
    include: {
      japaneseAnswers: true,
    },
  },
}

export default async function searchCards(
  params?: SearchCardsRequest,
): Promise<CardWithEverything[]> {
  if (params?.query) {
    return await prisma.card.findMany({
      where: {
        status: CardStatus.ACTIVE,
        OR: [
          {
            japaneseCardSide: {
              japaneseAnswers: {
                some: {
                  kana: {
                    contains: params?.query,
                  },
                },
              },
            },
          },
          {
            japaneseCardSide: {
              japaneseAnswers: {
                some: {
                  kanji: {
                    contains: params?.query,
                  },
                },
              },
            },
          },
          {
            englishCardSide: {
              englishAnswers: {
                some: {
                  answer: {
                    contains: params?.query,
                  },
                },
              },
            },
          },
        ],
      },
      include: includeAllCardRelationships,
    })
  } else {
    return await prisma.card.findMany({
      where: {
        status: CardStatus.ACTIVE,
      },
      include: includeAllCardRelationships,
    })
  }
}
