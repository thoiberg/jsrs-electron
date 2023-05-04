<template>
  <div class="container">
    <form @submit="onSubmit">
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

      <button type="submit">Add Card</button>
    </form>
  </div>
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

<style>
.container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

form {
  width: 60%;
}

form > button[type='submit'] {
  margin-top: 40px;
}

.field > input {
  width: 75%;
}

.field {
  display: flex;
  justify-content: space-between;
}

.field:not(:last-of-type) {
  margin-bottom: 30px;
}
</style>
