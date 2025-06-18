<template>
  <div class="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex flex-col items-center font-sans">
    <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-10 text-center drop-shadow-lg select-none">
      ANIMES VISTOS
    </h1>

    <!-- Loader -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="loader mb-4"></div>
      <p class="text-orange-300 text-lg font-medium">Cargando animes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="text-red-400 text-center">
        <h2 class="text-2xl font-bold mb-2">Error al cargar los datos</h2>
        <p class="text-red-300">{{ error }}</p>
        <button @click="fetchAnimeData" class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition">
          Reintentar
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else class="w-full">
      <!-- Filtros -->
      <div class="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre..."
          class="flex-1 px-5 py-3 rounded-xl bg-zinc-800/80 text-orange-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          :disabled="categoryFilter !== 'todas'"
        />
        <div class="relative">
          <select
            v-model="categoryFilter"
            class="w-full md:w-40 px-5 py-3 pr-12 rounded-xl bg-zinc-800/80 text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition uppercase cursor-pointer appearance-none"
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
          <!-- Icono personalizado del select -->
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <button @click="clearFilters" class="px-5 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition shadow-md">
          Limpiar
        </button>
      </div>

      <!-- Paginación Responsive Mejorada -->
<div v-if="totalPages > 1" class="flex flex-col items-center gap-4 mb-8 px-4">
  
  <!-- Información de página (móvil) -->
  <div class="flex sm:hidden items-center justify-center w-full">
    <div class="flex items-center gap-2 bg-zinc-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-zinc-700/50">
      <span class="text-orange-300 text-sm font-medium">Página</span>
      <span class="text-orange-100 font-semibold">{{ currentPage + 1 }}</span>
      <span class="text-orange-300/70 text-sm">de</span>
      <span class="text-orange-100 font-semibold">{{ totalPages }}</span>
    </div>
  </div>

  <!-- Controles principales -->
  <div class="flex items-center justify-center gap-2 w-full max-w-md">
    
    <!-- Botón primera página -->
    <button 
      @click="currentPage = 0" 
      :disabled="currentPage === 0" 
      class="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg bg-zinc-800/80 backdrop-blur-sm text-orange-200 font-medium hover:bg-orange-500/20 hover:text-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-zinc-700/50 hover:border-orange-500/30 active:scale-95"
      :class="{ 'ring-2 ring-orange-500/30': currentPage === 0 }"
    >
      <span class="text-xs sm:text-sm">««</span>
    </button>

    <!-- Botón anterior -->
    <button 
      @click="prevPage" 
      :disabled="currentPage === 0" 
      class="flex items-center justify-center px-3 py-2 sm:px-4 rounded-lg bg-zinc-800/80 backdrop-blur-sm text-orange-200 font-medium hover:bg-orange-500/20 hover:text-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-zinc-700/50 hover:border-orange-500/30 active:scale-95"
    >
      <svg class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      <span class="hidden sm:inline text-sm">Anterior</span>
    </button>

    <!-- Selector de página (desktop) -->
    <div class="hidden sm:flex items-center gap-3 px-4">
      <span class="text-orange-300 font-medium text-sm">Página</span>
      <div class="relative">
        <select 
          v-model="currentPage" 
          class="px-3 py-2 pr-8 rounded-lg bg-zinc-800/80 backdrop-blur-sm text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 cursor-pointer appearance-none min-w-[80px] text-center border border-zinc-700/50 hover:border-orange-500/30"
        >
          <option v-for="page in totalPages" :key="page - 1" :value="page - 1">
            {{ page }}
          </option>
        </select>
        <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg class="w-3 h-3 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      <span class="text-orange-300 flex gap-1.5 font-medium text-sm"><span>de</span> {{ totalPages }}</span>
    </div>

    <!-- Indicador de página móvil central -->
    <div class="flex sm:hidden items-center justify-center min-w-[60px] px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30">
      <span class="text-orange-100 font-bold text-sm">{{ currentPage + 1 }}/{{ totalPages }}</span>
    </div>

    <!-- Botón siguiente -->
    <button 
      @click="nextPage" 
      :disabled="currentPage >= totalPages - 1" 
      class="flex items-center justify-center px-3 py-2 sm:px-4 rounded-lg bg-zinc-800/80 backdrop-blur-sm text-orange-200 font-medium hover:bg-orange-500/20 hover:text-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-zinc-700/50 hover:border-orange-500/30 active:scale-95"
    >
      <span class="hidden sm:inline text-sm">Siguiente</span>
      <svg class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>

    <!-- Botón última página -->
    <button 
      @click="currentPage = totalPages - 1" 
      :disabled="currentPage >= totalPages - 1" 
      class="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg bg-zinc-800/80 backdrop-blur-sm text-orange-200 font-medium hover:bg-orange-500/20 hover:text-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-zinc-700/50 hover:border-orange-500/30 active:scale-95"
      :class="{ 'ring-2 ring-orange-500/30': currentPage >= totalPages - 1 }"
    >
      <span class="text-xs sm:text-sm">»»</span>
    </button>
  </div>

  <!-- Selector de página móvil -->
  <div class="flex sm:hidden w-full max-w-xs">
    <div class="relative w-full">
      <select 
        v-model="currentPage" 
        class="w-full px-4 py-3 pr-10 rounded-lg bg-zinc-800/80 backdrop-blur-sm text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 cursor-pointer appearance-none text-center border border-zinc-700/50 hover:border-orange-500/30 font-medium"
      >
        <option v-for="page in totalPages" :key="page - 1" :value="page - 1">
          Página {{ page }}
        </option>
      </select>
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg class="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  </div>

  <!-- Indicador de progreso -->
  <div class="w-full max-w-xs sm:max-w-sm">
    <div class="w-full bg-zinc-800/60 rounded-full h-1.5 overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${((currentPage + 1) / totalPages) * 100}%` }"
      ></div>
    </div>
  </div>
</div>

      <!-- Mensaje sin resultados -->
      <div v-if="filteredAnimes.length === 0" class="text-center text-orange-300 py-12">
        <h3 class="text-xl font-semibold mb-2">No se encontraron animes</h3>
        <p class="text-orange-400">Intenta con otros filtros de búsqueda</p>
      </div>

      <!-- Tarjetas de animes -->
      <div v-else class="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
        Esta lista comprende todos los animes randoms vistos en el canal del Saiko y uno que otro anime visto fuera de la dinamica (puede faltar alguno) <br><br>
        Postdata: VIVAN LAS LESBIANAS!!!!
      </footer>
    </div>
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
  isLoading.value = true
  error.value = null
  
  try {
    const res = await fetch('https://raw.githubusercontent.com/roldyoran/scrap-tiermaker/master/animes_updated.json')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    animeData.value = Array.isArray(data) ? data : Object.values(data)
    // console.log(animeData.value)
  } catch (err) {
    error.value = err.message
    console.error("Error cargando datos de anime:", err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchAnimeData()
})

function notaBgClass(nota) {
  const clean = (nota || '').toString().replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim().toUpperCase()
  if (clean.includes('GOTY')) return 'bg-gradient-to-br from-orange-500 to-orange-600'
  if (['GOD', 'WENA', 'PIOLA'].some(term => clean.includes(term))) return 'bg-gradient-to-br from-green-500 to-green-700'
  if (['NO ME GUSTO', 'MALA'].some(term => clean.includes(term))) return 'bg-gradient-to-br from-red-500 to-red-700'
  if (['HORRIBLE', 'LA PEOR DE TODAS'].some(term => clean.includes(term))) return 'bg-gradient-to-br from-fuchsia-800 to-yellow-900'
  return 'bg-gradient-to-br from-zinc-700 to-zinc-900'
}

// Limpiar búsqueda cuando se cambia la categoría
watch(categoryFilter, (newCategory) => {
  if (newCategory !== 'todas') {
    searchQuery.value = ""
  }
  currentPage.value = 0
})

// Solo resetear página cuando cambia la búsqueda
watch(searchQuery, () => {
  currentPage.value = 0
})

const filteredAnimes = computed(() => {
  let filtered = animeData.value

  // Si hay una categoría seleccionada (que no sea "todas"), filtrar solo por categoría
  if (categoryFilter.value !== "todas") {
    const category = categoryFilter.value.toLowerCase()
    filtered = filtered.filter(anime => {
      const nota = anime.nota?.toString().toLowerCase() || ''
      return nota.includes(category)
    })
  } 
  // Si la categoría es "todas", entonces aplicar filtro de búsqueda
  else if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase().replace(/\s+/g, "-")
    filtered = filtered.filter(anime => {
      const nombre = anime.nombre?.toLowerCase().replace(/\s+/g, "-") || ''
      return nombre.includes(query)
    })
  }

  return filtered
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
/* Loader personalizado */
.loader {
  width: 60px;
  height: 60px;
  border: 4px solid #27272a;
  border-top: 4px solid #fb923c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

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

/* Input deshabilitado cuando hay categoría seleccionada */
input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: rgba(39, 39, 42, 0.5);
}
</style>