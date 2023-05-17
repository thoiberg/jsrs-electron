import type { Prisma } from '@prisma/client'
import { Factory } from 'fishery'
import englishAnswerFactory from './englishAnswer'

type EnglishCardSideWithAnswers = Prisma.EnglishCardSideGetPayload<{
  include: { englishAnswers: true }
}>

type EnglishCardSideFactoryTransientParams = {
  answers?: string[]
}

const englishCardSideFactory = Factory.define<
  EnglishCardSideWithAnswers,
  EnglishCardSideFactoryTransientParams
>(({ sequence, transientParams }) => {
  const id = `${sequence}`

  const englishAnswers = transientParams.answers?.map((answer) =>
    englishAnswerFactory.build({ answer, englishCardSideId: id }),
  )
  return {
    id,
    cardId: sequence.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReviewAt: new Date(),
    englishAnswers: englishAnswers || [englishAnswerFactory.build({ englishCardSideId: id })],
  }
})

export default englishCardSideFactory
