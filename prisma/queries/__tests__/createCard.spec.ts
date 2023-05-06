import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../prisma'
import createCard from '../createCard'
import type { Event } from 'electron'
import type { RPCErrorResponse, RPCSuccessResponse } from 'electron/types'
import type { Card } from '@prisma/client'

describe('createCardQuery', () => {
  beforeEach(async () => {
    // truncate all the data in the db
    // const tableNames: { name: string }[] = await prisma.$queryRaw<{ name: string }>`
    //   SELECT name
    //   FROM sqlite_schema
    //   WHERE
    //   type ='table'
    //   AND name NOT LIKE 'sqlite_%'
    //   AND name NOT LIKE '_prisma%'
    //   ;`

    // TODO: find a more automated solution to a db wide clean
    await prisma.$executeRawUnsafe('DELETE FROM EnglishAnswer;')
    await prisma.$executeRawUnsafe('DELETE FROM JapaneseAnswer;')
    await prisma.$executeRawUnsafe('DELETE FROM JapaneseCardSide;')
    await prisma.$executeRawUnsafe('DELETE FROM EnglishCardSide;')
    await prisma.$executeRawUnsafe('DELETE FROM Card;')
  })

  it('creates a card in the db', async () => {
    await createCard({} as Event, { english: 'cat', kana: 'ねこ', kanji: '猫' })

    const cards = await prisma.card.findMany({
      include: {
        englishCardSide: {
          include: {
            englishAnswers: true
          }
        },
        japaneseCardSide: {
          include: {
            japaneseAnswers: true
          }
        }
      }
    })

    expect(cards.length).toEqual(1)
    const card = cards[0]

    expect(card.englishCardSide.englishAnswers.length).toEqual(1)
    expect(card.englishCardSide.englishAnswers[0].answer).toEqual('cat')

    expect(card.japaneseCardSide.japaneseAnswers.length).toEqual(1)
    expect(card.japaneseCardSide.japaneseAnswers[0].kana).toEqual('ねこ')
    expect(card.japaneseCardSide.japaneseAnswers[0].kanji).toEqual('猫')
  })

  describe('when the request succeeds', () => {
    it('returns the card', async () => {
      const response = await createCard({} as Event, {
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫'
      })
      const data = (response as RPCSuccessResponse).data
      const cards = await prisma.card.findMany()

      expect((data as Card).id).toEqual(cards[0].id)
    })
  })

  describe('when the request fails', () => {
    it('returns as error', async () => {
      const response = await createCard({} as Event, {
        english: undefined,
        kana: 'ねこ',
        kanji: '猫'
      })

      const error = (response as RPCErrorResponse).error

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain(
        'Argument answer for data.englishCardSide.create.englishAnswers.create.answer is missing.'
      )
    })
  })
})