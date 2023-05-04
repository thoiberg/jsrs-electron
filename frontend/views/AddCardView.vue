<template>
  <form @submit="onSubmit">
    <label for="englishAnswer">English</label>
    <input name="englishAnswer" type="text" v-model="english" />

    <label for="japaneseKanaAnswer">Kana</label>
    <input name="japaneseKanaAnswer" type="text" v-model="kana" />

    <label for="japaneseKanjiAnswer">Kanji</label>
    <input name="japaneseKanjiAnswer" type="text" v-model="kanji" />
    <button type="submit"></button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const english = ref('')
const kana = ref('')
const kanji = ref('')

async function onSubmit(event: Event) {
  event.preventDefault()

  const response = await window.electronAPI.createCard({
    english: english.value,
    kana: kana.value,
    kanji: kanji.value
  })

  if ('error' in response) {
    // display an error message and quit
    return
  }

  // display a "card created!" notice
  // reset the fields
}
</script>
