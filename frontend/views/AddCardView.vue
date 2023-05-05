<template>
  <div class="container">
    <div class="error-message" v-show="errorMessage">{{ errorMessage }}</div>
    <ul v-for="error in errors" :key="error">
      <li>{{ error }}</li>
    </ul>
    <form @submit="onSubmit" id="my-form">
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
import type { Ref } from 'vue'

const errors: Ref<string[]> = ref([])
const english = ref('')
const kana = ref('')
const kanji = ref('')
const errorMessage = ref('')
let showSuccessMessage = ref(false)

function isValid(): boolean {
  errors.value = []

  if (english.value == null || english.value.length === 0) {
    errors.value.push('English answer must be supplied')
  }

  if (
    (kana.value == null || kana.value.length == 0) &&
    (kanji.value == null || kanji.value.length == 0)
  ) {
    errors.value.push('Kana or Kanji must be supplied')
  }

  return errors.value.length > 0 ? false : true
}

async function onSubmit(event: Event) {
  event.preventDefault()

  if (!isValid()) {
    return
  }

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

  english.value = ''
  kanji.value = ''
  kana.value = ''
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
