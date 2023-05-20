import { describe, expect, it, beforeEach, vi } from 'vitest'

import searchCards, { includeAllCardRelationships } from '../searchCards'
import { prisma } from '../../prisma'

describe('searchCards', () => {
  beforeEach(async () => {
    await prisma.$executeRawUnsafe('DELETE FROM EnglishAnswer;')
    await prisma.$executeRawUnsafe('DELETE FROM JapaneseAnswer;')
    await prisma.$executeRawUnsafe('DELETE FROM JapaneseCardSide;')
    await prisma.$executeRawUnsafe('DELETE FROM EnglishCardSide;')
    await prisma.$executeRawUnsafe('DELETE FROM Card;')
  })

  describe('when a query is supplied', () => {
    it('searches for the card that matches the query', async () => {
      const card = await createCard('cat', 'ねこ', '猫')

      const response = await searchCards({} as Event, { query: 'cat' })

      expect(response).toEqual({ data: [card] })
    })
  })

  describe('when a query is not supplied', () => {
    it('returns all cards', async () => {
      const catCard = await createCard('cat', 'ねこ', '猫')
      const dogCard = await createCard('dog', 'いぬ', '犬')
      const response = await searchCards({} as Event)

      expect(response).toEqual({ data: [catCard, dogCard] })
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      vi.doMock('../../prisma.ts')
      vi.resetModules()
    })

    it('returns the error', async () => {
      const { prisma: mockPrisma } = await import('../../__mocks__/prisma')
      const { default: mockedSearchCards } = await import('../searchCards')

      const returnedError = new Error('oh no')
      mockPrisma.card.findMany.mockImplementation(() => {
        throw returnedError
      })

      const response = await mockedSearchCards({} as Event)

      expect(response).toEqual({ error: returnedError })
    })
  })
})

async function createCard(english: string, kana?: string, kanji?: string) {
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
    include: includeAllCardRelationships,
  })
}
