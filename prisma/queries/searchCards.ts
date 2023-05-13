import type { Event } from 'electron'
import { prisma } from '../prisma'
import type { RPCResponse, SearchCardsRequest } from 'electron/types'
import errorProcessing from './utils/errorProcessing'
import type { Card } from '@prisma/client'

export default async function searchCards(
  event: Event,
  { query }: SearchCardsRequest
): Promise<RPCResponse<Card[]>> {
  try {
    if (query) {
      // search for the string
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
        }
      })

      // TODO: investigate and remove dupes if necessary

      return { data }
    } else {
      const data = await prisma.card.findMany()

      return { data }
    }
  } catch (e) {
    return errorProcessing(e)
  }
}
