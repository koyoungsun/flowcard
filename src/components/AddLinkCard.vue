<template>
    <div
      class="w-full h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl text-gray-500 cursor-pointer hover:bg-gray-50 transition"
      @click="$router.push('/edit')"
    >
      <div class="text-4xl">＋</div>
      <p class="mt-2 text-sm font-medium">링크카드를 추가해 보세요</p>
    </div>
  </template>