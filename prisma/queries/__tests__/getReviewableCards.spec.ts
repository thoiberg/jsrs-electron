import { describe, expect, it, vi } from 'vitest'
import type { RPCErrorResponse, RPCSuccessResponse } from 'electron/types'
import type { Card } from '@prisma/client'
import { prisma as mockPrisma } from '../../__mocks__/prisma'
import getReviewableCards from '../getReviewableCards'

vi.mock('../../prisma.ts')

describe('getReviewableCards', () => {
  describe('when the request succeeds', () => {
    it('returns all reviewable cards', async () => {
      const card = {
        id: '1',
        createdAt: new Date('2023-05-10'),
        updatedAt: new Date('2023-05-10')
      }

      mockPrisma.card.findMany.mockResolvedValue([card])

      const response = await getReviewableCards()
      const data = (response as RPCSuccessResponse).data

      expect((data as Card[]).length).toEqual(1)
      expect((data as Card[])[0].id).toEqual('1')
    })
  })

  describe('when the request fails', () => {
    describe('with an error object', () => {
      it('returns as error', async () => {
        const returnedError = new Error('oh no')

        mockPrisma.card.findMany.mockImplementation(() => {
          throw returnedError
        })

        const response = await getReviewableCards()

        const error = (response as RPCErrorResponse).error

        expect(error).toEqual(returnedError)
      })
    })
  })
})
