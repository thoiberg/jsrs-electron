import { Factory } from 'fishery'
import type { CardWithEverything } from '../../prisma/queries/searchCards'
import japaneseCardSideFactory from './japaneseCardSide'
import englishCardSideFactory from './englishCardSide'
import { CardStatus } from '../../prisma/card'

type CardTransientParams = {
  answers?: { kana?: string; kanji?: string; english?: string }[]
}

const cardFactory = Factory.define<CardWithEverything, CardTransientParams>(
  ({ sequence, associations, transientParams }) => {
    const id = `${sequence}`
    let japaneseCardSide
    let englishCardSide

    if (transientParams.answers && transientParams.answers.length > 0) {
      japaneseCardSide = japaneseCardSideFactory.build(
        { cardId: id },
        {
          transient: {
            answers: transientParams.answers,
          },
        },
      )

      englishCardSide = englishCardSideFactory.build(
        { cardId: id },
        {
          transient: {
            answers: transientParams.answers
              .map((answer) => answer.english)
              .filter((answer) => answer) as string[],
          },
        },
      )
    }

    return {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: CardStatus.ACTIVE,
      japaneseCardSide:
        associations.japaneseCardSide ||
        japaneseCardSide ||
        japaneseCardSideFactory.build({
          cardId: `${sequence}`,
        }),
      englishCardSide:
        associations.englishCardSide ||
        englishCardSide ||
        englishCardSideFactory.build({ cardId: `${sequence}` }),
    }
  },
)

export default cardFactory
