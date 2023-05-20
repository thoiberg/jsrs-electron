import type {
  EnglishAnswerUpsertRequest,
  JapaneseAnswerUpsertRequest,
  RPCResponse,
  UpdateCardRequest,
} from 'electron/types'
import { includeAllCardRelationships, type CardWithEverything } from './searchCards'
import { prisma } from '../prisma'
import errorProcessing from './utils/errorProcessing'
import type { Event } from 'electron'

export default async function updateCard(
  event: Event,
  updateCardParams: UpdateCardRequest,
): Promise<RPCResponse<CardWithEverything>> {
  try {
    const { japaneseAnswers, englishAnswers, cardId } = updateCardParams

    englishAnswers && (await updateEnglishAnswers(englishAnswers))
    japaneseAnswers && (await updateJapaneseAnswers(japaneseAnswers))

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: includeAllCardRelationships,
    })

    return { data: card! }
  } catch (e) {
    return errorProcessing(e)
  }
}

async function updateEnglishAnswers(englishAnswers: EnglishAnswerUpsertRequest[]) {
  englishAnswers.forEach(async (answer) => {
    if ('englishAnswerId' in answer) {
      await prisma.englishAnswer.update({
        where: {
          id: answer.englishAnswerId,
        },
        data: {
          answer: answer.answer,
        },
      })
    } else {
      await prisma.englishAnswer.create({
        data: {
          englishCardSideId: answer.englishCardSideId,
          answer: answer.answer,
        },
      })
    }
  })
}

async function updateJapaneseAnswers(japaneseAnswers: JapaneseAnswerUpsertRequest[]) {
  japaneseAnswers.forEach(async (answer) => {
    if ('japaneseAnswerId' in answer) {
      await prisma.japaneseAnswer.update({
        where: {
          id: answer.japaneseAnswerId,
        },
        data: {
          kana: answer.kana,
          kanji: answer.kanji,
        },
      })
    } else {
      await prisma.japaneseAnswer.create({
        data: {
          japaneseCardSideId: answer.japaneseCardSideId,
          kana: answer.kana,
          kanji: answer.kanji,
        },
      })
    }
  })
}
