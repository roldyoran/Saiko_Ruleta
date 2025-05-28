# Manual Técnico - app.py

## Descripción General
El script `app.py` es una aplicación de web scraping diseñada para extraer información de personajes de anime desde Tiermaker. Utiliza tecnologías modernas de automatización web y procesamiento de datos para recopilar, actualizar y mantener una lista de personajes de anime.

## Tecnologías Utilizadas
- **asyncio**: Para manejo de operaciones asíncronas
- **playwright**: Framework de automatización web
- **BeautifulSoup4**: Para parsing de HTML
- **rich**: Biblioteca para interfaces de terminal mejoradas
- **re**: Módulo de expresiones regulares de Python
- **json**: Para manejo de archivos JSON

## Arquitectura del Sistema

### 1. Configuración del Navegador
```python
browser = await playwright.chromium.launch(
    headless=True,
    args=[
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        # User-Agent personalizado
    ]
)
```
Implementa técnicas anti-detección de bots incluyendo:
- Modo headless
- Headers personalizados
- User-Agent modificado
- Scripts de evasión de detección

### 2. Manejo de Cloudflare
El sistema incluye lógica para detectar y manejar la protección de Cloudflare:
- Detección de página de verificación
- Espera automática para bypass
- Reintentos configurables

### 3. Extracción de Datos
Utiliza patrones regex específicos para extraer:
- URLs de imágenes
- Nombres de personajes
- IDs únicos

Patrones principales:
```python
url_pattern = r'url\("([^"]+)"\)'
name_pattern = r'zzzzz-\d+([a-zA-Z]+.*?)(?:\d+)?\-185'
name_pattern_fallback = r'zzzzz-\d+([a-zA-Z]+.*?)(?:\d+)?\.png'
```

### 4. Procesamiento de Datos
Implementa un sistema de actualización que:
- Mantiene datos existentes de `original.json`
- Actualiza entradas modificadas
- Agrega nuevos personajes
- Preserva notas y URLs personalizadas

### 5. Sistema de Logging
Utiliza la biblioteca `rich` para proporcionar:
- Barras de progreso interactivas
- Tablas de resumen
- Paneles informativos
- Logging con colores

## Flujo de Ejecución
1. Inicialización del navegador con configuraciones anti-detección
2. Navegación a la URL de Tiermaker
3. Manejo de protección Cloudflare
4. Extracción de datos de personajes
5. Carga y procesamiento de datos existentes
6. Actualización y fusión de información
7. Generación de reportes
8. Guardado de datos actualizados

## Estructura de Datos

### Formato de Entrada (original.json)
```json
[
    {
        "id": "string",
        "nombre": "string",
        "url": "string",
        "nota": "string (opcional)"
    }
]
```

### Formato de Salida (anime_list.json)
```json
[
    {
        "id": "string",
        "nombre": "string",
        "url": "string",
        "nota": "string (si existe en original)"
    }
]
```

## Manejo de Errores
- Captura de errores de navegación
- Generación de screenshots en caso de error
- Logging detallado de problemas
- Fallbacks para patrones de extracción

## Métricas y Reportes
Genera reportes detallados incluyendo:
- Total de personajes encontrados
- Número de actualizaciones
- Nuevas adiciones
- Cambios en URLs y nombres

## Requisitos del Sistema
- Python 3.7+
- Playwright
- BeautifulSoup4
- Rich
- Conexión a Internet estable
- Memoria suficiente para procesamiento de datos

## Limitaciones Conocidas
- Dependencia de la estructura HTML de Tiermaker
- Sensibilidad a cambios en la protección anti-bot
- Necesidad de conexión estable a Internet
- Tiempo de espera para bypass de Cloudflare
        