import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddCardView from '../AddCardView.vue'
import { flushPromises } from '@vue/test-utils'
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'
import type { electronAPI } from 'env'

describe('AddCardView', () => {
  interface LocalTestContext {
    electronApi: DeepMockProxy<electronAPI>
  }

  beforeEach<LocalTestContext>((context) => {
    const electronApi = mockDeep<electronAPI>()
    context.electronApi = electronApi
    vi.stubGlobal('electronAPI', electronApi)
  })

  describe('when the english answer is missing', () => {
    it('shows an error message', async () => {
      const wrapper = mount(AddCardView)

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.get('ul').text()).toContain('English answer must be supplied')
    })

    it<LocalTestContext>('does not attempt to create the card', async ({ electronApi }) => {
      const wrapper = mount(AddCardView)
      const createCardSpy = vi.fn()
      electronApi.createCard.mockImplementation(createCardSpy)

      await wrapper.get('form').trigger('submit.prevent')

      expect(createCardSpy).not.toBeCalled()
    })
  })

  describe('when the kana answer and kanji answer are missing', () => {
    it('shows an error message', async () => {
      const wrapper = mount(AddCardView)

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.get('ul').text()).toContain('Kana or Kanji answer must be supplied')
    })

    it<LocalTestContext>('does not attempt to create the card', async ({ electronApi }) => {
      const wrapper = mount(AddCardView)
      const createCardSpy = vi.fn()
      electronApi.createCard.mockImplementation(createCardSpy)

      await wrapper.get('form').trigger('submit.prevent')

      expect(createCardSpy).not.toBeCalled()
    })
  })

  describe('when the data is valid', () => {
    it<LocalTestContext>('calls the create card method', async ({ electronApi }) => {
      const testCard = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const createCardMock = vi.fn(() => {
        return { data: testCard }
      })
      electronApi.createCard.mockImplementation(createCardMock)

      const wrapper = mount(AddCardView)

      await wrapper.get('input[name=englishAnswer]').setValue('cat')
      await wrapper.get('input[name=japaneseKanaAnswer]').setValue('ねこ')
      await wrapper.get('input[name=japaneseKanjiAnswer]').setValue('猫')

      await wrapper.get('form').trigger('submit.prevent')

      expect(createCardMock).toBeCalledWith({
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫'
      })
    })

    describe('and the create request succeeds', () => {
      it<LocalTestContext>('shows the success method', async ({ electronApi }) => {
        const testCard = {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const createCardMock = vi.fn(() => {
          return { data: testCard }
        })
        electronApi.createCard.mockImplementation(createCardMock)

        const wrapper = mount(AddCardView)

        await wrapper.get('input[name=englishAnswer]').setValue('cat')
        await wrapper.get('input[name=japaneseKanaAnswer]').setValue('ねこ')
        await wrapper.get('input[name=japaneseKanjiAnswer]').setValue('猫')

        await wrapper.get('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.find('.bottom-bar > span').text()).toEqual('Card Created!')
      })
    })

    describe('and the create request fails', () => {
      it<LocalTestContext>('shows the error message', async ({ electronApi }) => {
        const createCardMock = vi.fn(() => {
          return { error: new Error('oh no') }
        })
        electronApi.createCard.mockImplementation(createCardMock)

        const wrapper = mount(AddCardView)

        await wrapper.get('input[name=englishAnswer]').setValue('cat')
        await wrapper.get('input[name=japaneseKanaAnswer]').setValue('ねこ')
        await wrapper.get('input[name=japaneseKanjiAnswer]').setValue('猫')

        await wrapper.get('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.get('.error-message').text()).toEqual('oh no')
      })
    })
  })
})
