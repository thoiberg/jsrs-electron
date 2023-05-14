import { prisma } from '../prisma'
import type { CreateCardRequest, RPCResponse } from '../../electron/types'
import type { Event } from 'electron'
import errorProcessing from './utils/errorProcessing'
import type { Card } from '@prisma/client'

export default async function createCard(
  event: Event,
  { english, kana, kanji }: CreateCardRequest,
): Promise<RPCResponse<Card>> {
  try {
    const card = await prisma.card.create({
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
    })

    return { data: card }
  } catch (e) {
    return errorProcessing(e)
  }
}
