<template>
  <div class="no-data">
    <p class="text-gray-500 mb-2 tit-no">아직 등록된 링크 카드가 없어요.</p>

    <!--  groupId 안전 전달 -->
    <AddCardButton :groupIndex="groupIndex" :groupId="groupId || ''" />
  </div>
</template>

<script setup lang="ts">
import AddCardButton from './AddCardButton.vue'

const props = defineProps<{
  groupId: string
  groupIndex?: number
}>();
</script>