import { describe, expect, it, vi } from 'vitest'
import createCard from '../createCard'
import type { Event } from 'electron'
import type { RPCErrorResponse, RPCSuccessResponse } from 'electron/types'
import type { Card } from '@prisma/client'
import { prisma as mockPrisma } from '../../__mocks__/prisma'

vi.mock('../../prisma.ts')

describe('createCardQuery', () => {
  describe('when the request succeeds', async () => {
    it('returns the card', async () => {
      const card = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockPrisma.card.create.mockResolvedValue(card)

      const response = await createCard({} as Event, {
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫'
      })
      const data = (response as RPCSuccessResponse).data

      expect((data as Card).id).toEqual('1')
    })
  })

  describe('when the request fails', async () => {
    describe('with an error object', async () => {
      it('returns as error', async () => {
        const returnedError = new Error('oh no')

        mockPrisma.card.create.mockImplementation(() => {
          throw returnedError
        })

        const response = await createCard({} as Event, {
          english: 'cat',
          kana: 'ねこ',
          kanji: '猫'
        })

        const error = (response as RPCErrorResponse).error

        expect(error).toEqual(returnedError)
      })
    })
  })
})
