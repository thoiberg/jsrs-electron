import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'
import CardTable from '../CardTable.vue'
import type { CardWithEverything } from 'prisma/queries/searchCards'

describe('CardTable', () => {
  it('renders the cards in the table', async () => {
    const firstCardCreatedAt = new Date('2023-05-14, 10:00:00')
    const secondCardCreatedAt = new Date('2022-12-29, 15:13:00')
    const data = testCards(firstCardCreatedAt, secondCardCreatedAt)

    const navigatorMock = mockDeep<Navigator>({ language: 'en-GB' })
    vi.stubGlobal('navigator', navigatorMock)

    const wrapper = mount(CardTable, {
      props: {
        cards: data,
      },
    })

    const rows = wrapper.findAll('tr')

    const firstCardData = rows[0].findAll('td')
    expect(firstCardData[0].text()).toContain('cat')
    expect(firstCardData[1].text()).toContain('ねこ,ネコ')
    expect(firstCardData[2].text()).toContain('猫')
    expect(firstCardData[3].text()).toContain('14/05/2023')

    const secondCardData = rows[1].findAll('td')
    expect(secondCardData[0].text()).toContain('dog')
    expect(secondCardData[1].text()).toContain('いぬ')
    expect(secondCardData[2].text()).toContain('犬')
    expect(secondCardData[3].text()).toContain('29/12/2022')
  })
})

const testCards = (firstCardCreatedAt: Date, secondCardCreatedAt: Date): CardWithEverything[] => {
  return [
    {
      id: '1',
      createdAt: firstCardCreatedAt,
      updatedAt: new Date(),
      englishCardSide: {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        nextReviewAt: new Date(),
        cardId: '1',
        englishAnswers: [
          {
            englishCardSideId: '1',
            id: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
            answer: 'cat',
          },
        ],
      },
      japaneseCardSide: {
        id: '1',
        cardId: '1',
        nextReviewAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        japaneseAnswers: [
          {
            japaneseCardSideId: '1',
            id: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
            kanji: '猫',
            kana: 'ねこ',
          },
          {
            japaneseCardSideId: '2',
            id: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
            kana: 'ネコ',
            kanji: '',
          },
        ],
      },
    },
    {
      id: '2',
      createdAt: secondCardCreatedAt,
      updatedAt: new Date(),
      englishCardSide: {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        nextReviewAt: new Date(),
        cardId: '2',
        englishAnswers: [
          {
            englishCardSideId: '2',
            id: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
            answer: 'dog',
          },
        ],
      },
      japaneseCardSide: {
        id: '2',
        cardId: '2',
        nextReviewAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        japaneseAnswers: [
          {
            japaneseCardSideId: '2',
            id: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
            kanji: '犬',
            kana: 'いぬ',
          },
        ],
      },
    },
  ]
}
