import { Factory } from 'fishery'
import type { Prisma } from '@prisma/client'
import japaneseAnswerFactory from './japaneseAnswer'

type JapaneseCardSideWithAnswers = Prisma.JapaneseCardSideGetPayload<{
  include: {
    japaneseAnswers: true
  }
}>

type JapaneseCardSideFactoryTransientParams = {
  answers?: { kanji?: string; kana?: string }[]
}

const japaneseCardSideFactory = Factory.define<
  JapaneseCardSideWithAnswers,
  JapaneseCardSideFactoryTransientParams
>(({ sequence, transientParams }) => {
  const id = `${sequence}`

  const japaneseAnswers = transientParams.answers?.map((answer) =>
    japaneseAnswerFactory.build({
      japaneseCardSideId: id,
      kana: answer.kana,
      kanji: answer.kanji,
    }),
  )

  return {
    id,
    cardId: sequence.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReviewAt: new Date(),
    japaneseAnswers: japaneseAnswers || [japaneseAnswerFactory.build({ japaneseCardSideId: id })],
  }
})

export default japaneseCardSideFactory
