<template>
  <div class="min-h-screen bg-zinc-900 p-4 font-sans text-zinc-100">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-5xl font-bold text-white mb-6 text-center">Bingo</h1>
      
      <!-- Panel de configuración -->
  <div class="bg-zinc-800 rounded-lg p-4 mb-6 shadow-sm border border-zinc-700">
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
              class="w-full px-3 py-2 bg-zinc-700 text-zinc-100 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
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
              class="flex-1 px-3 py-2 bg-zinc-700 text-zinc-100 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <button
              @click="addOption"
              class="px-4 py-2 bg-zinc-600 hover:bg-zinc-500 text-white rounded-md transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        <!-- Lista de opciones -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-medium text-zinc-100">
              Opciones ({{ options.length }})
              <span 
                v-if="hasExtraOptions" 
                class="text-xs text-zinc-300 ml-2 px-2 py-1 bg-zinc-700 rounded"
              >
                +{{ options.length - totalCells }} extra
              </span>
            </h3>
            <button
              v-if="options.length > 0"
              @click="clearAllOptions"
              class="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md text-sm transition-colors border border-zinc-700"
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
              class="relative flex justify-between items-center bg-zinc-800 px-3 py-2 rounded-md group hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
                <span class="text-zinc-200 text-sm truncate pr-2">{{ option }}</span>
              <button
                @click="removeOption(index)"
                class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-700 text-zinc-400 transition-colors opacity-80 hover:bg-red-500 hover:text-red-50 focus:outline-none"
                title="Eliminar opción"
              >
                <span class="select-none">✕</span>
              </button>

              <!-- Tooltip para texto largo: visible en hover del grupo -->
              <div
                v-if="option.length > 40"
                class="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 w-64 max-w-[60vw] bg-zinc-800 text-zinc-100 text-sm p-2 rounded border border-zinc-700 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 break-words"
              >
                {{ option }}
              </div>
            </div>
          </div>

            <div 
              v-else 
              class="text-center py-6 text-zinc-400 bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700"
            >
              <p class="text-sm">No hay opciones agregadas</p>
              <p class="text-xs mt-1">Agrega al menos {{ totalCells }} opciones para generar el bingo</p>
            </div>
          
          <!-- Mensaje informativo sobre opciones extra -->
          <div 
            v-if="hasExtraOptions && bingoGrid.length === 0" 
            class="mt-2 p-3 bg-zinc-700 border border-zinc-700 rounded-lg"
          >
            <p class="text-zinc-300 text-sm">
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
            class="px-6 py-3 bg-green-600 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
          >
            Generar Bingo
          </button>
          <!-- (Guardar, Reordenar y Limpiar se muestran debajo del tablero en la vista principal) -->
        </div>

        <!-- Sección de compartir (siempre visible, compacto) -->
        <div class="mt-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
          <h3 class="text-sm font-medium text-zinc-100 mb-2">🔗 Compartir Opciones</h3>

          <div class="flex gap-2 mb-2">
            <button
              @click="generateOptionsLink"
              class="px-2 py-1 bg-zinc-600 hover:bg-zinc-500 text-white rounded-md text-sm transition-colors"
            >
              Compartir Opciones
            </button>
            <button
              v-if="bingoGrid.length > 0"
              @click="generateBoardLink"
              class="px-2 py-1 bg-zinc-600 hover:bg-zinc-500 text-white rounded-md text-sm transition-colors"
              title="Compartir el tablero (incluye marcas)"
            >
              Compartir Tablero
            </button>
            <button
              v-if="shareLink"
              @click="copyToClipboard"
              class="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md text-sm transition-colors"
              :class="{ 'bg-zinc-600': copied }"
            >
              {{ copied ? '✓ Copiado' : 'Copiar' }}
            </button>
          </div>

          <div class="space-y-1">
            <input
              :value="shareLink"
                readonly
                class="w-full px-2 py-1 bg-zinc-700 text-zinc-100 text-xs rounded border border-zinc-700 focus:outline-none"
            />
              <p class="text-zinc-400 text-xs mt-1">
              Comparte este enlace para que otros puedan usar las mismas opciones
            </p>
          </div>
        </div>
      </div>

      <!-- Vista previa del Tablero de Bingo (siempre visible) -->
      <div class="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-zinc-100">
            Tablero de Bingo
            <span class="text-sm text-zinc-300 ml-2">({{ boardSize }}x{{ boardSize }})</span>
          </h2>
          <div class="flex items-center gap-4">
            <div class="text-sm text-zinc-400">
              Marcados: {{ markedCells }} / {{ totalCells }}
            </div>
            <button
              @click="openFullscreen"
              :disabled="bingoGrid.length === 0"
              class="px-4 py-2 bg-zinc-600 hover:bg-zinc-500 text-white rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔍 Pantalla Completa
            </button>
          </div>
        </div>

        <!-- Contenido del tablero o placeholder -->
        <div class="flex justify-center items-center">
          <div v-if="bingoGrid.length > 0"
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
              class="relative bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden group"
                :class="{
                  'bg-zinc-700 border-zinc-600': cell.marked,
                  'hover:scale-[1.02]': !cell.marked,
                  'scale-[0.98]': cell.marked
                }"
            >
                <span class="text-zinc-100 text-center font-medium leading-tight px-1 break-words hyphens-auto select-none text-xs">
                {{ cell.text }}
              </span>
              <div
                v-if="cell.marked"
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                  <span class="text-red-500 text-6xl font-extrabold opacity-95 drop-shadow leading-none">✕</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12 text-zinc-400 bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-[720px]">
            <p class="text-lg">No hay un tablero generado</p>
            <p class="text-sm mt-2">Genera un bingo desde la sección de configuración o carga uno guardado.</p>
          </div>
        </div>
        <!-- Small action buttons under the board preview -->
        <div class="mt-4 flex flex-col items-center gap-2">
          <div class="flex gap-2 justify-center">
            <button
              v-if="bingoGrid.length > 0"
              @click="shuffleBingo"
              class="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md transition-colors border border-zinc-700"
              title="Reordenar las opciones actuales"
            >
              🔀 Reordenar
            </button>

            <button
              v-if="bingoGrid.length > 0"
              @click="saveBoard"
              class="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md transition-colors border border-zinc-700"
              :title="'Guardar tablero en local'"
            >
              💾 Guardar
            </button>

            <button
              v-if="bingoGrid.length > 0"
              @click="resetBingo"
              class="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md transition-colors border border-zinc-700"
            >
              🗑️ Limpiar
            </button>
          </div>

          <!-- Save success message shown below the buttons -->
          <div v-if="savedBoard" class="text-sm text-emerald-400 mt-1">
            ✓ Tablero guardado correctamente
          </div>
        </div>
      </div>

      <!-- Modal de pantalla completa -->
      <div
        v-if="showFullscreen"
        class="fixed inset-0 bg-zinc-950/80 backdrop-blur-lg z-50 flex items-center justify-center"
        @click.self="closeFullscreen"
      >
        <div class="absolute top-0 left-0 w-sm hidden md:block">
          <img src="https://github.com/roldyoran/Saiko_Ruleta/blob/main/public/reigen_ag/stickers/leji_halo.gif?raw=true" alt="leji girando">
        </div>
        <div class="absolute bottom-0 right-8 w-64 hidden md:block">
          <img src="https://github.com/roldyoran/Saiko_Ruleta/blob/main/public/roldyoran/DJ_RULETA.webp?raw=true" alt="DJRULETA" class="w-full h-auto" style="transform: scaleX(-1);" />
        </div>
        <!-- Header del modal -->
        <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div class="text-zinc-100">
            <h2 class="text-xl font-bold">Tablero de Bingo</h2>
            <p class="text-zinc-400 text-sm">
              Marcados: {{ markedCells }} / {{ totalCells }}
            </p>
          </div>
          <button
            @click="closeFullscreen"
            class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md font-medium transition-colors border border-zinc-700"
          >
            ✕ Cerrar
          </button>
        </div>

        <!-- Tablero de pantalla completa -->
        <div class="flex justify-center items-center w-full h-full pt-16 pb-4">
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
              class="relative bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden group shadow-sm"
              :class="{
                'bg-zinc-700 border-zinc-600': cell.marked,
                'hover:scale-[1.02]': !cell.marked,
                'scale-[0.99]': cell.marked
              }"
            >
              <span 
                class="text-zinc-100 text-center font-medium leading-tight break-words hyphens-auto select-none p-2"
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
import { ref, computed, onMounted, onUnmounted, watch, type CSSProperties, nextTick } from 'vue'

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
const savedBoard = ref(false)
// restoredNotice removed after debugging
const isRestoring = ref(false)
// Reactive window size so fullscreen layout recalculates on resize
const windowSize = ref({ width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 })

// Computed properties
const totalCells = computed(() => boardSize.value * boardSize.value)
const markedCells = computed(() => bingoGrid.value.filter(cell => cell.marked).length)
const canGenerateBingo = computed(() => options.value.length >= totalCells.value)
const hasExtraOptions = computed(() => options.value.length > totalCells.value)
const fullscreenGridSize = computed(() => {
  // Use reactive windowSize so the grid and font sizes update on resize
  const w = windowSize.value.width || 0
  const h = windowSize.value.height || 0
  const size = Math.min(Math.max(h - 150, 0), Math.max(w - 100, 0), 900) * 0.9
  return Math.max(500, size)
})

// debug helpers removed

// Funciones de almacenamiento
const saveToStorage = (): void => {
  localStorage.setItem('bingoOptions', JSON.stringify(options.value))
  localStorage.setItem('boardSize', boardSize.value.toString())
  if (bingoGrid.value.length > 0) {
    localStorage.setItem('bingoGrid', JSON.stringify(bingoGrid.value))
  }
}

const loadFromStorage = async (): Promise<void> => {
  isRestoring.value = true
  try {
    // Prefer an explicit saved board if present
    const savedBoardJson = localStorage.getItem('savedBingoBoard')
    if (savedBoardJson) {
      const parsed = JSON.parse(savedBoardJson)
      if (parsed.boardSize) boardSize.value = parsed.boardSize
      if (parsed.options && Array.isArray(parsed.options)) options.value = [...parsed.options]

      let restoredGrid = false
      if (parsed.bingoGrid && Array.isArray(parsed.bingoGrid)) {
        // try to be flexible: bingoGrid may be 1D array, 2D array, or map-like object
        let candidate: any[] = parsed.bingoGrid
        // if it's a 2D array (rows), flatten it
        if (Array.isArray(candidate) && candidate.length > 0 && Array.isArray(candidate[0])) candidate = candidate.flat()

        // normalize entries: support legacy strings or objects without 'marked'
        bingoGrid.value = candidate.map((cell: any) => {
          if (typeof cell === 'string') return { text: cell, marked: false }
          if (cell && typeof cell === 'object') return { text: (cell.text ?? ''), marked: !!cell.marked }
          return { text: String(cell), marked: false }
        })
        // ensure the storage keys are synced
        saveToStorage()
        restoredGrid = true
      }

      if (restoredGrid) {
        // If restored grid exists but cells have empty text, attempt to rebuild from options
        const allEmpty = bingoGrid.value.length > 0 && bingoGrid.value.every((c: any) => !(c && String(c.text).trim()))
        if (allEmpty) {
          if (options.value.length > 0) {
            const shuffled = [...options.value].sort(() => Math.random() - 0.5)
            const pool: string[] = []
            while (pool.length < totalCells.value) pool.push(...shuffled)
            bingoGrid.value = pool.slice(0, totalCells.value).map((t: string) => ({ text: t, marked: false }))
            saveToStorage()
          } else {
            bingoGrid.value = Array.from({ length: totalCells.value }, (_, i) => ({ text: `Item ${i + 1}`, marked: false }))
            saveToStorage()
          }
        }

        // If bingoGrid is still empty try alternative keys (grid/cells/board) or object maps
        if (bingoGrid.value.length === 0) {
          const alt = parsed.grid || parsed.cells || parsed.board || null
          if (alt && Array.isArray(alt)) {
            let candidateAlt: any[] = alt
            if (candidateAlt.length > 0 && Array.isArray(candidateAlt[0])) candidateAlt = candidateAlt.flat()
            bingoGrid.value = candidateAlt.map((cell: any) => ({ text: (cell && cell.text) ? cell.text : String(cell), marked: !!(cell && cell.marked) }))
            if (bingoGrid.value.length > 0) saveToStorage()
          } else if (parsed.bingoGrid && typeof parsed.bingoGrid === 'object' && !Array.isArray(parsed.bingoGrid)) {
            const vals = Object.values(parsed.bingoGrid)
            if (Array.isArray(vals) && vals.length > 0) {
              bingoGrid.value = vals.map((cell: any) => ({ text: (cell && cell.text) ? cell.text : String(cell), marked: !!(cell && cell.marked) }))
              saveToStorage()
            }
          }
        }

        // Final safety: if nothing produced a grid, create placeholders so UI always shows something
        if (bingoGrid.value.length === 0) {
          bingoGrid.value = Array.from({ length: totalCells.value }, (_, i) => ({ text: `Item ${i + 1}`, marked: false }))
          saveToStorage()
        }

        // indicate we restored a saved board (saved indicator)
        savedBoard.value = true
        setTimeout(() => savedBoard.value = false, 1500)

        // ensure DOM updates after assigning bingoGrid
        try {
          await nextTick()
        } catch (e) {
          // no-op
        }
        return
      }
    }

    // Fallback to older storage keys
    const savedOptions = localStorage.getItem('bingoOptions')
    const savedBoardSize = localStorage.getItem('boardSize')
    const savedGrid = localStorage.getItem('bingoGrid')

    if (savedOptions) options.value = JSON.parse(savedOptions)
    if (savedBoardSize) boardSize.value = parseInt(savedBoardSize)
    if (savedGrid) {
      try {
        const parsedGrid = JSON.parse(savedGrid)
        if (Array.isArray(parsedGrid) && parsedGrid.length > 0) bingoGrid.value = parsedGrid
      } catch {
        localStorage.removeItem('bingoGrid')
      }
    }

  } catch (err) {
    console.warn('Failed to parse savedBingoBoard, removing it', err)
    localStorage.removeItem('savedBingoBoard')
  } finally {
    isRestoring.value = false
  }
}

// Save the current board explicitly (includes marks)
const saveBoard = (): void => {
  try {
    const payload = {
      boardSize: boardSize.value,
      bingoGrid: bingoGrid.value,
      options: options.value
    }
    localStorage.setItem('savedBingoBoard', JSON.stringify(payload))
    // Also sync other storage keys used by the component
    saveToStorage()
    savedBoard.value = true
    setTimeout(() => savedBoard.value = false, 2000)
    console.info('savedBingoBoard written to localStorage')
  } catch (e) {
    console.error('Error saving board:', e)
  }
}

const loadFromUrl = async (): Promise<void> => {
  const bingoParam = new URLSearchParams(window.location.search).get('bingo')
  if (!bingoParam) return

  // Mark restoring so watchers don't reset the board while we apply URL data
  isRestoring.value = true
  try {
    const shareData = JSON.parse(atob(bingoParam))

    // If the shared data represents a full board, apply it (replace current)
    if (shareData.type === 'board') {
      if (shareData.boardSize) boardSize.value = shareData.boardSize
      if (shareData.options && Array.isArray(shareData.options)) options.value = [...shareData.options]
      if (shareData.bingoGrid && Array.isArray(shareData.bingoGrid)) {
        // normalize like loadFromStorage
        let candidate: any[] = shareData.bingoGrid
        if (Array.isArray(candidate) && candidate.length > 0 && Array.isArray(candidate[0])) candidate = candidate.flat()
        bingoGrid.value = candidate.map((cell: any) => {
          if (typeof cell === 'string') return { text: cell, marked: false }
          if (cell && typeof cell === 'object') return { text: (cell.text ?? ''), marked: !!cell.marked }
          return { text: String(cell), marked: false }
        })
        // ensure DOM updates before saving
        await nextTick()
        saveToStorage()
      }

      // replace the URL to remove parameters
      window.history.replaceState({}, document.title, window.location.pathname)

    } else if (shareData.type === 'options') {
      // Only apply shared options if there's no existing grid
      if (bingoGrid.value.length === 0) {
        if (shareData.boardSize) boardSize.value = shareData.boardSize
        if (shareData.options && Array.isArray(shareData.options)) {
          options.value = [...shareData.options]
        }
        window.history.replaceState({}, document.title, window.location.pathname)
      } else {
        console.info('Ignored shared bingo params because a board is already loaded')
      }
    }

    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (error) {
    console.error('Error al cargar datos compartidos:', error)
  } finally {
    isRestoring.value = false
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
  console.info('resetBingo() called — clearing bingoGrid (previous length:', bingoGrid.value.length, ')')
  bingoGrid.value = []
  showFullscreen.value = false
  shareLink.value = ''
  localStorage.removeItem('bingoGrid')
}

// debug watch removed

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

// update windowSize on resize so computed values recalc
const handleResize = (): void => {
  if (typeof window === 'undefined') return
  windowSize.value.width = window.innerWidth
  windowSize.value.height = window.innerHeight
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

const generateBoardLink = (): void => {
  const shareData = {
    type: 'board',
    boardSize: boardSize.value,
    options: options.value,
    bingoGrid: bingoGrid.value
  }
  const encodedData = btoa(JSON.stringify(shareData))
  shareLink.value = `${window.location.origin}${window.location.pathname}?bingo=${encodedData}`
}

const copyToClipboard = async (): Promise<void> => {
  if (!shareLink.value) return
  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareLink.value)
    } else {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = shareLink.value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (e) {
    console.error('Failed to copy share link', e)
  }
}

// Estilos dinámicos para pantalla completa
const getFullscreenTextStyle = (text: string): CSSProperties => {
  // Calculate a font size based on the available cell size and text length
  const cellSize = fullscreenGridSize.value / Math.max(boardSize.value, 1)

  // base font is a fraction of the cell size
  let fontSize = cellSize * 0.20

  // reduce font size for very long strings
  if (text.length > 80) fontSize *= 0.55
  else if (text.length > 60) fontSize *= 0.65
  else if (text.length > 40) fontSize *= 0.75
  else if (text.length > 25) fontSize *= 0.85

  // clamp font size to reasonable bounds
  fontSize = Math.max(10, Math.min(fontSize, 40))

  return {
    fontSize: `${fontSize}px`,
    lineHeight: `${Math.max(fontSize * 1.05, 12)}px`,
    whiteSpace: 'normal',
    overflowWrap: 'break-word' as any,
    wordBreak: 'break-word' as any,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '6px'
  } as CSSProperties
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
  if (isRestoring.value) {
    console.info('boardSize watcher skipped because restoration in progress')
    return
  }
  if (bingoGrid.value.length > 0) resetBingo()
})

// Lifecycle hooks
onMounted(() => {
  // Always try to restore a saved board first
  loadFromStorage()

  // Then, if there's a shared bingo param, apply it (but don't clear saved board automatically)
  const bingoParam = new URLSearchParams(window.location.search).get('bingo')
  if (bingoParam) loadFromUrl()

  document.addEventListener('keydown', handleKeyPress)
  // listen for resize so fullscreen sizes update live
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = 'auto'
})


</script>