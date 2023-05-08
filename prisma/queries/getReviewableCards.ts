import type { RPCResponse } from 'electron/types'
import { prisma } from '../prisma'
import errorProcessing from './utils/errorProcessing'

export default async function getReviewableCards(): Promise<RPCResponse> {
  try {
    const now = new Date()

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
