import { prisma } from '../prisma'
import type { CreateCardRequest, RPCResponse } from '../../electron/types'
import type { Event } from 'electron'

export default async function createCard(
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
    } else if (hasMessage(e)) {
      error = Error(e.message)
    } else {
      error = Error('something went wrong')
    }

    return { error }
  }
}

function hasMessage(x: unknown): x is { message: string } {
  if (x && typeof x === 'object' && 'message' in x) {
    return true
  }

  return false
}
