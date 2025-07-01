<template>
  <div class="flex flex-col items-center relative">
    <audio id="cancion"></audio>
    <div class="relative">
      <canvas ref="canvasRef" width="500" height="500" class="relative"></canvas>
      
      <!-- Mostrar ganador con Vue -->
      <transition name="fade-scale">
        <div 
          v-if="isShowingWinner" 
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-full backdrop-blur-sm shadow-lg"
          :class="{
                'bg-black/85': currentWinner === '11' || currentWinner === '13'
              }"
        >
          <template v-if="isNamesMode">
            <!-- <p class="text-4xl font-bold text-white mb-4">¡GANADOR!</p> -->
            <p class="text-4xl font-bold text-white uppercase">{{ currentWinner }}</p>
          </template>
          <template v-else >
            <p 
              class="text-7xl font-bold text-white"
              :class="{
                'text-8xl mb-4': currentWinner === '11' || currentWinner === '13'
              }"
            >
              {{ currentWinner }}
            </p>
            <p 
              v-if="currentWinner === '11'" 
              class="text-3xl font-bold text-white"
            >
              Chupalo Entonces
            </p>
            <p 
              v-if="currentWinner === '13'" 
              class="text-2xl font-bold text-white"
            >
              Agarramela que me Crece
            </p>
          </template>
        </div>
      </transition>
    </div>
    
    <!-- Botón flotante de lista -->
    <button
      @click="toggleNamesList"
      class="fixed top-4 right-4 z-50 p-3 bg-rose-600/20 text-white rounded-2xl shadow-lg hover:bg-rose-800 transition-all transform hover:scale-110"
      :class="{ 'bg-rose-900': showNamesList }"
    >
      <template v-if="isNamesMode">
      <!-- SVG modo nombres -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg>
      </template>
      <template v-else>
      <!-- SVG modo números -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-number-123"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 10l2 -2v8" /><path d="M9 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3" /><path d="M17 8h2.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-2.5" /></svg>
      </template>
    </button>

    <!-- Panel de nombres -->
    <div
      v-if="showNamesList"
      class="fixed top-16 right-4 z-40 w-80 bg-zinc-900/90 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-zinc-200/20 overflow-x-hidden"
    >
      <div class="mb-4">
      <input
        type="text"
        v-model="newName"
        @keyup.enter="addName"
        placeholder="Ingresa un nombre..."
        class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-zinc-700/95 dark:text-white overflow-x-hidden" 
      />
      </div>
      <div class="max-h-60 overflow-y-auto custom-scrollbar">
      <div
          v-for="(name, index) in namesList"
          :key="index"
          class="flex justify-between items-center mb-2 px-2 py-1 bg-zinc-50 dark:bg-zinc-700/95 rounded"
        >
          <span class="dark:text-white">{{ name }}</span>
          <button
            @click="removeName(index)"
            class="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    
    <!-- Contenedor de botones -->
    <div class="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-md justify-between items-center">
      <!-- Control de cantidad (visible solo en modo números) -->
      <div v-if="!isNamesMode" class="flex-1 min-w-[120px] w-full sm:w-auto">
        <label for="numOptionsInput" class="sr-only">Número de opciones</label>
        <input
          id="numOptionsInput"
          ref="numOptionsInput"
          type="number"
          min="2"
          max="44"
          :value="numOptions"
          @input="handleInputChange"
          class="w-full py-2 px-3 text-center text-sm md:text-base border-2 font-bold text-rose-700 border-rose-700 rounded-xl bg-transparent transition-all hover:bg-rose-700 hover:text-white hover:shadow-lg hover:shadow-rose-700/50 hover:-translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
            dark:border-rose-900 dark:text-white dark:bg-rose-700 dark:hover:border-rose-500 dark:hover:bg-rose-950"
        />
      </div>

      <!-- Botón Actualizar (visible solo en modo números) -->
      <button
        v-if="!isNamesMode"
        @click="handleUpdate"
        class="flex-1 min-w-[120px] w-full sm:w-auto border-2 text-sm md:text-base border-red-700 font-bold text-red-700 hover:bg-red-700 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-700/50 transition-all rounded-xl py-2 px-4 active:shadow-none active:translate-y-0
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
          dark:border-red-600 dark:text-white dark:bg-red-600 dark:hover:border-red-500 dark:hover:bg-red-800"
      >
        Actualizar
      </button>

      <!-- Botón Girar -->
      <button
        @click="handleSpin"
        :disabled="isNamesMode && namesList.length < 2"
        :class="{
          'opacity-50 cursor-not-allowed w-full': isNamesMode && namesList.length < 2,
          'w-full': isNamesMode && namesList.length >= 2
        }"
        class="md:min-w-[120px] py-2 px-3 text-center text-sm md:text-base border-2 font-bold text-rose-700 border-rose-700 rounded-xl bg-transparent transition-all hover:bg-rose-700 hover:text-white hover:shadow-lg hover:shadow-rose-700/50 hover:-translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
            dark:border-rose-900 dark:text-white dark:bg-rose-700 dark:hover:border-rose-500 dark:hover:bg-rose-950"
      >
        GIRAR
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

// Refs
const canvasRef = ref(null);
const ctx = ref(null);
const options = ref([]);
const startAngle = ref(0);
const spinTimeout = ref(null);
const showNamesList = ref(false);
const isNamesMode = ref(false);
const namesList = ref([]);
const newName = ref('');
const spinAngleStart = ref(0);
const spinTime = ref(0);
const spinTimeTotal = ref(0);
const numOptions = ref(9);
const numOptionsInput = ref(null);
const winnerDisplayTimeout = ref(null);
const isShowingWinner = ref(false);
const currentWinner = ref('');
const textAngule = ref(2);

// Constantes
const OUTSIDE_RADIUS = 200;
const TEXT_RADIUS = 160;
let INSIDE_RADIUS = 120;
const WINNER_DISPLAY_DURATION = 40000; // 16 segundos

// Computed
const arc = computed(() => Math.PI / (options.value.length / 2));

// Métodos para manejar la lista de nombres
const toggleNamesList = () => {
  showNamesList.value = !showNamesList.value;
  isNamesMode.value = !isNamesMode.value;
  
  if (isNamesMode.value) {
    // Cambiar a modo nombres
    if (namesList.value.length > 0) {
      options.value = [...namesList.value];
    }
    INSIDE_RADIUS = 75; // Reducir el radio interior en modo nombres
    textAngule.value = 15; // Ajustar el ángulo del texto
  } else {
    // Volver a modo números
    updateOptions(numOptions.value);
    INSIDE_RADIUS = 120;
    textAngule.value = 2; // Ajustar el ángulo del texto
  }
  drawRouletteWheel();
};

const addName = () => {
  if (newName.value.trim()) {
    namesList.value.push(newName.value.trim().toUpperCase());
    newName.value = '';
    if (isNamesMode.value) {
      options.value = [...namesList.value];
      drawRouletteWheel();
    }
  }
};

const removeName = (index) => {
  namesList.value.splice(index, 1);
  if (isNamesMode.value) {
    options.value = [...namesList.value];
    drawRouletteWheel();
  }
};

// Utilidades de color
const byte2Hex = (n) => {
  const nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0f, 1)) + nybHexString.substr(n & 0x0f, 1);
};

const RGB2Color = (r, g, b) => {
  return "#" + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
};

const getColor = (item, maxitem) => {
  const colors = [
    { red: 255, green: 0, blue: 85 },     // Rosa intenso (amor/pasión)
    { red: 255, green: 255, blue: 255 },  // Blanco (pureza/contraste)
    { red: 180, green: 0, blue: 30 }      // Rojo oscuro (amor)
  ];

  const color = colors[item % 3];
  return RGB2Color(
    Math.min(255, Math.max(0, color.red)),
    Math.min(255, Math.max(0, color.green)),
    Math.min(255, Math.max(0, color.blue))
  );
};

// Funciones de dibujo
const drawRouletteWheel = () => {
  if (!canvasRef.value || !ctx.value) return;

  ctx.value.clearRect(0, 0, 500, 500);
  ctx.value.strokeStyle = "black";
  ctx.value.lineWidth = 2;
  ctx.value.font = isNamesMode.value ? "bold 16px Helvetica, Arial" : "bold 22px Helvetica, Arial";

  for (let i = 0; i < options.value.length; i++) {
    const angle = startAngle.value + i * arc.value;
    ctx.value.fillStyle = getColor(i, options.value.length);

    // Dibujar segmento
    ctx.value.beginPath();
    ctx.value.arc(250, 250, OUTSIDE_RADIUS, angle, angle + arc.value, false);
    ctx.value.arc(250, 250, INSIDE_RADIUS, angle + arc.value, angle, true);
    ctx.value.lineWidth = 4;
    ctx.value.stroke();
    ctx.value.fill();

    // Dibujar texto
    ctx.value.save();
    ctx.value.shadowOffsetX = -1;
    ctx.value.shadowOffsetY = -1;
    ctx.value.shadowBlur = 0;
    ctx.value.shadowColor = "rgb(0,0,0)";
    ctx.value.lineWidth = 4;
    ctx.value.strokeStyle = "black";
    ctx.value.fillStyle = "white";

    ctx.value.translate(
      250 + Math.cos(angle + arc.value / 2) * TEXT_RADIUS,
      250 + Math.sin(angle + arc.value / 2) * TEXT_RADIUS
    );
    ctx.value.rotate(angle + arc.value / 2 + Math.PI / textAngule.value);
    
    const text = options.value[i];
    ctx.value.strokeText(text, -ctx.value.measureText(text).width / 2, 0);
    ctx.value.fillText(text, -ctx.value.measureText(text).width / 2, 0);
    ctx.value.restore();
  }

  // Dibujar flecha
  ctx.value.fillStyle = "white";
  ctx.value.beginPath();
  ctx.value.moveTo(250 - 4, 250 - (OUTSIDE_RADIUS + 5));
  ctx.value.lineTo(250 + 4, 250 - (OUTSIDE_RADIUS + 5));
  ctx.value.lineTo(250 + 4, 250 - (OUTSIDE_RADIUS - 5));
  ctx.value.lineTo(250 + 9, 250 - (OUTSIDE_RADIUS - 5));
  ctx.value.lineTo(250 + 0, 250 - (OUTSIDE_RADIUS - 13));
  ctx.value.lineTo(250 - 9, 250 - (OUTSIDE_RADIUS - 5));
  ctx.value.lineTo(250 - 4, 250 - (OUTSIDE_RADIUS - 5));
  ctx.value.lineTo(250 - 4, 250 - (OUTSIDE_RADIUS + 5));
  ctx.value.fill();
};

// Animación de la ruleta
const easeOut = (t, b, c, d) => {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
};

const rotateWheel = () => {
  spinTime.value += 30;
  if (spinTime.value >= spinTimeTotal.value) {
    stopRotateWheel();
    return;
  }

  const spinAngle = spinAngleStart.value - easeOut(spinTime.value, 0, spinAngleStart.value, spinTimeTotal.value);
  startAngle.value += (spinAngle * Math.PI) / 180;
  drawRouletteWheel();
  spinTimeout.value = setTimeout(rotateWheel, 30);
};

const showWinner = (index) => {
  currentWinner.value = options.value[index];
  isShowingWinner.value = true;
  
  // Limpiar timeout existente
  if (winnerDisplayTimeout.value) {
    clearTimeout(winnerDisplayTimeout.value);
  }
  
  // Detener sonido de giro y reproducir campana
  const spinSound = document.getElementById("spinSound");
  const bell = document.getElementById("bell");
  if (spinSound) {
    spinSound.pause();
    spinSound.currentTime = 0;
  }
  if (bell) bell.play();

  // Configurar timeout para volver a la vista normal
  winnerDisplayTimeout.value = setTimeout(() => {
    isShowingWinner.value = false;
    drawRouletteWheel();
  }, WINNER_DISPLAY_DURATION);
};

const stopRotateWheel = () => {
  clearTimeout(spinTimeout.value);
  const degrees = (startAngle.value * 180) / Math.PI + 90;
  const arcd = (arc.value * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);

  // Mostrar ganador
  showWinner(index);
};

// Métodos principales
const updateOptions = (newNumOptions) => {
  if (!isNaN(newNumOptions)) {
    numOptions.value = Math.min(44, Math.max(2, newNumOptions));
    options.value = Array.from({ length: numOptions.value }, (_, i) => (i + 1).toString());
    drawRouletteWheel();
  }
};

const spin = () => {
  if (isNamesMode.value && namesList.value.length < 2) {
    alert("Agrega al menos 2 nombres para girar la ruleta");
    return;
  }

  if (winnerDisplayTimeout.value) {
    clearTimeout(winnerDisplayTimeout.value);
    isShowingWinner.value = false;
  }

  // Animación del personaje (si existe)
  const rightImage = document.getElementById("personaje");
  if (rightImage) {
    rightImage.src = "roldyoran/TaniaColegialastick2.webp";
    setTimeout(() => {
      rightImage.src = "roldyoran/TaniaColegialastick1.webp";
    }, 350);
  }

  // Configurar parámetros de giro aleatorios
  const nmajah = Math.floor(Math.random() * (12 - 4 + 1)) + 8;
  const numeroRandom2 = Math.floor(Math.random() * 17) + 1;
  spinAngleStart.value = Math.random() * nmajah + numeroRandom2;
  spinTime.value = 0;
  spinTimeTotal.value = Math.random() * 6 + 4 * 2000;

  // Reproducir sonido de giro
  const spinSound = document.getElementById("spinSound");
  if (spinSound) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  rotateWheel();
};

// Inicialización
onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext("2d");
    updateOptions(numOptions.value);
  }

  // Event listeners para integración con speech.js
  window.addEventListener('ruleta-spin', handleSpinFromSpeech);
  window.addEventListener('ruleta-update-options', (e) => handleUpdateOptionsFromSpeech(e.detail));
  window.addEventListener('ruleta-play-audio', (e) => handlePlayAudio(e.detail));
});

onUnmounted(() => {
  // Limpiar event listeners
  window.removeEventListener('ruleta-spin', handleSpinFromSpeech);
  window.removeEventListener('ruleta-update-options', (e) => handleUpdateOptionsFromSpeech(e.detail));
  window.removeEventListener('ruleta-play-audio', (e) => handlePlayAudio(e.detail));
  
  // Limpiar timeouts
  if (spinTimeout.value) clearTimeout(spinTimeout.value);
  if (winnerDisplayTimeout.value) clearTimeout(winnerDisplayTimeout.value);
});

// Watchers
watch([options, numOptions], () => {
  if (!isShowingWinner.value) {
    drawRouletteWheel();
  }
});

// Métodos expuestos al componente padre
defineExpose({
  updateOptions,
  spin
});

// Handlers para los eventos del DOM
const handleInputChange = (event) => {
  numOptions.value = parseInt(event.target.value) || numOptions.value;
};

const handleUpdate = () => {
  const newValue = parseInt(numOptionsInput.value?.value);
  if (!isNaN(newValue)) {
    updateOptions(newValue);
  } else {
    alert("Por favor, ingresa un número válido entre 2 y 44.");
  }
};

const handleSpin = () => {
  spin();
};

// Métodos para manejar eventos del speech.js
const handleSpinFromSpeech = () => {
  spin();
};

const handleUpdateOptionsFromSpeech = (n) => {
  updateOptions(n);
};

const handlePlayAudio = (audioFile) => {
  const audio = document.getElementById('cancion');
  if (audio) {
    audio.src = `audios/${audioFile}`;
    audio.play();
  }
};
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Estilos para el contenedor del ganador */
.absolute {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
}
</style>