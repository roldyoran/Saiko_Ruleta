# Saiko Ruleta 🎲

Saiko Ruleta es una aplicación web interactiva desarrollada con Astro y TailwindCSS que simula una ruleta personalizada con temática de anime y streamers. El proyecto incluye animaciones, efectos visuales y elementos interactivos que hacen la experiencia más entretenida.

## 🌟 Características

- **Ruleta Interactiva**: Ruleta giratoria con animaciones suaves y efectos de sonido
- **Personajes Animados**: Incluye personajes animados que interactúan con la ruleta
- **Interfaz Responsiva**: Diseño adaptable para diferentes tamaños de pantalla
- **Tema Oscuro**: Soporte para modo oscuro con colores personalizados
- **Efectos Visuales**: Animaciones de fondo y efectos de onda

## 🚀 Tecnologías Utilizadas

- [Astro](https://astro.build/) - Framework web moderno
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitario
- [Vue.js](https://vuejs.org/) - Framework JavaScript progresivo
- Canvas API - Para la animación de la ruleta

## 📦 Estructura del Proyecto

```text
/
├── public/
│   ├── audios/         # Efectos de sonido y música
│   ├── carousel/       # Imágenes para el carrusel
│   ├── reigen_ag/      # Assets de personajes
│   ├── roldyoran/      # Assets de personajes
│   ├── saikomic/       # Assets relacionados con Saiko
│   └── stefy_cyan22/   # Assets adicionales
├── src/
│   ├── components/     # Componentes de Astro
│   ├── layouts/        # Layouts de la aplicación
│   ├── pages/          # Páginas de la aplicación
│   └── scripts/        # Scripts de JavaScript
```

### 📄 Páginas de la Aplicación

La carpeta `src/pages/` contiene las siguientes páginas:

- **index.astro**: Página principal que contiene la ruleta interactiva, botones de control, efectos de sonido y animaciones de fondo ondulantes.
- **animes_vistos.astro**: Página que muestra una lista de animes con integración de TierMaker y un botón para volver arriba que aparece al hacer scroll.
- **galeria.astro**: Galería de imágenes organizada por temporadas, mostrando el trabajo de diferentes artistas con enlaces a sus perfiles de Instagram.

## 🛠️ Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                         |
| `npm run dev`             | Inicia servidor local en `localhost:4321`        |
| `npm run build`           | Construye el sitio para producción              |
| `npm run preview`         | Previsualiza la construcción localmente         |

## 🎨 Personalización

La ruleta puede ser personalizada modificando los siguientes aspectos:

- Número de opciones (2-44)
- Colores y estilos usando TailwindCSS
- Personajes y animaciones
- Efectos de sonido y música

## 🔧 Desarrollo

Para comenzar a desarrollar en el proyecto:

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`
4. Abre `localhost:4321` en tu navegador

## 📝 Versión

Versión actual: 1.6.0
