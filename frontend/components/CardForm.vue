<template>
  <h1>Hi</h1>
</template>

<script setup lang="ts">
import type { CardWithEverything } from 'prisma/queries/searchCards'

defineProps<{
  card?: CardWithEverything
}>()
</script>
