<template>
  <div style="display:none"></div>
</template>

<script setup>
import { onMounted, onUnmounted, defineEmits } from 'vue';

const emit = defineEmits(['spin', 'update-options']);

// Frases a reconocer con .includes
const phrasesMap = {
  2: ["ACTUALÍZALO A DOS", "ACTUALÍZALO A 2"],
  3: ["ACTUALÍZALO A TRES", "ACTUALÍZALO A 3"],
  4: ["ACTUALÍZALO A CUATRO", "ACTUALÍZALO A 4"],
  5: ["ACTUALÍZALO A 5", "ACTUALÍZALO A CINCO"],
  6: ["ACTUALÍZALO A SEIS", "ACTUALÍZALO A 6"],
  7: ["ACTUALÍZALO A 7", "ACTUALÍZALO A SIETE"],
  8: ["ACTUALÍZALO A 8", "ACTUALÍZALO A OCHO"],
};

const girarPhrases = [
  "GIRALDO", "GÍRALO", "MÍRALO", "TÍRALO", "GIRALO", "TANIA", "TANIÁ"
];

function includesAny(transcript, phrases) {
  return phrases.some(phrase => transcript.includes(phrase));
}

let recognition = null;
let isRecognizing = false;

onMounted(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Tu navegador no soporta la API de reconocimiento de voz");
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = true;
  recognition.interimResults = false;
  console.log("SpeechRecognition initialized");

  recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript.trim().toUpperCase();
    // Girar la ruleta
    console.log("Transcripción detectada:", transcript);
    if (girarPhrases.some(p => transcript.includes(p))) {
        console.log("Girar la ruleta detectado:", transcript);
      emit('spin');
      setTimeout(() => emit('spin'), 1000);
      setTimeout(() => emit('spin'), 1500);
      setTimeout(() => emit('spin'), 1600);
      setTimeout(() => emit('spin'), 2200);
    } else if (["TE AMO", "DEPILATE", "DEPÍLATE", "TEAMO", "DEPILANTE"].some(p => transcript.includes(p))) {
      // Audio trolleo: el audio debe ser manejado por el padre si se requiere
      emit('play-audio', 'depilate.mp3');
    } else {
      for (let n = 2; n <= 8; n++) {
        if (includesAny(transcript, phrasesMap[n])) {
          emit('update-options', n);
          break;
        }
      }
    }
  };

  recognition.onerror = (event) => {
    if (!isRecognizing) recognition.start();
  };
  recognition.onend = () => {
    isRecognizing = false;
    recognition.start();
    isRecognizing = true;
  };
  if (!isRecognizing) {
    recognition.start();
    isRecognizing = true;
  }
});

onUnmounted(() => {
  if (recognition) recognition.stop();
});
</script>
