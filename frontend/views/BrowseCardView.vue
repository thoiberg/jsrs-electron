<template>
  <p class="error-message" v-if="serverError">{{ serverError }}</p>
  <input type="text" placeholder="Search" @input="onSearchInput" />
  <table>
    <thead>
      <th>English</th>
      <th>Kana</th>
      <th>Kanji</th>
      <th>Created At</th>
    </thead>
    <tr v-for="card in cards" :key="card.id">
      <td>{{ card.englishCardSide?.englishAnswers.map((answer) => answer.answer).join(',') }}</td>
      <td>{{ card.japaneseCardSide?.japaneseAnswers.map((answer) => answer.kana).join(',') }}</td>
      <td>{{ card.japaneseCardSide?.japaneseAnswers.map((answer) => answer.kanji).join(',') }}</td>
      <td>{{ formatDateTime(card.createdAt) }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import type { CardWithEverything } from 'prisma/queries/searchCards'
import { onMounted, ref, type Ref } from 'vue'
import formatDateTime from '../utils/formatDateTime'

const cards: Ref<CardWithEverything[]> = ref([])
const serverError = ref('')

async function retrieveData(query?: string) {
  const queryValue = query && query.length > 0 ? { query } : undefined
  const { error, data } = await window.electronAPI.searchCards(queryValue)

  if (error) {
    serverError.value = error.message
  } else {
    cards.value = data
  }
}

async function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  await retrieveData(target.value)
}

onMounted(async () => {
  await retrieveData()
})
</script>
