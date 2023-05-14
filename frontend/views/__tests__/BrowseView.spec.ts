import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import BrowseCardView from '../BrowseCardView.vue'
import mockElectronApi from '../__mocks__/electronApi'
import CardTable from '@/components/CardTable.vue'
import type { CardWithEverything } from 'prisma/queries/searchCards'

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
})
