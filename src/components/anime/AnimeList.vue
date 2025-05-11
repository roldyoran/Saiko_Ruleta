<template>
  <div class="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 flex flex-col items-center font-sans">
    <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-10 text-center drop-shadow-lg select-none">
      ANIMES VISTOS
    </h1>
    <div class="w-full max-w-2xl flex flex-col md:flex-row gap-4 mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre..."
        class="flex-1 px-5 py-3 rounded-xl bg-zinc-800/80 text-orange-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
      />
      <select
        v-model="categoryFilter"
        class="w-40 px-5 py-3 rounded-xl bg-zinc-800/80 text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition uppercase cursor-pointer"
      >
        <option value="todas">Todas</option>
        <option value="goty">goty</option>
        <option value="god">god</option>
        <option value="wena">wena</option>
        <option value="piola">piola</option>
        <option value="no me gusto">no me gusto</option>
        <option value="mala">mala</option>
        <option value="horrible">horrible</option>
        <option value="no me gusto">la peor de todas</option>
      </select>
      <button @click="clearFilters" class="px-5 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition shadow-md">
        Limpiar
      </button>
    </div>
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mb-8">
      <button @click="prevPage" :disabled="currentPage === 0" class="px-4 py-2 rounded-lg bg-zinc-700/70 text-orange-200 font-medium hover:bg-orange-500/30 disabled:opacity-40 transition">
        Anterior
      </button>
      <span class="text-orange-300 font-bold">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages - 1" class="px-4 py-2 rounded-lg bg-zinc-700/70 text-orange-200 font-medium hover:bg-orange-500/30 disabled:opacity-40 transition">
        Siguiente
      </button>
    </div>
    <div class="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="anime in paginatedAnimes" :key="anime.id" class="bg-zinc-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-orange-500/30 transition group relative flex flex-col">
        <img :src="anime.url" :alt="anime.nombre" class="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
        <div class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow group-hover:scale-110 transition"
             :class="notaBgClass(anime.nota)">
          {{ (anime.nota || 'N/A').toUpperCase() }}
        </div>
        <div class="p-4 flex-1 flex flex-col justify-end">
          <h2 class="text-orange-100 font-semibold text-base md:text-lg truncate mb-1">{{ anime.nombre }}</h2>
          <p class="text-orange-200/70 text-xs">ID: {{ anime.id }}</p>
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
      <button @click="prevPage" :disabled="currentPage === 0" class="px-4 py-2 rounded-lg bg-zinc-700/70 text-orange-200 font-medium hover:bg-orange-500/30 disabled:opacity-40 transition">
        Anterior
      </button>
      <span class="text-orange-300 font-bold">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages - 1" class="px-4 py-2 rounded-lg bg-zinc-700/70 text-orange-200 font-medium hover:bg-orange-500/30 disabled:opacity-40 transition">
        Siguiente
      </button>
    </div>
    <footer class="text-orange-300/80 text-center text-xs mt-12 mb-4 tracking-wide font-medium bg-zinc-800/30 backdrop-blur-sm py-4 rounded-2xl max-w-2xl mx-auto px-6">
      Esta lista comprende todos los animes randoms vistos en el canal del Saiko y uno que otro anime que el SAIKO se vio una vez por su cuenta (puede faltar alguno) <br><br>
Postdata: VIVAN LAS LESBIANAS!!!!
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import animeData from '@/assets/anime_list.json'

const searchQuery = ref("")
const categoryFilter = ref("todas")
const currentPage = ref(0)
const pageSize = 30


function notaBgClass(nota) {
  // Handle null/undefined values
  if (!nota) return 'bg-gradient-to-br from-zinc-700 to-zinc-900'
  
  // Convert to string, remove emojis, and normalize text
  const n = nota.toString()
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .trim()
    .toUpperCase()

  // Return color based on cleaned text
  if (n.includes('GOTY')) return 'bg-gradient-to-br from-orange-500 to-orange-600'
  if (['GOD', 'WENA', 'PIOLA'].some(term => n.includes(term))) return 'bg-gradient-to-br from-green-500 to-green-700'
  if (['NO ME GUSTO', 'MALA'].some(term => n.includes(term))) return 'bg-gradient-to-br from-red-500 to-red-700'
  if (n.includes('HORRIBLE')) return 'bg-gradient-to-br from-fuchsia-800 to-yellow-900'
  return 'bg-gradient-to-br from-zinc-700 to-zinc-900'
}


watch([searchQuery, categoryFilter], ([newSearch, newCategory], [oldSearch, oldCategory]) => {
  const ambosVacios = (!newSearch || newSearch.trim() === "") && (!newCategory || newCategory === "todas");
  if (!ambosVacios && ((newSearch && newSearch !== oldSearch) || (newCategory && newCategory !== oldCategory))) {
    currentPage.value = 0;
  }
})

const filteredAnimes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  // Si hay texto en la búsqueda, solo filtra por nombre
  if (query.length > 0) {
    return animeData.filter(anime => anime.nombre.toLowerCase().includes(query))
  }
  const category = categoryFilter.value
  return animeData.filter(anime => {
    const matchesName = anime.nombre.toLowerCase().includes(query)
    const matchesCategory = category === "todas" || (anime.nota && anime.nota.toLowerCase() === category)
    return matchesName && matchesCategory
  })
})

const totalPages = computed(() => Math.ceil(filteredAnimes.value.length / pageSize))

const paginatedAnimes = computed(() => {
  const start = currentPage.value * pageSize
  return filteredAnimes.value.slice(start, start + pageSize)
})

function prevPage() {
  if (currentPage.value > 0) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value - 1) currentPage.value++
}
function clearFilters() {
  searchQuery.value = ''
  categoryFilter.value = 'todas'
  currentPage.value = 0
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #fb923c 0%, #f59e42 50%, #ea580c 100%);
  border-radius: 8px;
}
::-webkit-scrollbar-track {
  background: #27272a;
}
</style>