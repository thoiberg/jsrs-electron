import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'
import CardTable from '../CardTable.vue'
import type { CardWithEverything } from 'prisma/queries/searchCards'
import cardFactory from 'utils/factories/card'
import mockElectronApi from '@/views/__mocks__/electronApi'

describe('CardTable', () => {
  interface LocalTestContext {
    cards: CardWithEverything[]
  }

  beforeEach<LocalTestContext>((context) => {
    const catCard = cardFactory.build(
      { id: '1', createdAt: new Date('2023-05-14, 10:00:00') },
      { transient: { answers: [{ english: 'cat', kana: 'ねこ', kanji: '猫' }, { kana: 'ネコ' }] } },
    )
    const dogCard = cardFactory.build(
      { createdAt: new Date('2022-12-29, 15:13:00') },
      { transient: { answers: [{ english: 'dog', kana: 'いぬ', kanji: '犬' }] } },
    )

    context.cards = [catCard, dogCard]
  })

  it<LocalTestContext>('renders the cards in the table', async ({ cards }) => {
    const navigatorMock = mockDeep<Navigator>({ language: 'en-GB' })
    vi.stubGlobal('navigator', navigatorMock)

    const wrapper = mount(CardTable, {
      props: {
        cards,
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

  describe('when a row is clicked', () => {
    it<LocalTestContext>('emits the cardSelected event with the card id', async ({ cards }) => {
      const navigatorMock = mockDeep<Navigator>({ language: 'en-GB' })
      vi.stubGlobal('navigator', navigatorMock)

      const wrapper = mount(CardTable, {
        props: {
          cards,
        },
      })

      const firstCardRow = wrapper.findAll('tr')[0]
      await firstCardRow.trigger('click')

      const cardSelectedEvent = wrapper.emitted('cardSelected')

      expect(cardSelectedEvent).toHaveLength(1)
      expect(cardSelectedEvent![0]).toEqual(['1'])
    })
  })

  describe('when a row is right clicked', () => {
    it<LocalTestContext>('calls the showCardContextMenu api with the selected Card id', async ({
      cards,
    }) => {
      const electronMock = mockElectronApi()
      electronMock.showCardContextMenu.mockResolvedValue()

      const wrapper = mount(CardTable, { props: { cards } })

      const firstCardRow = wrapper.findAll('tr')[0]
      await firstCardRow.trigger('contextmenu')

      expect(electronMock.showCardContextMenu).toBeCalled()
    })
  })
})
