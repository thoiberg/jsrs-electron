<template>
  <p class="error-message" v-if="serverError">{{ serverError }}</p>
  <input type="text" placeholder="Search" @input="onSearchInput" />
  <CardTable :cards="cards" @card-selected="onCardSelect" />
  <CardForm v-if="selectedCard" />
</template>

<script setup lang="ts">
import type { CardWithEverything } from 'prisma/queries/searchCards'
import { onMounted, ref, type Ref } from 'vue'
import CardTable from '@/components/CardTable.vue'
import CardForm from '@/components/CardForm.vue'

const cards: Ref<CardWithEverything[]> = ref([])
const serverError = ref('')
const selectedCard: Ref<CardWithEverything | undefined> = ref()

async function retrieveData(query?: string) {
  const queryValue = query && query.length > 0 ? { query } : undefined
  const { error, data } = await window.electronAPI.searchCards(queryValue)

  if (error) {
    serverError.value = error.message
  } else {
    cards.value = data
  }
}

function onCardSelect(cardId: string) {
  const card = cards.value.find((card) => card.id === cardId)

  selectedCard.value = card
}

async function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  await retrieveData(target.value)
}

onMounted(async () => {
  await retrieveData()
})
</script>
