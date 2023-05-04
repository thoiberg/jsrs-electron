import { prisma } from '../electron/prisma'
import type { CreateCardRequest, RPCResponse } from '../electron/types'
import type { Event } from 'electron'

export async function createCard(
  event: Event,
  { english, kana, kanji }: CreateCardRequest
): Promise<RPCResponse> {
  try {
    const card = await prisma.card.create({
      data: {
        japaneseCardSide: {
          create: {
            japaneseAnswers: {
              create: {
                kana,
                kanji
              }
            }
          }
        },
        englishCardSide: {
          create: {
            englishAnswers: {
              create: {
                answer: english
              }
            }
          }
        }
      }
    })

    return { data: card }
  } catch (e) {
    let error
    if (e instanceof Error) {
      error = e
    } else if (Object.prototype.hasOwnProperty.call(e, 'message')) {
      const boop = e as { message: string }
      error = Error(boop.message)
    } else {
      error = Error('something went wrong')
    }

    return { error }
  }
}
