import { describe, expect, it, vi, beforeEach } from 'vitest'
import getReviewableCards from '../getReviewableCards'
import { prisma } from 'prisma/prisma'
import { add, sub } from 'date-fns'
import resetDatabase from 'utils/testHelpers/resetDatabase'

describe('getReviewableCards', () => {
  describe('when the request succeeds', () => {
    beforeEach(async () => {
      await resetDatabase()
    })

    describe('and there is an english card side that should be reviewed', () => {
      it('returns the card', async () => {
        const past = sub(new Date(), { weeks: 1 })
        const future = add(new Date(), { weeks: 1 })
        const catCard = await createCard('cat', 'ねこ', '猫', past, future)

        const response = await getReviewableCards()

        expect(response.data).toBeDefined()
        expect(response.data!.length).toEqual(1)
        expect(response.data![0].id).toEqual(catCard.id)
      })
    })

    describe('and there is a japanese card side that should be reviewed', () => {
      it('returns the card', async () => {
        const past = sub(new Date(), { weeks: 1 })
        const future = add(new Date(), { weeks: 1 })
        const catCard = await createCard('cat', 'ねこ', '猫', future, past)

        const response = await getReviewableCards()

        expect(response.data).toBeDefined()
        expect(response.data!.length).toEqual(1)
        expect(response.data![0].id).toEqual(catCard.id)
      })
    })

    describe('and both sides should be reviewed', () => {
      it('only returns one card', async () => {
        const past = sub(new Date(), { weeks: 1 })
        await createCard('cat', 'ねこ', '猫', past, past)

        const response = await getReviewableCards()

        expect(response.data).toBeDefined()
        expect(response.data!.length).toEqual(1)
      })
    })

    describe('and no cards should be reviewed', () => {
      it('returns nothing', async () => {
        const future = add(new Date(), { weeks: 1 })
        await createCard('cat', 'ねこ', '猫', future, future)

        const response = await getReviewableCards()

        expect(response.data).toBeDefined()
        expect(response.data!.length).toEqual(0)
      })
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      vi.doMock('../../prisma.ts')
      vi.resetModules()
    })
    describe('with an error object', () => {
      it('returns as error', async () => {
        const { prisma: mockPrisma } = await import('../../__mocks__/prisma')
        const { default: mockedGetReviewableCards } = await import('../getReviewableCards')

        const returnedError = new Error('oh no')

        mockPrisma.card.findMany.mockImplementation(() => {
          throw returnedError
        })

        const response = await mockedGetReviewableCards()

        expect(response.error).toEqual(returnedError)
      })
    })
  })
})

async function createCard(
  english: string,
  kana: string,
  kanji: string,
  englishNextReviewAt: Date,
  japaneseNextReviewAt: Date,
) {
  return await prisma.card.create({
    data: {
      englishCardSide: {
        create: {
          nextReviewAt: englishNextReviewAt,
          englishAnswers: {
            create: {
              answer: english,
            },
          },
        },
      },
      japaneseCardSide: {
        create: {
          nextReviewAt: japaneseNextReviewAt,
          japaneseAnswers: {
            create: {
              kana,
              kanji,
            },
          },
        },
      },
    },
  })
}
