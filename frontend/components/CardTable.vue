<template>
  <table>
    <thead>
      <th>English</th>
      <th>Kana</th>
      <th>Kanji</th>
      <th>Created At</th>
    </thead>
    <tr
      v-for="card in cards"
      :key="card.id"
      @click="$emit('cardSelected', card.id)"
      @contextmenu="showContextMenu(card.id)"
    >
      <td>{{ card.englishCardSide?.englishAnswers.map((answer) => answer.answer).join(',') }}</td>
      <td>{{ card.japaneseCardSide?.japaneseAnswers.map((answer) => answer.kana).join(',') }}</td>
      <td>{{ card.japaneseCardSide?.japaneseAnswers.map((answer) => answer.kanji).join(',') }}</td>
      <td>{{ formatDateTime(card.createdAt) }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import formatDateTime from '@/utils/formatDateTime'
import type { CardWithEverything } from 'prisma/queries/searchCards'
defineProps<{
  cards: CardWithEverything[]
}>()
defineEmits<{
  (e: 'cardSelected', id: string): void
}>()

function showContextMenu(cardId: string) {
  window.electronAPI.showCardContextMenu(cardId)
}
</script>
