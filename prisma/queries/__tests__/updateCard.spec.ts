import { describe, it, expect, beforeEach } from 'vitest'
import updateCard from '../updateCard'
import type { Event } from 'electron'
import { prisma } from 'prisma/prisma'
import resetDatabase from 'utils/testHelpers/resetDatabase'
import { includeAllCardRelationships } from '../searchCards'

describe('updateCard', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when japaneseAnswers are supplied', () => {
    describe('and the answer exists', () => {
      it('updates the existing answer', async () => {
        const card = await createCard('dog', 'イヌ', '犬')
        const japaneseAnswerId = card.japaneseCardSide?.japaneseAnswers[0].id!

        const params = {
          cardId: card.id,
          japaneseAnswers: [{ japaneseAnswerId, kana: 'いぬ' }],
        }

        const updatedCard = await updateCard(params)

        expect(updatedCard).toBeDefined()

        const changedAnswer = await prisma.japaneseAnswer.findMany({
          where: {
            id: japaneseAnswerId,
          },
        })

        expect(changedAnswer.length).toEqual(1)
        expect(changedAnswer[0].kana).toEqual('いぬ')
      })
    })

    describe("and the answer doesn't exist", () => {
      it('creates a new answer', async () => {
        const card = await createCard('dog', 'イヌ', '犬')
        const japaneseCardSideId = card.japaneseCardSide!.id

        const params = {
          cardId: card.id,
          japaneseAnswers: [{ japaneseCardSideId, kana: 'ポチ' }],
        }
        const updatedCard = await updateCard(params)
        expect(updatedCard).toBeDefined()

        const answers = await prisma.japaneseAnswer.findMany({
          where: {
            japaneseCardSideId,
          },
        })

        expect(answers.length).toEqual(2)
        expect(answers[1].kana).toEqual('ポチ')
      })
    })
  })

  describe('when englishAnswers are supplied', () => {
    describe('and the answer exists', () => {
      it('updates the answer', async () => {
        const card = await createCard('dog', 'イヌ', '犬')
        const englishAnswerId = card.englishCardSide?.englishAnswers[0].id!

        const params = {
          cardId: card.id,
          englishAnswers: [{ englishAnswerId, answer: 'pupper' }],
        }

        const updatedCard = await updateCard(params)

        expect(updatedCard).toBeDefined()

        const changedAnswer = await prisma.englishAnswer.findMany({
          where: {
            id: englishAnswerId,
          },
        })

        expect(changedAnswer.length).toEqual(1)
        expect(changedAnswer[0].answer).toEqual('pupper')
      })
    })

    describe("and the answer doesn't exist", () => {
      it('create a new answer', async () => {
        const card = await createCard('dog', 'イヌ', '犬')
        const englishCardSideId = card.englishCardSide!.id

        const params = {
          cardId: card.id,
          englishAnswers: [{ englishCardSideId, answer: 'pupper' }],
        }
        const updatedCard = await updateCard(params)
        expect(updatedCard).toBeDefined()

        const answers = await prisma.englishAnswer.findMany({
          where: {
            englishCardSideId,
          },
        })

        expect(answers.length).toEqual(2)
        expect(answers[1].answer).toEqual('pupper')
      })
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
