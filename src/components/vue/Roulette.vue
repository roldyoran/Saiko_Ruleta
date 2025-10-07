<template>
  <div class="relative flex flex-col items-center">
    <audio id="cancion"></audio>
    <div class="relative">
      <canvas ref="canvasRef" width="500" height="500" class="relativE"></canvas>

      <!-- Mostrar ganador con Vue -->
      <transition name="fade-scale">
        <div
          v-if="isShowingWinner"
          class="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 shadow-[0_0_20px_10px_rgba(0,0,0,0.3)] backdrop-blur-sm"
          :class="{
            'bg-black/85': currentWinner === '11' || currentWinner === '13',
          }"
        >
          <template v-if="isNamesMode">
            <!-- <p class="text-4xl font-bold text-white mb-4">¡GANADOR!</p> -->
            <p class="text-shadow shadow-2xl text-4xl font-bold text-white uppercase">
              {{ currentWinner }}
            </p>
          </template>
          <template v-else>
            <p
              class="text-7xl font-bold text-white"
              :class="{
                'mb-4 text-8xl': currentWinner === '11' || currentWinner === '13',
              }"
            >
              {{ currentWinner }}
            </p>
            <p v-if="currentWinner === '11'" class="text-3xl font-bold text-white">
              Chupalo Entonces
            </p>
            <p v-if="currentWinner === '13'" class="text-2xl font-bold text-white">
              Agarramela que me Crece
            </p>
          </template>
        </div>
      </transition>
    </div>

    <!-- Botón flotante de lista -->
    <button
      @click="toggleNamesList"
      class="fixed top-4 right-4 z-50 flex cursor-pointer items-center gap-2 rounded-full border-2 border-zinc-700 bg-zinc-800/80 px-2 py-1 shadow-lg transition-all duration-200"
      :class="{
        '!border-rose-700 !bg-rose-800/90': isNamesMode,
        'border-zinc-700 bg-zinc-800/80': !isNamesMode,
      }"
      style="min-width: 64px"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
        :class="
          isNamesMode ? 'scale-110 bg-rose-500 text-white shadow-md' : 'bg-zinc-700 text-zinc-300'
        "
      >
        <!-- SVG modo nombres -->
        <svg
          v-if="isNamesMode"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M16 19h6" />
          <path d="M19 16v6" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
        </svg>
        <!-- SVG modo números -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-number-123"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 10l2 -2v8" />
          <path d="M9 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3" />
          <path
            d="M17 8h2.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-2.5"
          />
        </svg>
      </span>
      <span
        class="relative mx-1 flex h-5 w-10 items-center rounded-full bg-zinc-600 transition-all duration-200"
      >
        <span
          class="absolute top-0 left-0 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200"
          :class="isNamesMode ? 'translate-x-5 !bg-rose-100' : 'translate-x-0 bg-white'"
          style="box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15)"
        ></span>
      </span>
    </button>

    <transition name="fade-scale">
      <!-- Panel de nombres -->
      <div
        v-if="showNamesList"
        class="fixed top-16 right-4 z-40 w-80 overflow-x-hidden rounded-lg border border-zinc-200/20 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-sm"
      >
        <div class="mb-4">
          <input
            type="text"
            v-model="newName"
            @keyup.enter="addName"
            placeholder="Ingresa un nombre..."
            class="w-full overflow-x-hidden rounded-md border border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700/95 dark:text-white"
          />
        </div>
        <div class="custom-scrollbar max-h-60 overflow-y-auto">
          <div
            v-for="(name, index) in namesList"
            :key="index"
            class="mb-2 flex items-center justify-between rounded bg-zinc-50 px-2 py-1 dark:bg-zinc-700/95"
          >
            <span class="text-wrap dark:text-white">
              {{ name.length > 23 ? name.slice(0, 23) + "-" : name }}
              <span v-if="name.length > 23"><br />{{ name.slice(23) }}</span>
            </span>
            <button
              @click="removeName(index)"
              class="cursor-pointer font-bold text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Contenedor de botones -->
    <div
      class="mt-4 flex w-full flex-col gap-2 px-2 sm:flex-row sm:items-stretch sm:justify-between"
    >
      <!-- Control de cantidad (visible solo en modo números) -->
      <div v-if="!isNamesMode" class="w-full sm:flex-1 sm:basis-0">
        <label for="numOptionsInput" class="sr-only">Número de opciones</label>
        <div
          class="flex items-stretch overflow-hidden rounded-xl border-2 border-rose-900 bg-rose-700 text-sm font-bold text-white shadow-md md:text-base"
        >
          <!-- Botón "-" -->
          <button
            type="button"
            @click="numOptions > 2 && updateOptions(numOptions - 1)"
            class="flex items-center justify-center px-3 font-bold transition-all hover:bg-rose-800 focus:ring-2 focus:ring-rose-500 focus:outline-none disabled:opacity-50"
            :disabled="numOptions <= 2"
            aria-label="Disminuir"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>

          <!-- Input numérico -->
          <input
            id="numOptionsInput"
            ref="numOptionsInput"
            type="number"
            min="2"
            max="44"
            :value="numOptions"
            @input="handleInputChange"
            class="no-spin w-16 border-0 bg-transparent px-2 py-2 text-center focus:ring-0 focus:outline-none"
          />

          <!-- Botón "+" -->
          <button
            type="button"
            @click="numOptions < 44 && updateOptions(numOptions + 1)"
            class="flex items-center justify-center px-3 transition-all hover:bg-rose-800 focus:ring-2 focus:ring-rose-500 focus:outline-none disabled:opacity-50"
            :disabled="numOptions >= 44"
            aria-label="Aumentar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Botón Actualizar (visible solo en modo números) -->
      <button
        v-if="!isNamesMode"
        @click="handleUpdate"
        class="w-full rounded-xl border-2 border-red-600 bg-red-600 px-4 py-2 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-red-900 hover:text-white hover:shadow-lg hover:shadow-red-700/50 focus:ring-2 focus:ring-red-500 focus:outline-none active:translate-y-0 active:shadow-none sm:flex-1 sm:basis-0 md:text-base"
      >
        Actualizar
      </button>

      <!-- Botón Girar -->
      <button
        @click="handleSpin"
        :disabled="isNamesMode && namesList.length < 2"
        :class="{
          'cursor-not-allowed opacity-50': isNamesMode && namesList.length < 2,
        }"
        class="w-full rounded-xl border-2 border-rose-900 bg-rose-700 px-3 py-2 text-center text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-rose-950 hover:text-white hover:shadow-lg hover:shadow-rose-700/50 focus:border-transparent focus:ring-2 focus:ring-rose-500 focus:outline-none sm:flex-1 sm:basis-0 md:text-base"
      >
        GIRAR
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch, computed } from "vue";

  // Refs
  const canvasRef = ref(null);
  const ctx = ref(null);
  const options = ref([]);
  const startAngle = ref(0);
  const spinTimeout = ref(null);
  const showNamesList = ref(false);
  const isNamesMode = ref(false);
  const namesList = ref([]);
  const newName = ref("");
  const spinAngleStart = ref(0);
  const spinTime = ref(0);
  const spinTimeTotal = ref(0);
  const numOptions = ref(9);
  const numOptionsInput = ref(null);
  const winnerDisplayTimeout = ref(null);
  const isShowingWinner = ref(false);
  const currentWinner = ref("");
  const textAngule = ref(2);

  // Ruleta Radios
  const insideRadius = ref(120);
  const textRadius = ref(190);
  // Constantes Radios
  const OUTSIDE_RADIUS = 240;
  insideRadius.value = isNamesMode.value ? 90 : 140;

  // Constantes de tiempo
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
      insideRadius.value = 20; // Reducir el radio interior en modo nombres
      textAngule.value = 45; // Ajustar el ángulo del texto
      textRadius.value = 170; // Ajustar el radio del texto
    } else {
      // Volver a modo números
      updateOptions(numOptions.value);
      insideRadius.value = 120;
      textAngule.value = 2; // Ajustar el ángulo del texto
      textRadius.value = 190; // Ajustar el radio del texto
    }
    drawRouletteWheel();
  };

  const addName = () => {
    if (newName.value.trim()) {
      namesList.value.push(newName.value.trim().toUpperCase());
      newName.value = "";
      // quitar ganador de pantalla
      if (winnerDisplayTimeout.value) {
        clearTimeout(winnerDisplayTimeout.value);
        isShowingWinner.value = false;
      }
      if (isNamesMode.value) {
        options.value = [...namesList.value];
        drawRouletteWheel();
      }
    }
  };

  const removeName = (index) => {
    // quitar ganador de pantalla
    if (winnerDisplayTimeout.value) {
      clearTimeout(winnerDisplayTimeout.value);
      isShowingWinner.value = false;
    }

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
      { red: 255, green: 0, blue: 85 }, // Rosa intenso (amor/pasión)
      { red: 255, green: 255, blue: 255 }, // Blanco (pureza/contraste)
      { red: 180, green: 0, blue: 30 }, // Rojo oscuro (amor)
      { red: 255, green: 182, blue: 193 }, // Rosa claro
      { red: 100, green: 0, blue: 30 }, // Vino tinto oscuro
    ];

    const color = colors[item % colors.length];
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
    ctx.value.font = isNamesMode.value
      ? "bold 16px Helvetica, Arial"
      : "bold 22px Helvetica, Arial";

    for (let i = 0; i < options.value.length; i++) {
      const angle = startAngle.value + i * arc.value;
      ctx.value.fillStyle = getColor(i, options.value.length);

      // Dibujar segmento
      ctx.value.beginPath();
      ctx.value.arc(250, 250, OUTSIDE_RADIUS, angle, angle + arc.value, false);
      ctx.value.arc(250, 250, insideRadius.value, angle + arc.value, angle, true);
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
        250 + Math.cos(angle + arc.value / 2) * textRadius.value,
        250 + Math.sin(angle + arc.value / 2) * textRadius.value
      );
      ctx.value.rotate(angle + arc.value / 2 + Math.PI / textAngule.value);

      const text = options.value[i];

      // Medir el ancho del texto
      const maxTextWidth = arc.value * textRadius.value * 0.9;
      const textWidth = ctx.value.measureText(text).width;

      // Si es muy largo, escalarlo para que quepa en el segmento
      if (textWidth > maxTextWidth) {
        const scaleFactor = maxTextWidth / textWidth;
        ctx.value.scale(scaleFactor, scaleFactor);
      }

      // Centrar el texto
      ctx.value.textAlign = "center";
      ctx.value.textBaseline = "middle";

      // Dibujar texto centrado
      ctx.value.strokeText(text, 0, 0);
      ctx.value.fillText(text, 0, 0);

      // Restaurar escala si fue aplicada
      if (textWidth > arc.value * textRadius.value) {
        ctx.value.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.value.translate(
          250 + Math.cos(angle + arc.value / 2) * textRadius.value,
          250 + Math.sin(angle + arc.value / 2) * textRadius.value
        );
        ctx.value.rotate(angle + arc.value / 2 + Math.PI / textAngule.value);
      }

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

    const spinAngle =
      spinAngleStart.value - easeOut(spinTime.value, 0, spinAngleStart.value, spinTimeTotal.value);
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
    // quitar ganador de pantalla
    if (winnerDisplayTimeout.value) {
      clearTimeout(winnerDisplayTimeout.value);
      isShowingWinner.value = false;
    }

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
      rightImage.src = "reigen_ag/Tania2_ruleta18.webp";
      setTimeout(() => {
        rightImage.src = "reigen_ag/Tania1_ruleta18.webp";
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
    window.addEventListener("ruleta-spin", handleSpinFromSpeech);
    window.addEventListener("ruleta-update-options", (e) =>
      handleUpdateOptionsFromSpeech(e.detail)
    );
    window.addEventListener("ruleta-play-audio", (e) => handlePlayAudio(e.detail));
  });

  onUnmounted(() => {
    // Limpiar event listeners
    window.removeEventListener("ruleta-spin", handleSpinFromSpeech);
    window.removeEventListener("ruleta-update-options", (e) =>
      handleUpdateOptionsFromSpeech(e.detail)
    );
    window.removeEventListener("ruleta-play-audio", (e) => handlePlayAudio(e.detail));

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
    spin,
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
    updateOptionsinNameStatus(n);
  };

  const handlePlayAudio = (audioFile) => {
    const audio = document.getElementById("cancion");
    if (audio) {
      audio.src = `audios/${audioFile}`;
      audio.play();
    }
  };

  const updateOptionsinNameStatus = (n) => {
    if (isNamesMode.value) {
      toggleNamesList();
      updateOptions(n);
    } else {
      updateOptions(n);
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

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
    padding-right: 10px;
  }

  .text-shadow {
    text-shadow:
      2px 2px 0 #000,
      -2px 2px 0 #000,
      2px -2px 0 #000,
      -2px -2px 0 #000,
      0px 2px 0 #000,
      2px 0px 0 #000,
      0px -2px 0 #000,
      -2px 0px 0 #000;
  }

  /* Oculta las flechas del input[type=number] en Chrome, Safari, Edge */
  input[type="number"].no-spin::-webkit-inner-spin-button,
  input[type="number"].no-spin::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
