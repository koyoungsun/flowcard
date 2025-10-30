<template>
  <section class="relative min-h-screen bg-gray-50 p-4 space-y-6">
    <!-- 상태 -->
    <div class="now-posi flex justify-between items-center mt-2">
      <h2>
        <strong>{{ currentViewMode === 'card' ? '카드형' : '리스트형' }} 보기</strong>
        <span class="text-sm text-gray-500 ml-1">({{ totalCardCount }})</span>
      </h2>
      <button @click="onCreateGroup" class="text-indigo-600 font-medium">+ 그룹 만들기</button>
    </div>

    <!-- 그룹이 없는 경우 -->
    <div v-if="groups && groups.length === 0">
      <EmptyCard :groupIndex="0" :groupId="''" />
    </div>

    <!-- 그룹 목록 -->
    <div v-else>
      <div v-for="group in groups" :key="group.id" class="mb-8">
        <!-- 그룹 헤더 -->
        <div class="group-header-tit flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <strong><i class="bi bi-link-45deg"></i>{{ group.groupName }}</strong>
            <span class="btn-set text-sm text-gray-500">
              ({{ (linksByGroup[group.id]?.length) || 0 }})
            </span>
          </h3>
          <button @click="openBottomSheet(group)" class="text-lg"><i class="bi bi-gear"></i></button>
        </div>

        <!-- 리스트형 -->
        <div v-if="currentViewMode === 'list'" class="list">
          <!-- ✅ 리스트가 비어 있을 때 -->
          <div
            v-show="!linksByGroup[group.id] || linksByGroup[group.id].length === 0"
            class="empty-message list-no-data text-center text-gray-400 py-8"
          >
            <em></em>
            <h3 class="text-sm font-medium">아직 저장된 링크가 없습니다.</h3>
            <p>링크를 등록해 보세요.</p>
          </div>

          <!-- ✅ 리스트 내용 -->
          <draggable
            v-show="linksByGroup[group.id] && linksByGroup[group.id].length > 0"
            v-model="linksByGroup[group.id]"
            :item-key="(_, i) => i"
            animation="200"
            handle=".drag-handle"
            class="list-area mt-3"
          >
            <template #item="{ element, index }">
              <div
                class="list-detail drag-handle cursor-move bg-white p-3 rounded shadow-sm mb-2 flex items-center justify-between"
              >
                <div class="flex items-center gap-3 flex-1 posi">
                  <em class="thumnail">
                    <img :src="getFavicon(element.url)" alt="favicon" class="w-5 h-5 rounded shrink-0" />
                  </em>
                  <div class="user">
                    <h3 class="font-medium li-tit">{{ element.title }}</h3>
                    <p v-if="element.summary" class="tit-summary text-gray-500 text-sm">
                      {{ element.summary }}
                    </p>
                    <div class="btn-combo">
                      <button class="text-pink-500 text-sm hover:text-pink-600 btn-3" @click="goToEditCard(group.id, element.id)">편집</button>
                      <button class="text-gray-500 text-sm btn-2" @click="copyLink(element.url)">복사</button>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 btn-box">
                  <button class="text-indigo-500 text-sm btn-1" @click="openLink(element.url)">바로가기</button>
                  <i class="bi bi-grip-vertical"></i>
                </div>
              </div>
            </template>
          </draggable>

          <!-- 안내 -->
          <ol class="info mt-4">
            <h6><i class="bi bi-bell-fill"></i> Notice</h6>
            <li>항목들은 드래그를 통해 순서를 조정할 수 있습니다.</li>
            <li>복사하기 버튼 클릭 시 링크가 복사됩니다.</li>
          </ol>

          <!-- ✅ 항상 보이는 링크 추가 버튼 -->
          <div class="text-center mt-4 btn-link-add">
            <button
              class="inline-flex items-center gap-1 px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded hover:bg-gray-100 transition"
              @click="goToAddCard(group.id)"
            >
              <i class="bi bi-plus-lg"></i> 링크 추가
            </button>
          </div>
        </div>

        <!-- 카드형 -->
        <div v-else class="card-wrap mt-3">
          <Swiper :slides-per-view="1.7" :space-between="8" centeredSlides>
            <!-- ✅ 카드가 없을 때 -->
            <SwiperSlide
              v-if="!linksByGroup[group.id] || linksByGroup[group.id].length === 0"
              key="empty-card"
            >
              <div
                class="bg-gray-100 border border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center p-6 text-gray-400"
              >
                <h3 class="text-sm font-medium"></h3>
                <p>링크를 등록해 보세요.</p>
              </div>
            </SwiperSlide>

            <!-- ✅ 카드가 있을 때 -->
            <SwiperSlide
              class="gradient-card"
              v-for="(card, index) in (linksByGroup[group.id] || [])"
              :key="`card-${index}`"
            >
              <div
                class="card-inner flex flex-col items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <img :src="getFavicon(card.url)" alt="favicon" class="w-8 h-8 mb-2 rounded thum-card" />
                <Card :card="card" :groupId="group.id" :cardIndex="index" />
              </div>
            </SwiperSlide>

            <!-- ✅ 카드 추가 버튼 -->
            <SwiperSlide key="add-card">
              <div
                class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center p-6 text-gray-500 hover:bg-gray-100 cursor-pointer transition"
                @click="goToAddCard(group.id)"
              >
                <span class="text-3xl mb-1">＋</span>
                <p class="text-sm font-medium">링크카드 추가</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>

    <!-- 보기 전환 버튼 -->
    <div class="text-center py-6 btn-toggle">
      <button @click="toggleView" class="bg-indigo-500 text-white px-4 py-2 rounded">
        {{ currentViewMode === 'card' ? '리스트 보기' : '카드 보기' }}
      </button>
    </div>

    <!-- 바텀시트 -->
    <transition name="bottom-sheet">
      <div v-if="isBottomSheetOpen" class="bottom-sheet-overlay" @click="closeBottomSheet">
        <div class="bottom-sheet" @click.stop>
          <div class="sheet-handle"></div>
          <div class="btm-header">
            <h3 class="text-center text-gray-100 font-semibold mb-4">그룹 설정</h3>
            <button class="sheet-btn-close" @click="closeBottomSheet"><i class="bi bi-x-lg"></i></button>
          </div>
          <ul class="space-y-2">
            <li><button @click="onRenameGroup(activeGroup)" class="sheet-btn">이름 수정</button></li>
            <li><button @click="onDeleteGroup(activeGroup)" class="sheet-btn text-red-400">그룹 삭제</button></li>
          </ul>
          <p class="text-xs text-gray-300 mt-4">* 그룹 삭제 시 포함된 모든 링크가 제거됩니다.</p>
        </div>
      </div>
    </transition>

    <ToastMessage ref="toastRef" />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import draggable from "vuedraggable";
import Card from "@/components/Card.vue";
import EmptyCard from "@/components/EmptyCard.vue";
import ToastMessage from "@/components/ToastMessage.vue";
import { useGroups } from "@/composables/useGroups";
import { useLinks } from "@/composables/useLinks";
import { useAuthWatcher } from "@/composables/useAuthWatcher";
import { getAuth } from "firebase/auth";

const props = defineProps<{ viewMode?: string }>();

const auth = getAuth();
const currentUser = ref(auth.currentUser);
const router = useRouter();
const toastRef = ref();
onMounted(() => useAuthWatcher(toastRef));

const { groups, fetchGroups, createGroup, renameGroup, deleteGroup } = useGroups(toastRef);
const linksByGroup = reactive<Record<string, any[]>>({});
const linkFetchers: Record<string, ReturnType<typeof useLinks>> = {};

const defaultView = ref(localStorage.getItem("defaultViewMode") || "card");
const currentViewMode = ref(props.viewMode || defaultView.value);

watch(
  () => props.viewMode,
  (newVal) => {
    if (newVal) currentViewMode.value = newVal;
  }
);

const totalCardCount = computed(() =>
  groups.value.reduce((sum, g) => sum + ((linksByGroup[g.id]?.length) || 0), 0)
);

function getFavicon(url: string): string {
  if (!url || typeof url !== "string") return "/default-icon.png";
  try {
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${new URL(url).origin}`;
  } catch {
    return "/default-icon.png";
  }
}

async function onRenameGroup(group: any) {
  const newName = prompt("새 그룹명을 입력하세요", group.groupName);
  if (!newName?.trim()) return;
  await renameGroup(group.id, newName.trim());
}

function toggleView() {
  currentViewMode.value = currentViewMode.value === "card" ? "list" : "card";
  localStorage.setItem("defaultViewMode", currentViewMode.value);
}

function openLink(url: string) {
  window.open(url, "_blank");
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url).then(() => toastRef.value?.show("링크가 복사되었습니다!"));
}

async function onCreateGroup() {
  const name = prompt("그룹 이름을 입력하세요");
  if (name) await createGroup(name.trim());
}

async function onDeleteGroup(group: any) {
  if (confirm("정말 이 그룹을 삭제하시겠습니까?")) {
    await deleteGroup(group.id);
    delete linksByGroup[group.id];
  }
}

function goToEditCard(groupId: string, cardId: string) {
  if (!groupId || !cardId) return console.warn("⚠️ groupId 또는 cardId 누락:", groupId, cardId);
  router.push({ name: "EditCard", params: { groupId, cardId } });
}

function goToAddCard(groupId: string) {
  if (!groupId) return;
  router.push({ name: "AddCard", params: { groupId } });
}

/* ✅ Firestore 실시간 링크 동기화 + 초기값 보장 */
watch(
  () => groups.value.map((g) => g.id),
  async (ids) => {
    if (!ids?.length) return;
    for (const id of ids) {
      if (!id || linkFetchers[id]) continue;

      // 🔹 초기화 보장
      if (!linksByGroup[id]) linksByGroup[id] = [];

      const linkHandler = useLinks(id);
      linkFetchers[id] = linkHandler;
      await linkHandler.fetchLinks();

      watch(
        linkHandler.links,
        async (newVal) => {
          linksByGroup[id] = [...newVal];
          await nextTick();
        },
        { immediate: true }
      );
    }
  },
  { immediate: true }
);

const isBottomSheetOpen = ref(false);
const activeGroup = ref(null);

function openBottomSheet(group: any) {
  activeGroup.value = group;
  isBottomSheetOpen.value = true;
}

function closeBottomSheet() {
  isBottomSheetOpen.value = false;
}

onMounted(async () => {
  await fetchGroups();
  // ✅ 그룹 목록 초기화 시점에 linksByGroup 빈배열 세팅
  groups.value.forEach((g) => {
    if (!linksByGroup[g.id]) linksByGroup[g.id] = [];
  });
});
</script>

<style scoped>
.empty-message {
  font-size: 15px;
  color: #9CA3AF;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 24px;
}
</style>