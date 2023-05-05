import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddCardView from '../AddCardView.vue'
import { flushPromises } from '@vue/test-utils'

describe('AddCardView', () => {
  describe('when the english answer is missing', () => {
    it('shows an error message', async () => {
      const wrapper = mount(AddCardView)

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.get('ul').text()).toContain('English answer must be supplied')
    })

    it('does not attempt to create the card', async () => {
      const createCardApi = vi.fn(() => {})
      const electronApi = vi.fn(() => ({
        createCard: createCardApi
      }))

      vi.stubGlobal('electronAPI', electronApi)

      const wrapper = mount(AddCardView)

      await wrapper.get('form').trigger('submit.prevent')

      expect(createCardApi).not.toBeCalled()
    })
  })

  describe('when the kana answer and kanji answer are missing', () => {
    it('shows an error message', async () => {
      const wrapper = mount(AddCardView)

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.get('ul').text()).toContain('Kana or Kanji answer must be supplied')
    })

    it('does not attempt to create the card', async () => {
      const createCardApi = vi.fn(() => {})
      const electronApi = vi.fn(() => ({
        createCard: createCardApi
      }))

      vi.stubGlobal('electronAPI', electronApi)

      const wrapper = mount(AddCardView)

      await wrapper.get('form').trigger('submit.prevent')

      expect(createCardApi).not.toBeCalled()
    })
  })

  describe('when the data is valid', () => {
    it('calls the create card method', async () => {
      const createCardApi = vi.fn(() => {
        return { data: {} }
      })
      const electronApi = {
        createCard: createCardApi
      }

      vi.stubGlobal('electronAPI', electronApi)

      const wrapper = mount(AddCardView)

      await wrapper.get('input[name=englishAnswer]').setValue('cat')
      await wrapper.get('input[name=japaneseKanaAnswer]').setValue('ねこ')
      await wrapper.get('input[name=japaneseKanjiAnswer]').setValue('猫')

      await wrapper.get('form').trigger('submit.prevent')

      expect(createCardApi).toBeCalledWith({
        english: 'cat',
        kana: 'ねこ',
        kanji: '猫'
      })
    })

    describe('and the create request succeeds', () => {
      it('shows the success method', async () => {
        const createCardApi = vi.fn(() => {
          return { data: {} }
        })
        const electronApi = {
          createCard: createCardApi
        }

        vi.stubGlobal('electronAPI', electronApi)

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
      it('shows the error message', async () => {
        const createCardApi = vi.fn(() => {
          return { error: new Error('oh no') }
        })
        const electronApi = {
          createCard: createCardApi
        }

        vi.stubGlobal('electronAPI', electronApi)

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
