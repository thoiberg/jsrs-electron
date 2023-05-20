import type { Event } from 'electron'
import { prisma } from '../prisma'
import type { RPCResponse, SearchCardsRequest } from 'electron/types'
import errorProcessing from './utils/errorProcessing'
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
  event: Event,
  params?: SearchCardsRequest,
): Promise<RPCResponse<CardWithEverything[]>> {
  try {
    if (params?.query) {
      const data = await prisma.card.findMany({
        where: {
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

      // TODO: investigate and remove dupes if necessary

      return { data }
    } else {
      const data = await prisma.card.findMany({
        include: includeAllCardRelationships,
      })

      return { data }
    }
  } catch (e) {
    return errorProcessing(e)
  }
}
