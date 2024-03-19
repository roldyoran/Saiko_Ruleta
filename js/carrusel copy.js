document.addEventListener("DOMContentLoaded", function() {
  // Configuración del carrusel
  const carousel = document.querySelector(".carousel2");
  const images = document.querySelectorAll(".carousel-image2");

  let currentIndex = 0;
  const totalImages = images.length;

  // Función para pasar a la siguiente imagen
  function nextImage() {
    if (currentIndex < totalImages - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }

  // Función para actualizar la posición del carrusel
  function updateCarousel() {
    carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
  }

  // Configura el intervalo para cambiar automáticamente las imágenes cada 3 segundos (ajusta según sea necesario)
  setInterval(nextImage, 6000);
});
