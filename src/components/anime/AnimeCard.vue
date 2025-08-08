<template>
  <div class="group relative flex flex-col overflow-hidden rounded-xl tracking-widest transition-all">
    <img
      :src="anime.url"
      :alt="anime.nombre"
      class="aspect-[2/3] w-full object-cover transition duration-300 rounded-xl"
      loading="lazy"
    />
    <div
      class="absolute bottom-20 left-2 rounded-md px-3 py-1 text-xs font-extrabold text-white shadow transition text-shadow-sm text-shadow-white/60 group-hover:scale-110"
      :class="notaBgClass(anime.nota)"
    >
      {{ (anime.nota || 'N/A').toUpperCase() }}
    </div>
    <div class="flex flex-1 flex-col justify-end py-3" :title="anime.nombre">
      <h2 class="mb-1 truncate text-base font-semibold text-indigo-50 md:text-lg capitalize">
        {{ anime.nombre }}
      </h2>
      <p class="text-xs text-zinc-200/70">ID: {{ anime.id }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  anime: { type: Object, required: true },
  notaBgClass: { type: Function, required: true }
});
</script>