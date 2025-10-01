<template>
  <div
    @click="goToAdd"
    class="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50"
  >
    <p class="link-card-add ">➕ 링크 카드 추가</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { defineProps } from "vue";

// 💡 여기서 props로 groupIndex를 받도록 합니다.
const props = defineProps<{
  groupIndex: number;
}>();

const router = useRouter();
const goToAdd = () => {
  router.push({ name: 'AddCard', params: { groupIndex: props.groupIndex } });
};
</script>