<template>
  <div class="container">
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
    <form @submit.prevent="submit" id="my-form">
      <div class="field">
        <label>English</label>
        <input name="englishAnswer" type="text" v-model="english" />
      </div>

      <div class="field">
        <label for="japaneseKanaAnswer">Kana</label>
        <input name="japaneseKanaAnswer" type="text" v-model="kana" />
      </div>

      <div class="field">
        <label for="japaneseKanjiAnswer">Kanji</label>
        <input name="japaneseKanjiAnswer" type="text" v-model="kanji" />
      </div>

      <div class="bottom-bar">
        <button type="submit">{{ props.submitText }}</button>
        <span v-show="showSuccessMessage">Card Created!</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CardWithEverything } from 'prisma/queries/searchCards'
import { ref, watch, type Ref } from 'vue'

export type SubmitParams = {
  kana: Ref<string>
  kanji: Ref<string>
  english: Ref<string>
}

const props = defineProps<{
  card?: CardWithEverything
  submitText: string
  onSubmit: (params: SubmitParams) => void
}>()

// TODO: track more complex objects, so I can record the answer Id and whether they've been updated
// TODO: support multiple answers
const kana = ref(props.card?.japaneseCardSide?.japaneseAnswers[0].kana || '')
const kanji = ref(props.card?.japaneseCardSide?.japaneseAnswers[0].kanji || '')
const english = ref(props.card?.englishCardSide?.englishAnswers[0].answer || '')

watch(
  () => props.card,
  (newValue) => {
    kana.value = newValue?.japaneseCardSide?.japaneseAnswers[0].kana || ''
    kanji.value = newValue?.japaneseCardSide?.japaneseAnswers[0].kanji || ''
    english.value = newValue?.englishCardSide?.englishAnswers[0].answer || ''
  },
)
const errors: Ref<string[]> = ref([])
let showSuccessMessage = ref(false)

function submit() {
  if (isValid()) {
    props.onSubmit({ kana, kanji, english })
  }
}

function isValid(): boolean {
  errors.value = []

  if (english.value == null || english.value.length === 0) {
    errors.value.push('English answer must be supplied')
  }

  if (
    (kana.value == null || kana.value.length == 0) &&
    (kanji.value == null || kanji.value.length == 0)
  ) {
    errors.value.push('Kana or Kanji answer must be supplied')
  }

  return errors.value.length > 0 ? false : true
}
</script>
