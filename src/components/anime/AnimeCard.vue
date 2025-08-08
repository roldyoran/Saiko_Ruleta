<template>
  <div class="group flex flex-col overflow-hidden rounded-xl tracking-widest transition-all">
    <div class="relative">
      <img
        :src="anime.url"
        :alt="anime.nombre"
        class="aspect-[2/3] w-full rounded-xl object-cover transition duration-300"
        loading="lazy"
      />

      <!-- Fondo de la nota -->
      <div class="absolute bottom-0 left-0">
        <!-- Contenedor que se adapta al contenido -->
        <div
          class="bg-midnight-500 rnd-bse rnd-ase rnd-sm inline-block rounded-tr-xl pt-2.5 pr-2.5"
          style="border-bottom-left-radius: 0"
        >
          <div
            class="relative rounded-md px-3 py-1 text-xs font-extrabold whitespace-nowrap text-white shadow transition text-shadow-sm text-shadow-white/60"
            :class="notaBgClass(anime.nota)"
          >
            {{ (anime.nota || "N/A").toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-end py-3" :title="anime.nombre">
      <h2 class="mb-1 truncate text-base font-semibold text-indigo-50 capitalize md:text-lg">
        {{ anime.nombre }}
      </h2>
      <p class="text-xs text-zinc-200/70">ID: {{ anime.id }}</p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    anime: { type: Object, required: true },
    notaBgClass: { type: Function, required: true },
  });
</script>

<style scoped>
  .py-3\.6 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  /* Sistema de esquinas redondeadas personalizadas */
  [class*="rnd-"] {
    position: relative;
  }

  [class*="rnd-"]:before,
  [class*="rnd-"]:after {
    content: "";
    position: absolute;
    mask: var(--ms) no-repeat;
    mask-size: 100% 100%;
    background-color: currentColor;
  }

  .rnd-bse:before,
  .rnd-ase:after {
    --ms: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M0 12h12C5.373 12 0 6.627 0 0v12z'/%3E%3C/svg%3E");
  }

  .rnd-sm:before,
  .rnd-sm:after {
    width: 8px;
    height: 8px;
  }

  /* Posicionamiento de las esquinas redondeadas */
  .rnd-bse:before {
    bottom: 100%;
    left: 0;
    background-color: #18141c;
  }

  .rnd-ase:after {
    bottom: 0;
    left: 100%;
    background-color: #18141c;
  }

  /* Estilos específicos para las notas animadas */
  .goty-gold-animated,
  .god-tier-animated,
  .bad-tier-animated,
  .horrible-tier-animated,
  .default-tier-animated {
    position: relative !important;
    overflow: visible !important;
    display: inline-block;
  }

  /* El texto debe estar por encima del efecto de brillo */
  .goty-gold-animated {
    z-index: 2;
    position: relative;
  }

  /* Ajuste para el contenedor del fondo rojo */
  .inline-block {
    min-width: fit-content;
  }
</style>
