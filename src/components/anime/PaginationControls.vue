<template>
  <div v-if="totalPages > 1" class="mb-8 flex flex-col items-center gap-4 px-4">
    <!-- Información de página (móvil) -->
    <div class="flex w-full items-center justify-center sm:hidden">
      <div
        class="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/60 px-4 py-2 backdrop-blur-sm"
      >
        <span class="text-sm font-medium text-rose-300">Página</span>
        <span class="font-semibold text-rose-100">{{ currentPage + 1 }}</span>
        <span class="text-sm text-rose-300/70">de</span>
        <span class="font-semibold text-rose-100">{{ totalPages }}</span>
      </div>
    </div>

    <!-- Controles principales -->
    <div class="flex w-full max-w-md items-center justify-center gap-2">
      <!-- Botón primera página -->
      <button
        @click="goToFirstPage"
        :disabled="currentPage === 0"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 font-medium text-rose-200 backdrop-blur-sm transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
        :class="{ 'ring-2 ring-rose-500/30': currentPage === 0 }"
      >
        <span class="text-xs sm:text-sm">««</span>
      </button>

      <!-- Botón anterior -->
      <button
        @click="prevPage"
        :disabled="currentPage === 0"
        class="flex items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 font-medium text-rose-200 backdrop-blur-sm transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
      >
        <svg class="h-4 w-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        <span class="hidden text-sm sm:inline">Anterior</span>
      </button>

      <!-- Selector de página (desktop) -->
      <div class="hidden items-center gap-3 px-4 sm:flex">
        <span class="text-sm font-medium text-rose-300">Página</span>
        <div class="relative">
          <select
            :value="currentPage"
            @change="handlePageSelect"
            class="min-w-[80px] cursor-pointer appearance-none rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 pr-8 text-center text-rose-100 backdrop-blur-sm transition-all duration-200 hover:border-rose-500/30 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/50 focus:outline-none"
          >
            <option v-for="page in totalPages" :key="page - 1" :value="page - 1">
              {{ page }}
            </option>
          </select>
          <div class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 transform">
            <svg
              class="h-3 w-3 text-rose-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
        <span class="flex gap-1.5 text-sm font-medium text-rose-300"
          ><span>de</span> {{ totalPages }}</span
        >
      </div>

      <!-- Indicador de página móvil central -->
      <div
        class="flex min-w-[60px] items-center justify-center rounded-lg border border-rose-500/30 bg-gradient-to-r from-rose-500/20 to-rose-600/20 px-3 py-2 backdrop-blur-sm sm:hidden"
      >
        <span class="text-sm font-bold text-rose-100"
          >{{ currentPage + 1 }}/{{ totalPages }}</span
        >
      </div>

      <!-- Botón siguiente -->
      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages - 1"
        class="flex items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 font-medium text-rose-200 backdrop-blur-sm transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
      >
        <span class="hidden text-sm sm:inline">Siguiente</span>
        <svg class="h-4 w-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>

      <!-- Botón última página -->
      <button
        @click="goToLastPage"
        :disabled="currentPage >= totalPages - 1"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 font-medium text-rose-200 backdrop-blur-sm transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
        :class="{ 'ring-2 ring-rose-500/30': currentPage >= totalPages - 1 }"
      >
        <span class="text-xs sm:text-sm">»»</span>
      </button>
    </div>

    <!-- Selector de página móvil -->
    <div class="flex w-full max-w-xs sm:hidden">
      <div class="relative w-full">
        <select
          :value="currentPage"
          @change="handlePageSelect"
          class="w-full cursor-pointer appearance-none rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-4 py-3 pr-10 text-center font-medium text-rose-100 backdrop-blur-sm transition-all duration-200 hover:border-rose-500/30 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/50 focus:outline-none"
        >
          <option v-for="page in totalPages" :key="page - 1" :value="page - 1">
            Página {{ page }}
          </option>
        </select>
        <div class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
          <svg
            class="h-4 w-4 text-rose-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Indicador de progreso -->
    <div class="w-full max-w-xs sm:max-w-sm">
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/60">
        <div
          class="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300 ease-out"
          :style="{ width: `${((currentPage + 1) / totalPages) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(["update:currentPage"]);

  function goToFirstPage() {
    emit("update:currentPage", 0);
  }

  function goToLastPage() {
    emit("update:currentPage", props.totalPages - 1);
  }

  function prevPage() {
    if (props.currentPage > 0) {
      emit("update:currentPage", props.currentPage - 1);
    }
  }

  function nextPage() {
    if (props.currentPage < props.totalPages - 1) {
      emit("update:currentPage", props.currentPage + 1);
    }
  }

  function handlePageSelect(event) {
    const newPage = parseInt(event.target.value);
    emit("update:currentPage", newPage);
  }
</script>

<style scoped>
  /* Estilos de botones reutilizados del componente padre */
  button {
    transition: all 0.3s ease;
  }

  button:not(:disabled):hover {
    transform: scale(1.05);
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
