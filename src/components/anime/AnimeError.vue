<template>
  <div class="flex min-h-[400px] flex-col items-center justify-center">
    <div class="text-center text-red-400">
      <h2 class="mb-2 text-2xl font-bold">Error al cargar los datos</h2>
      <p class="text-red-300">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="mt-4 rounded-lg bg-rose-500 px-6 py-2 text-white transition hover:bg-rose-400"
      >
        Reintentar
      </button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    error: { type: String, required: true },
  });
  const emit = defineEmits(["retry"]);
</script>
