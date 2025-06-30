<template>
  <div class="flex flex-col items-center">
    <audio id="cancion"></audio>
    <canvas ref="canvasRef" width="500" height="500" class="relative"></canvas>
    
    <!-- Contenedor de botones -->
    <div class="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-md justify-between items-center">
      <!-- Control de cantidad -->
      <div class="flex-1 min-w-[120px] w-full sm:w-auto">
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

      <!-- Botón Actualizar -->
      <button
        @click="handleUpdate"
        class="flex-1 min-w-[120px] w-full sm:w-auto border-2 text-sm md:text-base border-red-700 font-bold text-red-700 hover:bg-red-700 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-700/50 transition-all rounded-xl py-2 px-4 active:shadow-none active:translate-y-0
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
          dark:border-red-600 dark:text-white dark:bg-red-600 dark:hover:border-red-500 dark:hover:bg-red-800"
      >
        Actualizar
      </button>

      <!-- Botón Girar (destacado) -->
      <button
        @click="handleSpin"
        class="min-w-[150px] py-2 px-3 text-center text-sm md:text-base border-2 font-bold text-rose-700 border-rose-700 rounded-xl bg-transparent transition-all hover:bg-rose-700 hover:text-white hover:shadow-lg hover:shadow-rose-700/50 hover:-translate-y-0.5
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

const canvasRef = ref(null);
const ctx = ref(null);
const options = ref([]);
const startAngle = ref(0);
const spinTimeout = ref(null);

// Constants
const OUTSIDE_RADIUS = 200;
const TEXT_RADIUS = 160;
const INSIDE_RADIUS = 125;

// State
const spinAngleStart = ref(0);
const spinTime = ref(0);
const spinTimeTotal = ref(0);
const numOptions = ref(9);
const numOptionsInput = ref(null);

// Computed value for arc
const arc = computed(() => Math.PI / (options.value.length / 2));

// Color utilities
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

// Drawing functions
const drawRouletteWheel = () => {
  if (!canvasRef.value || !ctx.value) return;

  ctx.value.clearRect(0, 0, 500, 500);
  ctx.value.strokeStyle = "black";
  ctx.value.lineWidth = 2;
  ctx.value.font = "bold 22px Helvetica, Arial";

  for (let i = 0; i < options.value.length; i++) {
    const angle = startAngle.value + i * arc.value;
    ctx.value.fillStyle = getColor(i, options.value.length);

    // Draw segment
    ctx.value.beginPath();
    ctx.value.arc(250, 250, OUTSIDE_RADIUS, angle, angle + arc.value, false);
    ctx.value.arc(250, 250, INSIDE_RADIUS, angle + arc.value, angle, true);
    ctx.value.lineWidth = 4;
    ctx.value.stroke();
    ctx.value.fill();

    // Draw text
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
    ctx.value.rotate(angle + arc.value / 2 + Math.PI / 2);
    
    const text = options.value[i];
    ctx.value.strokeText(text, -ctx.value.measureText(text).width / 2, 0);
    ctx.value.fillText(text, -ctx.value.measureText(text).width / 2, 0);
    ctx.value.restore();
  }

  // Draw arrow
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

const stopRotateWheel = () => {
  clearTimeout(spinTimeout.value);
  const degrees = (startAngle.value * 180) / Math.PI + 90;
  const arcd = (arc.value * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);

  // Stop spin sound and play bell
  const spinSound = document.getElementById("spinSound");
  const bell = document.getElementById("bell");
  if (spinSound) {
    spinSound.pause();
    spinSound.currentTime = 0;
  }
  if (bell) bell.play();

  // Display result
  ctx.value.save();
  ctx.value.font = "bold 70px Helvetica, Arial";
  let text = options.value[index];
  let lineHeight = 0;

  ctx.value.fillStyle = "white";
  if (text === "11") {
    text += "\nChupalo Entonces";
    ctx.value.font = "bold 22px Helvetica, Arial";
    lineHeight = 30;
  } else if (text === "13") {
    text += "\nAgarramela \nque me Crece";
    ctx.value.font = "bold 20px Helvetica, Arial";
    lineHeight = 30;
  }

  const lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.value.fillText(
      line,
      250 - ctx.value.measureText(line).width / 2,
      250 + 10 + i * lineHeight
    );
  });
  ctx.value.restore();
};

// Methods exposed to parent
const updateOptions = (newNumOptions) => {
  if (!isNaN(newNumOptions) && newNumOptions > 0) {
    numOptions.value = newNumOptions;
    options.value = Array.from({ length: newNumOptions }, (_, i) => (i + 1).toString());
    drawRouletteWheel();
  }
};

const spin = () => {
  const rightImage = document.getElementById("personaje");
  if (rightImage) {
    rightImage.src = "roldyoran/TaniaColegialastick2.webp";
    setTimeout(() => {
      rightImage.src = "roldyoran/TaniaColegialastick1.webp";
    }, 350);
  }

  const nmajah = Math.floor(Math.random() * (12 - 4 + 1)) + 8;
  const numeroRandom2 = Math.floor(Math.random() * 17) + 1;
  spinAngleStart.value = Math.random() * nmajah + numeroRandom2;
  spinTime.value = 0;
  spinTimeTotal.value = Math.random() * 6 + 4 * 2000;

  const spinSound = document.getElementById("spinSound");
  if (spinSound) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  rotateWheel();
};

// Initialize on mount
onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext("2d");
    options.value = Array.from({ length: numOptions.value }, (_, i) => (i + 1).toString());
    drawRouletteWheel();
  }

  window.addEventListener('ruleta-spin', handleSpinFromSpeech);
  window.addEventListener('ruleta-update-options', (e) => handleUpdateOptionsFromSpeech(e.detail));
  window.addEventListener('ruleta-play-audio', (e) => handlePlayAudio(e.detail));
});

onUnmounted(() => {
  window.removeEventListener('ruleta-spin', handleSpinFromSpeech);
  window.removeEventListener('ruleta-update-options', (e) => handleUpdateOptionsFromSpeech(e.detail));
  window.removeEventListener('ruleta-play-audio', (e) => handlePlayAudio(e.detail));
});

// Watch for changes in options
watch([options, numOptions], () => {
  drawRouletteWheel();
});

// Expose methods and refs to parent
defineExpose({
  updateOptions,
  spin
});

const handleInputChange = (event) => {
  numOptions.value = parseInt(event.target.value) || numOptions.value;
};

const handleUpdate = () => {
  const newValue = parseInt(numOptionsInput.value?.value);
  if (!isNaN(newValue) && newValue >= 2 && newValue <= 44) {
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
