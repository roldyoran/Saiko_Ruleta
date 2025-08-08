<template>
  <div class="mx-auto mb-8 flex w-full max-w-2xl flex-col gap-4 md:flex-row">
    <div class="relative w-full flex-1">
      <input
        :value="searchQuery"
        @input="emit('update:searchQuery', $event.target.value)"
        type="text"
        placeholder="Buscar por nombre..."
        class="w-full rounded-lg bg-zinc-800/80 pl-11 pr-5 py-3 text-indigo-100 placeholder-zinc-400 transition focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        :disabled="categoryFilter !== 'todas'"
      />
      <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-linecap="round" />
        </svg>
      </div>
    </div>
    <div class="relative">
      <select
        :value="categoryFilter"
        @change="emit('update:categoryFilter', $event.target.value)"
        class="w-full cursor-pointer appearance-none rounded-lg bg-zinc-800/80 px-5 py-3 pr-12 text-indigo-100 uppercase transition focus:ring-2 focus:ring-indigo-500 focus:outline-none md:w-40"
      >
        <option value="todas" class="bg-zinc-800 text-indigo-100">Todas</option>
        <option value="goty" class="bg-zinc-800 text-yellow-400 font-bold">GOTY</option>
        <option value="god" class="bg-zinc-800 text-green-400 font-bold">GOD</option>
        <option value="wena" class="bg-zinc-800 text-green-300">WENA</option>
        <option value="piola" class="bg-zinc-800 text-indigo-200">PIOLA</option>
        <option value="no me gusto" class="bg-zinc-800 text-red-300">NO ME GUSTO</option>
        <option value="mala" class="bg-zinc-800 text-red-400">MALA</option>
        <option value="horrible" class="bg-zinc-800 text-purple-400">HORRIBLE</option>
        <option value="la peor de todas" class="bg-zinc-800 text-purple-300">LA PEOR DE TODAS</option>
      </select>
      <div class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform">
        <svg
          class="h-4 w-4 text-indigo-300"
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
    <button
      @click="$emit('clear-filters')"
      class="rounded-lg border bg-zinc-800 border-zinc-700/50 px-5 py-3 text-indigo-200 shadow-md transition hover:bg-indigo-500/20 hover:text-white hover:border-indigo-500/30 "
    >
    <span class="md:hidden ">Limpiar</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  searchQuery: { type: String, required: true },
  categoryFilter: { type: String, required: true }
});
const emit = defineEmits(['update:searchQuery', 'update:categoryFilter', 'clear-filters']);
</script>
