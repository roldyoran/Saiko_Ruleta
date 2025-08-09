<template>
  <div class="body-two bg-midnight-500 flex min-h-screen flex-col items-center px-6 md:px-0">
    <h1
      class="mt-8 mb-10 bg-gradient-to-r bg-clip-text text-center text-4xl font-extrabold text-white drop-shadow-lg select-none md:text-6xl tracking-wider"
    >
      Animes Vistos
    </h1>

    <!-- Loader -->
    <AnimeLoader v-if="isLoading" />

    <!-- Error -->
    <AnimeError v-else-if="error" :error="error" @retry="fetchAnimeData" />

    <!-- Contenido principal -->
    <div v-else class="w-full">
      <!-- Filtros -->
      <AnimeFilters
        :searchQuery="searchQuery"
        :categoryFilter="categoryFilter"
        @update:searchQuery="(val) => (searchQuery = val)"
        @update:categoryFilter="(val) => (categoryFilter = val)"
        @clear-filters="clearFilters"
      />

      <!-- Paginación -->
      <PaginationControls v-model:current-page="currentPage" :total-pages="totalPages" />

      <!-- Mensaje sin resultados -->
      <AnimeEmpty v-if="filteredAnimes.length === 0" />

      <!-- Tarjetas de animes -->
      <div
        v-else
        class="mx-auto mb-10 grid max-w-6xl grid-cols-2 gap-6 gap-y-7 p-0 sm:grid-cols-3 md:grid-cols-4 md:px-8 lg:grid-cols-5 xl:px-0"
      >
        <AnimeCard
          v-for="anime in paginatedAnimes"
          :key="anime.id"
          :anime="anime"
          :notaBgClass="notaBgClass"
        />
      </div>

      <!-- Paginación -->
      <PaginationControls v-model:current-page="currentPage" :total-pages="totalPages" />

      <!-- Footer -->
      <footer
        class="mx-auto mt-12 mb-10 max-w-2xl rounded-2xl border border-rose-500/40 bg-zinc-800/30 px-6 py-4 text-center text-xs font-medium tracking-wide text-rose-200/70"
      >
        Esta lista comprende todos los animes randoms vistos en el canal del Saiko y uno que otro
        anime visto fuera de la dinamica ( puede faltar alguno ) <br /><br />
        <span class="text-lg font-bold tracking-widest text-rose-300">
          VIVAN LAS LESBIANAS!!!!
        </span>
      </footer>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from "vue";
  import PaginationControls from "./PaginationControls.vue";
  import AnimeCard from "./AnimeCard.vue";
  import AnimeFilters from "./AnimeFilters.vue";
  import AnimeLoader from "./AnimeLoader.vue";
  import AnimeError from "./AnimeError.vue";
  import AnimeEmpty from "./AnimeEmpty.vue";

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
    const pageFromUrl = parseInt(urlParams.get("page")) || 1;
    return {
      search: urlParams.get("search") || "",
      category: urlParams.get("category") || "todas",
      page: pageFromUrl > 0 ? pageFromUrl - 1 : 0, // Convertir de 1-indexed a 0-indexed
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
      params.set("page", (currentPage.value + 1).toString());
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

  function clearFilters() {
    searchQuery.value = "";
    categoryFilter.value = "todas";
    currentPage.value = 0;
    // La URL se actualizará automáticamente por los watchers
  }
</script>

<style>
  .body-two {
    font-family: "OpenSans-Medium", Courier, monospace;
    /* text-transform: uppercase; */
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
    position: relative;
    /* Sin efecto de brillo móvil */
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
