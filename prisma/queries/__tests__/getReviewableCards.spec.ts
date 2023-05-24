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

        const cards = await getReviewableCards()

        expect(cards.length).toEqual(1)
        expect(cards[0].id).toEqual(catCard.id)
      })
    })

    describe('and there is a japanese card side that should be reviewed', () => {
      it('returns the card', async () => {
        const past = sub(new Date(), { weeks: 1 })
        const future = add(new Date(), { weeks: 1 })
        const catCard = await createCard('cat', 'ねこ', '猫', future, past)

        const cards = await getReviewableCards()

        expect(cards.length).toEqual(1)
        expect(cards[0].id).toEqual(catCard.id)
      })
    })

    describe('and both sides should be reviewed', () => {
      it('only returns one card', async () => {
        const past = sub(new Date(), { weeks: 1 })
        await createCard('cat', 'ねこ', '猫', past, past)

        const cards = await getReviewableCards()

        expect(cards.length).toEqual(1)
      })
    })

    describe('and no cards should be reviewed', () => {
      it('returns nothing', async () => {
        const future = add(new Date(), { weeks: 1 })
        await createCard('cat', 'ねこ', '猫', future, future)

        const cards = await getReviewableCards()

        expect(cards.length).toEqual(0)
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
