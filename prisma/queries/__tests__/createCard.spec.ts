import { beforeEach, describe, expect, it, vi } from 'vitest'
import createCard from '../createCard'
import type { Event } from 'electron'
import { prisma } from '../../prisma'
import { includeAllCardRelationships } from '../searchCards'
import resetDatabase from 'utils/testHelpers/resetDatabase'

describe('createCardQuery', () => {
  describe('when the request succeeds', async () => {
    beforeEach(async () => {
      await resetDatabase()
    })

    it('returns the card', async () => {
      const response = await createCard({} as Event, {
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫',
      })

      expect(response.data).toBeDefined()

      const cardFromDb = await prisma.card.findUnique({
        where: { id: response.data!.id },
        include: includeAllCardRelationships,
      })

      expect(cardFromDb?.englishCardSide?.englishAnswers[0].answer).toEqual('cat')
      expect(cardFromDb?.japaneseCardSide?.japaneseAnswers[0].kana).toEqual('ねこ')
      expect(cardFromDb?.japaneseCardSide?.japaneseAnswers[0].kanji).toEqual('猫')
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      vi.doMock('../../prisma.ts')
      vi.resetModules()
    })

    it('returns as error', async () => {
      const { prisma: mockPrisma } = await import('../../__mocks__/prisma')
      const { default: mockedCreateCard } = await import('../createCard')

      const returnedError = new Error('oh no')

      mockPrisma.card.create.mockImplementation(() => {
        throw returnedError
      })

      const response = await mockedCreateCard({} as Event, {
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫',
      })

      expect(response).toEqual({ error: returnedError })
    })
  })
})
