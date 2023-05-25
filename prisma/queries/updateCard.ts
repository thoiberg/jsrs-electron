import type {
  EnglishAnswerUpsertRequest,
  JapaneseAnswerUpsertRequest,
  UpdateCardRequest,
} from 'electron/types'
import { includeAllCardRelationships } from './searchCards'
import type { CardWithEverything } from '../types'
import { prisma } from '../prisma'

export default async function updateCard(
  updateCardParams: UpdateCardRequest,
): Promise<CardWithEverything | null> {
  const { japaneseAnswers, englishAnswers, cardId } = updateCardParams

  englishAnswers && (await updateEnglishAnswers(englishAnswers))
  japaneseAnswers && (await updateJapaneseAnswers(japaneseAnswers))

  return await prisma.card.findUnique({
    where: { id: cardId },
    include: includeAllCardRelationships,
  })
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
