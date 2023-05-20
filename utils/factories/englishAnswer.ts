import type { EnglishAnswer } from '@prisma/client'
import { Factory } from 'fishery'

const englishAnswerFactory = Factory.define<EnglishAnswer>(({ sequence }) => ({
  id: sequence.toString(),
  englishCardSideId: sequence.toString(),
  answer: 'cat',
  createdAt: new Date(),
  updatedAt: new Date(),
}))

export default englishAnswerFactory
