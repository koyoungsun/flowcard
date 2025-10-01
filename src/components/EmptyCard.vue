<template>
  <div class="no-data">
    <p class="text-gray-500 mb-2 tit-no">아직 등록된 링크 카드가 없어요.</p>
    <AddCardButton :groupIndex="groupIndex" />
  </div>
</template>

<script setup lang="ts">
import AddCardButton from './AddCardButton.vue'

defineProps<{
  groupIndex: number
}>()
</script>