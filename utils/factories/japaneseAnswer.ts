import type { JapaneseAnswer } from '@prisma/client'
import { Factory } from 'fishery'

const japaneseAnswerFactory: Factory<JapaneseAnswer> = Factory.define<JapaneseAnswer>(
  ({ sequence }) => ({
    id: sequence.toString(),
    japaneseCardSideId: sequence.toString(),
    kana: 'ねこ',
    kanji: '猫',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
)

export default japaneseAnswerFactory
