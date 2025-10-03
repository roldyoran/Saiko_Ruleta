<template>
  <div class="min-h-screen bg-zinc-950 p-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-6 text-center">Generador de Bingo</h1>
      
      <!-- Panel de configuración -->
      <div class="bg-zinc-800 rounded-lg p-4 mb-6">
        <h2 class="text-xl font-semibold text-white mb-3">Configuración del Bingo</h2>
        
        <!-- Tamaño del bingo -->
        <div class="mb-4">
          <label class="block text-zinc-300 mb-2">Tamaño del tablero (cuadrado):</label>
          <div class="max-w-xs">
            <input
              v-model.number="boardSize"
              type="number"
              min="2"
              max="10"
              class="w-full px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 5 para un tablero de 5x5"
            />
            <p class="text-zinc-400 text-xs mt-1">
              Un tablero de {{ boardSize }}x{{ boardSize }} necesita {{ totalCells }} opciones
            </p>
          </div>
        </div>

        <!-- Agregar opciones -->
        <div class="mb-3">
          <label class="block text-zinc-300 mb-2">Agregar opción:</label>
          <div class="flex gap-2">
            <input
              v-model="newOption"
              @keypress.enter="addOption"
              type="text"
              placeholder="Escribe una opción..."
              class="flex-1 px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="addOption"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        <!-- Lista de opciones -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-medium text-white">
              Opciones ({{ options.length }})
              <span 
                v-if="hasExtraOptions" 
                class="text-xs text-green-400 ml-2 px-2 py-1 bg-green-900 rounded"
              >
                +{{ options.length - totalCells }} extra
              </span>
            </h3>
            <button
              v-if="options.length > 0"
              @click="clearAllOptions"
              class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
            >
              Limpiar todas
            </button>
          </div>
          
          <div 
            v-if="options.length > 0"
            class="grid gap-2"
            :class="{
              'grid-cols-1': options.length <= 5,
              'grid-cols-2': options.length > 5 && options.length <= 15,
              'grid-cols-3': options.length > 15 && options.length <= 30,
              'grid-cols-4': options.length > 30
            }"
          >
            <div
              v-for="(option, index) in options"
              :key="index"
              class="flex justify-between items-center bg-zinc-700 px-3 py-2 rounded-md group hover:bg-zinc-600 transition-colors"
            >
              <span class="text-zinc-300 text-sm truncate pr-2">{{ option }}</span>
              <button
                @click="removeOption(index)"
                class="text-red-400 hover:text-red-300 transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0"
                title="Eliminar opción"
              >
                ✕
              </button>
            </div>
          </div>

          <div 
            v-else 
            class="text-center py-6 text-zinc-400 bg-zinc-700 rounded-lg border-2 border-dashed border-zinc-600"
          >
            <p class="text-sm">No hay opciones agregadas</p>
            <p class="text-xs mt-1">Agrega al menos {{ totalCells }} opciones para generar el bingo</p>
          </div>
          
          <!-- Mensaje informativo sobre opciones extra -->
          <div 
            v-if="hasExtraOptions && bingoGrid.length === 0" 
            class="mt-2 p-3 bg-blue-900 border border-blue-700 rounded-lg"
          >
            <p class="text-blue-300 text-sm">
              💡 <strong>¡Genial!</strong> Tienes {{ options.length - totalCells }} opciones extra. 
              Cada vez que generes o reordenes el tablero, se seleccionarán {{ totalCells }} opciones aleatorias.
            </p>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-4 flex-wrap">
          <button
            @click="generateBingo"
            :disabled="!canGenerateBingo"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
          >
            Generar Bingo
          </button>
          <button
            v-if="bingoGrid.length > 0"
            @click="shuffleBingo"
            class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
            :title="hasExtraOptions ? 'Generar nuevo tablero con opciones aleatorias' : 'Reordenar las opciones actuales'"
          >
            🔀 {{ hasExtraOptions ? 'Nuevo Tablero' : 'Reordenar' }}
          </button>
          <button
            v-if="bingoGrid.length > 0"
            @click="resetBingo"
            class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            🗑️ Limpiar
          </button>
        </div>

        <!-- Sección de compartir -->
        <div v-if="bingoGrid.length > 0" class="mt-4 p-4 bg-zinc-700 rounded-lg">
          <h3 class="text-lg font-medium text-white mb-3">🔗 Compartir Opciones</h3>
          
          <div class="flex gap-2 mb-3">
            <button
              @click="generateOptionsLink"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Generar Enlace
            </button>
            <button
              v-if="shareLink"
              @click="copyToClipboard"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              :class="{ 'bg-green-700': copied }"
            >
              {{ copied ? '✓ Copiado' : 'Copiar' }}
            </button>
          </div>
          
          <div v-if="shareLink" class="space-y-2">
            <input
              :value="shareLink"
              readonly
              class="w-full px-3 py-2 bg-zinc-800 text-white text-sm rounded border border-zinc-500 focus:outline-none"
            />
            <p class="text-zinc-400 text-xs">
              Comparte este enlace para que otros puedan usar las mismas opciones
            </p>
          </div>
        </div>
      </div>

      <!-- Vista previa del Tablero de Bingo -->
      <div v-if="bingoGrid.length > 0" class="bg-zinc-800 rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">
            Tablero de Bingo
            <span class="text-sm text-green-400 ml-2">({{ boardSize }}x{{ boardSize }})</span>
          </h2>
          <div class="flex items-center gap-4">
            <div class="text-sm text-zinc-300">
              Marcados: {{ markedCells }} / {{ totalCells }} 
              <span class="ml-2 px-2 py-1 bg-zinc-700 rounded">
                {{ Math.round((markedCells / totalCells) * 100) }}%
              </span>
            </div>
            <button
              @click="openFullscreen"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
            >
              🔍 Pantalla Completa
            </button>
          </div>
        </div>
        
        <!-- Vista previa pequeña del tablero -->
        <div class="flex justify-center items-center">
          <div
            class="grid gap-1"
            :style="{ 
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              gridTemplateRows: `repeat(${boardSize}, 1fr)`,
              width: '400px',
              height: '400px'
            }"
          >
            <div
              v-for="(cell, index) in bingoGrid"
              :key="index"
              @click="toggleCell(index)"
              class="relative bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 rounded cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden group"
              :class="{
                'bg-zinc-600': cell.marked,
                'hover:scale-[1.02]': !cell.marked,
                'scale-[0.98]': cell.marked
              }"
            >
              <span class="text-white text-center font-medium leading-tight px-1 break-words hyphens-auto select-none text-xs">
                {{ cell.text }}
              </span>
              <div
                v-if="cell.marked"
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span class="text-red-600 text-6xl font-extrabold opacity-95 drop-shadow-2xl leading-none">✕</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de pantalla completa -->
      <div
        v-if="showFullscreen"
        class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
        @click.self="closeFullscreen"
      >
        <!-- Header del modal -->
        <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div class="text-white">
            <h2 class="text-xl font-bold">Tablero de Bingo</h2>
            <p class="text-zinc-300 text-sm">
              Marcados: {{ markedCells }} / {{ totalCells }} - 
              Progreso: {{ Math.round((markedCells / totalCells) * 100) }}%
            </p>
          </div>
          <button
            @click="closeFullscreen"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            ✕ Cerrar
          </button>
        </div>

        <!-- Tablero de pantalla completa -->
        <div class="flex justify-center items-center w-full h-full pt-12 pb-4">
          <div
            class="grid gap-2"
            :style="{ 
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              gridTemplateRows: `repeat(${boardSize}, 1fr)`,
              width: `${fullscreenGridSize}px`,
              height: `${fullscreenGridSize}px`
            }"
          >
            <div
              v-for="(cell, index) in bingoGrid"
              :key="index"
              @click="toggleCell(index)"
              class="relative bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden group shadow-lg"
              :class="{
                'bg-zinc-700 border-zinc-500': cell.marked,
                'hover:scale-[1.01]': !cell.marked,
                'scale-[0.99]': cell.marked
              }"
            >
              <span 
                class="text-white text-center font-medium leading-tight break-words hyphens-auto select-none p-2"
                :style="getFullscreenTextStyle(cell.text)"
              >
                {{ cell.text }}
              </span>
              <div
                v-if="cell.marked"
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span 
                  class="text-red-500 font-bold opacity-90 drop-shadow-xl"
                  :style="getFullscreenMarkStyle()"
                >✕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface BingoCell {
  text: string
  marked: boolean
}

// Estado reactivo
const options = ref<string[]>([])
const newOption = ref('')
const boardSize = ref(5)
const bingoGrid = ref<BingoCell[]>([])
const showFullscreen = ref(false)
const shareLink = ref('')
const copied = ref(false)

// Computed properties
const totalCells = computed(() => boardSize.value * boardSize.value)
const markedCells = computed(() => bingoGrid.value.filter(cell => cell.marked).length)
const canGenerateBingo = computed(() => options.value.length >= totalCells.value)
const hasExtraOptions = computed(() => options.value.length > totalCells.value)
const fullscreenGridSize = computed(() => {
  const size = Math.min(window.innerHeight - 150, window.innerWidth - 100, 900) * 0.9
  return Math.max(500, size)
})

// Funciones de almacenamiento
const saveToStorage = (): void => {
  localStorage.setItem('bingoOptions', JSON.stringify(options.value))
  localStorage.setItem('boardSize', boardSize.value.toString())
  if (bingoGrid.value.length > 0) {
    localStorage.setItem('bingoGrid', JSON.stringify(bingoGrid.value))
  }
}

const loadFromStorage = (): void => {
  const savedOptions = localStorage.getItem('bingoOptions')
  const savedBoardSize = localStorage.getItem('boardSize')
  const savedGrid = localStorage.getItem('bingoGrid')
  
  if (savedOptions) options.value = JSON.parse(savedOptions)
  if (savedBoardSize) boardSize.value = parseInt(savedBoardSize)
  if (savedGrid) {
    try {
      const parsed = JSON.parse(savedGrid)
      if (Array.isArray(parsed) && parsed.length > 0) {
        bingoGrid.value = parsed
      }
    } catch {
      localStorage.removeItem('bingoGrid')
    }
  }
}

const loadFromUrl = (): void => {
  const bingoParam = new URLSearchParams(window.location.search).get('bingo')
  if (!bingoParam) return
  
  try {
    const shareData = JSON.parse(atob(bingoParam))
    if (shareData.boardSize) boardSize.value = shareData.boardSize
    if (shareData.options && Array.isArray(shareData.options)) {
      options.value = [...shareData.options]
    }
    bingoGrid.value = []
    window.history.replaceState({}, document.title, window.location.pathname)
  } catch (error) {
    console.error('Error al cargar datos compartidos:', error)
  }
}

// Funciones de opciones
const addOption = (): void => {
  const trimmed = newOption.value.trim()
  if (trimmed && !options.value.includes(trimmed)) {
    options.value.push(trimmed)
    newOption.value = ''
  }
}

const removeOption = (index: number): void => {
  options.value.splice(index, 1)
}

const clearAllOptions = (): void => {
  options.value = []
}

// Funciones del tablero
const toggleCell = (index: number): void => {
  bingoGrid.value[index].marked = !bingoGrid.value[index].marked
}

const generateBingo = (): void => {
  if (!canGenerateBingo.value) return
  
  const shuffled = [...options.value].sort(() => Math.random() - 0.5)
  bingoGrid.value = shuffled.slice(0, totalCells.value).map(text => ({
    text,
    marked: false
  }))
  
  shareLink.value = ''
}

const shuffleBingo = (): void => {
  if (bingoGrid.value.length === 0 || !canGenerateBingo.value) return
  
  if (hasExtraOptions.value) {
    generateBingo()
  } else {
    const texts = bingoGrid.value.map(cell => cell.text)
    const shuffled = [...texts].sort(() => Math.random() - 0.5)
    bingoGrid.value = shuffled.map(text => ({ text, marked: false }))
  }
  
  shareLink.value = ''
}

const resetBingo = (): void => {
  bingoGrid.value = []
  showFullscreen.value = false
  shareLink.value = ''
  localStorage.removeItem('bingoGrid')
}

// Funciones de pantalla completa
const openFullscreen = (): void => {
  showFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

const closeFullscreen = (): void => {
  showFullscreen.value = false
  document.body.style.overflow = 'auto'
}

const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && showFullscreen.value) {
    closeFullscreen()
  }
}

// Funciones para compartir
const generateOptionsLink = (): void => {
  const shareData = {
    type: 'options',
    boardSize: boardSize.value,
    options: options.value
  }
  const encodedData = btoa(JSON.stringify(shareData))
  shareLink.value = `${window.location.origin}${window.location.pathname}?bingo=${encodedData}`
}

const copyToClipboard = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = shareLink.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}

// Estilos dinámicos para pantalla completa
const getFullscreenTextStyle = (text: string) => {
  const cellSize = fullscreenGridSize.value / boardSize.value
  let fontSize = Math.min(cellSize * 0.8, 24)
  
  if (text.length > 20) fontSize *= 0.7
  else if (text.length > 15) fontSize *= 0.8
  else if (text.length > 10) fontSize *= 0.9
  
  return {
    fontSize: `${Math.max(fontSize, 10)}px`,
    lineHeight: '1.2'
  }
}

const getFullscreenMarkStyle = () => {
  const cellSize = fullscreenGridSize.value / boardSize.value
  return { fontSize: `${Math.max(cellSize * 0.7, 24)}px` }
}

// Watchers
watch([options, boardSize, bingoGrid], () => {
  saveToStorage()
}, { deep: true })

watch(boardSize, () => {
  if (bingoGrid.value.length > 0) resetBingo()
})

// Lifecycle hooks
onMounted(() => {
  const bingoParam = new URLSearchParams(window.location.search).get('bingo')
  bingoParam ? loadFromUrl() : loadFromStorage()
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
  document.body.style.overflow = 'auto'
})
</script>