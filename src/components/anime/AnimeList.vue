<template>
  <div class="body-two flex min-h-screen flex-col items-center bg-zinc-950 px-6 md:px-0">
    <h1
      class="mt-8 mb-10 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-center text-4xl font-extrabold text-transparent drop-shadow-lg select-none md:text-6xl"
    >
      ANIMES VISTOS
    </h1>

    <!-- Loader -->
    <div v-if="isLoading" class="flex min-h-[400px] flex-col items-center justify-center">
      <div class="loader mb-4"></div>
      <p class="text-lg font-medium text-orange-300">Cargando animes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex min-h-[400px] flex-col items-center justify-center">
      <div class="text-center text-red-400">
        <h2 class="mb-2 text-2xl font-bold">Error al cargar los datos</h2>
        <p class="text-red-300">{{ error }}</p>
        <button
          @click="fetchAnimeData"
          class="mt-4 rounded-lg bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-400"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else class="w-full">
      <!-- Filtros -->
      <div class="mx-auto mb-8 flex w-full max-w-2xl flex-col gap-4 md:flex-row">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre..."
          class="flex-1 rounded-xl bg-zinc-800/80 px-5 py-3 text-orange-100 placeholder-zinc-400 transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
          :disabled="categoryFilter !== 'todas'"
        />
        <div class="relative">
          <select
            v-model="categoryFilter"
            class="w-full cursor-pointer appearance-none rounded-xl bg-zinc-800/80 px-5 py-3 pr-12 text-orange-100 uppercase transition focus:ring-2 focus:ring-orange-500 focus:outline-none md:w-40"
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
          <div class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform">
            <svg
              class="h-4 w-4 text-orange-300"
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
          @click="clearFilters"
          class="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-md transition hover:bg-orange-400"
        >
          Limpiar
        </button>
      </div>

      <!-- Paginación Responsive Mejorada -->
      <div v-if="totalPages > 1" class="mb-8 flex flex-col items-center gap-4 px-4">
        <!-- Información de página (móvil) -->
        <div class="flex w-full items-center justify-center sm:hidden">
          <div
            class="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/60 px-4 py-2 backdrop-blur-sm"
          >
            <span class="text-sm font-medium text-orange-300">Página</span>
            <span class="font-semibold text-orange-100">{{ currentPage + 1 }}</span>
            <span class="text-sm text-orange-300/70">de</span>
            <span class="font-semibold text-orange-100">{{ totalPages }}</span>
          </div>
        </div>

        <!-- Controles principales -->
        <div class="flex w-full max-w-md items-center justify-center gap-2">
          <!-- Botón primera página -->
          <button
            @click="currentPage = 0"
            :disabled="currentPage === 0"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 font-medium text-orange-200 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
            :class="{ 'ring-2 ring-orange-500/30': currentPage === 0 }"
          >
            <span class="text-xs sm:text-sm">««</span>
          </button>

          <!-- Botón anterior -->
          <button
            @click="prevPage"
            :disabled="currentPage === 0"
            class="flex items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 font-medium text-orange-200 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
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
            <span class="text-sm font-medium text-orange-300">Página</span>
            <div class="relative">
              <select
                v-model="currentPage"
                class="min-w-[80px] cursor-pointer appearance-none rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 pr-8 text-center text-orange-100 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
              >
                <option v-for="page in totalPages" :key="page - 1" :value="page - 1">
                  {{ page }}
                </option>
              </select>
              <div class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 transform">
                <svg
                  class="h-3 w-3 text-orange-300"
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
            <span class="flex gap-1.5 text-sm font-medium text-orange-300"
              ><span>de</span> {{ totalPages }}</span
            >
          </div>

          <!-- Indicador de página móvil central -->
          <div
            class="flex min-w-[60px] items-center justify-center rounded-lg border border-orange-500/30 bg-gradient-to-r from-orange-500/20 to-orange-600/20 px-3 py-2 backdrop-blur-sm sm:hidden"
          >
            <span class="text-sm font-bold text-orange-100"
              >{{ currentPage + 1 }}/{{ totalPages }}</span
            >
          </div>

          <!-- Botón siguiente -->
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
            class="flex items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-3 py-2 font-medium text-orange-200 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
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
            @click="currentPage = totalPages - 1"
            :disabled="currentPage >= totalPages - 1"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 font-medium text-orange-200 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
            :class="{ 'ring-2 ring-orange-500/30': currentPage >= totalPages - 1 }"
          >
            <span class="text-xs sm:text-sm">»»</span>
          </button>
        </div>

        <!-- Selector de página móvil -->
        <div class="flex w-full max-w-xs sm:hidden">
          <div class="relative w-full">
            <select
              v-model="currentPage"
              class="w-full cursor-pointer appearance-none rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-4 py-3 pr-10 text-center font-medium text-orange-100 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
            >
              <option v-for="page in totalPages" :key="page - 1" :value="page - 1">
                Página {{ page }}
              </option>
            </select>
            <div class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
              <svg
                class="h-4 w-4 text-orange-300"
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
              class="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out"
              :style="{ width: `${((currentPage + 1) / totalPages) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Mensaje sin resultados -->
      <div v-if="filteredAnimes.length === 0" class="py-12 text-center text-orange-300">
        <h3 class="mb-2 text-xl font-semibold">No se encontraron animes</h3>
        <p class="text-orange-400">Intenta con otros filtros de búsqueda</p>
      </div>

      <!-- Tarjetas de animes -->
      <div
        v-else
        class="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        <div
          v-for="anime in paginatedAnimes"
          :key="anime.id"
          class="group relative flex flex-col overflow-hidden rounded-xl bg-zinc-800/20 tracking-widest transition-all"
        >
          <img
            :src="anime.url"
            :alt="anime.nombre"
            class="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div
            class="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-extrabold text-white shadow transition text-shadow-sm text-shadow-white/60 group-hover:scale-110"
            :class="notaBgClass(anime.nota)"
          >
            {{ (anime.nota || "N/A").toUpperCase() }}
          </div>
          <div class="flex flex-1 flex-col justify-end p-4" :title="anime.nombre">
            <h2 class="mb-1 truncate text-base font-semibold text-orange-50 md:text-lg">
              {{ anime.nombre }}
            </h2>
            <p class="text-xs text-zinc-200/70">ID: {{ anime.id }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer
        class="mx-auto mt-12 mb-10 max-w-2xl rounded-2xl bg-zinc-800/30 px-6 py-4 text-center text-xs font-medium tracking-wide text-orange-300/70 backdrop-blur-sm"
      >
        Esta lista comprende todos los animes randoms vistos en el canal del Saiko y uno que otro
        anime visto fuera de la dinamica ( puede faltar alguno ) <br /><br />
        Postdata: VIVAN LAS LESBIANAS!!!!
      </footer>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from "vue";

  const animeData = ref([]);
  const isLoading = ref(true);
  const error = ref(null);

  const searchQuery = ref("");
  const categoryFilter = ref("todas");
  const currentPage = ref(0);
  const pageSize = 30;

  // Función para obtener parámetros de la URL
  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      search: urlParams.get("search") || "",
      category: urlParams.get("category") || "todas",
      page: parseInt(urlParams.get("page")) || 0,
    };
  }

  // Función para actualizar la URL
  function updateUrl() {
    const params = new URLSearchParams();

    if (searchQuery.value.trim()) {
      params.set("search", searchQuery.value.trim());
    }

    if (categoryFilter.value !== "todas") {
      params.set("category", categoryFilter.value);
    }

    if (currentPage.value > 0) {
      let page = currentPage.value + 1; // Convertir a 1-indexed para la URL
      params.set("page", page.toString());
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    // Actualizar la URL sin recargar la página
    window.history.replaceState({}, "", newUrl);
  }

  // Inicializar valores desde la URL
  function initializeFromUrl() {
    const params = getUrlParams();
    searchQuery.value = params.search;
    categoryFilter.value = params.category;
    currentPage.value = params.page;
  }

  async function fetchAnimeData() {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/roldyoran/scrap-tiermaker/master/animes_updated.json"
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      animeData.value = Array.isArray(data) ? data : Object.values(data);
    } catch (err) {
      error.value = err.message;
      console.error("Error cargando datos de anime:", err);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(async () => {
    // Primero inicializar desde la URL
    initializeFromUrl();

    // Luego cargar los datos
    await fetchAnimeData();

    // Escuchar cambios en la URL (para botón atrás/adelante del navegador)
    window.addEventListener("popstate", () => {
      initializeFromUrl();
    });
  });

  // Función JavaScript actualizada
  function notaBgClass(nota) {
    const clean = (nota || "")
      .toString()
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
      .trim()
      .toUpperCase();
    if (clean.includes("GOTY")) return "goty-gold-animated";
    if (["GOD", "WENA", "PIOLA"].some((term) => clean.includes(term))) return "god-tier-animated";
    if (["NO ME GUSTO", "MALA"].some((term) => clean.includes(term))) return "bad-tier-animated";
    if (["HORRIBLE", "LA PEOR DE TODAS"].some((term) => clean.includes(term)))
      return "horrible-tier-animated";
    return "default-tier-animated";
  }

  // Watchers para actualizar la URL cuando cambian los valores
  watch(searchQuery, () => {
    currentPage.value = 0;
    updateUrl();
  });

  watch(categoryFilter, (newCategory) => {
    if (newCategory !== "todas") {
      searchQuery.value = "";
    }
    currentPage.value = 0;
    updateUrl();
  });

  watch(currentPage, () => {
    updateUrl();
  });

  const filteredAnimes = computed(() => {
    let filtered = animeData.value;

    // Si hay una categoría seleccionada (que no sea "todas"), filtrar solo por categoría
    if (categoryFilter.value !== "todas") {
      const category = categoryFilter.value.toLowerCase();
      filtered = filtered.filter((anime) => {
        const nota = anime.nota?.toString().toLowerCase() || "";
        return nota.includes(category);
      });
    }
    // Si la categoría es "todas", entonces aplicar filtro de búsqueda
    else if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim().toLowerCase().replace(/\s+/g, "-");
      filtered = filtered.filter((anime) => {
        const nombre = anime.nombre?.toLowerCase().replace(/\s+/g, "-") || "";
        return nombre.includes(query);
      });
    }

    return filtered;
  });

  const totalPages = computed(() => Math.ceil(filteredAnimes.value.length / pageSize));

  const paginatedAnimes = computed(() => {
    const start = currentPage.value * pageSize;
    return filteredAnimes.value.slice(start, start + pageSize);
  });

  function prevPage() {
    if (currentPage.value > 0) currentPage.value--;
  }

  function nextPage() {
    if (currentPage.value < totalPages.value - 1) currentPage.value++;
  }

  function clearFilters() {
    searchQuery.value = "";
    categoryFilter.value = "todas";
    currentPage.value = 0;
    // La URL se actualizará automáticamente por los watchers
  }
</script>

<style scoped>
  .body-two {
    font-family: "Courier New", Courier, monospace;
    text-transform: uppercase;
  }

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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  h1 {
    animation: slideInFromBottom 0.8s ease-out;
  }
  .w-full.max-w-2xl > * {
    animation: fadeInScale 0.5s ease-out;
  }
  .grid > div {
    animation: fadeInScale 0.5s ease-out;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }
  /* .grid > div:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(251, 146, 60, 0.2);
  } */
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

  .goty-gold-animated {
    background: linear-gradient(
      135deg,
      #da570c 0%,
      #ff9800 25%,
      #ff6f00 50%,
      #d46904 75%,
      #e47309 100%
    );
    background-size: 200% 200%;
    animation: goldShimmer 6s ease-in-out infinite;
    position: absolute;
    overflow: hidden;
    /* Borde negro en las letras */
    /* text-shadow:
      0 0 1px #000,
      0 1px 2px #000,
      1px 0 2px #000,
      -1px 0 2px #000,
      0 -1px 2px #000; */
  }

  .goty-gold-animated::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 40%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 60%
    );
    animation: goldSweep 4s ease-in-out infinite;
  }

  .god-tier-animated {
    background: linear-gradient(135deg, #038157 0%, #0c8055 50%, #057450 100%);
    background-size: 200% 200%;
    animation: greenPulse 2.5s ease-in-out infinite;
  }

  .bad-tier-animated {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #991b1b 100%);
    background-size: 200% 200%;
    animation: redPulse 2s ease-in-out infinite;
  }

  .horrible-tier-animated {
    background: linear-gradient(
      135deg,
      #86198f 0%,
      #c026d3 25%,
      #920e8c 50%,
      #920e8c 75%,
      #c026d3 100%
    );
    background-size: 300% 300%;
    animation: horrorWave 1.5s ease-in-out infinite;
    box-shadow: 0 0 25px rgba(134, 25, 143, 0.5);
  }

  .default-tier-animated {
    background: linear-gradient(135deg, #3f3f46 0%, #52525b 50%, #18181b 100%);
    background-size: 200% 200%;
    animation: subtleShift 4s ease-in-out infinite;
  }

  /* Animaciones */
  @keyframes goldShimmer {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes goldSweep {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  @keyframes greenPulse {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes redPulse {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes horrorWave {
    0%,
    100% {
      background-position: 0% 50%;
      box-shadow: 0 0 25px rgba(134, 25, 143, 0.5);
    }
    33% {
      background-position: 100% 0%;
      box-shadow: 0 0 35px rgba(134, 25, 143, 0.7);
    }
    66% {
      background-position: 0% 100%;
      box-shadow: 0 0 20px rgba(217, 119, 6, 0.6);
    }
  }

  @keyframes subtleShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Efectos adicionales para hover (opcional)
  .goty-gold-animated:hover {
    animation-duration: 1.5s;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  }

  .god-tier-animated:hover {
    animation-duration: 1.5s;
  }

  .bad-tier-animated:hover {
    animation-duration: 1s;
  }

  .horrible-tier-animated:hover {
    animation-duration: 1s;
  } */
</style>
