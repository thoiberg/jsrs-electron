import { beforeEach, describe, expect, it } from 'vitest'
import createCard from '../createCard'
import { prisma } from '../../prisma'
import { includeAllCardRelationships } from '../searchCards'
import resetDatabase from 'utils/testHelpers/resetDatabase'

describe('createCardQuery', () => {
  describe('when the request succeeds', async () => {
    beforeEach(async () => {
      await resetDatabase()
    })

    it('returns the card', async () => {
      const response = await createCard({
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫',
      })

      expect(response).toBeDefined()

      const cardFromDb = await prisma.card.findUnique({
        where: { id: response.id },
        include: includeAllCardRelationships,
      })

      expect(cardFromDb?.englishCardSide?.englishAnswers[0].answer).toEqual('cat')
      expect(cardFromDb?.japaneseCardSide?.japaneseAnswers[0].kana).toEqual('ねこ')
      expect(cardFromDb?.japaneseCardSide?.japaneseAnswers[0].kanji).toEqual('猫')
    })
  })
})
