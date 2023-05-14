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

export default async function searchCards(
  event: Event,
  { query }: SearchCardsRequest
): Promise<RPCResponse<CardWithEverything[]>> {
  const includeRelationshipsConfig = {
    englishCardSide: {
      include: {
        englishAnswers: true
      }
    },
    japaneseCardSide: {
      include: {
        japaneseAnswers: true
      }
    }
  }

  try {
    if (query) {
      const data = await prisma.card.findMany({
        where: {
          OR: [
            {
              japaneseCardSide: {
                japaneseAnswers: {
                  some: {
                    kana: {
                      contains: query
                    }
                  }
                }
              }
            },
            {
              japaneseCardSide: {
                japaneseAnswers: {
                  some: {
                    kanji: {
                      contains: query
                    }
                  }
                }
              }
            },
            {
              englishCardSide: {
                englishAnswers: {
                  some: {
                    answer: {
                      contains: query
                    }
                  }
                }
              }
            }
          ]
        },
        include: includeRelationshipsConfig
      })

      // TODO: investigate and remove dupes if necessary

      return { data }
    } else {
      const data = await prisma.card.findMany({
        include: includeRelationshipsConfig
      })

      return { data }
    }
  } catch (e) {
    return errorProcessing(e)
  }
}
