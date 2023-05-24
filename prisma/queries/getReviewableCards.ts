import { prisma } from '../prisma'
import type { Card } from '@prisma/client'

export default async function getReviewableCards(): Promise<Card[]> {
  const now = new Date()

  return await prisma.card.findMany({
    where: {
      OR: [
        {
          englishCardSide: {
            nextReviewAt: {
              lte: now,
            },
          },
        },
        {
          japaneseCardSide: {
            nextReviewAt: {
              lte: now,
            },
          },
        },
      ],
    },
  })
}
