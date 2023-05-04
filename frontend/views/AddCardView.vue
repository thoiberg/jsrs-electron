<template>
  <div class="container">
    <div class="error-message" v-show="errorMessage">{{ errorMessage }}</div>
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

      <div class="bottom-bar">
        <button type="submit">Add Card</button>
        <span v-show="showSuccessMessage">Card Created!</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const english = ref('')
const kana = ref('')
const kanji = ref('')
const errorMessage = ref('')
let showSuccessMessage = ref(false)

async function onSubmit(event: Event) {
  event.preventDefault()

  //   TODO: validate the inputs

  const response = await window.electronAPI.createCard({
    english: english.value,
    kana: kana.value,
    kanji: kanji.value
  })

  if ('error' in response) {
    errorMessage.value = response.error.message
    return
  }

  showSuccessMessage.value = true

  setTimeout(() => {
    showSuccessMessage.value = false
  }, 2000)
}
</script>

<style>
.container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-message {
  margin-bottom: 25px;
}

form {
  width: 60%;
}

.bottom-bar {
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

.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
