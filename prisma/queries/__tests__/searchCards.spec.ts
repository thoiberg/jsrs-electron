import { describe, expect, it, vi } from 'vitest'

import searchCards from '../searchCards'
import { prisma as mockPrisma } from '../../__mocks__/prisma'
import type { Card } from '@prisma/client'

vi.mock('../../prisma.ts')

describe('searchCards', () => {
  describe('when a query is supplied', () => {
    it('searches for the card that matches the query', async () => {
      const card: Card = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockPrisma.card.findMany.mockResolvedValue([card])

      const response = await searchCards({} as Event, { query: 'cat' })

      expect(mockPrisma.card.findMany).toBeCalledWith({
        where: {
          OR: [
            {
              japaneseCardSide: {
                japaneseAnswers: {
                  some: {
                    kana: {
                      contains: 'cat'
                    }
                  }
                }
              }
            },
            {
              japaneseCardSide: {
                japaneseAnswers: {
                  some: {
                    kanji: {
                      contains: 'cat'
                    }
                  }
                }
              }
            },
            {
              englishCardSide: {
                englishAnswers: {
                  some: {
                    answer: {
                      contains: 'cat'
                    }
                  }
                }
              }
            }
          ]
        },
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

      expect(response).toEqual({ data: [card] })
    })
  })

  describe('when a query is not supplied', () => {
    it('returns all cards', async () => {
      await searchCards({} as Event)

      expect(mockPrisma.card.findMany).toBeCalledWith({
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
    })
  })

  describe('when the request fails', () => {
    it('returns the error', async () => {
      const returnedError = new Error('oh no')
      mockPrisma.card.findMany.mockImplementation(() => {
        throw returnedError
      })

      const response = await searchCards({} as Event)

      expect(response).toEqual({ error: returnedError })
    })
  })
})
