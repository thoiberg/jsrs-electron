import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import BrowseCardView from '../BrowseCardView.vue'
import mockElectronApi from '../__mocks__/electronApi'
import CardTable from '@/components/CardTable.vue'
import type { CardWithEverything } from 'prisma/queries/searchCards'
import CardForm from '@/components/CardForm.vue'
import cardFactory from 'utils/factories/card'
import { ref } from 'vue'

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
    it('shows the card form', async () => {
      const electronApiMock = mockElectronApi()

      const card = cardFactory.build({
        id: '12',
      })

      electronApiMock.searchCards.mockImplementation(() => {
        return { data: [card] }
      })

      const wrapper = mount(BrowseCardView)
      await flushPromises()

      wrapper.findComponent(CardTable).vm.$emit('cardSelected', '12')
      await wrapper.vm.$nextTick()

      const cardFormComponent = wrapper.findComponent(CardForm)
      expect(cardFormComponent.exists()).toBe(true)
      expect(cardFormComponent.props()).toEqual({
        card,
        submitText: 'Update',
        onSubmit: (wrapper.vm as any).onSubmit,
      })
    })
  })

  describe('when the onSubmit handler is fired', () => {
    it('calls the electron updateCard API', async () => {
      const electronApiMock = mockElectronApi()

      const card = cardFactory.build({
        id: '12',
      })
      electronApiMock.searchCards.mockImplementation(() => {
        return { data: [card] }
      })
      electronApiMock.updateCard.mockResolvedValue({ data: card })

      const wrapper = mount(BrowseCardView)
      await flushPromises()
      wrapper.findComponent(CardTable).vm.$emit('cardSelected', '12')
      await wrapper.vm.$nextTick()

      const submitParams = {
        english: ref('cat'),
        kana: ref('ねこ'),
        kanji: ref('猫'),
      }

      wrapper.vm.onSubmit(submitParams)

      expect(electronApiMock.updateCard).toBeCalledWith({
        cardId: '12',
        englishAnswers: [{ answer: 'cat', englishAnswerId: '2' }],
        japaneseAnswers: [{ japaneseAnswerId: '2', kana: 'ねこ', kanji: '猫' }],
      })
    })
  })
})
