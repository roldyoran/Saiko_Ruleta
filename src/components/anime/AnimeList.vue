<template>
  <div class="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 flex flex-col items-center font-sans">
    <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-10 text-center drop-shadow-lg select-none">
      ANIMES VISTOS
    </h1>

    <!-- Filtros -->
    <div class="w-full max-w-2xl flex flex-col md:flex-row gap-4 mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre..."
        class="flex-1 px-5 py-3 rounded-xl bg-zinc-800/80 text-orange-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
      />
      <select
        v-model="categoryFilter"
        class="w-full md:w-40 px-5 py-3 rounded-xl bg-zinc-800/80 text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition uppercase cursor-pointer"
      >
        <option value="todas">Todas</option>
        <option value="goty">GOTY</option>
        <option value="god">GOD</option>
        <option value="wena">WENA</option>
        <option value="piola">PIOLA</option>
        <option value="no me gusto">NO ME GUSTO</option>
        <option value="mala">MALA</option>
        <option value="horrible">HORRIBLE</option>
        <option value="la peor de todas">LA PEOR DE TODAS</option>
      </select>
      <button @click="clearFilters" class="px-5 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition shadow-md">
        Limpiar
      </button>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mb-8">
      <button @click="prevPage" :disabled="currentPage === 0" class="px-4 py-2 rounded-lg bg-zinc-700/70 text-orange-200 font-medium hover:bg-orange-500/30 disabled:opacity-40 transition">
        Anterior
      </button>
      <span class="text-orange-300 font-bold">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="px-4 py-2 rounded-lg bg-zinc-700/70 text-orange-200 font-medium hover:bg-orange-500/30 disabled:opacity-40 transition">
        Siguiente
      </button>
    </div>

    <!-- Tarjetas de animes -->
    <div class="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="anime in paginatedAnimes" :key="anime.id" class="bg-zinc-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-orange-500/30 transition group relative flex flex-col">
        <img :src="anime.url" :alt="anime.nombre" class="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
        <div class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow group-hover:scale-110 transition"
             :class="notaBgClass(anime.nota)">
          {{ (anime.nota || 'N/A').toUpperCase() }}
        </div>
        <div class="p-4 flex-1 flex flex-col justify-end" :title="anime.nombre">
          <h2 class="text-orange-100 font-semibold text-base md:text-lg truncate mb-1">{{ anime.nombre }}</h2>
          <p class="text-orange-200/70 text-xs">ID: {{ anime.id }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-orange-300/80 text-center text-xs mt-12 mb-4 tracking-wide font-medium bg-zinc-800/30 backdrop-blur-sm py-4 rounded-2xl max-w-2xl mx-auto px-6">
      Esta lista comprende todos los animes randoms vistos en el canal del Saiko y uno que otro anime que el SAIKO se vio una vez por su cuenta (puede faltar alguno) <br><br>
      Postdata: VIVAN LAS LESBIANAS!!!!
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const animeData = ref([])
const isLoading = ref(true)
const error = ref(null)

const searchQuery = ref("")
const categoryFilter = ref("todas")
const currentPage = ref(0)
const pageSize = 30

async function fetchAnimeData() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/roldyoran/scrap-tiermaker/master/animes_updated.json')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    animeData.value = Array.isArray(data) ? data : Object.values(data)
  } catch (err) {
    error.value = err.message
    console.error("Error cargando datos de anime:", err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAnimeData)

function notaBgClass(nota) {
  const clean = (nota || '').toString().replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim().toUpperCase()
  if (clean.includes('GOTY')) return 'bg-gradient-to-br from-orange-500 to-orange-600'
  if (['GOD', 'WENA', 'PIOLA'].some(term => clean.includes(term))) return 'bg-gradient-to-br from-green-500 to-green-700'
  if (['NO ME GUSTO', 'MALA'].some(term => clean.includes(term))) return 'bg-gradient-to-br from-red-500 to-red-700'
  if (['HORRIBLE', 'LA PEOR DE TODAS'].some(term => clean.includes(term))) return 'bg-gradient-to-br from-fuchsia-800 to-yellow-900'
  return 'bg-gradient-to-br from-zinc-700 to-zinc-900'
}

watch([searchQuery, categoryFilter], () => {
  currentPage.value = 0
})

const filteredAnimes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase().replace(/\s+/g, "-")
  const category = categoryFilter.value.toLowerCase()

  return animeData.value.filter(anime => {
    const nombre = anime.nombre?.toLowerCase().replace(/\s+/g, "-") || ''
    const nota = anime.nota?.toString().toLowerCase() || ''
    const nombreMatch = nombre.includes(query)
    const categoriaMatch = category === "todas" || nota.includes(category)
    return nombreMatch && categoriaMatch
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
  searchQuery.value = ""
  categoryFilter.value = "todas"
  currentPage.value = 0
}
</script>

<style scoped>
/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #fb923c, #ea580c);
  border-radius: 8px;
}
::-webkit-scrollbar-track {
  background: #27272a;
}

/* Animaciones */
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideInFromBottom {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
h1 {
  animation: slideInFromBottom 0.8s ease-out;
}
.w-full.max-w-2xl > * {
  animation: fadeInScale 0.5s ease-out;
}
.grid > div {
  animation: fadeInScale 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.grid > div:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(251, 146, 60, 0.2);
}
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
footer {
  animation: slideInFromBottom 1s ease-out;
  transition: background-color 0.3s ease;
}
footer:hover {
  background-color: rgba(39, 39, 42, 0.5);
}
.absolute.top-3 {
  transition: all 0.3s ease;
}
.absolute.top-3:hover {
  transform: scale(1.1) rotate(-2deg);
}
</style>
