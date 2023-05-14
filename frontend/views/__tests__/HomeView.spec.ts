import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import HomeView from '../HomeView.vue'
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'
import type { electronAPI } from 'env'

describe('HomeView', () => {
  interface LocalTestContext {
    electronApi: DeepMockProxy<electronAPI>
  }

  beforeEach<LocalTestContext>((context) => {
    const electronApi = mockDeep<electronAPI>()
    context.electronApi = electronApi
    vi.stubGlobal('electronAPI', electronApi)
  })

  describe('when the data is retrieved successfully', () => {
    it<LocalTestContext>('shows the number of reviewable cards', async ({ electronApi }) => {
      const firstCard = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const secondCard = {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const thirdCard = {
        id: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const getReviewableCardsMock = vi.fn(() => {
        return { data: [firstCard, secondCard, thirdCard] }
      })
      electronApi.getReviewableCards.mockImplementation(getReviewableCardsMock)
      const wrapper = mount(HomeView)
      await flushPromises()

      expect(wrapper.find('p').text()).toEqual('Reviewable Cards: 3')
    })
  })

  describe('when an error occurs when trying to retrieve the data', () => {
    it<LocalTestContext>('shows the error message', async ({ electronApi }) => {
      const getReviewableCardsMock = vi.fn(() => {
        return { error: new Error('oh no') }
      })
      electronApi.getReviewableCards.mockImplementation(getReviewableCardsMock)
      const wrapper = mount(HomeView)
      await flushPromises()

      expect(wrapper.find('.server-error').text()).toEqual('oh no')
    })
  })
})
