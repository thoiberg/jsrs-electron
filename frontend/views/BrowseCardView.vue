<template>
  <p class="error-message" v-if="serverError">{{ serverError }}</p>
  <input type="text" placeholder="Search" @input="onSearchInput" />
  <CardTable :cards="cards" @card-selected="onCardSelect" />
  <CardForm v-if="selectedCard" :card="selectedCard" submit-text="Update" @submit="onSubmit" />
</template>

<script setup lang="ts">
import type { CardWithEverything } from 'prisma/queries/searchCards'
import { onMounted, ref, type Ref } from 'vue'
import CardTable from '@/components/CardTable.vue'
import CardForm, { type SubmitParams } from '@/components/CardForm.vue'

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

async function onSubmit(params: SubmitParams) {
  // TODO: filter out unchanged values and don't pass them to prisma
  // TODO: Support multiple answers
  const cardToUpdate = selectedCard.value!
  const { error } = await window.electronAPI.updateCard({
    cardId: cardToUpdate.id,
    japaneseAnswers: [
      {
        kana: params.kana.value,
        kanji: params.kanji.value,
        japaneseAnswerId: cardToUpdate.japaneseCardSide!.japaneseAnswers[0].id,
      },
    ],
    englishAnswers: [
      {
        answer: params.english.value,
        englishAnswerId: cardToUpdate.englishCardSide!.englishAnswers[0].id,
      },
    ],
  })

  if (error) {
    serverError.value = error.message
  }
}

onMounted(async () => {
  await retrieveData()
})
</script>
