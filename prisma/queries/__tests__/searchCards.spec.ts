import { describe, expect, it, beforeEach } from 'vitest'

import searchCards, { includeAllCardRelationships } from '../searchCards'
import { prisma } from '../../prisma'
import resetDatabase from 'utils/testHelpers/resetDatabase'
import { CardStatus } from 'prisma/card'

describe('searchCards', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when a query is supplied', () => {
    it('searches for the card that matches the query', async () => {
      const card = await createCard('cat', 'ねこ', '猫')

      const cards = await searchCards({ query: 'cat' })

      expect(cards).toEqual([card])
    })

    describe('and the card is marked as deleted', () => {
      it('does not include the card', async () => {
        const catCard = await createCard('cat', 'ねこ', '猫')
        await createCard('car', 'くるま', '車', CardStatus.DELETED)

        const cards = await searchCards({ query: 'ca' })

        expect(cards).toHaveLength(1)
        expect(cards).toEqual([catCard])
      })
    })
  })

  describe('when a query is not supplied', () => {
    it('returns all active cards', async () => {
      const catCard = await createCard('cat', 'ねこ', '猫')
      await createCard('car', 'くるま', '車', CardStatus.DELETED)
      const dogCard = await createCard('dog', 'いぬ', '犬')
      const cards = await searchCards()

      expect(cards).toHaveLength(2)
      expect(cards).toEqual([catCard, dogCard])
    })
  })
})

async function createCard(english: string, kana?: string, kanji?: string, status?: CardStatus) {
  return await prisma.card.create({
    data: {
      status: status || CardStatus.ACTIVE,
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
