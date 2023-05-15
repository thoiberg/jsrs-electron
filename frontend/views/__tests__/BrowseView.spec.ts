import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import BrowseCardView from '../BrowseCardView.vue'
import mockElectronApi from '../__mocks__/electronApi'
import CardTable from '@/components/CardTable.vue'
import type { CardWithEverything } from 'prisma/queries/searchCards'
import CardForm from '@/components/CardForm.vue'

describe('BrowseView', () => {
  describe('when mounting', () => {
    it('retrieves all the cards', async () => {
      const electronApiMock = mockElectronApi()

      electronApiMock.searchCards.mockImplementation(() => {
        return { data: [] }
      })

      mount(BrowseCardView)
      await flushPromises()

      expect(electronApiMock.searchCards).toBeCalledWith(undefined)
    })
  })

  it('renders the card table with the cards', async () => {
    const electronApiMock = mockElectronApi()

    const cards: CardWithEverything[] = []

    electronApiMock.searchCards.mockImplementation(() => {
      return { data: cards }
    })

    const wrapper = mount(BrowseCardView)
    await flushPromises()

    const cardTable = wrapper.getComponent(CardTable)
    expect(cardTable.isVisible()).toEqual(true)
    expect(cardTable.props()).toEqual({ cards })
  })

  describe('when entering a search query', () => {
    describe('and the value is empty', () => {
      it('retrieves all the cards', async () => {
        const electronApiMock = mockElectronApi()

        electronApiMock.searchCards.mockImplementation(() => {
          return { data: [] }
        })

        const wrapper = mount(BrowseCardView)
        await flushPromises()

        await wrapper.find('input').setValue('')
        await flushPromises()

        expect(electronApiMock.searchCards).toBeCalledTimes(2)
      })
    })

    describe('and the query has text', () => {
      it('searches for cards matching the query', async () => {
        const electronApiMock = mockElectronApi()

        electronApiMock.searchCards.mockImplementation(() => {
          return { data: [] }
        })

        const wrapper = mount(BrowseCardView)
        await flushPromises()

        await wrapper.find('input').setValue('cat')

        expect(electronApiMock.searchCards).toBeCalledWith({ query: 'cat' })
      })
    })
  })

  describe('when an error occurs retrieving the data', () => {
    it('shows the error', async () => {
      const electronApiMock = mockElectronApi()

      electronApiMock.searchCards.mockImplementation(() => {
        return { error: new Error('oh no') }
      })

      const wrapper = mount(BrowseCardView)
      await flushPromises()

      expect(wrapper.find('.error-message').isVisible()).toBe(true)
      expect(wrapper.find('.error-message').text()).toEqual('oh no')
    })
  })

  describe('when a card is not selected', () => {
    it('does not show the card form', async () => {
      const wrapper = mount(BrowseCardView)

      expect(wrapper.findComponent(CardForm).exists()).toBe(false)
    })
  })

  describe('when a card is selected', () => {
    it.only('shows the card form', async () => {
      const electronApiMock = mockElectronApi()

      electronApiMock.searchCards.mockImplementation(() => {
        return { data: testCards() }
      })

      const wrapper = mount(BrowseCardView)
      await flushPromises()

      wrapper.findComponent(CardTable).vm.$emit('cardSelected', '1')
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent(CardForm).exists()).toBe(true)
    })
  })
})

const testCards = (firstCardCreatedAt?: Date, secondCardCreatedAt?: Date): CardWithEverything[] => {
  return [
    {
      id: '1',
      createdAt: firstCardCreatedAt || new Date(),
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
      createdAt: secondCardCreatedAt || new Date(),
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
