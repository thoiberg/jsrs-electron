import { prisma } from '../prisma'
import type { CreateCardRequest } from '../../electron/types'
import type { Card } from '@prisma/client'

export default async function createCard({
  english,
  kana,
  kanji,
}: CreateCardRequest): Promise<Card> {
  return await prisma.card.create({
    data: {
      japaneseCardSide: {
        create: {
          japaneseAnswers: {
            create: {
              kana,
              kanji,
            },
          },
        },
      },
      englishCardSide: {
        create: {
          englishAnswers: {
            create: {
              answer: english,
            },
          },
        },
      },
    },
  })
}
