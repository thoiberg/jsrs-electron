import { describe, it, vi, expect } from 'vitest'
import updateCard from '../updateCard'
import { prisma as mockPrisma } from '../../__mocks__/prisma'
import type { Event } from 'electron'
import cardFactory from 'utils/factories/card'

vi.mock('../../prisma.ts')

describe('updateCard', () => {
  const electronEvent = {} as Event

  describe('when japaneseAnswers are supplied', () => {
    describe('and the answer exists', () => {
      it('updates the existing answer', async () => {
        const params = {
          cardId: '1',
          japaneseAnswers: [{ japaneseAnswerId: '2', kana: 'いぬ' }],
        }
        await updateCard(electronEvent, params)

        expect(mockPrisma.japaneseAnswer.update).toBeCalledWith({
          where: {
            id: '2',
          },
          data: {
            kana: 'いぬ',
            kanji: undefined,
          },
        })
      })
    })

    describe("and the answer doesn't exist", () => {
      it('creates a new answer', async () => {
        const params = {
          cardId: '1',
          japaneseAnswers: [{ japaneseCardSideId: '2', kana: 'いぬ' }],
        }
        await updateCard(electronEvent, params)

        expect(mockPrisma.japaneseAnswer.create).toBeCalledWith({
          data: {
            japaneseCardSideId: '2',
            kana: 'いぬ',
            kanji: undefined,
          },
        })
      })
    })
  })

  describe('when englishAnswers are supplied', () => {
    describe('and the answer exists', () => {
      it('updates the answer', async () => {
        const params = {
          cardId: '1',
          englishAnswers: [{ englishAnswerId: '2', answer: 'dog' }],
        }
        await updateCard(electronEvent, params)

        expect(mockPrisma.englishAnswer.update).toBeCalledWith({
          where: {
            id: '2',
          },
          data: {
            answer: 'dog',
          },
        })
      })
    })

    describe("and the answer doesn't exist", () => {
      it('create a new answer', async () => {
        const params = {
          cardId: '1',
          englishAnswers: [{ englishCardSideId: '2', answer: 'dog' }],
        }
        await updateCard(electronEvent, params)

        expect(mockPrisma.englishAnswer.create).toBeCalledWith({
          data: {
            englishCardSideId: '2',
            answer: 'dog',
          },
        })
      })
    })
  })

  it('returns the card as a RPCResponse object', async () => {
    const params = {
      cardId: '1',
    }
    const card = cardFactory.build()
    mockPrisma.card.findUnique.mockResolvedValue(card)

    const resp = await updateCard(electronEvent, params)

    expect(resp).toEqual({ data: card })
  })
})
