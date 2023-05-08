import type { Event } from 'electron'
import type { RPCResponse } from 'electron/types'
import { prisma } from 'prisma/prisma'
import errorProcessing from './utils/errorProcessing'

export default async function getReviewableCards(event: Event): Promise<RPCResponse> {
  try {
    const now = new Date()
    // find all cards where englishCardSide nextReviewAt is le to now
    // OR japaneseCardSide nextReviewAt is le to now
    const cards = await prisma.card.findMany({
      where: {
        OR: [
          {
            englishCardSide: {
              nextReviewAt: {
                lte: now
              }
            }
          },
          {
            japaneseCardSide: {
              nextReviewAt: {
                lte: now
              }
            }
          }
        ]
      }
    })
    return { data: cards }
  } catch (e) {
    return errorProcessing(e)
  }

  // remove dupes?? (not sure if they'll be there or not)
}
