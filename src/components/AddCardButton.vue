<template>
  <div class="add-card-button text-center mt-4">
    <button
      class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm shadow transition"
      @click="goToAddPage"
    >
      ➕ 새 링크 만들기
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  groupId: string;
  groupIndex?: number;
}>();

const router = useRouter();

// ✅ AddCard 페이지로 이동 (groupId 전달)
function goToAddPage() {
  console.log("👉 이동할 groupId:", props.groupId);
  router.push({
    name: "AddCard",
    params: { groupId: props.groupId },
  });
}
</script>

<style scoped>
.add-card-button button {
  transition: all 0.2s ease;
}
.add-card-button button:hover {
  transform: translateY(-2px);
}
</style>