<template>
  <main>
    <p v-if="serverError" class="server-error">{{ serverError }}</p>
    <p>Reviewable Cards: {{ reviewableCards.length }}</p>
  </main>
</template>

<script setup lang="ts">
import type { Card } from '@prisma/client'
import { onMounted, ref, type Ref } from 'vue'

const reviewableCards: Ref<Card[]> = ref([])
const serverError = ref('')

onMounted(async () => {
  const { data, error } = await window.electronAPI.getReviewableCards()

  if (error) {
    serverError.value = error.message
    return
  }

  reviewableCards.value = data
})
</script>

<style>
p {
  font-size: 2rem;
}
</style>
