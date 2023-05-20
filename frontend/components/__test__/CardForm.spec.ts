import { mount } from '@vue/test-utils'
import { describe, it, vi, expect } from 'vitest'
import CardForm from '../CardForm.vue'
import cardFactory from 'utils/factories/card'

describe('CardForm', () => {
  it('renders the submitText on the submit button', () => {
    const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

    expect(wrapper.find('button[type=submit]').text()).toEqual('Create')
  })

  describe('when no card is supplied', () => {
    it('sets the inputs to nothing', () => {
      const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

      expect((wrapper.find('input[name=englishAnswer]').element as HTMLInputElement).value).toEqual(
        '',
      )
      expect(
        (wrapper.find('input[name=japaneseKanaAnswer]').element as HTMLInputElement).value,
      ).toEqual('')
      expect(
        (wrapper.find('input[name=japaneseKanjiAnswer]').element as HTMLInputElement).value,
      ).toEqual('')
    })
  })

  describe('when a card is supplied', () => {
    it('sets the inputs to the cards data', () => {
      const card = cardFactory.build(
        {},
        { transient: { answers: [{ english: 'cat', kana: 'ねこ', kanji: '猫' }] } },
      )
      const wrapper = mount(CardForm, { props: { submitText: 'Update', card } })

      expect((wrapper.find('input[name=englishAnswer]').element as HTMLInputElement).value).toEqual(
        'cat',
      )
      expect(
        (wrapper.find('input[name=japaneseKanaAnswer]').element as HTMLInputElement).value,
      ).toEqual('ねこ')
      expect(
        (wrapper.find('input[name=japaneseKanjiAnswer]').element as HTMLInputElement).value,
      ).toEqual('猫')
    })
  })

  describe('when the card prop is changed', () => {
    it('updates the inputs', async () => {
      const card = cardFactory.build(
        {},
        { transient: { answers: [{ english: 'cat', kana: 'ねこ', kanji: '猫' }] } },
      )
      const wrapper = mount(CardForm, { props: { submitText: 'Update' } })

      expect((wrapper.find('input[name=englishAnswer]').element as HTMLInputElement).value).toEqual(
        '',
      )

      await wrapper.setProps({ card, submitText: 'Update' })

      expect((wrapper.find('input[name=englishAnswer]').element as HTMLInputElement).value).toEqual(
        'cat',
      )
    })
  })

  describe('when the english answer is missing', () => {
    it('shows an error message', async () => {
      const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.get('ul').text()).toContain('English answer must be supplied')
    })

    it('does not attempt to create the card', async () => {
      const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.emitted()).not.toHaveProperty('onSubmit')
    })
  })

  describe('when the kana answer and kanji answer are missing', () => {
    it('shows an error message', async () => {
      const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.get('ul').text()).toContain('Kana or Kanji answer must be supplied')
    })

    it('does not attempt to create the card', async () => {
      const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

      await wrapper.get('form').trigger('submit.prevent')

      expect(wrapper.emitted()).not.toHaveProperty('onSubmit')
    })
  })

  describe('when the data is valid', () => {
    it('calls the onSubmit handler', async () => {
      const wrapper = mount(CardForm, { props: { submitText: 'Create' } })

      await wrapper.get('input[name=englishAnswer]').setValue('cat')
      await wrapper.get('input[name=japaneseKanaAnswer]').setValue('ねこ')
      await wrapper.get('input[name=japaneseKanjiAnswer]').setValue('猫')
      await wrapper.get('form').trigger('submit.prevent')

      // TODO: Check args passed in
      // (currently passing in the refs which I can't figure out how to get through test-utils)
      expect(wrapper.emitted()).toHaveProperty('onSubmit')
    })
  })
})
