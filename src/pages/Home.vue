<template>
  <section class="relative min-h-screen bg-gray-50 p-4 space-y-6">
    <!-- 상단 헤더 -->
    <HeaderBar @toggleNav="showNav = !showNav" />
    <ToastNav :isOpen="showNav" @go="handleNavGo" />

    <!-- 설정 버튼 -->
    <button class="top-setting" @click="showSettings = !showSettings">⚙️ Setting</button>

    <!-- 보기 설정 -->
    <div v-if="showSettings" class="setting-area bg-white p-4 rounded shadow-md">
      <div class="sel-tit mb-3">
        <h3 class="tit font-semibold">Default Mode Set</h3>
        <div class="sel-chk space-y-1">
          <label class="block">
            <input type="radio" value="card" v-model="defaultView" class="mr-1" />Card Type
          </label>
          <label class="block">
            <input type="radio" value="list" v-model="defaultView" class="mr-1" />List Type
          </label>
        </div>
      </div>
      <div class="sel-btn flex justify-end gap-2">
        <button class="px-4 py-1 bg-indigo-500 text-white text-sm rounded" @click="applyDefaultView">확인</button>
        <button class="px-4 py-1 bg-gray-300 text-sm rounded" @click="showSettings = false">닫기</button>
      </div>
    </div>

    <!-- 상태 -->
    <div class="now-posi flex justify-between items-center mt-2">
      <h2>
        <strong>{{ viewMode === 'card' ? '카드형' : '리스트형' }} 보기</strong>
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
            <em>#</em><strong>{{ group.groupName }}</strong>
            <span class="text-sm text-gray-500">({{ (linksByGroup[group.id]?.length) || 0 }}개)</span>
          </h3>
          <div class="relative">
            <button @click="toggleGroupMenu(group.id)" class="text-lg">⋮</button>
            <div v-if="activeGroupMenuId === group.id" class="absolute right-0 bg-white shadow-md border rounded mt-1">
              <ul class="text-sm">
                <li>
                  <button @click="onRenameGroup(group)" class="block w-full text-left px-3 py-1 hover:bg-gray-100">
                    이름 수정
                  </button>
                </li>
                <li>
                  <button
                    @click="onDeleteGroup(group)"
                    class="block w-full text-left px-3 py-1 hover:bg-gray-100 text-red-500"
                  >
                    그룹 삭제
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 리스트형 -->
        <div v-if="viewMode === 'list'" class="list">
          <draggable
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
                  <div>
                    <h3 class="font-medium li-tit">{{ element.title }}</h3>
                    <p v-if="element.summary" class="tit-summary text-gray-500 text-sm">
                      {{ element.summary }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="text-indigo-500 text-sm" @click="openLink(element.url)">바로가기</button>
                  <button class="text-gray-500 text-sm" @click="copyLink(element.url)">복사</button>
                  <button
                    class="text-pink-500 text-sm hover:text-pink-600"
                    @click="goToEditCard(group.id, element.id)"
                  >
                    ✏️ 수정
                  </button>
                </div>
              </div>
            </template>
          </draggable>
          <div class="text-center mt-4">
            <AddCardButton :groupId="group.id" />
          </div>
        </div>

        <!-- 카드형 -->
        <div v-else class="card-wrap mt-3">
          <Swiper :slides-per-view="1.7" :space-between="8" centeredSlides>
            <SwiperSlide
              class="gradient-card"
              v-for="(card, index) in (linksByGroup[group.id] || [])"
              :key="`card-${index}`"
            >
              <div class="card-inner flex flex-col items-center bg-white rounded-xl p-4 shadow-sm">
                <img :src="getFavicon(card.url)" alt="favicon" class="w-8 h-8 mb-2 rounded" />
                <Card :card="card" :groupId="group.id" :cardIndex="index" />
              </div>
            </SwiperSlide>
            <SwiperSlide key="add-card">
              <AddCardSlide :groupId="group.id" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>

    <!-- 뷰 전환 버튼 -->
    <div class="text-center py-6">
      <button @click="toggleView" class="bg-indigo-500 text-white px-4 py-2 rounded">
        {{ viewMode === 'card' ? '리스트로 보기' : '카드로 보기' }}
      </button>
    </div>

    <!-- ✅ 토스트 메시지 -->
    <ToastMessage ref="toastRef" />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import draggable from "vuedraggable";
import HeaderBar from "@/components/HeaderBar.vue";
import ToastNav from "@/components/ToastNav.vue";
import Card from "@/components/Card.vue";
import EmptyCard from "@/components/EmptyCard.vue";
import AddCardButton from "@/components/AddCardButton.vue";
import AddCardSlide from "@/components/AddCardSlide.vue";
import ToastMessage from "@/components/ToastMessage.vue";
import { useGroups } from "@/composables/useGroups";
import { useLinks } from "@/composables/useLinks";
import { useAuthWatcher } from "@/composables/useAuthWatcher";

const router = useRouter();
const toastRef = ref();
onMounted(() => useAuthWatcher(toastRef));

const { groups, fetchGroups, createGroup, renameGroup, deleteGroup } = useGroups(toastRef);
const linksByGroup = reactive<Record<string, any[]>>({});
const linkFetchers: Record<string, ReturnType<typeof useLinks>> = {};

const defaultView = ref(localStorage.getItem("defaultViewMode") || "card");
const viewMode = ref(defaultView.value);
const showSettings = ref(false);
const activeGroupMenuId = ref<string | null>(null);
const showNav = ref(false);

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

/** 🔹 그룹 이름 수정 (useGroups 연결) */
async function onRenameGroup(group: any) {
  const newName = prompt("새 그룹명을 입력하세요", group.groupName);
  if (!newName?.trim()) return;
  await renameGroup(group.id, newName.trim());
}

function toggleView() {
  viewMode.value = viewMode.value === "card" ? "list" : "card";
  localStorage.setItem("defaultViewMode", viewMode.value);
}

function applyDefaultView() {
  localStorage.setItem("defaultViewMode", defaultView.value);
  viewMode.value = defaultView.value;
  showSettings.value = false;
  toastRef.value?.show("설정이 적용되었습니다!");
}

function openLink(url: string) {
  window.open(url, "_blank");
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url).then(() => toastRef.value?.show("링크가 복사되었습니다!"));
}

function toggleGroupMenu(id: string) {
  activeGroupMenuId.value = activeGroupMenuId.value === id ? null : id;
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

function handleNavGo(target: string) {
  showNav.value = false;
  if (target === "home") router.push("/");
  else if (target === "settings") showSettings.value = true;
  else if (target === "profile") toastRef.value?.show("👤 프로필 화면 준비 중!");
}

function goToEditCard(groupId: string, cardId: string) {
  if (!groupId || !cardId) return console.warn("⚠️ groupId 또는 cardId 누락:", groupId, cardId);
  router.push({ name: "EditCard", params: { groupId, cardId } });
}

/* ✅ Firestore 실시간 링크 동기화 */
watch(
  () => groups.value.map((g) => g.id),
  async (ids) => {
    if (!ids?.length) return;

    for (const id of ids) {
      if (!id || linkFetchers[id]) continue;

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

onMounted(async () => {
  await fetchGroups();
});
</script>