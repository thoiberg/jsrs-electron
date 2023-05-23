import { prisma } from 'prisma/prisma'
import resetDatabase from 'utils/testHelpers/resetDatabase'
import { describe, beforeEach, it, expect } from 'vitest'
import deleteCard from '../deleteCard'
import { includeAllCardRelationships } from '../searchCards'
import { CardStatus } from 'prisma/card'

describe('deleteCard', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it('marks the card as deleted in the DB', async () => {
    const dogCard = await createCard('dog', 'いぬ', '犬')

    const response = await deleteCard({} as Event, dogCard.id)

    expect(response.data).toBeUndefined()

    const updatedCard = await prisma.card.findUnique({ where: { id: dogCard.id } })

    expect(updatedCard?.status).toEqual(CardStatus.DELETED)
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
